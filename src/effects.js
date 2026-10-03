import * as T from 'three';
export class Effects{
 constructor(scene,texture){this.scene=scene;this.particles=[];this.pool=[];this.mat=new T.SpriteMaterial({map:texture,color:'#c0a0ff',transparent:true,blending:T.AdditiveBlending,depthWrite:false});for(let i=0;i<130;i++){const sprite=new T.Sprite(this.mat.clone());sprite.visible=false;scene.add(sprite);this.pool.push(sprite);}this.pulses=[];this.timer=0;this.reduced=false;}
 emit(pos,count=1,color='#c0a0ff',spread=1){if(this.reduced)return;for(let i=0;i<count;i++){const s=this.pool.pop();if(!s)break;s.position.copy(pos);s.material.color.set(color);s.visible=true;this.particles.push({s,life:1,v:new T.Vector3((Math.random()-.5)*spread,(Math.random()-.3)*spread,(Math.random()-.5)*spread)});}}
 pulse(pos){if(this.reduced)return;const m=new T.Mesh(new T.SphereGeometry(1,24,12),new T.MeshBasicMaterial({color:'#ff6ec7',transparent:true,opacity:.25,wireframe:true,depthWrite:false}));m.position.copy(pos);this.scene.add(m);this.pulses.push({m,life:.7});this.emit(pos,24,'#ffb0e0',15);}
 update(dt,flight){this.timer+=dt;if(this.timer>.035){this.timer=0;this.emit(flight.position.clone().addScaledVector(flight.forward,-1.8),flight.boosting?3:1,flight.boosting?'#ffbb71':'#a6ffd5',.8);}for(let i=this.particles.length-1;i>=0;i--){const p=this.particles[i];p.life-=dt;p.s.position.addScaledVector(p.v,dt);p.s.scale.setScalar(.3+p.life*.25);p.s.material.opacity=Math.max(0,p.life);if(p.life<=0){p.s.visible=false;this.pool.push(p.s);this.particles.splice(i,1);}}for(let i=this.pulses.length-1;i>=0;i--){const p=this.pulses[i];p.life-=dt;p.m.scale.setScalar(1+(1-p.life/.7)*12);p.m.material.opacity=p.life*.3;if(p.life<=0){this.scene.remove(p.m);p.m.geometry.dispose();p.m.material.dispose();this.pulses.splice(i,1);}}}
}
/** Áudio one-shot apenas — sem pad contínuo (era a causa do zumbido/serra). */
export class Audio{
 constructor(){this.on=false;this.ctx=null;}
 _ensure(){
  if(this.ctx)return;
  this.ctx=new(window.AudioContext||window.webkitAudioContext)();
  this.master=this.ctx.createGain();
  this.master.gain.value=.9;
  this.master.connect(this.ctx.destination);
 }
 toggle(){
  this._ensure();
  this.on=!this.on;
  if(this.on)this.ctx.resume();else this.ctx.suspend();
  return this.on;
 }
 note(f=660){
  if(!this.on)return;
  this._ensure();
  const o=this.ctx.createOscillator(),g=this.ctx.createGain();
  o.frequency.value=f;o.type='sine';
  g.gain.setValueAtTime(.07,this.ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.45);
  o.connect(g);g.connect(this.master);
  o.start();o.stop(this.ctx.currentTime+.45);
 }
}
