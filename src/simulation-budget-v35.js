export class SimulationBudgetV35{
 constructor(){this.frame=0}
 tier(distance){return distance<15?0:distance<30?1:distance<60?2:3}
 shouldUpdate(distance){this.frame++;const t=this.tier(distance);return t===0||t===1&&this.frame%2===0||t===2&&this.frame%8===0}
}