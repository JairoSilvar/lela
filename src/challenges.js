import {storage} from './storage.js';
const KEY='lelinha-challenges-v9';
const TARGET={floresta:62,vila:66,castelo:70};
export class ChallengeSystem{
 constructor(){try{this.data=JSON.parse(storage.getItem(KEY)||'{}')}catch{this.data={}};this.mode='adventure';this.ghost=[];this.recording=[];this.acc=0;}
 setMode(m){this.mode=m==='time'?'time':'adventure';}
 start(phase){this.phase=phase;this.recording=[];this.acc=0;this.ghost=this.data[phase]?.ghost||[];}
 update(dt,pos,yaw){if(this.mode!=='time')return;this.acc+=dt;if(this.acc>=.12){this.acc=0;this.recording.push([+pos.x.toFixed(2),+pos.y.toFixed(2),+pos.z.toFixed(2),+yaw.toFixed(3)]);}}
 finish(time,complete){if(this.mode!=='time'||!complete)return {record:false,target:TARGET[this.phase]};const p=this.data[this.phase]||{};const record=!p.time||time<p.time;if(record){this.data[this.phase]={time,ghost:this.recording.slice(0,1200)};try{storage.setItem(KEY,JSON.stringify(this.data))}catch{}}return {record,target:TARGET[this.phase]};}
 best(phase){return this.data[phase]?.time||0;}
 target(phase){return TARGET[phase]||70;}
 sample(t){if(!this.ghost.length)return null;return this.ghost[Math.min(this.ghost.length-1,Math.floor(t/.12))]||null;}
}
