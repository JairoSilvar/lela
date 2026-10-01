import * as T from 'three';
export class AtmosphereVFX{
 constructor(scene,phase='floresta'){this.scene=scene;this.phase=phase;this.root=new T.Group();this.root.name='AtmosphereVFX';scene.add(this.root);this.t=0;this.build()}
 mat(c,op=.72){return new T.MeshBasicMaterial({color:c,transparent:true,opacity:op,depthWrite:false,blending:T.AdditiveBlending})}
 build(){
  const low=document.body.dataset.graphics==='low', n=low?18:42;
  const col=this.phase==='castelo'?0xff9366:this.phase==='vila'?0xffd0ef:0xa8ffd5;
  this.motes=[];
  for(let i=0;i<n;i++){const m=new T.Mesh(new T.SphereGeometry(.035+(i%3)*.018,5,4),this.mat(col,.34+(i%4)*.09));
   const a=i*2.399,r=8+(i%11)*3.4;m.position.set(Math.cos(a)*r,.7+(i%9)*.65,Math.sin(a)*r);m.userData={a,r,y:m.position.y,spd:.06+(i%5)*.012};this.root.add(m);this.motes.push(m)}
  this.wisps=[];
  if(!low)for(let i=0;i<7;i++){const g=new T.Mesh(new T.SphereGeometry(.13,7,5),this.mat(this.phase==='castelo'?0xd7b0ff:0x8fffe0,.55));g.position.set((i-3)*6,1.2+(i%3),-14+(i%4)*8);g.userData={base:g.position.clone(),p:i*.8};this.root.add(g);this.wisps.push(g)}
 }
 update(dt,player){this.t+=dt;for(const m of this.motes){const u=m.userData,a=u.a+this.t*u.spd;m.position.x=Math.cos(a)*u.r;m.position.z=Math.sin(a)*u.r;m.position.y=u.y+Math.sin(this.t*1.2+u.a)*.35}
  for(const w of this.wisps){const u=w.userData;w.position.x=u.base.x+Math.sin(this.t*.55+u.p)*2.2;w.position.z=u.base.z+Math.cos(this.t*.48+u.p)*2;w.position.y=u.base.y+Math.sin(this.t*1.1+u.p)*.55}
  if(player){this.root.position.x=player.x*.06;this.root.position.z=player.z*.06}}
 dispose(){this.scene.remove(this.root);this.root.traverse(o=>{o.geometry?.dispose?.();o.material?.dispose?.()})}
}