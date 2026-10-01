import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
export class CreatureModelsV34{
 constructor(scene,ai,combat=null,boss=null,animState=null){this.scene=scene;this.ai=ai;this.combat=combat;this.boss=boss;this.animState=animState;this.loader=new GLTFLoader();this.root=new T.Group();this.root.name='RealCreatures-v34';scene.add(this.root);this.mixers=[];this.loaded=[]}
 async one(file,pos,scale,kind){
  try{const g=await this.loader.loadAsync(file),o=g.scene;o.position.set(...pos);o.scale.setScalar(scale);o.traverse(x=>{if(x.isMesh){x.castShadow=true;x.receiveShadow=true}});this.root.add(o);this.loaded.push(o);
   if(g.animations?.length){const mx=new T.AnimationMixer(o);this.animState?.bind(o,mx,g.animations);this.animState?.play(o,'idle');if(!this.animState){mx.clipAction(g.animations[0]).play()}this.mixers.push(mx)}
   this.ai?.register(o,{kind,speed:kind==='hostile'?1.25:.8,range:kind==='hostile'?8:5});
   const fileName=file.split('/').pop();const isBoss=fileName==='Cyclops.gltf';
   const ce=this.combat?.bind(o,{name:isBoss?'Cyclops':fileName.replace('.gltf',''),hp:isBoss?180:kind==='hostile'?55:35,damage:isBoss?18:8,xp:isBoss?120:kind==='hostile'?25:10,boss:isBoss});
   if(isBoss&&ce)this.boss?.bind(ce);return o
  }catch(e){console.warn('Creature asset fallback:',file,e);return null}
 }
 loadPhase(p){
  this.clear();
  if(p==='floresta'){this.one('assets/creatures/Deer.gltf',[-9,1,11],.85,'passive');this.one('assets/creatures/Bat.gltf',[9,4,14],.65,'neutral')}
  else if(p==='vila'){this.one('assets/creatures/Deer.gltf',[12,1,-7],.72,'passive')}
  else {this.one('assets/creatures/Ghost.gltf',[-8,2,15],.85,'hostile');this.one('assets/creatures/Bat.gltf',[8,4,18],.7,'hostile');this.one('assets/creatures/Cyclops.gltf',[0,1,27],1.05,'hostile')}
 }
 update(dt){for(const m of this.mixers)m.update(dt)}
 clear(){for(const m of this.mixers)m.stopAllAction();this.mixers.length=0;for(const o of this.loaded)this.root.remove(o);this.loaded.length=0;if(this.ai)this.ai.agents.length=0}
}