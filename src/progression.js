import {storage} from './storage.js';
const KEY='lelinha-progression-v8';
const DEFAULT={regions:{},totalStars:0,unlocks:{brooms:['classica'],trails:['rosa']}};
function read(){const base=JSON.parse(JSON.stringify(DEFAULT));try{const d=JSON.parse(storage.getItem(KEY)||'{}');if(!d||typeof d!=='object')return base;return {...base,...d,regions:d.regions&&typeof d.regions==='object'?d.regions:{},unlocks:{brooms:Array.isArray(d.unlocks?.brooms)?d.unlocks.brooms:['classica'],trails:Array.isArray(d.unlocks?.trails)?d.unlocks.trails:['rosa']}}}catch{return base}}
function write(v){try{storage.setItem(KEY,JSON.stringify(v))}catch{}}
const TARGETS={
  floresta:{time:72,essence:520,combo:6},
  vila:{time:76,essence:560,combo:7},
  castelo:{time:80,essence:620,combo:8}
};
export class ProgressionSystem{
  constructor(){this.data=read();this.xp=Number(this.data.xp)||0;this.level=1+Math.floor(this.xp/100);this.recalc();}
 add(n){const before=this.level;this.xp+=Math.max(0,Number(n)||0);this.level=1+Math.floor(this.xp/100);this.data.xp=this.xp;write(this.data);return this.level>before}
 snapshot(){return {...this.data,xp:this.xp,level:this.level}}
 restore(d){if(!d||typeof d!=='object')return;this.data={...this.data,...d};this.xp=Math.max(0,Number(d.xp)||0);this.level=1+Math.floor(this.xp/100);this.recalc()}
  recalc(){this.data.totalStars=Object.values(this.data.regions||{}).reduce((n,r)=>n+(r.stars||0),0);write(this.data);}
  evaluate(phase,run){
    const t=TARGETS[phase]||TARGETS.floresta;
    const complete=run.rings>=18;
    let stars=complete?1:0;
    if(complete&&run.time<=t.time)stars++;
    if(complete&&(run.essence>=t.essence||run.maxCombo>=t.combo))stars++;
    let score=run.rings*1000+run.essence*4+run.maxCombo*180+Math.max(0,900-Math.floor(run.time*8))-run.collisions*220;
    score=Math.max(0,Math.round(score));
    const ratio=complete?score/21000:score/24000;
    const rank=!complete?'C':ratio>=1.15?'S+':ratio>=1.0?'S':ratio>=.86?'A':ratio>=.72?'B':'C';
    const prev=this.data.regions[phase]||{};
    const best={...prev};
    best.stars=Math.max(prev.stars||0,stars);
    best.rank=this.betterRank(rank,prev.rank)?rank:(prev.rank||rank);
    best.score=Math.max(prev.score||0,score);
    if(complete&&(!prev.bestTime||run.time<prev.bestTime))best.bestTime=run.time;
    best.maxCombo=Math.max(prev.maxCombo||0,run.maxCombo||0);
    best.bestEssence=Math.max(prev.bestEssence||0,run.essence||0);
    best.completed=!!(prev.completed||complete);
    this.data.regions[phase]=best;
    const before=(this.data.unlocks?.brooms||[]).slice();
    this.recalc();
    this.data.unlocks=this.data.unlocks||{brooms:['classica'],trails:['rosa']};
    if(this.data.totalStars>=3&&!this.data.unlocks.brooms.includes('lunar'))this.data.unlocks.brooms.push('lunar');
    if(this.data.totalStars>=6&&!this.data.unlocks.brooms.includes('tempestade'))this.data.unlocks.brooms.push('tempestade');
    if(this.data.totalStars>=8&&!this.data.unlocks.trails.includes('lunar'))this.data.unlocks.trails.push('lunar');
    write(this.data);
    const unlocked=this.data.unlocks.brooms.filter(x=>!before.includes(x));
    return {stars,rank,score,best,unlocked,targets:t};
  }
  betterRank(a,b){const r=['C','B','A','S','S+'];return r.indexOf(a)>r.indexOf(b||'');}
  region(id){return this.data.regions[id]||{stars:0,rank:'—',score:0,maxCombo:0};}
  summary(){return {totalStars:this.data.totalStars||0,regions:this.data.regions,unlocks:this.data.unlocks};}
}
