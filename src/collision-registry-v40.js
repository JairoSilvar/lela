export class CollisionRegistryV40{
 constructor(){this.obstacles=[];this.triggers=[]}
 obstacle(x,z,r,tag='world'){this.obstacles.push({x,z,r,tag})}
 trigger(x,z,r,tag){this.triggers.push({x,z,r,tag,inside:false})}
 seed(phase){
  this.obstacles.length=0;this.triggers.length=0;
  const data={
   floresta:[[-13,9,1.4],[-4,18,1.2],[14,12,1.5],[8,-14,1.1]],
   vila:[[-12,10,1.7],[-5,8,1.4],[7,9,1.5],[13,-8,1.6]],
   castelo:[[-11,14,1.8],[11,14,1.8],[-7,24,1.5],[7,24,1.5],[0,30,2.1]]
  };
  for(const [x,z,r] of data[phase]||[])this.obstacle(x,z,r);
  this.trigger(0,0,2.2,'checkpoint-start');
 }
 events(pos){const e=[];for(const t of this.triggers){const d=Math.hypot(pos.x-t.x,pos.z-t.z),now=d<t.r;if(now&&!t.inside)e.push({type:'enter',tag:t.tag});t.inside=now}return e}
}