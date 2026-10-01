export class SessionQAV41{
 constructor(){this.start=performance.now();this.deaths=0;this.hits=0;this.casts=0;this.bossPhases=[]}
 death(){this.deaths++}hit(){this.hits++}cast(){this.casts++}phase(n){if(!this.bossPhases.includes(n))this.bossPhases.push(n)}
 report(){return{minutes:(performance.now()-this.start)/60000,deaths:this.deaths,hits:this.hits,casts:this.casts,bossPhases:this.bossPhases.slice()}}
}