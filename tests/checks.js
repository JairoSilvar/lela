import * as T from 'three';
import {Input} from '../src/input.js';
import {Flight} from '../src/flight.js';
import {World,ground} from '../src/world.js';
import {loadAssets,createWitch} from '../src/assets.js';
import {Effects} from '../src/effects.js';
let failures=0,total=0;
function check(name,condition){total++;const li=document.createElement('li');li.textContent=(condition?'PASSOU — ':'FALHOU — ')+name;li.style.color=condition?'#a9f4d4':'#ff8a88';document.querySelector('#results').appendChild(li);if(!condition)failures++;}
try{
 const assets=await loadAssets(()=>{});check('Modelos base, Lelinha, animações, cenário e Kenney carregados',['witch','broom','lelinha','heroAnimations','environment','kenney'].every(k=>assets[k]));
 const input=new Input();input.enabled=true;check('Controles neutros produzem números finitos',['turn','throttle','lift','lookX','lookY','motion'].every(k=>Number.isFinite(input.state[k]))&&input.state.lift===0);
 window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyD'}));window.dispatchEvent(new KeyboardEvent('keydown',{code:'ArrowUp'}));check('Teclado: virar e subir simultaneamente',input.state.turn===1&&input.state.lift===1);input.clear();
 window.dispatchEvent(new KeyboardEvent('keydown',{code:'Space'}));check('Magia dispara uma vez por pressionamento',input.consumeMagic()&&!input.consumeMagic());
 window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyW'}));window.dispatchEvent(new Event('blur'));check('Perda de foco libera teclas',input.state.throttle===0);
 const up=document.querySelector('[data-action=up]');up.setPointerCapture=()=>{};up.dispatchEvent(new PointerEvent('pointerdown',{pointerId:1,bubbles:true}));check('Botão touch de subida',input.state.lift===1);up.dispatchEvent(new PointerEvent('pointercancel',{pointerId:1,bubbles:true}));check('Cancelamento touch libera subida',input.state.lift===0);
 const scene=new T.Scene(),world=new World(scene,assets),model=createWitch(assets),camera=new T.PerspectiveCamera(62,16/9,.1,650);scene.add(model);const flight=new Flight(model,camera,world);const step=(state,n=120)=>{for(let i=0;i<n;i++)flight.update(1/60,{turn:0,throttle:0,lift:0,boost:false,...state});};
 step({});check('Voo neutro avança e mantém valores finitos',flight.position.z<85&&flight.position.toArray().every(Number.isFinite));
 flight.reset();flight.position.y=50;step({throttle:1});const normal=flight.speed;step({boost:true});check('Turbo aumenta velocidade e consome energia',flight.speed>normal+5&&flight.energy<90);const depleted=flight.energy;step({});check('Energia se regenera',flight.energy>depleted);
 flight.reset();const y=flight.position.y;step({lift:1},90);check('Subida livre',flight.position.y>y+5);const high=flight.position.y;step({lift:-1},120);check('Descida livre',flight.position.y<high-5);
 flight.reset();step({turn:1},120);check('Curva altera orientação e trajetória',Math.abs(flight.yaw)>2&&flight.position.x>5);
 flight.reset();flight.position.set(0,-30,90);step({throttle:-1},60);check('Solo impede atravessamento persistente',flight.position.y>=ground(flight.position.x,flight.position.z)+1.29);
 flight.reset();const c=world.colliders[0];flight.position.set(c.x+.05,c.y+2,c.z);step({throttle:-1},30);check('Colisão suave afasta do tronco',Math.hypot(flight.position.x-c.x,flight.position.z-c.z)>c.r+.6);
 flight.reset();flight.position.set(600,30,0);step({throttle:-1},180);check('Limite suave reconduz para o bosque',flight.position.distanceTo(new T.Vector3(90,30,0))<245);
 check('Câmera permanece finita depois das colisões',camera.position.toArray().every(Number.isFinite));check('18 anéis, 54 essências e 4 NPCs',world.rings.length===18&&world.orbs.length===54&&world.npcs.length===4);check('Cenário usa malhas instanciadas',world.decor.filter(m=>m.isInstancedMesh).length>8);
 const p=world.npcs[0].model.position.clone();world.update(2,.016);check('NPCs percorrem a floresta',world.npcs[0].model.position.distanceTo(p)>1);
 const effects=new Effects(scene,world.glow);effects.pulse(flight.position);check('Pulso mágico cria efeito',effects.pulses.length===1);effects.update(1,flight);check('Efeito de magia libera recursos ao terminar',effects.pulses.length===0);
 world.rings[0].collected=true;world.rings[0].mesh.visible=false;world.orbs[0].collected=true;world.reset();check('Reinício restaura colecionáveis',world.rings.every(r=>!r.collected&&r.mesh.visible)&&world.orbs.every(o=>!o.collected));
 const renderer=new T.WebGLRenderer({antialias:false});renderer.setSize(640,360);document.body.appendChild(renderer.domElement);flight.reset();camera.lookAt(flight.position);renderer.render(scene,camera);check('Cena renderiza com WebGL 2',renderer.info.render.triangles>0);const li=document.createElement('li');li.textContent=`Render: ${renderer.info.render.calls} chamadas · ${renderer.info.render.triangles.toLocaleString('pt-BR')} triângulos`;document.querySelector('#results').appendChild(li);
}catch(e){console.error(e);check('Execução sem exceções: '+e.message,false);}
document.querySelector('#status').textContent=`${total-failures}/${total} testes passaram · ${failures} falhas`;

