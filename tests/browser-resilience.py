"""v52 — resiliência em navegador real: segundo plano, isolamento de falhas, rajada de erros."""
import subprocess, sys, time, json, os, signal
from playwright.sync_api import sync_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));PORT=4198
srv=subprocess.Popen(['node','server.mjs'],cwd=ROOT,env={**os.environ,'PORT':str(PORT)},stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
results=[]
def check(n,ok,d=None):
    results.append(bool(ok));print(('PASS ' if ok else 'FAIL ')+n,'' if ok else d)
try:
    time.sleep(1.2)
    with sync_playwright() as p:
        b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
        pg=b.new_page(viewport={'width':960,'height':540});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto(f'http://localhost:{PORT}/?qa',wait_until='load')
        pg.wait_for_function("window.__qa && !document.getElementById('start').disabled",timeout=120000)
        pg.evaluate("window.__qa.start()");pg.wait_for_timeout(1500)
        st=lambda:pg.evaluate("window.__qa.get().state")
        # 1) segundo plano pausa e salva
        pg.evaluate("localStorage.clear()")
        pg.evaluate("Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))")
        pg.wait_for_timeout(200)
        check('Ir para segundo plano pausa a partida',st()=='paused',st())
        check('Ir para segundo plano grava save',pg.evaluate("Object.keys(localStorage).some(k=>/save/i.test(k))"),pg.evaluate("Object.keys(localStorage)"))
        pg.evaluate("Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'))")
        pg.evaluate("window.__qa.resume()");pg.wait_for_timeout(300)
        check('Voltar e continuar retoma o jogo',st()=='playing',st())
        # 2) subsistema auxiliar quebrado não derruba o jogo
        pg.evaluate("(()=>{window.__qa.get().livingEncounters.update=()=>{throw new Error('falha-injetada')};return 1})()")
        pos0=pg.evaluate("window.__qa.get().flight.position.toArray()")
        pg.evaluate("window.__qa.get().input.keys.add('KeyW')")
        try: pg.wait_for_function("window.__guardReport().disabled.length>0",timeout=90000)
        except Exception: pass
        pg.wait_for_timeout(1500)
        rep=pg.evaluate("window.__guardReport()");pos1=pg.evaluate("window.__qa.get().flight.position.toArray()")
        check('Falha repetida em subsistema auxiliar o desativa (e só ele)',rep['disabled']==['livingEncounters'],rep)
        check('Jogo continua rodando sem tela de recuperação',st()=='playing' and not pg.evaluate("!!document.getElementById('recovery-v42')"),st())
        check('Voo continua respondendo ao input',sum((a-b)**2 for a,b in zip(pos0,pos1))>1,(pos0,pos1))
        # 3) erro no núcleo: tolerado, render segue
        pg.evaluate("(()=>{const f=window.__qa.get().flight;window.__origU=f.update;let n=0;f.update=function(...a){if(n++<5)throw new Error('falha-nucleo');return window.__origU.apply(this,a)}})()")
        try: pg.wait_for_function("(window.__guardReport().errors.voo||0)>=5",timeout=90000)
        except Exception: pass
        pg.wait_for_timeout(500)
        check('Erros pontuais no núcleo não pausam o jogo',st()=='playing' and pg.evaluate("window.__guardReport().errors.voo")==5,pg.evaluate("window.__guardReport()"))
        # 4) reiniciar zera o orçamento de falhas
        pg.evaluate("window.__qa.start()");pg.wait_for_timeout(500)
        check('Nova sessão zera guardas',pg.evaluate("window.__guardReport().disabled.length")==0,pg.evaluate("window.__guardReport()"))
        # 5) erro isolado de evento não pausa; rajada pausa
        pg.evaluate("window.dispatchEvent(new ErrorEvent('error',{message:'isolado'}))");pg.wait_for_timeout(100)
        check('Um erro global isolado não pausa',st()=='playing',st())
        pg.evaluate("for(let i=0;i<3;i++)window.dispatchEvent(new ErrorEvent('error',{message:'rajada'}))");pg.wait_for_timeout(200)
        check('Rajada de 3 erros em 3 s pausa com recuperação',st()=='paused',st())
        b.close()
finally:
    srv.send_signal(signal.SIGTERM)
print(json.dumps({'passed':sum(results),'total':len(results)}));sys.exit(0 if all(results) else 1)
