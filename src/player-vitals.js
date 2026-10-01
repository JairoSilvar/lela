export class PlayerVitals{
 constructor(){this.maxHealth=100;this.health=100;this.maxMagic=100;this.magic=100;this.invuln=0}
 update(dt){this.invuln=Math.max(0,this.invuln-dt);this.magic=Math.min(this.maxMagic,this.magic+dt*3)}
 damage(n){if(this.invuln>0)return false;this.health=Math.max(0,this.health-n);this.invuln=.65;return true}
 spendMagic(n){if(this.magic<n)return false;this.magic-=n;return true}
 get dead(){return this.health<=0}
}