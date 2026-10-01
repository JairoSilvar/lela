export class BossCyclopsV35{
 constructor(){this.entity=null;this.phase=1;this.special=0}
 bind(e){this.entity=e;this.phase=1}
 update(dt){
  if(!this.entity||this.entity.dead)return null;this.special=Math.max(0,this.special-dt);
  const r=this.entity.hp/this.entity.maxHp;this.phase=r<=.25?3:r<=.6?2:1;
  if(this.phase>=2&&this.special<=0){this.special=this.phase===3?3.2:4.8;return{type:'telegraph',phase:this.phase,duration:.75}}
  return null
 }
}