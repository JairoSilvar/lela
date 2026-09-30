import * as T from 'three';
import {GLTFLoader} from '../vendor/GLTFLoader.js';

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

  if(errors.length){
    throw new Error('Falha ao carregar modelos:\n'+errors.join('\n'));
  }
  if(!assets.witch||!assets.broom){
    throw new Error('Modelos essenciais (witch/broom) não carregaram.');
  }
  return assets;
}

export function normalized(source,height){
  const model=source.clone(true);
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
  const body=normalized(assets.witch,2.35);
  body.traverse(o=>{
    if(!o.isMesh) return;
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
    o.material=o.material.clone();
    o.material.roughness=1;
    o.material.metalness=0;
    if(o.material.name==='DarkBlue'){
      o.material.color.set('#6b2d6e');
      o.material.emissive.set('#3a1548');
      o.material.emissiveIntensity=.28;
    }
  });
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
  root.userData.body=body;
  return root;
}
