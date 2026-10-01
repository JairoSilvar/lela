export class CheckpointV38{
 constructor(respawn,save){this.respawn=respawn;this.save=save;this.last=''}
 reach(id,pos,phase,ctx){
  if(!id||id===this.last)return false;this.last=id;this.respawn?.set(pos,phase);
  this.save?.save?.({phase,position:pos,vitals:ctx.vitals,progression:ctx.progression,essence:ctx.essence||0});return true
 }
}