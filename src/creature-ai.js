export class CreatureAI{
 constructor(){this.agents=[];this.animation=null}setAnimationSystem(x){this.animation=x}
 register(object,{kind='neutral',speed=1.1,range=7}={}){if(object)this.agents.push({object,kind,speed,range,state:'idle',cool:0,origin:object.position.clone()})}
 update(dt,target){
  if(!target)return;
  for(const a of this.agents){
   a.cool=Math.max(0,a.cool-dt);const p=a.object.position,dx=target.x-p.x,dz=target.z-p.z,d=Math.hypot(dx,dz);
   if(a.kind==='passive')a.state=d<4?'flee':'idle';
   else if(a.kind==='hostile')a.state=d<1.7?'attack':d<a.range?'chase':'patrol';
   else a.state=d<3?'alert':'idle';
   if(a.state==='chase'&&d>.01){p.x+=dx/d*a.speed*dt;p.z+=dz/d*a.speed*dt}
   if(a.state==='flee'&&d>.01){p.x-=dx/d*a.speed*.8*dt;p.z-=dz/d*a.speed*.8*dt}
   this.animation?.play?.(a.object,a.state);if(a.state==='attack'&&a.cool<=0){a.cool=1.2;return{type:'attack',source:a.object,damage:8}}
  }
  return null;
 }
}