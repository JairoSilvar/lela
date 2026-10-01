export class GroundFeedback{
constructor(){this.wasGround=false;this.cool=0}
update(dt,state,show){this.cool=Math.max(0,this.cool-dt);const g=state==='ground'||state==='exploring';if(g&&!this.wasGround&&this.cool<=0){show?.('Exploração terrestre · procure locais secretos e habitantes');this.cool=5}this.wasGround=g}
}