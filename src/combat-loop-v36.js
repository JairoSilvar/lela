import * as T from 'three';
export class CombatLoopV36{
 constructor(combat,combatCore,progression,audio,vfx,toast){this.combat=combat;this.core=combatCore;this.progression=progression;this.audio=audio;this.vfx=vfx;this.toast=toast;this.lastDead=new Set()}
 cast(player,camera){
  if(!player||!camera||!this.combat?.cast())return false;
  const origin=player.position.clone();origin.y+=.75;
  const dir=new T.Vector3();camera.getWorldDirection(dir);
  this.core?.cast(origin,dir,18+(this.combat.combo||1)*2);this.audio?.impact();return true
 }
 update(){
  for(const e of this.core?.entities||[]){if(e.dead&&!this.lastDead.has(e)){this.lastDead.add(e);const level=this.progression?.add?.(e.xp);this.toast?.(level?`Nível ${this.progression.level}!`:`${e.name} derrotado · +${e.xp} XP`);this.audio?.reward();this.vfx?.magic?.('lumen',e.object.position)}}
 }
}