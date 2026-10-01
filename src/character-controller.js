import {ground} from './world.js';
export class CharacterController{
 constructor(){this.radius=.42;this.grounded=false}
 update(dt,flight){if(!flight)return;this.grounded=flight.grounded;if(this.grounded)flight.position.y=ground(flight.position.x,flight.position.z)+1.05}
 resolveWorld(pos,colliders=[]){if(!pos)return;for(const c of colliders){if(pos.y>(c.y||0)+(c.height||5)+1||pos.y<(c.y||0)-1)continue;let dx=pos.x-c.x,dz=pos.z-c.z,d=Math.hypot(dx,dz),r=this.radius+c.r;if(d<r){if(d<.0001){dx=1;dz=0;d=1}pos.x+=dx/d*(r-d);pos.z+=dz/d*(r-d)}}}
}