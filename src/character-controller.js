export class CharacterController{
 constructor(){this.radius=.38;this.height=1.55;this.gravity=-18;this.vy=0;this.grounded=false;this.maxSlope=.72;this.step=.32}
 update(dt,flight,state){
  if(!flight?.position)return;
  const ground=state==='ground'||state==='exploring'||flight.position.y<1.12;
  if(ground){
   this.vy+=this.gravity*dt;
   flight.position.y+=this.vy*dt;
   if(flight.position.y<=1){flight.position.y=1;this.vy=0;this.grounded=true}else this.grounded=false;
  } else {this.vy=0;this.grounded=false}
 }
 resolveWorld(pos,colliders=[]){
  if(!pos)return;
  for(const c of colliders){
   const dx=pos.x-c.x,dz=pos.z-c.z,rr=this.radius+(c.r||1);
   const d2=dx*dx+dz*dz;
   if(d2>0&&d2<rr*rr){const d=Math.sqrt(d2),push=(rr-d)/d;pos.x+=dx*push;pos.z+=dz*push}
  }
 }
}