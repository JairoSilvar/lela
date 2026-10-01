import {CombatV33} from './combat-v33.js';
import {SaveV33} from './save-v33.js';
import {ComfortV33} from './comfort-v33.js';
import {AdaptiveQualityV33} from './adaptive-quality-v33.js';
let combatV33,saveV33,comfortV33,adaptiveQualityV33;
import {CharacterController} from './character-controller.js';
import {WorldColliders} from './world-colliders.js';
import {CreatureAI} from './creature-ai.js';
import {PlayerVitals} from './player-vitals.js';
let characterController,worldColliders,creatureAI,playerVitals;
import {GameAudioBus} from './game-audio-bus.js';
import {GameplayStateGuard} from './gameplay-state-guard.js';
import {PerformanceGovernor} from './performance-governor.js';
let gameAudioBus,gameplayStateGuard,performanceGovernor;
import {ExplorationPOI} from './exploration-poi.js';
import {NPCBehavior} from './npc-behavior.js';
import {GroundFeedback} from './ground-feedback.js';
let explorationPOI,npcBehavior,groundFeedback;
import {DialogueSystem} from './dialogue-system.js';
import {MobileFlightControl} from './mobile-flight-control.js';
let dialogueSystem,mobileFlightControl;
import * as T from 'three';
import {loadAssets,createWitch} from './assets.js';
import {World,ground,PHASES} from './world.js';
import {Flight} from './flight.js';
import {Input} from './input.js';
import {Effects,Audio} from './effects.js';
import {MusicPlayer} from './music.js';
import {Exploration} from './exploration.js';
import {MissionSystem} from './missions.js';
import {ProgressionSystem} from './progression.js';
import {EquipmentSystem} from './equipment.js';
import {ChallengeSystem} from './challenges.js';
import {LivingWorld} from './living-world.js';
import {DeepExploration} from './deep-exploration.js';
import {MagicSystem} from './magic.js';
import {AdventureSystem} from './adventure.js';
import {GamerPolish} from './gamer-polish.js';
import {VisualArtPass} from './visual-art-pass.js';
import {ExternalArtLoader} from './external-art.js';
import {GraphicsProfile} from './graphics-profile.js';
import {Soundscape} from './soundscape.js';
import {AtmosphereVFX} from './atmosphere-vfx.js';
import {KenneyWorld} from './kenney-world.js';
import {KenneyVFX} from './kenney-vfx.js';
import {DungeonAdventure} from './dungeon-adventure.js';
import {LelinhaIdentity} from './lelinha-identity.js';
import {CharacterCameraPolish} from './character-camera-polish.js';
import {LivingEncounters} from './living-encounters.js';
import {RegionQuests} from './region-quests.js';
const $=id=>document.getElementById(id),input=new Input(),audio=new Audio(),music=new MusicPlayer(),progression=new ProgressionSystem(),equipment=new EquipmentSystem(progression),challenges=new ChallengeSystem(),magicSystem=new MagicSystem(),gamerPolish=new GamerPolish(),externalArt=new ExternalArtLoader(),soundscape=new Soundscape();
let scene,camera,renderer,graphicsProfile,world,flight,effects,exploration,missions,livingWorld,deepExploration,adventure,visualArt,atmosphereVFX,kenneyWorld,kenneyVFX,dungeonAdventure,lelinhaIdentity,characterCameraPolish,livingEncounters,regionQuests,state='loading',elapsed=0,time=0,essence=0,ringCount=0,perfectScore=0,selectedPhase='floresta',magicCooldown=0,toastTime=0,skimTime=0,quality='auto',avgFrame=1/60,qualityTimer=0,autoScale=1,maxSpeed=0,distance=0,lastPos=null,pulsesCast=0,best=null;
let combo=0,comboTimer=0,maxCombo=0,collisions=0,lastBump=false,ghostMesh=null;
function setCombo(n,label='FLIGHT COMBO'){combo=n;maxCombo=Math.max(maxCombo,n);comboTimer=2.2;const h=$('combo-hud');if(h){$('combo-value').textContent='×'+Math.max(1,combo);$('combo-label').textContent=label;h.classList.add('show');}}
function breakCombo(){combo=0;comboTimer=0;$('combo-hud')?.classList.remove('show');}
function showToast(text){$('toast').textContent=text;toastTime=3;$('toast').style.opacity=1;}
function loadBest(){try{return JSON.parse(localStorage.getItem('witches-flight-best')||'null');}catch{return null;}}
function saveBest(value){try{localStorage.setItem('witches-flight-best',JSON.stringify(value));}catch{}}
function isBetterRun(value,previous){if(!previous)return true;if(value.rings!==previous.rings)return value.rings>previous.rings;if(value.rings===18)return value.time<previous.time;return value.essence>previous.essence;}
function updateBestDisplay(){const el=$('best-score');if(!el)return;el.textContent=best?`Melhor ritual · ${best.rings}/18 anéis · ${best.essence} essência${best.rings===18?` · ${Math.floor(best.time/60)}:${String(Math.floor(best.time%60)).padStart(2,'0')}`:''}`:'Nenhum ritual registrado neste navegador';}
function toggleFullscreen(){if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.()?.catch?.(()=>{});}
function touchVisibility(){const active=state==='playing'||state==='exploring'||state==='ground';$('touch').classList.toggle('hidden',!input.touch||!active);input.enabled=active;}
function start(){music.setContext(selectedPhase);soundscape.setAmbient(true);gameAudioBus=new GameAudioBus();gameplayStateGuard=new GameplayStateGuard();performanceGovernor=new PerformanceGovernor();characterController=new CharacterController();worldColliders=new WorldColliders(selectedPhase);creatureAI=new CreatureAI();playerVitals=new PlayerVitals();combatV33=new CombatV33(playerVitals,gameAudioBus);saveV33=new SaveV33();comfortV33=new ComfortV33();comfortV33.apply();adaptiveQualityV33=new AdaptiveQualityV33();dialogueSystem=new DialogueSystem();mobileFlightControl=new MobileFlightControl();soundscape.setPhase(selectedPhase);breakCombo();challenges.start(selectedPhase);if(world.phaseId!==selectedPhase){world.dispose();livingWorld?.dispose();deepExploration?.dispose();adventure?.dispose();visualArt?.dispose();atmosphereVFX?.dispose();kenneyWorld?.dispose();livingEncounters?.dispose();explorationPOI?.dispose();worldColliders=new WorldColliders(selectedPhase);dungeonAdventure?.dispose();world=new World(scene,window.__assets,selectedPhase);livingWorld=new LivingWorld(scene,world,selectedPhase);deepExploration=new DeepExploration(scene,selectedPhase);adventure=new AdventureSystem(scene,selectedPhase);visualArt=new VisualArtPass(scene,selectedPhase,window.__assets);atmosphereVFX=new AtmosphereVFX(scene,selectedPhase);kenneyWorld=new KenneyWorld(scene,selectedPhase,window.__assets);livingEncounters=new LivingEncounters(scene,selectedPhase);regionQuests=new RegionQuests(selectedPhase);explorationPOI=new ExplorationPOI(scene,selectedPhase);npcBehavior=new NPCBehavior();groundFeedback=new GroundFeedback();dungeonAdventure=new DungeonAdventure(scene,selectedPhase);flight.world=world;if(exploration)exploration.dispose();exploration=new Exploration(scene,world);missions=new MissionSystem(selectedPhase);}world.reset();flight.reset();flight.setProfile(equipment.current().stats);elapsed=0;essence=0;ringCount=0;perfectScore=0;skimTime=0;magicCooldown=0;maxSpeed=0;distance=0;maxCombo=0;collisions=0;lastBump=false;lastPos=flight.position.clone();pulsesCast=0;if(missions)missions.resetSession();state='playing';$('menu').classList.add('hidden');$('pause-menu').classList.add('hidden');$('result').classList.add('hidden');$('hud').classList.remove('hidden');input.clear();touchVisibility();showToast(input.touch?'Joystick 2D: mova em qualquer direção • TURBO à direita':'↑ / ↓ muda a altura • A / D vira • siga o brilho');}
function pause(){if(state==='playing'||state==='exploring'||state==='ground'){const prev=state;state='paused';$('pause-menu').dataset.previous=prev;$('pause-menu').classList.remove('hidden');input.clear();touchVisibility();}}

function goToMenu(){
  state='menu';soundscape.setAmbient(false);
  music.setContext('menu');
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
function finish(){
  state='result';
  const run={rings:ringCount,essence,time:elapsed,maxSpeed,distance,pulses:pulsesCast,maxCombo,collisions};
  const record=isBetterRun(run,best);if(record){best=run;saveBest(best);updateBestDisplay();}
  const grade=progression.evaluate(selectedPhase,run);const challenge=challenges.finish(elapsed,ringCount===18);syncPhaseUI();
  $('result-title').textContent=grade.rank==='S+'?'Voo lendário · S+!':record?'Novo recorde do reino!':ringCount===18?'Ritual concluído!':'A lua rosa ouviu você.';
  $('result-text').textContent=`${grade.rank} · ${grade.stars}/3 estrelas · ${grade.score.toLocaleString('pt-BR')} pontos. ${ringCount} de 18 anéis e ${essence} de essência.`;
  const stars='★'.repeat(grade.stars)+'☆'.repeat(3-grade.stars);
  $('result-stats').innerHTML=`<span class="rank-card">Rank<b>${grade.rank}</b></span><span class="stars-card">Estrelas<b>${stars}</b></span><span>Pontuação<b>${grade.score.toLocaleString('pt-BR')}</b></span><span>Tempo<b>${Math.floor(elapsed/60)}:${String(Math.floor(elapsed%60)).padStart(2,'0')}</b></span><span>Maior combo<b>×${maxCombo}</b></span><span>Colisões<b>${collisions}</b></span><span>Velocidade máxima<b>${Math.round(maxSpeed)} km/h</b></span><span>Essência<b>${essence}</b></span>${grade.unlocked.length?`<span class="record">✦ Nova vassoura desbloqueada: ${grade.unlocked.join(', ')} ✦</span>`:''}${record?'<span class="record">✦ Recorde salvo neste navegador ✦</span>':''}${challenges.mode==='time'?`<span class="record">⏱ Time Trial ${challenge.record?'· NOVO RECORDE':''} · alvo ${challenge.target}s</span>`:''}`;
  $('result').classList.remove('hidden');input.clear();touchVisibility();
}
function collectOrb(o){o.collected=true;o.mesh.visible=o.glow.visible=false;essence+=5;flight.energy=Math.min(100,flight.energy+4);effects.emit(o.pos,6);soundscape.play('orb','sfx',.65,1.04+Math.random()*.06);}
function magic(){if(magicCooldown>0)return;magicCooldown=1.15;pulsesCast++;effects.pulse(flight.position);audio.note(330);flight?.model?.userData?.animation?.oneShot?.('Spell_Simple_Shoot',flight.grounded?'Idle_Loop':'Driving_Loop');const cast=magicSystem.cast(flight);soundscape.magic(magicSystem.current());kenneyVFX?.magic(magicSystem.current(),flight.position);if(cast.vision&&exploration&&!exploration.vision)exploration.toggleVision();let n=0;if(magicSystem.current()==='lumen')world.orbs.forEach(o=>{if(!o.collected&&o.pos.distanceTo(flight.position)<13){collectOrb(o);n++;}});input.pulse(.18,22);showToast(n?`${cast.message} · ${n} essências atraídas`:cast.message);const mb=$('magic-label');if(mb)mb.textContent=magicSystem.label();}
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(quality==='low'?.8:quality==='high'?Math.min(devicePixelRatio,1.75):Math.min(devicePixelRatio,input.touch?1.25:1.5)*autoScale);}
function updateHUD(){const next=world.rings.find(r=>!r.collected);$('rings').textContent=String(ringCount).padStart(2,'0');$('essence').textContent=essence;if($('discoveries'))$('discoveries').textContent=exploration?exploration.found:0;const remain=Math.max(0,90-elapsed);$('timer').textContent=(state==='exploring'||state==='ground')?'∞':`${Math.floor(remain/60)}:${String(Math.floor(remain%60)).padStart(2,'0')}`;$('speed').textContent=Math.round(flight.velocity.length()*3.6);$('altitude').textContent=Math.round(flight.position.y-ground(flight.position.x,flight.position.z))+' m';$('energy').style.width=flight.energy+'%';$('energy-wrap').classList.toggle('ready',flight.energy>=99&&!flight.boosting);$('route-progress').style.width=ringCount/18*100+'%';$('boost-label').textContent=flight.bump>0?'DESVIO':flight.boosting?'ATIVO':flight.energy>=99?'PRONTO':'TURBO';$('distance').textContent=next?Math.round(next.pos.distanceTo(flight.position)):'—';$('objective').textContent=missions?missions.objective():(state==='ground'?'Explore a pé · aproxime-se de pontos mágicos':state==='exploring'?'Explore o reino livremente':'3 regiões · rasantes e Perfect Flight');const heading=(((-flight.yaw*180/Math.PI)%360)+360)%360;$('bearing').textContent=['N','NE','L','SE','S','SO','O','NO'][Math.round(heading/45)%8];
 const idev=$('input-device');if(idev)idev.textContent='Entrada: '+(input.lastDevice==='gamepad'?'gamepad':input.lastDevice==='touch'?'touch':'teclado/mouse'); const ctx=$('map').getContext('2d');ctx.clearRect(0,0,160,160);ctx.save();ctx.beginPath();ctx.arc(80,80,77,0,Math.PI*2);ctx.clip();ctx.strokeStyle='#8cafaa22';ctx.lineWidth=1;for(let n=0;n<160;n+=32){ctx.beginPath();ctx.moveTo(n,0);ctx.lineTo(n,160);ctx.moveTo(0,n);ctx.lineTo(160,n);ctx.stroke();}const project=p=>[80+(p.x-flight.position.x)*.55,80+(p.z-flight.position.z)*.55];world.rings.forEach(r=>{const [x,y]=project(r.pos);ctx.strokeStyle=r.collected?'#3b6c65':r===next?'#f5da8e':'#9dd8c7';ctx.beginPath();ctx.arc(x,y,r===next?4:2,0,6.28);ctx.stroke();});world.npcs.forEach(n=>{const[x,y]=project(n.model.position);ctx.fillStyle='#b997e9';ctx.fillRect(x-1,y-1,3,3);});ctx.translate(80,80);ctx.rotate(-flight.yaw);ctx.fillStyle='#e5f4d5';ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(4,5);ctx.lineTo(0,3);ctx.lineTo(-4,5);ctx.closePath();ctx.fill();ctx.restore();}
function frame(now){requestAnimationFrame(frame);const raw=Math.min((now-(frame.last||now))/1000,.1),dt=Math.min(raw,.04);frame.last=now;if(!world)return;time+=dt;world.update(time,dt);gamerPolish.update(dt,renderer);visualArt?.update(time);atmosphereVFX?.update(dt,flight?.position);kenneyVFX?.update(dt);dialogueSystem?.update(dt);characterController?.update(dt,flight,state);characterController?.resolveWorld(flight?.position,worldColliders?.items);playerVitals?.update(dt);combatV33?.update(dt);adaptiveQualityV33?.update(dt);const aiHit=creatureAI?.update(dt,flight?.position);if(aiHit&&playerVitals?.damage(aiHit.damage)){gameAudioBus?.impact();showToast(`Dano recebido · ${playerVitals.health}/${playerVitals.maxHealth}`)}const gs=gameplayStateGuard?.update(dt,state,flight);if(gs?.changed&&gs.mode==='landing')gameAudioBus?.land();const quality=performanceGovernor?.update(dt);npcBehavior?.update(dt,livingEncounters,flight?.position);groundFeedback?.update(dt,state,showToast);if(explorationPOI&&(state==='playing'||state==='exploring'||state==='ground')){const pe=explorationPOI.update(dt,flight.position);if(pe){essence+=pe.reward||0;showToast(pe.message);gameAudioBus?.reward();kenneyVFX?.magic('lumen',flight.position)}}mobileFlightControl?.apply(flight,input,state,dt);if(livingEncounters&&(state==='playing'||state==='exploring'||state==='ground')){const le=livingEncounters.update(dt,flight.position);if(le){essence+=le.reward||0;showToast(le.message);const nn={fada:'Fada',guardiao:'Guardião',mercador:'Mercador',guarda:'Guarda',moradora:'Moradora'};dialogueSystem?.show(nn[le.type]||'Habitante',le.message);gameAudioBus?.ui();const rq=regionQuests?.encounter(le.type);if(rq){essence+=rq.reward||0;showToast(rq.message);kenneyVFX?.magic('lumen',flight.position)}}}lelinhaIdentity?.update(dt);characterCameraPolish?.update(dt,camera);if(adventure&&(state==='playing'||state==='exploring'||state==='ground')){const ae=adventure.update(dt,flight.position);if(ae)showToast(ae);}if(dungeonAdventure&&(state==='playing'||state==='exploring'||state==='ground')){const de=dungeonAdventure.update(dt,flight.position);if(de){if(de.reward)essence+=de.reward;showToast(de.message);if(de.type==='rune'||de.type==='complete')kenneyVFX?.dungeon(flight.position);}}if(livingWorld){livingWorld.update(dt,flight?.position);const lwe=livingWorld.consumeEvent();if(lwe&&state!=='menu'&&state!=='loading')showToast(lwe);const lw=$('living-status');if(lw)lw.textContent=livingWorld.label();}
 if(state==='playing'||state==='exploring'||state==='ground'){const controlState=input.state;if(input.consumePause()){pause();return;}flight.update(dt,controlState);effects.update(dt,flight);soundscape.update(dt,flight);maxSpeed=Math.max(maxSpeed,flight.velocity.length()*3.6);if(lastPos)distance+=flight.position.distanceTo(lastPos);lastPos=flight.position.clone();magicCooldown=Math.max(0,magicCooldown-dt);if(input.consumeMagic())magic();if(input.consumeVision()&&exploration){const on=exploration.toggleVision();showToast(on?'Visão Mágica · segredos próximos revelados':'Visão Mágica encerrada');const vb=$('vision-action');if(vb)vb.classList.toggle('active',on);}if(exploration)exploration.update(time,flight.position);if(input.consumeInteract()){if(flight.grounded){const secret=exploration?.interact(flight.position);if(secret){essence+=75;const ev=missions?.onDiscovery(secret);if(ev?.reward)essence+=ev.reward;showToast(ev?.message||('SEGREDO · '+secret.name+' · +75 essência'));refreshGrimoire();}else{const deep=deepExploration?.interact(flight.position,!!exploration?.vision);if(deep){essence+=deep.reward||0;showToast(deep.message);refreshGrimoire();}else{flight.mount();state='exploring';showToast('Na vassoura · decole e explore');}}}else if(flight.land()){state='ground';showToast('Lelinha pousou · use VISÃO para descobrir pontos mágicos');}else showToast('Aproxime-se do solo e reduza a velocidade para pousar');}const ca=$('context-action');if(ca){const near=flight.grounded&&(exploration?.nearest(flight.position)||deepExploration?.nearest(flight.position));ca.textContent=near?'EXAMINAR':flight.grounded?'MONTAR':flight.canLand()?'POUSAR':'AÇÃO';}if(input.consumeMode()&&!flight.grounded){const m=flight.toggleMode();const b=$('flight-mode');if(b)b.textContent=m==='precision'?'PRECISÃO':'CRUZEIRO';showToast(m==='precision'?'Voo de precisão · controle fino':'Voo de cruzeiro · mais velocidade e inércia');}if(state==='playing')elapsed+=raw;challenges.update(raw,flight.position,flight.yaw);updateGhost();for(const r of world.rings){if(!r.collected&&r.pos.distanceTo(flight.position)<3.25){r.collected=true;r.mesh.visible=false;ringCount++;essence+=25;flight.energy=Math.min(100,flight.energy+15);effects.emit(r.pos,22,'#ffe7a1',8);audio.note(550+ringCount*25);soundscape.play('ring','sfx',.9,1+Math.min(.18,ringCount*.008));if(ringCount>0&&ringCount%5===0)soundscape.perfect();kenneyVFX?.ring(r.pos,ringCount>0&&ringCount%5===0);input.pulse(.22,24);combo++;setCombo(combo,combo>=5?'CADEIA PERFEITA':'ANEL ENCADEADO');const missionMsg=missions?.onRing();showToast(missionMsg||`Anel de cristal ${ringCount} / 18 · +25 essência`);refreshGrimoire();}}for(const o of world.orbs)if(!o.collected&&o.pos.distanceTo(flight.position)<2)collectOrb(o);if(!flight.grounded&&flight.position.y-ground(flight.position.x,flight.position.z)<3.5&&flight.speed>8){skimTime+=dt;if(skimTime>1.5){skimTime=0;essence+=2;showToast('Rasante encantado · +2 essência');}}else skimTime=0;const pb=flight.consumePerfectBonus();if(pb){perfectScore+=pb;essence+=pb*3;showToast(`Perfect Flight ×${pb} · +${pb*3} essência`);effects.emit(flight.position,12,'#f0c96a',4);}if(flight.bump>0){$('boost-label').textContent='DESVIO';if(!lastBump)collisions++;lastBump=true;breakCombo();}else lastBump=false;if(state==='playing'&&(elapsed>=90||ringCount===18))finish();updateHUD();}
 if(state==='menu'){flight.model.position.y=7+Math.sin(time)*.13;camera.position.set(9+Math.sin(time*.08)*2,11,102);camera.lookAt(-2,9,73);}
 toastTime-=dt;if(toastTime<=0)$('toast').style.opacity=0;comboTimer-=dt;if(comboTimer<=0)$('combo-hud')?.classList.remove('show');
 if(raw>0){avgFrame=avgFrame*.97+raw*.03;qualityTimer+=dt;if(quality==='auto'&&qualityTimer>5){qualityTimer=0;const old=autoScale;if(avgFrame>.028)autoScale=Math.max(.6,autoScale-.12);else if(avgFrame<.018)autoScale=Math.min(1,autoScale+.04);if(old!==autoScale)resize();$('quality-label').textContent=autoScale<.85?'AUTO • LEVE':'AUTO';}}
 renderer.render(scene,camera);
}
function ensureGhost(){if(ghostMesh)return;const g=new T.ConeGeometry(.55,1.8,8);const m=new T.MeshBasicMaterial({color:0xcbb7ff,transparent:true,opacity:.28,depthWrite:false});ghostMesh=new T.Mesh(g,m);ghostMesh.visible=false;scene.add(ghostMesh);}
function updateGhost(){if(!ghostMesh)return;const q=challenges.mode==='time'?challenges.sample(elapsed):null;if(!q){ghostMesh.visible=false;return;}ghostMesh.visible=true;ghostMesh.position.set(q[0],q[1],q[2]);ghostMesh.rotation.y=q[3];}
function refreshGamerPanel(){const b=$('broom-list');if(b){b.innerHTML=equipment.render();b.querySelectorAll('[data-broom]').forEach(x=>x.onclick=()=>{if(equipment.select(x.dataset.broom)){flight?.setProfile(equipment.current().stats);refreshGamerPanel();showToast('Vassoura equipada · '+equipment.current().name);}});}const cm=$('challenge-mode');if(cm)cm.value=challenges.mode;const cb=$('challenge-best');if(cb){const t=challenges.best(selectedPhase);cb.textContent=t?`Melhor Time Trial: ${t.toFixed(1)}s · alvo ${challenges.target(selectedPhase)}s`:`Time Trial: sem recorde · alvo ${challenges.target(selectedPhase)}s`;}}
async function init(){try{scene=new T.Scene();camera=new T.PerspectiveCamera(62,innerWidth/innerHeight,.1,650);renderer=new T.WebGLRenderer({antialias:!input.touch,powerPreference:'high-performance'});renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;$('game').appendChild(renderer.domElement);graphicsProfile=new GraphicsProfile(renderer,input);resize();const assets=await loadAssets((a,b,name)=>$('loading').textContent=`Preparando o reino · ${a}/${b}`+(name?' · '+name:''));window.__assets=assets;selectedPhase=localStorage.getItem('wf-phase')||'floresta';world=new World(scene,assets,selectedPhase);exploration=new Exploration(scene,world);missions=new MissionSystem(selectedPhase);livingWorld=new LivingWorld(scene,world,selectedPhase);deepExploration=new DeepExploration(scene,selectedPhase);adventure=new AdventureSystem(scene,selectedPhase);visualArt=new VisualArtPass(scene,selectedPhase,window.__assets);atmosphereVFX=new AtmosphereVFX(scene,selectedPhase);kenneyWorld=new KenneyWorld(scene,selectedPhase,window.__assets);livingEncounters=new LivingEncounters(scene,selectedPhase);regionQuests=new RegionQuests(selectedPhase);explorationPOI=new ExplorationPOI(scene,selectedPhase);npcBehavior=new NPCBehavior();groundFeedback=new GroundFeedback();kenneyVFX=new KenneyVFX(scene);dungeonAdventure=new DungeonAdventure(scene,selectedPhase);externalArt.probe();syncPhaseUI();refreshGrimoire();const witch=createWitch(assets);scene.add(witch);flight=new Flight(witch,camera,world);flight.setProfile(equipment.current().stats);effects=new Effects(scene,world.glow);lelinhaIdentity=new LelinhaIdentity(scene,flight);characterCameraPolish=new CharacterCameraPolish(scene,flight);ensureGhost();refreshGamerPanel();state='menu';music.setContext('menu');best=loadBest();updateBestDisplay();$('start').disabled=false;$('start').textContent='Voar · '+(PHASES[selectedPhase]||PHASES.floresta).name+'  →';$('loading').textContent='Modelos carregados · pronta para voar';requestAnimationFrame(frame);$('photo-btn')&&($('photo-btn').onclick=()=>showToast(gamerPolish.togglePhoto()?'PHOTO MODE · HUD oculto':'Photo Mode encerrado'));$('zen-btn')&&($('zen-btn').onclick=()=>showToast(gamerPolish.toggleZen()?'VOO ZEN · interface reduzida':'Voo Zen encerrado'));const gfx=$('graphics-profile');if(gfx){gfx.value=graphicsProfile.mode;gfx.onchange=e=>{const q=graphicsProfile.apply(e.target.value);showToast('Gráficos · '+q.toUpperCase());resize();}}document.addEventListener('click',e=>{if(e.target.closest('button,.phase-card,select'))soundscape.play('click','ui',.35,.98+Math.random()*.05)},{passive:true});window.addEventListener('resize',resize);
 // Read-only diagnostics for reproducible browser checks.
 window.__flightDiagnostics=()=>({state,elapsed,essence,ringCount,position:flight.position.toArray(),speed:flight.speed,energy:flight.energy,yaw:flight.yaw,magicCooldown,collisions:flight.bump>0,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,trees:world.colliders.length,npcs:world.npcs.length,frameMs:avgFrame*1000,pixelRatio:renderer.getPixelRatio(),loadedAssets:Object.keys(assets)});
 }catch(e){console.error(e);$('loading').textContent=(e&&e.message?e.message:'Erro ao carregar').slice(0,220);$('loading').style.whiteSpace='pre-wrap';$('loading').style.color='#ff9ec8';$('start').textContent='Recarregar';$('start').disabled=false;$('start').onclick=()=>location.reload();}}
$('start').addEventListener('click',()=>{if(world)start();});$('magic-label')&&($('magic-label').onclick=()=>{const s=magicSystem.next();$('magic-label').textContent=magicSystem.label(s);showToast('Feitiço selecionado · '+magicSystem.label(s));});$('fullscreen').onclick=toggleFullscreen;$('pause').onclick=()=>{if(state==='paused')resume();else pause();};$('resume').onclick=resume;$('restart').onclick=start;$('to-menu')&&($('to-menu').onclick=goToMenu);$('to-menu-result')&&($('to-menu-result').onclick=goToMenu);$('retry').onclick=start;$('explore').onclick=()=>{state='exploring';$('result').classList.add('hidden');touchVisibility();if(input.touch)$('touch').classList.remove('hidden');input.enabled=true;const storyMsg=adventure?.start();if(storyMsg)setTimeout(()=>showToast(storyMsg),700);};$('quality').onchange=e=>{quality=e.target.value;resize();$('quality-label').textContent=quality==='high'?'ALTA':quality==='low'?'LEVE':'AUTO';};$('sound').onclick=()=>{const on=soundscape.toggle();if(on&&!audio.on)audio.toggle();else if(!on&&audio.on)audio.toggle();$('sound').textContent=on?'Som: on':'Som: off';if(on&&state!=='menu')soundscape.setAmbient(true);};$('music')&&($('music').onclick=()=>{$('music').textContent=music.toggle()?'Música: on':'Música: off';});$('music-volume')&&($('music-volume').oninput=e=>music.setVolume(e.target.value/100));$('sfx-volume')&&($('sfx-volume').oninput=e=>soundscape.setVolume('sfx',e.target.value/100));$('ambient-volume')&&($('ambient-volume').oninput=e=>soundscape.setVolume('ambient',e.target.value/100));$('ui-volume')&&($('ui-volume').oninput=e=>soundscape.setVolume('ui',e.target.value/100));if($('music'))$('music').textContent=music.enabled?'Música: on':'Música: off';if($('music-volume'))$('music-volume').value=Math.round(music.el.volume*100);if($('sound'))$('sound').textContent=soundscape.enabled?'Som: on':'Som: off';if($('sfx-volume'))$('sfx-volume').value=Math.round(soundscape.vol.sfx*100);if($('ambient-volume'))$('ambient-volume').value=Math.round(soundscape.vol.ambient*100);if($('ui-volume'))$('ui-volume').value=Math.round(soundscape.vol.ui*100);const sx=$('sens-x'),sy=$('sens-y'),fy=$('floating-stick'),iy=$('invert-y'),lh=$('left-handed'),fa=$('flight-assist'),ml=$('motion-level'),csize=$('control-size'),cop=$('control-opacity'),hap=$('haptics-toggle');
if(sx){sx.value=Math.round(input.sensitivityX*100);sx.oninput=e=>input.configure({sensitivityX:e.target.value/100})}
if(sy){sy.value=Math.round(input.sensitivityY*100);sy.oninput=e=>input.configure({sensitivityY:e.target.value/100})}
if(fy){fy.checked=input.floating;fy.onchange=e=>input.configure({floating:e.target.checked})}
if(iy){iy.checked=input.invertY;iy.onchange=e=>input.configure({invertY:e.target.checked})}
if(lh){lh.checked=input.leftHanded;lh.onchange=e=>input.configure({leftHanded:e.target.checked})}
if(fa){fa.value=input.assist;fa.onchange=e=>input.configure({assist:e.target.value})}
if(ml){ml.value=Math.round(input.motion*100);ml.oninput=e=>input.configure({motion:e.target.value/100})}
if(csize){csize.value=Math.round(input.controlScale*100);csize.oninput=e=>input.configure({controlScale:e.target.value/100})}
if(cop){cop.value=Math.round(input.controlOpacity*100);cop.oninput=e=>input.configure({controlOpacity:e.target.value/100})}
if(hap){hap.checked=input.haptics;hap.onchange=e=>input.configure({haptics:e.target.checked})}window.addEventListener('keydown',e=>{if(e.code==='Escape'){if(state==='paused')resume();else pause();}if(e.code==='KeyF')toggleFullscreen();if(e.code==='KeyM')$('sound').click();if(e.code==='KeyP'&&!e.repeat){showToast(gamerPolish.togglePhoto()?'PHOTO MODE · HUD oculto':'Photo Mode encerrado')}if(e.code==='KeyZ'&&!e.repeat){showToast(gamerPolish.toggleZen()?'VOO ZEN · interface reduzida':'Voo Zen encerrado')}if(e.code==='KeyX'&&!e.repeat){showToast('Feitiço · '+magicSystem.label(magicSystem.next()));const mb=$('magic-label');if(mb)mb.textContent=magicSystem.label();}if(e.code==='KeyR'&&(state==='playing'||state==='exploring'||state==='ground')){flight.reset();lastPos=flight.position.clone();showToast('De volta ao castelo');}});const cm=$('challenge-mode');if(cm)cm.onchange=e=>{challenges.setMode(e.target.value);refreshGamerPanel();showToast(challenges.mode==='time'?'Time Trial ativado · corra contra seu fantasma':'Aventura ativada');};window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
function syncPhaseUI(){
  document.querySelectorAll('.phase-card').forEach(btn=>{
    const on=btn.dataset.phase===selectedPhase;
    btn.classList.toggle('active',on);
    btn.setAttribute('aria-selected',on?'true':'false');const pr=progression.region(btn.dataset.phase);let badge=btn.querySelector('.phase-progress');if(!badge){badge=document.createElement('small');badge.className='phase-progress';btn.appendChild(badge);}badge.textContent=`${'★'.repeat(pr.stars||0)}${'☆'.repeat(3-(pr.stars||0))} · ${pr.rank||'—'}`;
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
  livingWorld?.dispose();deepExploration?.dispose();adventure?.dispose();visualArt?.dispose();atmosphereVFX?.dispose();kenneyWorld?.dispose();livingEncounters?.dispose();dungeonAdventure?.dispose();world=new World(scene,window.__assets,selectedPhase);livingWorld=new LivingWorld(scene,world,selectedPhase);deepExploration=new DeepExploration(scene,selectedPhase);adventure=new AdventureSystem(scene,selectedPhase);visualArt=new VisualArtPass(scene,selectedPhase,window.__assets);atmosphereVFX=new AtmosphereVFX(scene,selectedPhase);kenneyWorld=new KenneyWorld(scene,selectedPhase,window.__assets);livingEncounters=new LivingEncounters(scene,selectedPhase);regionQuests=new RegionQuests(selectedPhase);
  if(exploration)exploration.dispose(); exploration=new Exploration(scene,world);missions=new MissionSystem(selectedPhase);refreshGrimoire();
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


function refreshGrimoire(){const body=$('grimoire-body');if(body&&missions)body.innerHTML=missions.render();}
function openGrimoire(){refreshGrimoire();const g=$('grimoire');if(!g)return;g.dataset.previous=state;if(state==='playing'||state==='exploring'||state==='ground'){state='paused';input.clear();touchVisibility();}g.classList.remove('hidden');}
function closeGrimoire(){const g=$('grimoire');if(!g)return;g.classList.add('hidden');const prev=g.dataset.previous;if(prev==='playing'||prev==='exploring'||prev==='ground'){state=prev;touchVisibility();}}
$('grimoire-open')&&($('grimoire-open').onclick=openGrimoire);$('grimoire-close')&&($('grimoire-close').onclick=closeGrimoire);
init();
