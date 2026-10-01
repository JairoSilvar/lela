export class GameplayStateGuard{
 constructor(){this.mode="flight";this.prev="flight";this.transition=0}
 infer(state,flight){
  if(state==="ground"||state==="exploring")return"ground";
  if(flight?.position?.y<1.15)return"landing";
  return"flight";
 }
 update(dt,state,flight){
  this.transition=Math.max(0,this.transition-dt);
  const next=this.infer(state,flight);
  const changed=next!==this.mode;
  if(changed){this.prev=this.mode;this.mode=next;this.transition=.22}
  return{mode:this.mode,previous:this.prev,changed,locked:this.transition>0}
 }
}