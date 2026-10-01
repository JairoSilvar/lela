import {storage} from './storage.js';
const KEY='lelinha-equipment-v9';
export const BROOMS={
 classica:{name:'Clássica',desc:'Equilíbrio para aventura e exploração.',stats:{speed:1,accel:1,control:1,stability:1,turbo:1}},
 lunar:{name:'Lunar',desc:'Controle fino, pousos e anéis precisos.',stats:{speed:.94,accel:1.02,control:1.18,stability:1.15,turbo:.96}},
 tempestade:{name:'Tempestade',desc:'Alta velocidade e turbo para Time Trial.',stats:{speed:1.14,accel:1.1,control:.9,stability:.92,turbo:1.18}}
};
export class EquipmentSystem{
 constructor(progression){this.progression=progression;this.selected=storage.getItem(KEY)||'classica';if(!this.available().includes(this.selected))this.selected='classica';}
 available(){return this.progression.summary().unlocks?.brooms||['classica'];}
 select(id){if(!this.available().includes(id)||!BROOMS[id])return false;this.selected=id;storage.setItem(KEY,id);return true;}
 current(){return {id:this.selected,...BROOMS[this.selected]};}
 render(){return Object.entries(BROOMS).map(([id,b])=>{const ok=this.available().includes(id),s=b.stats;return `<button class="broom-card ${this.selected===id?'selected':''}" data-broom="${id}" ${ok?'':'disabled'}><b>🧹 ${b.name}</b><small>${ok?b.desc:'Bloqueada pela progressão'}</small><span>VEL ${Math.round(s.speed*100)} · CTRL ${Math.round(s.control*100)} · TURBO ${Math.round(s.turbo*100)}</span></button>`}).join('');}
}
