export class WorldSchedulerV37{
 constructor(){this.frame=0}
 tick(){this.frame++}
 interval(distance){return distance<15?1:distance<30?2:distance<60?8:30}
 active(distance){const n=this.interval(distance);return this.frame%n===0}
}