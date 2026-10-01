export class WorldPopulationV38{
 constructor(){this.caps={floresta:{passive:5,neutral:3,hostile:2},vila:{passive:4,neutral:2,hostile:0},castelo:{passive:0,neutral:2,hostile:6}}}
 profile(phase){return this.caps[phase]||this.caps.floresta}
 density(quality){return quality==='lite'?.45:quality==='balanced'?.72:1}
}