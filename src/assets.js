import * as T from 'three';
import {GLTFLoader} from '../vendor/GLTFLoader.js';
import {applyHeroOutfit} from './hero-recolor-v46.js';
import {clone as skeletonClone} from '../vendor/SkeletonUtils.js';

export async function loadAssets(onProgress){
  const names=[
    'witch','broom',
    'tree_dead_large','tree_dead_medium',
    'tree_pine_orange_large','tree_pine_yellow_large',
    'pumpkin_orange_jackolantern','pumpkin_orange_small',
    'lantern_standing','crypt','gravestone','arch','candle_triple','shrine'
  ];
  const loader=new GLTFLoader();
  const assets={};
  let done=0;
  const errors=[];

  await Promise.all(names.map(async name=>{
    const ext=(name==='witch'||name==='broom')?'.glb':'.gltf';
    const url='./assets/'+name+ext;
    try{
      const g=await loader.loadAsync(url);
      g.scene.updateMatrixWorld(true);
      assets[name]=g.scene;
      done++;
      if(onProgress) onProgress(done,names.length,name);
    }catch(err){
      errors.push(name+ext+': '+(err&&err.message?err.message:String(err)));
      done++;
      if(onProgress) onProgress(done,names.length,name+' (erro)');
    }
  }));

  // v17: personagem e animações CC0 reais (Quaternius). O modelo antigo permanece como fallback.
  try{
    const hero=await loader.loadAsync('./assets/characters/lelinha/Female_Ranger.gltf');
    hero.scene.updateMatrixWorld(true); assets.lelinha=hero.scene;
    const a1=await loader.loadAsync('./assets/animations/UAL1_Standard.glb');
    const a2=await loader.loadAsync('./assets/animations/UAL2_Standard.glb');
    assets.heroAnimations=[...(a1.animations||[]),...(a2.animations||[])];
  }catch(err){ throw new Error('Personagem/animações incompletas: '+err.message); }
  try{
    const env={};
    for(const [key,file] of Object.entries({town:'TownCenter_FirstAge_Level1.gltf',house:'Houses_FirstAge_1_Level1.gltf',tower:'WatchTower_FirstAge_Level1.gltf',windmill:'Windmill_FirstAge.gltf'})){
      const g=await loader.loadAsync('./assets/environment/'+file); env[key]=g.scene;
    }
    assets.environment=env;
  }catch(err){ throw new Error('Cenários incompletos: '+err.message); }
  // v24: curated Kenney world library. Only selected GLBs are shipped to protect mobile memory.
  try{
    const kenney={};
    const files={
      treeOak:'nature/tree_oak.glb',treePine:'nature/tree_pineDefaultA.glb',rock:'nature/rock_largeA.glb',mushrooms:'nature/mushroom_redGroup.glb',log:'nature/log.glb',bridge:'nature/bridge_wood.glb',grass:'nature/grass_large.glb',
      fountain:'town/fountain-round.glb',stallRed:'town/stall-red.glb',stallGreen:'town/stall-green.glb',townLantern:'town/lantern.glb',cart:'town/cart.glb',road:'town/road.glb',townWindmill:'town/windmill.glb',townWall:'town/wall.glb',townDoor:'town/wall-door.glb',pillar:'town/pillar-stone.glb',banner:'town/banner-red.glb',
      dungeonCorridor:'dungeon/corridor.glb',dungeonCorner:'dungeon/corridor-corner.glb',dungeonGate:'dungeon/gate-door.glb',dungeonRoom:'dungeon/room-small.glb',dungeonStairs:'dungeon/stairs.glb'
    };
    await Promise.all(Object.entries(files).map(async([key,file])=>{const g=await loader.loadAsync('./assets/kenney/'+file);kenney[key]=g.scene;}));
    assets.kenney=kenney;
  }catch(err){ throw new Error('Biblioteca Kenney incompleta: '+err.message); }

  if(errors.length){
    throw new Error('Falha ao carregar modelos:\n'+errors.join('\n'));
  }
  if(!assets.witch||!assets.broom){
    throw new Error('Modelos essenciais (witch/broom) não carregaram.');
  }
  for(const value of Object.values(assets)){const sources=value?.isObject3D?[value]:Object.values(value||{}).filter(x=>x?.isObject3D);for(const source of sources)source.traverse(o=>{if(o.geometry)o.geometry.userData.assetOwned=true;if(o.material&&!Array.isArray(o.material))o.material.userData.assetOwned=true})}return assets;
}

export function normalized(source,height){
  // SkeletonUtils preserves SkinnedMesh -> bone bindings; Object3D.clone(true) does not reliably do so.
  const model=skeletonClone(source);
  const box=new T.Box3().setFromObject(model);
  const size=box.getSize(new T.Vector3());
  const center=box.getCenter(new T.Vector3());
  const root=new T.Group();
  model.position.sub(new T.Vector3(center.x,box.min.y,center.z));
  root.add(model);
  root.scale.setScalar(height/size.y);
  return root;
}

export function createWitch(assets){
  const root=new T.Group();
  const heroSource=assets.lelinha||assets.witch;
  const body=normalized(heroSource,2.35);
  body.traverse(o=>{
    if(!o.isMesh) return;
    if(!assets.lelinha){
    o.geometry=o.geometry.clone();
    const p=o.geometry.attributes.position;
    for(let i=0;i<p.count;i++){
      let x=p.getX(i), y=p.getY(i), z=p.getZ(i);
      if(y<2.7){
        const a=Math.min(1,(2.7-y)/1.3)*.95;
        const d=y-2.7;
        p.setY(i,2.7+d*Math.cos(a));
        p.setZ(i,z-d*Math.sin(a));
      }
      if(y>2.5&&y<5.0&&Math.abs(x)>.7){
        const d=Math.abs(x)-.7;
        p.setX(i,Math.sign(x)*(.7+d*.4));
        p.setY(i,p.getY(i)-d*.35);
        p.setZ(i,p.getZ(i)+d*.7);
      }
    }
    p.needsUpdate=true;
    o.geometry.computeVertexNormals();
    }
    o.material=o.material.clone();
    o.material.roughness=1;
    o.material.metalness=0;
    if(o.material.name==='DarkBlue'||(assets.lelinha&&/ranger|cloth|body/i.test(o.material.name||''))){
      // v46: remapeia a textura escura do figurino (evita a silhueta preta); cai na tinta antiga se indisponível.
      if(!(assets.lelinha&&applyHeroOutfit(o.material))){
        o.material.color.set('#6b2d6e');
        o.material.emissive.set('#3a1548');
        o.material.emissiveIntensity=.28;
      }
    }
  });
  if(assets.lelinha&&assets.heroAnimations?.length){
    const mixer=new T.AnimationMixer(body);
    const clips=Object.fromEntries(assets.heroAnimations.map(c=>[c.name,c]));
    let current='';
    const play=(name,fade=.18)=>{const clip=clips[name];if(!clip||current===name)return;const next=mixer.clipAction(clip);next.reset().fadeIn(fade).play();if(current&&clips[current])mixer.clipAction(clips[current]).fadeOut(fade);current=name;};
    play('Idle_Loop',0);
    const alias=(name)=>clips[name]?name:(name==='Driving_Loop'&&clips['Idle_Loop']?'Idle_Loop':name==='Jog_Fwd_Loop'&&clips['Walk_Loop']?'Walk_Loop':name);
    let shot=null;let backState='Idle_Loop';
    mixer.addEventListener('finished',e=>{if(e.action===shot){shot.fadeOut(.12);shot=null;current='';play(alias(backState),.12)}});
    root.userData.animation={mixer,clips,play:(name,fade=.18)=>play(alias(name),fade),update:(dt,state)=>{backState=state;if(!shot)play(alias(state));mixer.update(dt)},has:name=>!!clips[name],oneShot:(name,back='Idle_Loop')=>{const clip=clips[name];if(!clip||shot)return false;backState=back;if(current)mixer.clipAction(clips[current]).fadeOut(.08);shot=mixer.clipAction(clip);shot.reset().setLoop(T.LoopOnce,1);shot.clampWhenFinished=true;shot.fadeIn(.08).play();return true}};
  }
  body.rotation.y=Math.PI;
  body.position.y=-.7;
  body.rotation.x=-.12;
  root.add(body);

  const broom=assets.broom.clone(true);
  broom.traverse(o=>{
    if(o.isMesh){
      o.material=o.material.clone();
      o.material.roughness=1;
      o.material.metalness=0;
    }
  });
  const box=new T.Box3().setFromObject(broom);
  const size=box.getSize(new T.Vector3());
  const center=box.getCenter(new T.Vector3());
  broom.position.sub(center);
  const holder=new T.Group();
  holder.add(broom);
  holder.scale.setScalar(2.5/Math.max(size.x,size.y,size.z));
  holder.rotation.set(0,Math.PI/2,-.72);
  holder.position.set(0,.05,-.25);
  root.add(holder);
  // v45: expose the broom as a first-class mount so ground/flight states can control it.
  holder.name='LelinhaBroomMount';
  holder.userData.baseScale=holder.scale.clone();
  holder.userData.mountVisibility=1;
  root.userData.broomHolder=holder;
  root.userData.body=body;
  return root;
}
