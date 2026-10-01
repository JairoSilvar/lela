import {storage} from './storage.js';
export class MagicSystem{
 constructor(){this.spells=['lumen','ventus','aegis','blink'];this.index=Number(storage.getItem('wf-spell')||0);this.inventory=this.load()}
 load(){try{return JSON.parse(storage.getItem('wf-inventory')||'{"flor":0,"cogumelo":0,"cristal":0,"pocoes":0}')}catch{return{flor:0,cogumelo:0,cristal:0,pocoes:0}}}
 save(){storage.setItem('wf-spell',String(this.index));storage.setItem('wf-inventory',JSON.stringify(this.inventory))}
 current(){return this.spells[this.index]}
 next(){this.index=(this.index+1)%this.spells.length;this.save();return this.current()}
 label(s=this.current()){return({lumen:'Lumen · revelar',ventus:'Ventus · impulso',aegis:'Aegis · escudo',blink:'Blink · avanço'})[s]}
 cast(flight){
  const s=this.current();
  if(s==='ventus'){flight.energy=Math.min(100,flight.energy+18);return{message:'VENTUS · impulso mágico',reward:0}}
  if(s==='aegis'){flight.shieldTime=3;return{message:'AEGIS · proteção por 3s',reward:0}}
  if(s==='blink'){flight.position.addScaledVector(flight.forward||{x:0,y:0,z:-1},2.5);return{message:'BLINK · avanço instantâneo',reward:0}}
  return{message:'LUMEN · a magia revela o que estava oculto',reward:0,vision:true}
 }
 gather(type){if(this.inventory[type]!=null){this.inventory[type]++;this.save()}}
 craft(){if(this.inventory.flor>=1&&this.inventory.cogumelo>=1){this.inventory.flor--;this.inventory.cogumelo--;this.inventory.pocoes++;this.save();return true}return false}
 summary(){return`Flor ${this.inventory.flor} · Cogumelo ${this.inventory.cogumelo} · Poções ${this.inventory.pocoes}`}
}
