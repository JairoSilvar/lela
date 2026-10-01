import * as T from 'three';
export class KenneyWorld{
 constructor(scene,phase,assets){this.scene=scene;this.phase=phase;this.k=assets?.kenney||{};this.root=new T.Group();this.root.name='KenneyWorld-v24';scene.add(this.root);this.build()}
 place(src,x,z,h=3,ry=0){if(!src)return;const m=src.clone(true),b=new T.Box3().setFromObject(m),sz=b.getSize(new T.Vector3()),c=b.getCenter(new T.Vector3()),g=new T.Group();m.position.sub(new T.Vector3(c.x,b.min.y,c.z));g.add(m);g.scale.setScalar(h/Math.max(.01,sz.y));g.position.set(x,0,z);g.rotation.y=ry;g.traverse(o=>{if(o.isMesh){o.castShadow=document.body.dataset.graphics!=='low';o.receiveShadow=true}});this.root.add(g);return g}
 build(){const k=this.k;
  if(this.phase==='floresta'){
   for(let i=0;i<18;i++){const a=i*2.399,r=16+(i%6)*7;this.place(i%3?k.treeOak:k.treePine,Math.cos(a)*r,Math.sin(a)*r,5.5+(i%4),a+.8)}
   for(let i=0;i<8;i++){const a=i*1.7,r=13+(i%4)*8;this.place(k.rock,Math.cos(a)*r,Math.sin(a)*r,1.4+(i%3)*.4,a)}
   this.place(k.bridge,0,-25,2.2,Math.PI/2);this.place(k.log,-12,-9,1.1,.5);this.place(k.mushrooms,9,-7,.75,-.3);
  }else if(this.phase==='vila'){
   this.place(k.fountain,0,-9,3.2);this.place(k.stallRed,-9,-3,3.4,.2);this.place(k.stallGreen,9,-3,3.4,-.2);this.place(k.cart,-13,8,2.2,.7);this.place(k.townWindmill,31,22,10,-.35);
   for(let i=0;i<6;i++)this.place(k.townLantern,-15+i*6,5,2.8,0);
   for(let i=0;i<5;i++)this.place(k.road,0,-20+i*6,.25,0);
  }else{
   for(let i=-3;i<=3;i++)this.place(k.townWall,i*5,-26,4.8,0);this.place(k.townDoor,0,-26,5.4,0);this.place(k.banner,-4,-25,3.2,0);this.place(k.banner,4,-25,3.2,0);
   this.place(k.dungeonGate,0,13,5.4,Math.PI);this.place(k.dungeonRoom,0,25,8,0);this.place(k.dungeonCorridor,0,18,5,0);this.place(k.dungeonCorner,9,22,5,Math.PI/2);this.place(k.dungeonStairs,-9,20,4.5,0);
  }
 }
 dispose(){this.scene.remove(this.root);this.root.traverse(o=>{o.geometry?.dispose?.();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose?.());else o.material?.dispose?.()})}
}
