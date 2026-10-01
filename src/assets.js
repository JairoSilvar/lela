import * as T from 'three';
import {GLTFLoader} from '../vendor/GLTFLoader.js';
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
  }catch(err){ console.warn('Art Pass v17: usando personagem fallback',err); }
  try{
    const env={};
    for(const [key,file] of Object.entries({town:'TownCenter_FirstAge_Level1.gltf',house:'Houses_FirstAge_1_Level1.gltf',tower:'WatchTower_FirstAge_Level1.gltf',windmill:'Windmill_FirstAge.gltf'})){
      const g=await loader.loadAsync('./assets/environment/'+file); env[key]=g.scene;
    }
    assets.environment=env;
  }catch(err){ console.warn('Art Pass v17: cenários externos parciais',err); }
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
  }catch(err){ console.warn('World Art v24: biblioteca Kenney parcial',err); }

  if(errors.length){
    throw new Error('Falha ao carregar modelos:\n'+errors.join('\n'));
  }
  if(!assets.witch||!assets.broom){
    throw new Error('Modelos essenciais (witch/broom) não carregaram.');
  }
  return assets;
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
      o.material.color.set('#6b2d6e');
      o.material.emissive.set('#3a1548');
      o.material.emissiveIntensity=.28;
    }
  });
  if(assets.lelinha&&assets.heroAnimations?.length){
    const mixer=new T.AnimationMixer(body);
    const clips=Object.fromEntries(assets.heroAnimations.map(c=>[c.name,c]));
    let current='';
    const play=(name,fade=.18)=>{const clip=clips[name];if(!clip||current===name)return;const next=mixer.clipAction(clip);next.reset().fadeIn(fade).play();if(current&&clips[current])mixer.clipAction(clips[current]).fadeOut(fade);current=name;};
    play('Idle_Loop',0);
    const alias=(name)=>clips[name]?name:(name==='Driving_Loop'&&clips['Idle_Loop']?'Idle_Loop':name==='Jog_Fwd_Loop'&&clips['Walk_Loop']?'Walk_Loop':name);
    root.userData.animation={mixer,clips,play:(name,fade=.18)=>play(alias(name),fade),update:(dt,state)=>{play(alias(state));mixer.update(dt);},has:(name)=>!!clips[name],oneShot:(name,back='Idle_Loop')=>{const clip=clips[name];if(!clip)return false;const act=mixer.clipAction(clip);act.reset();act.setLoop(T.LoopOnce,1);act.clampWhenFinished=true;act.fadeIn(.08).play();mixer.addEventListener('finished',function done(e){if(e.action!==act)return;mixer.removeEventListener('finished',done);play(alias(back),.12)});return true;}};
  }
  body.rotation.y=Math.PI;
  body.position.y=-.7;
  body.rotation.x=-.12;
  root.add(body);

  // v44: Lelinha's glasses are anchored to the character's head/bone, never to world coordinates.
  if(assets.lelinha){
    const head=body.getObjectByName('Head')||body.getObjectByName('head')||body.getObjectByName('mixamorigHead')||body;
    const glasses=new T.Group(); glasses.name='LelinhaGlasses';
    const gm=new T.MeshStandardMaterial({color:0x17101d,roughness:.32,metalness:.18});
    const rg=new T.TorusGeometry(.085,.014,8,24);
    const l=new T.Mesh(rg,gm),r=new T.Mesh(rg,gm);l.position.x=-.098;r.position.x=.098;
    const bridge=new T.Mesh(new T.BoxGeometry(.045,.014,.014),gm);
    glasses.add(l,r,bridge); glasses.scale.setScalar(.9);
    // Female_Ranger head local space. Kept conservative; if named head bone is unavailable, hide rather than float.
    if(head!==body){glasses.position.set(0,.035,.125);glasses.rotation.x=-.04;head.add(glasses)}
    else glasses.visible=false;
  }

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
  root.userData.body=body;
  return root;
}
