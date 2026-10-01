export class NPCBehavior{
constructor(){this.t=0}
update(dt,living,pos){this.t+=dt;if(!living?.actors||!pos)return;for(const a of living.actors){const d=a.position.distanceTo(pos);if(d<6){const dx=pos.x-a.position.x,dz=pos.z-a.position.z;a.rotation.y=Math.atan2(dx,dz)}a.position.y=Math.sin(this.t*1.5+(a.userData?.p||0))*.025}}
}