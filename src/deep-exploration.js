import {storage} from './storage.js';
import * as T from 'three';
import {ground} from './world.js';

const DATA={
 floresta:[
  {id:'ruinas',name:'Ruínas das Três Luas',p:[-28,1,-20],kind:'puzzle'},
  {id:'caverna',name:'Caverna dos Vaga-lumes',p:[34,1,25],kind:'investigation'}
 ],
 vila:[
  {id:'poco',name:'Poço dos Sussurros',p:[-30,1,28],kind:'investigation'},
  {id:'oficina',name:'Oficina Abandonada',p:[32,1,-24],kind:'puzzle'}
 ],
 castelo:[
  {id:'cripta',name:'Cripta Lunar',p:[-32,1,-25],kind:'puzzle'},
  {id:'observatorio',name:'Observatório Antigo',p:[30,1,30],kind:'investigation'}
 ]
};
export class DeepExploration{
 constructor(scene,phase='floresta'){this.scene=scene;this.phase=phase;this.sites=[];this.active=null;this.progress=this.load();this.build()}
 load(){try{return JSON.parse(storage.getItem('wf-deep-explore')||'{}')}catch{return{}}}
 save(){try{storage.setItem('wf-deep-explore',JSON.stringify(this.progress))}catch{}}
 build(){
  const ring=new T.TorusGeometry(2.2,.11,7,24), pillar=new T.CylinderGeometry(.35,.55,2.8,6);
  for(const d of DATA[this.phase]||[]){const g=new T.Group(),mat=new T.MeshStandardMaterial({color:d.kind==='puzzle'?0xa98bd4:0x79b9a5,roughness:.72,metalness:.08,emissive:d.kind==='puzzle'?0x25143b:0x102d29,emissiveIntensity:.45});
   const r=new T.Mesh(ring,mat);r.rotation.x=Math.PI/2;r.position.y=.15;g.add(r);
   for(let i=0;i<3;i++){const m=new T.Mesh(pillar,mat.clone());m.position.set(Math.cos(i*2.094)*2.6,1.35,Math.sin(i*2.094)*2.6);g.add(m)}
   g.position.set(...d.p);g.position.y=ground(d.p[0],d.p[2])+d.p[1];this.scene.add(g);this.sites.push({...d,g,stage:this.progress[this.phase+'-'+d.id]||0});}
 }
 nearest(pos,max=6.5){let best=null,dist=max;for(const s of this.sites){const d=s.g.position.distanceTo(pos);if(d<dist){best=s;dist=d}}return best}
 interact(pos,vision=false){
  const s=this.nearest(pos);if(!s)return null;const key=this.phase+'-'+s.id;
  if(s.stage===0){s.stage=1;this.progress[key]=1;this.save();return{site:s,reward:35,message:`LOCAL DESCOBERTO · ${s.name} · use Visão Mágica para investigar`}}
  if(s.stage===1&&!vision)return{site:s,reward:0,message:`${s.name} · a pista está oculta. Ative a Visão Mágica.`}
  if(s.stage===1&&vision){s.stage=2;this.progress[key]=2;this.save();return{site:s,reward:90,message:`PISTA REVELADA · ${s.name} · símbolos mágicos responderam à Lelinha`}}
  if(s.stage===2){s.stage=3;this.progress[key]=3;this.save();s.g.children.forEach(x=>x.material&&(x.material.emissiveIntensity=1.25));return{site:s,reward:160,message:`ENIGMA CONCLUÍDO · ${s.name} · +160 essência`}}
  return{site:s,reward:0,message:`${s.name} · mistério já solucionado`}
 }
 summary(){const a=this.sites.filter(s=>s.stage>=3).length;return`${a}/${this.sites.length} locais profundos`}
 dispose(){for(const s of this.sites){this.scene.remove(s.g);s.g.traverse(o=>{o.geometry?.dispose?.();o.material?.dispose?.()})}this.sites=[]}
}
