export class BalanceV41{
 constructor(){this.table={player:{maxHealth:100,maxMagic:100},ghost:{hp:55,damage:8,xp:25},bat:{hp:40,damage:6,xp:18},cyclops:{hp:180,damage:[16,20,24],xp:120}}}
 bossDamage(phase){return this.table.cyclops.damage[Math.max(0,Math.min(2,(phase||1)-1))]}
 audit(){const b=this.table;return{bossHitsToDefeatPlayer:b.player.maxHealth/b.cyclops.damage[2],bossRewardRatio:b.cyclops.xp/b.ghost.xp}}
}