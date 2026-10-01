import {storage} from './storage.js';
export class SaveV35{
 constructor(key='lelinha-save'){this.key=key;this.version=2}
 save({phase,position,vitals,progression,essence=0,session=null}){
  try{storage.setItem(this.key,JSON.stringify({saveVersion:this.version,phase,position:{x:position.x,y:position.y,z:position.z},vitals:{health:vitals.health,magic:vitals.magic},progression:progression?.snapshot?.()||null,essence,session,savedAt:Date.now()}));return storage.persistent}catch{return false}
 }
 load(){try{const d=JSON.parse(storage.getItem(this.key)||'null');if(!d)return null;if(!d.saveVersion)d.saveVersion=1;return d}catch{return null}}
}