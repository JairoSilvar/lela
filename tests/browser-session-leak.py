"""v52 — teste COMPORTAMENTAL em navegador real (Chromium headless).
Executa o jogo, reinicia a sessão várias vezes e afirma que a cena não cresce.
Uso: python3 tests/browser-session-leak.py   (sobe server.mjs sozinho)
"""
import subprocess, sys, time, json, os, signal
from playwright.sync_api import sync_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT=4199
srv=subprocess.Popen(['node','server.mjs'],cwd=ROOT,env={**os.environ,'PORT':str(PORT)},stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
errors=[];results=[]
def check(name,ok,detail=None):
    results.append({'name':name,'pass':bool(ok),'detail':detail});print(('PASS ' if ok else 'FAIL ')+name,'' if ok else detail)
try:
    time.sleep(1.2)
    with sync_playwright() as p:
        b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
        pg=b.new_page(viewport={'width':960,'height':540})
        pg.on('pageerror',lambda e:errors.append(str(e)))
        pg.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
        pg.goto(f'http://localhost:{PORT}/?qa',wait_until='load')
        pg.wait_for_function("window.__qa && !document.getElementById('start').disabled",timeout=120000)
        census="""()=>{const g=window.__qa.get();let meshes=0;g.scene.traverse(o=>{if(o.isMesh)meshes++});
          return {children:g.scene.children.length,meshes,sky:g.scene.children.filter(c=>c.name==='SkyTraffic-v51').length,
                  companions:g.skyCompanions?g.skyCompanions.actors.length:0,
                  geos:g.renderer.info.memory.geometries,tex:g.renderer.info.memory.textures}}"""
        pg.evaluate("window.__qa.start()");pg.wait_for_timeout(1500)
        base=pg.evaluate(census);print('base',base)
        series=[]
        for i in range(5):
            pg.evaluate("window.__qa.start()");pg.wait_for_timeout(1200);series.append(pg.evaluate(census))
        print('after 5 restarts',series[-1])
        check('Reiniciar 5x mantém exatamente 1 grupo SkyTraffic na cena',series[-1]['sky']==1,series[-1]['sky'])
        check('Reiniciar 5x não aumenta meshes da cena',series[-1]['meshes']==base['meshes'],{'base':base['meshes'],'now':series[-1]['meshes']})
        check('Reiniciar 5x não aumenta geometrias na GPU',series[-1]['geos']<=base['geos']+5,{'base':base['geos'],'now':series[-1]['geos']})
        # troca de fase: tráfego de NPCs deve continuar existindo
        for ph in ['vila','castelo','floresta']:
            pg.evaluate("window.__qa.goToMenu()");pg.evaluate(f"window.__qa.selectPhase('{ph}')");pg.evaluate("window.__qa.start()");pg.wait_for_timeout(2500)
            c=pg.evaluate(census);check(f'Fase {ph}: Sky Traffic presente e único',c['sky']==1 and c['companions']==3,c)
        final=pg.evaluate(census)
        check('Após 3 trocas de fase a cena não explodiu (<= base*1.35)',final['meshes']<=base['meshes']*1.35,{'base':base['meshes'],'final':final['meshes']})
        check('Sem erros de console/página',not [e for e in errors if 'favicon' not in e],errors[:5])
        b.close()
finally:
    srv.send_signal(signal.SIGTERM)
print(json.dumps({'passed':sum(r['pass'] for r in results),'total':len(results)}))
sys.exit(0 if all(r['pass'] for r in results) else 1)
