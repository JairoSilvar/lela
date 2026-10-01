export class CombatFeedbackV37{
 constructor(hud,toast,audio){this.hud=hud;this.toast=toast;this.audio=audio;this.lastBossPhase=0}
 update(boss){
  const e=boss?.entity;this.hud?.boss?.(e);
  if(e&&!e.dead&&boss.phase!==this.lastBossPhase){this.lastBossPhase=boss.phase;if(boss.phase>1){this.toast?.(`Cyclops entrou na Fase ${boss.phase}`);this.audio?.impact()}}
 }
}