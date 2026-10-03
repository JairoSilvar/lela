import * as T from 'three';

/**
 * CombatLoop v48.1 — cast com mira automática no inimigo mais próximo (mobile-friendly).
 */
export class CombatLoopV36{
  constructor(combat,combatCore,progression,audio,vfx,toast,loot){
    this.loot=loot;
    this.combat=combat;
    this.core=combatCore;
    this.progression=progression;
    this.audio=audio;
    this.vfx=vfx;
    this.toast=toast;
    this.lastDead=new Set();
    this.tmp=new T.Vector3();
    this.lockRange=22;
  }

  nearestEnemy(playerPos){
    if(!playerPos||!this.core?.entities?.length) return null;
    let best=null, bestD=this.lockRange;
    for(const e of this.core.entities){
      if(e.dead||!e.object) continue;
      e.object.getWorldPosition(this.tmp);
      const d=this.tmp.distanceTo(playerPos);
      if(d<bestD){ bestD=d; best=e; }
    }
    return best;
  }

  cast(player,camera,opts={}){
    if(!player||!camera||!this.combat?.cast()) return false;
    const origin=player.position.clone();
    origin.y+=.75;
    const dir=new T.Vector3();
    const autoAim=opts.autoAim!==false;
    const target=autoAim?this.nearestEnemy(player.position):null;
    if(target){
      target.object.getWorldPosition(this.tmp);
      this.tmp.y+=target.boss?1.4:.6;
      dir.subVectors(this.tmp,origin).normalize();
    }else{
      dir.copy(player.forward);
    }
    const dmg=18+(this.combat.combo||1)*2;
    this.core?.cast(origin,dir,dmg);
    this.audio?.impact();
    return {ok:true,locked:!!target,name:target?.name||null};
  }

  update(){
    for(const e of this.core?.entities||[]){
      if(e.dead&&!this.lastDead.has(e)){
        this.lastDead.add(e);
        this.loot?.drop(e.deathPosition||e.object.position,e.boss?40:8);
        const level=this.progression?.add?.(e.xp);
        this.toast?.(level?`Nível ${this.progression.level}!`:`${e.name} derrotado · +${e.xp} XP`);
        this.audio?.reward();
        this.vfx?.magic?.('lumen',e.object.position);
      }
    }
  }
}
