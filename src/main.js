import * as T from 'three';
import {loadAssets,createWitch} from './assets.js';
import {World,ground,PHASES} from './world.js';
import {Flight} from './flight.js';
import {Input} from './input.js';
import {Effects,Audio} from './effects.js';
const $=id=>document.getElementById(id),input=new Input(),audio=new Audio();
let scene,camera,renderer,world,flight,effects,state='loading',elapsed=0,time=0,essence=0,ringCount=0,perfectScore=0,selectedPhase='floresta',magicCooldown=0,toastTime=0,skimTime=0,quality='auto',avgFrame=1/60,qualityTimer=0,autoScale=1,maxSpeed=0,distance=0,lastPos=null,pulsesCast=0,best=null;
function showToast(text){$('toast').textContent=text;toastTime=3;$('toast').style.opacity=1;}
function loadBest(){try{return JSON.parse(localStorage.getItem('witches-flight-best')||'null');}catch{return null;}}
function saveBest(value){try{localStorage.setItem('witches-flight-best',JSON.stringify(value));}catch{}}
function isBetterRun(value,previous){if(!previous)return true;if(value.rings!==previous.rings)return value.rings>previous.rings;if(value.rings===18)return value.time<previous.time;return value.essence>previous.essence;}
function updateBestDisplay(){const el=$('best-score');if(!el)return;el.textContent=best?`Melhor ritual · ${best.rings}/18 anéis · ${best.essence} essência${best.rings===18?` · ${Math.floor(best.time/60)}:${String(Math.floor(best.time%60)).padStart(2,'0')}`:''}`:'Nenhum ritual registrado neste navegador';}
function toggleFullscreen(){if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.()?.catch?.(()=>{});}
function touchVisibility(){const active=state==='playing'||state==='exploring';$('touch').classList.toggle('hidden',!input.touch||!active);input.enabled=active;}
function start(){if(world.phaseId!==selectedPhase){world.dispose();world=new World(scene,window.__assets,selectedPhase);flight.world=world;}world.reset();flight.reset();elapsed=0;essence=0;ringCount=0;perfectScore=0;skimTime=0;magicCooldown=0;maxSpeed=0;distance=0;lastPos=flight.position.clone();pulsesCast=0;state='playing';$('menu').classList.add('hidden');$('pause-menu').classList.add('hidden');$('result').classList.add('hidden');$('hud').classList.remove('hidden');input.clear();touchVisibility();showToast(input.touch?'Joystick 2D: mova em qualquer direção • TURBO à direita':'↑ / ↓ muda a altura • A / D vira • siga o brilho');}
function pause(){if(state==='playing'||state==='exploring'){const prev=state;state='paused';$('pause-menu').dataset.previous=prev;$('pause-menu').classList.remove('hidden');input.clear();touchVisibility();}}

function goToMenu(){
  state='menu';
  $('pause-menu').classList.add('hidden');
  $('result').classList.add('hidden');
  $('hud').classList.add('hidden');
  $('menu').classList.remove('hidden');
  input.clear();
  touchVisibility();
  if(flight) flight.reset();
  if(world) world.reset();
  syncPhaseUI();
  const st=$('start');
  if(st&&!st.disabled) st.textContent='Voar · '+(PHASES[selectedPhase]||PHASES.floresta).name+'  →';
  showToast('Menu principal');
}
function resume(){if(state!=='paused')return;state=$('pause-menu').dataset.previous||'playing';$('pause-menu').classList.add('hidden');input.clear();touchVisibility();}
function finish(){state='result';const run={rings:ringCount,essence,time:elapsed,maxSpeed,distance,pulses:pulsesCast};const record=isBetterRun(run,best);if(record){best=run;saveBest(best);updateBestDisplay();}$('result-title').textContent=record?'Novo recorde do reino!':ringCount===18?'O reino reconhece sua magia.':'A lua rosa ouviu você.';$('result-text').textContent=`Você atravessou ${ringCount} de 18 anéis e reuniu ${essence} pontos de essência. O ritual terminou, mas o reino continua aberto para explorar.`;$('result-stats').innerHTML=`<span>Tempo<b>${Math.floor(elapsed/60)}:${String(Math.floor(elapsed%60)).padStart(2,'0')}</b></span><span>Velocidade máxima<b>${Math.round(maxSpeed)} km/h</b></span><span>Distância voada<b>${Math.round(distance)} m</b></span><span>Pulsos de magia<b>${pulsesCast}</b></span>${record?'<span class="record">✦ Recorde salvo neste navegador ✦</span>':''}`;$('result').classList.remove('hidden');input.clear();touchVisibility();}
function collectOrb(o){o.collected=true;o.mesh.visible=o.glow.visible=false;essence+=5;flight.energy=Math.min(100,flight.energy+4);effects.emit(o.pos,6);}
function magic(){if(magicCooldown>0)return;magicCooldown=1.5;pulsesCast++;effects.pulse(flight.position);audio.note(330);let n=0;world.orbs.forEach(o=>{if(!o.collected&&o.pos.distanceTo(flight.position)<13){collectOrb(o);n++;}});showToast(n?`Pulso rosa · ${n} essências atraídas`:'Pulso rosa · aproxima-se das essências');}
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(quality==='low'?.8:quality==='high'?Math.min(devicePixelRatio,1.75):Math.min(devicePixelRatio,input.touch?1.25:1.5)*autoScale);}
function updateHUD(){const next=world.rings.find(r=>!r.collected);$('rings').textContent=String(ringCount).padStart(2,'0');$('essence').textContent=essence;const remain=Math.max(0,90-elapsed);$('timer').textContent=state==='exploring'?'∞':`${Math.floor(remain/60)}:${String(Math.floor(remain%60)).padStart(2,'0')}`;$('speed').textContent=Math.round(flight.velocity.length()*3.6);$('altitude').textContent=Math.round(flight.position.y-ground(flight.position.x,flight.position.z))+' m';$('energy').style.width=flight.energy+'%';$('energy-wrap').classList.toggle('ready',flight.energy>=99&&!flight.boosting);$('route-progress').style.width=ringCount/18*100+'%';$('boost-label').textContent=flight.bump>0?'DESVIO':flight.boosting?'ATIVO':flight.energy>=99?'PRONTO':'TURBO';$('distance').textContent=next?Math.round(next.pos.distanceTo(flight.position)):'—';$('objective').textContent=state==='exploring'?'Explore o reino livremente':'3 regiões · rasantes e Perfect Flight';const heading=(((-flight.yaw*180/Math.PI)%360)+360)%360;$('bearing').textContent=['N','NE','L','SE','S','SO','O','NO'][Math.round(heading/45)%8];
 const ctx=$('map').getContext('2d');ctx.clearRect(0,0,160,160);ctx.save();ctx.beginPath();ctx.arc(80,80,77,0,Math.PI*2);ctx.clip();ctx.strokeStyle='#8cafaa22';ctx.lineWidth=1;for(let n=0;n<160;n+=32){ctx.beginPath();ctx.moveTo(n,0);ctx.lineTo(n,160);ctx.moveTo(0,n);ctx.lineTo(160,n);ctx.stroke();}const project=p=>[80+(p.x-flight.position.x)*.55,80+(p.z-flight.position.z)*.55];world.rings.forEach(r=>{const [x,y]=project(r.pos);ctx.strokeStyle=r.collected?'#3b6c65':r===next?'#f5da8e':'#9dd8c7';ctx.beginPath();ctx.arc(x,y,r===next?4:2,0,6.28);ctx.stroke();});world.npcs.forEach(n=>{const[x,y]=project(n.model.position);ctx.fillStyle='#b997e9';ctx.fillRect(x-1,y-1,3,3);});ctx.translate(80,80);ctx.rotate(-flight.yaw);ctx.fillStyle='#e5f4d5';ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(4,5);ctx.lineTo(0,3);ctx.lineTo(-4,5);ctx.closePath();ctx.fill();ctx.restore();}
function frame(now){requestAnimationFrame(frame);const raw=Math.min((now-(frame.last||now))/1000,.1),dt=Math.min(raw,.04);frame.last=now;if(!world)return;time+=dt;world.update(time,dt);
 if(state==='playing'||state==='exploring'){flight.update(dt,input.state);effects.update(dt,flight);maxSpeed=Math.max(maxSpeed,flight.velocity.length()*3.6);if(lastPos)distance+=flight.position.distanceTo(lastPos);lastPos=flight.position.clone();magicCooldown=Math.max(0,magicCooldown-dt);if(input.consumeMagic())magic();if(state==='playing')elapsed+=raw;for(const r of world.rings){if(!r.collected&&r.pos.distanceTo(flight.position)<3.25){r.collected=true;r.mesh.visible=false;ringCount++;essence+=25;flight.energy=Math.min(100,flight.energy+15);effects.emit(r.pos,22,'#ffe7a1',8);audio.note(550+ringCount*25);showToast(`Anel de cristal ${ringCount} / 18 · +25 essência`);}}for(const o of world.orbs)if(!o.collected&&o.pos.distanceTo(flight.position)<2)collectOrb(o);if(flight.position.y-ground(flight.position.x,flight.position.z)<3.5&&flight.speed>8){skimTime+=dt;if(skimTime>1.5){skimTime=0;essence+=2;showToast('Rasante encantado · +2 essência');}}else skimTime=0;const pb=flight.consumePerfectBonus();if(pb){perfectScore+=pb;essence+=pb*3;showToast(`Perfect Flight ×${pb} · +${pb*3} essência`);effects.emit(flight.position,12,'#f0c96a',4);}if(flight.bump>0)$('boost-label').textContent='DESVIO';if(state==='playing'&&(elapsed>=90||ringCount===18))finish();updateHUD();}
 if(state==='menu'){flight.model.position.y=7+Math.sin(time)*.13;camera.position.set(9+Math.sin(time*.08)*2,11,102);camera.lookAt(-2,9,73);}
 toastTime-=dt;if(toastTime<=0)$('toast').style.opacity=0;
 if(raw>0){avgFrame=avgFrame*.97+raw*.03;qualityTimer+=dt;if(quality==='auto'&&qualityTimer>5){qualityTimer=0;const old=autoScale;if(avgFrame>.028)autoScale=Math.max(.6,autoScale-.12);else if(avgFrame<.018)autoScale=Math.min(1,autoScale+.04);if(old!==autoScale)resize();$('quality-label').textContent=autoScale<.85?'AUTO • LEVE':'AUTO';}}
 renderer.render(scene,camera);
}
async function init(){try{scene=new T.Scene();camera=new T.PerspectiveCamera(62,innerWidth/innerHeight,.1,650);renderer=new T.WebGLRenderer({antialias:!input.touch,powerPreference:'high-performance'});renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;$('game').appendChild(renderer.domElement);resize();const assets=await loadAssets((a,b,name)=>$('loading').textContent=`Preparando o reino · ${a}/${b}`+(name?' · '+name:''));window.__assets=assets;selectedPhase=localStorage.getItem('wf-phase')||'floresta';world=new World(scene,assets,selectedPhase);syncPhaseUI();const witch=createWitch(assets);scene.add(witch);flight=new Flight(witch,camera,world);effects=new Effects(scene,world.glow);state='menu';best=loadBest();updateBestDisplay();$('start').disabled=false;$('start').textContent='Voar · '+(PHASES[selectedPhase]||PHASES.floresta).name+'  →';$('loading').textContent='Modelos carregados · pronta para voar';requestAnimationFrame(frame);window.addEventListener('resize',resize);
 // Read-only diagnostics for reproducible browser checks.
 window.__flightDiagnostics=()=>({state,elapsed,essence,ringCount,position:flight.position.toArray(),speed:flight.speed,energy:flight.energy,yaw:flight.yaw,magicCooldown,collisions:flight.bump>0,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,trees:world.colliders.length,npcs:world.npcs.length,frameMs:avgFrame*1000,pixelRatio:renderer.getPixelRatio(),loadedAssets:Object.keys(assets)});
 }catch(e){console.error(e);$('loading').textContent=(e&&e.message?e.message:'Erro ao carregar').slice(0,220);$('loading').style.whiteSpace='pre-wrap';$('loading').style.color='#ff9ec8';$('start').textContent='Recarregar';$('start').disabled=false;$('start').onclick=()=>location.reload();}}
$('start').addEventListener('click',()=>{if(world)start();});$('fullscreen').onclick=toggleFullscreen;$('pause').onclick=()=>{if(state==='paused')resume();else pause();};$('resume').onclick=resume;$('restart').onclick=start;$('to-menu')&&($('to-menu').onclick=goToMenu);$('to-menu-result')&&($('to-menu-result').onclick=goToMenu);$('retry').onclick=start;$('explore').onclick=()=>{state='exploring';$('result').classList.add('hidden');touchVisibility();if(input.touch)$('touch').classList.remove('hidden');input.enabled=true;};$('quality').onchange=e=>{quality=e.target.value;resize();$('quality-label').textContent=quality==='high'?'ALTA':quality==='low'?'LEVE':'AUTO';};$('sound').onclick=()=>{$('sound').textContent=audio.toggle()?'Som: on':'Som: off';};window.addEventListener('keydown',e=>{if(e.code==='Escape'){if(state==='paused')resume();else pause();}if(e.code==='KeyF')toggleFullscreen();if(e.code==='KeyM')$('sound').click();if(e.code==='KeyR'&&(state==='playing'||state==='exploring')){flight.reset();lastPos=flight.position.clone();showToast('De volta ao castelo');}});window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
function syncPhaseUI(){
  document.querySelectorAll('.phase-card').forEach(btn=>{
    const on=btn.dataset.phase===selectedPhase;
    btn.classList.toggle('active',on);
    btn.setAttribute('aria-selected',on?'true':'false');
  });
  const ph=PHASES[selectedPhase]||PHASES.floresta;
  const note=$('menu-phase-note');
  if(note) note.innerHTML=ph.short+'<br><span>'+ph.blurb+'</span>';
  const map=$('map-label');
  // map-label contains quality span
  const ql=$('quality-label');
  if(map) map.innerHTML=ph.mapLabel+' <span id="quality-label">'+(ql?ql.textContent:'AUTO')+'</span>';
}
function selectPhase(id){
  if(!PHASES[id]||id===selectedPhase) return;
  selectedPhase=id;
  localStorage.setItem('wf-phase',id);
  syncPhaseUI();
  if(!scene||!window.__assets) return;
  // rebuild world for preview in menu too
  if(world) world.dispose();
  world=new World(scene,window.__assets,selectedPhase);
  if(flight){flight.world=world;flight.reset();}
  showToast(PHASES[id].name);const st=$('start');if(st&&!st.disabled)st.textContent='Voar · '+PHASES[id].name+'  →';
}
document.querySelectorAll('.phase-card').forEach(btn=>{
  btn.addEventListener('click',()=>selectPhase(btn.dataset.phase));
});


$('tilt-toggle')&&($('tilt-toggle').onclick=async()=>{
  const btn=$('tilt-toggle');
  if(input.tiltEnabled){input.disableTilt();btn.textContent='Inclinar celular: off';showToast('Controle por inclinação desligado');}
  else{
    const ok=await input.enableTilt();
    btn.textContent=ok?'Inclinar celular: on':'Inclinar: não suportado';
    if(ok) showToast('Incline o celular para virar · recalibra ao ligar');
    else showToast('Inclinação indisponível neste aparelho');
  }
});

init();
