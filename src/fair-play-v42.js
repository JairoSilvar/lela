export class FairPlayV42{
 constructor(){this.lastHit=0;this.minGap=.18;this.maxSingleHit=30}
 damage(raw){const now=performance.now()/1000;if(now-this.lastHit<this.minGap)return 0;this.lastHit=now;return Math.max(0,Math.min(this.maxSingleHit,Number(raw)||0))}
}