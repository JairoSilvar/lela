import * as T from 'three';
export class RespawnV36{
 constructor(){this.point=new T.Vector3(0,1,0);this.phase=null;this.cool=0}
 set(pos,phase){this.point.copy(pos);this.phase=phase}
 update(dt,vitals,player){this.cool=Math.max(0,this.cool-dt);if(vitals?.dead&&this.cool<=0){player.position.copy(this.point);vitals.health=vitals.maxHealth;vitals.magic=Math.max(35,vitals.magic);vitals.invuln=2;this.cool=2;return true}return false}
}