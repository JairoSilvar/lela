export class PhysicsPolishV37{
 constructor(){this.radius=.42;this.world=340;this.prevGround=false}
 update(player,controller,colliders){
  if(!player)return null;
  player.position.x=Math.max(-this.world,Math.min(this.world,player.position.x));
  player.position.z=Math.max(-this.world,Math.min(this.world,player.position.z));
  controller?.resolveWorld?.(player.position,colliders||[]);
  const landed=!!controller?.grounded&&!this.prevGround;this.prevGround=!!controller?.grounded;
  return{landed}
 }
}