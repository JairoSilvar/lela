import {storage} from './storage.js';
const ROOT='./assets/audio/sfx/';
const F={
  click:'ui_click.ogg',orb:'orb.ogg',ring:'ring.ogg',reward:'reward.ogg',
  book:'book_open.ogg',page:'book_page.ogg',door:'door_open.ogg',
  lumen:'spell_lumen.ogg',ventus:'spell_ventus.ogg',aegis:'spell_aegis.ogg',
  blink:'spell_blink.ogg',special:'magic_special.ogg',
  roar:'creature_roar.ogg',stone:'stone.ogg',wood:'wood.ogg',
  steps:['footstep_1.ogg','footstep_2.ogg','footstep_3.ogg']
};

/**
 * Soundscape v53.1 — ambient/vento suaves, sem empilhar drones, sem “serra”.
 * Causas antigas do ruído estranho:
 *  1) pad de 3 osciladores contínuos em effects.js
 *  2) vento = ruído branco puro em loop com filtro agressivo
 *  3) phaseOsc recriado sem garantir stop (drones empilhados)
 *  4) ambient_fantasy em loop alto + vento juntos
 */
export class Soundscape{
  constructor(){
    this.enabled=storage.getItem('wf-sfx')!=='0';
    this.vol={
      sfx:Number(storage.getItem('wf-sfx-vol')??.72),
      ambient:Number(storage.getItem('wf-amb-vol')??.18), // default mais baixo
      ui:Number(storage.getItem('wf-ui-vol')??.55)
    };
    this.pools={};
    this.stepT=0;this.stepI=0;
    this.amb=null;
    this.ctx=null;
    this.wind=null;this.windGain=null;this.windFilter=null;
    this.phaseOsc=null;this.phaseGain=null;
    this.lastGrounded=true;this.phase='';this.stingerT=0;
    this._landCool=0;this._woodCool=0;
  }

  audio(f,loop=false){
    const a=new Audio(ROOT+f);
    a.preload='auto';a.loop=loop;a.playsInline=true;
    return a;
  }
  pool(f,n=4){return this.pools[f]||(this.pools[f]=Array.from({length:n},()=>this.audio(f)));}

  play(n,c='sfx',g=1,r=1){
    if(!this.enabled)return;
    const f=F[n];if(!f||Array.isArray(f))return;
    const p=this.pool(f),a=p.find(x=>x.paused||x.ended)||p[0];
    try{
      a.pause();a.currentTime=0;
      a.volume=Math.min(1,(this.vol[c]??this.vol.sfx)*g);
      a.playbackRate=r;
      a.play().catch(()=>{});
    }catch{}
  }

  magic(k){this.play(F[k]?k:'special','sfx',.85,.96+Math.random()*.08);}

  step(){
    if(!this.enabled)return;
    const f=F.steps[this.stepI++%F.steps.length],p=this.pool(f,3),a=p.find(x=>x.paused||x.ended)||p[0];
    a.currentTime=0;a.volume=this.vol.sfx*.22;a.playbackRate=.92+Math.random()*.12;
    a.play().catch(()=>{});
  }

  /** Ruído rosa aproximado + lowpass suave — não parece serra. */
  ensureWind(){
    if(this.ctx||!this.enabled)return;
    try{
      this.ctx=new(window.AudioContext||window.webkitAudioContext)();
      const n=this.ctx.sampleRate*2,b=this.ctx.createBuffer(1,n,this.ctx.sampleRate),d=b.getChannelData(0);
      // pink-ish: filtro simples em ruído branco
      let last=0;
      for(let i=0;i<n;i++){
        const w=Math.random()*2-1;
        last=(last+0.02*w)/1.02;
        d[i]=last*3.5;
      }
      this.wind=this.ctx.createBufferSource();
      this.wind.buffer=b;this.wind.loop=true;
      this.windFilter=this.ctx.createBiquadFilter();
      this.windFilter.type='lowpass';
      this.windFilter.frequency.value=420; // mais grave, menos “serra”
      this.windFilter.Q.value=.7;
      this.windGain=this.ctx.createGain();
      this.windGain.gain.value=0;
      this.wind.connect(this.windFilter).connect(this.windGain).connect(this.ctx.destination);
      this.wind.start();
    }catch{}
  }

  tone(freq=440,dur=.12,gain=.06){
    if(!this.enabled)return;
    this.ensureWind();if(!this.ctx)return;
    const o=this.ctx.createOscillator(),g=this.ctx.createGain();
    o.frequency.value=freq;o.type='sine';
    const t=this.ctx.currentTime;
    g.gain.setValueAtTime(Math.max(.0001,gain*this.vol.sfx),t);
    g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g).connect(this.ctx.destination);
    o.start();o.stop(t+dur);
  }

  takeoff(){this.tone(180,.14,.07);setTimeout(()=>this.tone(300,.16,.05),50);}
  land(){
    if(this._landCool>0)return;
    this._landCool=.35;
    this.play('stone','sfx',.16,.8+Math.random()*.08);
  }
  perfect(){this.play('reward','sfx',.75,1.12);this.tone(880,.18,.05);}
  mission(){this.play('reward','sfx',.8,1);setTimeout(()=>this.tone(660,.22,.05),90);}

  worldCue(kind='roar',distance=1){
    if(!this.enabled)return;
    // wood/stone como worldCue ficavam “serrando” se spamados — bloquear
    if(kind==='wood'||kind==='stone'){
      if(this._woodCool>0)return;
      this._woodCool=.8;
    }
    const g=Math.max(.04,Math.min(.28,.35/(Math.max(.7,distance))));
    this.play(kind,'ambient',g,.9+Math.random()*.12);
  }

  setPhase(p){
    if(this.phase===p&&this.phaseOsc)return; // não recria
    this.phase=p;
    if(!this.enabled)return;
    this.ensureWind();if(!this.ctx)return;
    const f=p==='castelo'?92:p==='vila'?130:110;
    try{this.phaseOsc?.stop();}catch{}
    try{this.phaseGain?.disconnect();}catch{}
    this.phaseOsc=this.ctx.createOscillator();
    this.phaseOsc.type='sine';
    this.phaseOsc.frequency.value=f;
    this.phaseGain=this.ctx.createGain();
    // bem baixo — só presença, não zumbido
    this.phaseGain.gain.value=.0025*this.vol.ambient;
    this.phaseOsc.connect(this.phaseGain).connect(this.ctx.destination);
    this.phaseOsc.start();
  }

  update(dt,f){
    if(!f)return;
    this.stingerT=Math.max(0,this.stingerT-dt);
    this._landCool=Math.max(0,this._landCool-dt);
    this._woodCool=Math.max(0,this._woodCool-dt);

    // passos só no chão, ritmo mais espaçado
    if(f.grounded&&f.speed>1.2){
      this.stepT-=dt;
      if(this.stepT<=0){this.step();this.stepT=Math.max(.32,.55-f.speed*.015);}
    }else this.stepT=0;

    if(this.lastGrounded&&!f.grounded)this.takeoff();
    else if(!this.lastGrounded&&f.grounded)this.land();
    this.lastGrounded=!!f.grounded;

    this.ensureWind();
    if(this.windGain&&this.ctx){
      const speed=Math.min(1,Math.max(0,(f.speed||0)/28));
      // no chão quase silencioso; em voo suave
      const target=f.grounded?0.003:.01+speed*.035;
      this.windGain.gain.setTargetAtTime(this.enabled?target*this.vol.ambient:0,this.ctx.currentTime,.18);
      this.windFilter.frequency.setTargetAtTime(320+speed*600,this.ctx.currentTime,.18);
    }
  }

  setAmbient(on=true){
    if(!this.amb)this.amb=this.audio('ambient_fantasy.ogg',true);
    if(!this.enabled||!on){
      this.amb.pause();
      if(this.windGain&&this.ctx)this.windGain.gain.setTargetAtTime(0,this.ctx.currentTime,.1);
      try{this.phaseOsc?.stop();}catch{}
      this.phaseOsc=null;
      return;
    }
    // volume de ambient limitado para não mascarar SFX nem “serra”
    this.amb.volume=Math.min(.35,this.vol.ambient);
    this.amb.play().catch(()=>{});
    this.ensureWind();
  }

  setVolume(c,v){
    this.vol[c]=Math.max(0,Math.min(1,+v));
    storage.setItem(c==='sfx'?'wf-sfx-vol':c==='ambient'?'wf-amb-vol':'wf-ui-vol',this.vol[c]);
    if(c==='ambient'&&this.amb)this.amb.volume=Math.min(.35,this.vol.ambient);
    if(c==='ambient'&&this.phaseGain)this.phaseGain.gain.value=.0025*this.vol.ambient;
  }

  toggle(){
    this.enabled=!this.enabled;
    storage.setItem('wf-sfx',this.enabled?'1':'0');
    if(!this.enabled)this.setAmbient(false);
    return this.enabled;
  }
}
