import {storage} from './storage.js';
const ROOT='./assets/audio/sfx/';
const F={click:'ui_click.ogg',orb:'orb.ogg',ring:'ring.ogg',reward:'reward.ogg',book:'book_open.ogg',page:'book_page.ogg',door:'door_open.ogg',
lumen:'spell_lumen.ogg',ventus:'spell_ventus.ogg',aegis:'spell_aegis.ogg',blink:'spell_blink.ogg',special:'magic_special.ogg',
roar:'creature_roar.ogg',stone:'stone.ogg',wood:'wood.ogg',steps:['footstep_1.ogg','footstep_2.ogg','footstep_3.ogg']};
export class Soundscape{
 constructor(){this.enabled=storage.getItem('wf-sfx')!=='0';this.vol={sfx:Number(storage.getItem('wf-sfx-vol')??.72),ambient:Number(storage.getItem('wf-amb-vol')??.28),ui:Number(storage.getItem('wf-ui-vol')??.55)};
 this.pools={};this.stepT=0;this.stepI=0;this.amb=null;this.ctx=null;this.wind=null;this.windGain=null;this.windFilter=null;this.lastGrounded=true;this.phase='';this.stingerT=0}
 audio(f,loop=false){const a=new Audio(ROOT+f);a.preload='auto';a.loop=loop;a.playsInline=true;return a}
 pool(f,n=4){return this.pools[f]||(this.pools[f]=Array.from({length:n},()=>this.audio(f)))}
 play(n,c='sfx',g=1,r=1){if(!this.enabled)return;const f=F[n];if(!f||Array.isArray(f))return;const p=this.pool(f),a=p.find(x=>x.paused||x.ended)||p[0];try{a.pause();a.currentTime=0;a.volume=Math.min(1,this.vol[c]*g);a.playbackRate=r;a.play().catch(()=>{})}catch{}}
 magic(k){this.play(F[k]?k:'special','sfx',.9,.96+Math.random()*.08)}
 step(){if(!this.enabled)return;const f=F.steps[this.stepI++%F.steps.length],p=this.pool(f,3),a=p.find(x=>x.paused||x.ended)||p[0];a.currentTime=0;a.volume=this.vol.sfx*.34;a.playbackRate=.92+Math.random()*.15;a.play().catch(()=>{})}
 ensureWind(){if(this.ctx||!this.enabled)return;try{this.ctx=new (window.AudioContext||window.webkitAudioContext)();const n=this.ctx.sampleRate*2,b=this.ctx.createBuffer(1,n,this.ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1);this.wind=this.ctx.createBufferSource();this.wind.buffer=b;this.wind.loop=true;this.windFilter=this.ctx.createBiquadFilter();this.windFilter.type='lowpass';this.windFilter.frequency.value=900;this.windGain=this.ctx.createGain();this.windGain.gain.value=0;this.wind.connect(this.windFilter).connect(this.windGain).connect(this.ctx.destination);this.wind.start()}catch{}}
 tone(freq=.5,dur=.12,gain=.08){if(!this.enabled)return;this.ensureWind();if(!this.ctx)return;const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(gain*this.vol.sfx,this.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,this.ctx.currentTime+dur);o.connect(g).connect(this.ctx.destination);o.start();o.stop(this.ctx.currentTime+dur)}
 takeoff(){this.tone(180,.18,.11);setTimeout(()=>this.tone(320,.22,.07),50)}
 land(){this.play('stone','sfx',.24,.78+Math.random()*.08)}
 perfect(){this.play('reward','sfx',.8,1.16);this.tone(880,.22,.07)}
 mission(){this.play('reward','sfx',.9,1);setTimeout(()=>this.tone(660,.3,.07),90)}
 worldCue(kind='roar',distance=1){if(!this.enabled)return;const g=Math.max(.05,Math.min(.5,.5/(Math.max(.7,distance))));this.play(kind,'ambient',g,.86+Math.random()*.18)}
 setPhase(p){this.phase=p;if(!this.enabled)return;this.ensureWind();if(!this.ctx)return;
  const f=p==='castelo'?92:p==='vila'?146:118;
  if(this.phaseOsc){try{this.phaseOsc.stop()}catch{}}
  if(this.phaseGain)try{this.phaseGain.disconnect()}catch{}
  this.phaseOsc=this.ctx.createOscillator();this.phaseOsc.type='sine';this.phaseOsc.frequency.value=f;
  this.phaseGain=this.ctx.createGain();this.phaseGain.gain.value=.006*this.vol.ambient;
  this.phaseOsc.connect(this.phaseGain).connect(this.ctx.destination);this.phaseOsc.start();
}
 update(dt,f){
  if(!f)return;this.stingerT=Math.max(0,this.stingerT-dt);
  if(f.grounded&&f.speed>.6){this.stepT-=dt;if(this.stepT<=0){this.step();this.stepT=Math.max(.23,.48-f.speed*.018)}}else this.stepT=0;
  if(this.lastGrounded&&!f.grounded)this.takeoff();else if(!this.lastGrounded&&f.grounded)this.land();this.lastGrounded=!!f.grounded;
  this.ensureWind();if(this.windGain){const speed=Math.min(1,Math.max(0,(f.speed||0)/24)),target=f.grounded?.006:.018+speed*.075;this.windGain.gain.setTargetAtTime(this.enabled?target*this.vol.ambient:0,this.ctx.currentTime,.12);this.windFilter.frequency.setTargetAtTime(500+speed*1900,this.ctx.currentTime,.12)}
 }
 setAmbient(on=true){if(!this.amb)this.amb=this.audio('ambient_fantasy.ogg',true);if(!this.enabled||!on){this.amb.pause();if(this.windGain&&this.ctx)this.windGain.gain.setTargetAtTime(0,this.ctx.currentTime,.08);return}this.amb.volume=this.vol.ambient;this.amb.play().catch(()=>{});this.ensureWind()}
 setVolume(c,v){this.vol[c]=Math.max(0,Math.min(1,+v));storage.setItem(c==='sfx'?'wf-sfx-vol':c==='ambient'?'wf-amb-vol':'wf-ui-vol',this.vol[c]);if(c==='ambient'&&this.amb)this.amb.volume=this.vol.ambient}
 toggle(){this.enabled=!this.enabled;storage.setItem('wf-sfx',this.enabled?'1':'0');if(!this.enabled)this.setAmbient(false);return this.enabled}
}