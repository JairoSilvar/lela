import {storage} from './storage.js';
import * as T from 'three';

export class LivingWorld {
  constructor(scene, world, phase='floresta'){
    this.scene=scene; this.world=world; this.phase=phase;
    this.time=Number(storage.getItem('wf-world-time')||.28); // 0..1
    this.weather='clear'; this.weatherTimer=28; this.eventTimer=16;
    this.fireflies=[]; this.fauna=[]; this.clouds=[]; this.eventText='';
    this._makeAmbient();
  }
  _makeAmbient(){
    const geo=new T.SphereGeometry(.07,5,4), mat=new T.MeshBasicMaterial({color:0xffe8a6,transparent:true,opacity:.8});
    const count=this.phase==='castelo'?16:28;
    for(let i=0;i<count;i++){const m=new T.Mesh(geo,mat.clone());m.position.set((Math.random()-.5)*115,1+Math.random()*10,(Math.random()-.5)*115);this.scene.add(m);this.fireflies.push({m,seed:Math.random()*20,baseY:m.position.y});}
    // Lightweight magical fauna silhouettes: no external assets/draw-call explosion.
    const fgeo=new T.ConeGeometry(.18,.7,5), fmat=new T.MeshBasicMaterial({color:0xbfd9cf,transparent:true,opacity:.55});
    for(let i=0;i<7;i++){const m=new T.Mesh(fgeo,fmat.clone());m.rotation.x=Math.PI/2;m.position.set((Math.random()-.5)*100,5+Math.random()*14,(Math.random()-.5)*100);this.scene.add(m);this.fauna.push({m,seed:Math.random()*30,r:12+Math.random()*18,s:.35+Math.random()*.4});}
  }
  setPhase(phase){this.phase=phase}
  cycleWeather(){
    const pool=this.phase==='castelo'?['clear','mist','stars']:this.phase==='vila'?['clear','mist','drizzle']:['clear','mist','drizzle'];
    this.weather=pool[(pool.indexOf(this.weather)+1)%pool.length];
    return this.weather;
  }
  label(){
    const h=Math.floor(this.time*24), period=h<5?'Madrugada':h<8?'Amanhecer':h<18?'Dia':h<21?'Entardecer':'Noite';
    const w={clear:'Céu limpo',mist:'Névoa mágica',drizzle:'Garoa encantada',stars:'Céu estrelado'}[this.weather]||this.weather;
    return `${period} · ${w}`;
  }
  update(dt, player){
    this.time=(this.time+dt/420)%1; // ~7 min full cycle
    this.weatherTimer-=dt; this.eventTimer-=dt;
    if(this.weatherTimer<=0){this.weatherTimer=34+Math.random()*35;this.cycleWeather();this.eventText='O clima do reino mudou · '+this.label();}
    if(this.eventTimer<=0){this.eventTimer=24+Math.random()*32;const ev=['Um bando mágico cruza o céu','Vaga-lumes revelam uma trilha antiga','O vento traz sinos distantes','Uma estrela rosa risca o horizonte'];this.eventText=ev[Math.floor(Math.random()*ev.length)];}
    const night=this.time<.22||this.time>.78, dusk=Math.max(0,1-Math.abs(this.time-.78)*9);
    const glow=night?1:.18+dusk*.5;
    this.fireflies.forEach((f,i)=>{f.m.visible=glow>.2;f.m.material.opacity=.15+glow*.72*(.65+.35*Math.sin(performance.now()/600+f.seed));f.m.position.y=f.baseY+Math.sin(performance.now()/900+f.seed)*.08;});
    this.fauna.forEach(f=>{const a=performance.now()/1000*f.s+f.seed;f.m.position.x=Math.cos(a)*f.r;f.m.position.z=Math.sin(a)*f.r;f.m.position.y=7+Math.sin(a*1.7)*3;f.m.rotation.z=-a;});
    // Atmospheric fog is intentionally modest for visibility and mobile performance.
    if(this.scene.fog){const target=this.weather==='mist'?0.028:this.weather==='drizzle'?0.018:0.009;this.scene.fog.density+=(target-this.scene.fog.density)*Math.min(1,dt*1.2);}
    const bgDay=new T.Color(this.phase==='vila'?0x6b6a8c:this.phase==='castelo'?0x4d527b:0x58796f),bgNight=new T.Color(0x111426);
    if(this.scene.background?.isColor)this.scene.background.copy(bgNight).lerp(bgDay,night?.12:.82);
    if(Math.random()<dt*.08)try{storage.setItem('wf-world-time',String(this.time))}catch{}
  }
  consumeEvent(){const e=this.eventText;this.eventText='';return e}
  dispose(){[...this.fireflies,...this.fauna].forEach(x=>{this.scene.remove(x.m);x.m.geometry?.dispose();x.m.material?.dispose()});this.fireflies=[];this.fauna=[];}
}
