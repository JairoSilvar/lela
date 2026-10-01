import * as T from 'three';
export class LelinhaIdentity{
 constructor(scene,flight){this.scene=scene;this.flight=flight;this.root=new T.Group();this.root.name='LelinhaIdentity-v44';scene.add(this.root);this.t=0;this.build()}
 build(){
  // Identity accents only. Glasses are attached to the actual character skeleton in assets.js.
  const glow=new T.MeshBasicMaterial({color:0xff73c8,transparent:true,opacity:.9,depthWrite:false,blending:T.AdditiveBlending});
  this.charm=new T.Mesh(new T.OctahedronGeometry(.065,0),glow);this.root.add(this.charm);
  const trailMat=new T.MeshBasicMaterial({color:0xffb0df,transparent:true,opacity:.32,depthWrite:false,blending:T.AdditiveBlending});
  this.trail=new T.Mesh(new T.SphereGeometry(.07,8,6),trailMat);this.root.add(this.trail);
 }
 update(dt){this.t+=dt;const p=this.flight?.position;if(!p)return;this.root.position.copy(p);this.charm.position.set(Math.cos(this.t*1.8)*.38,.9+Math.sin(this.t*2.4)*.08,Math.sin(this.t*1.8)*.38);this.charm.rotation.y+=dt*2.5;this.trail.position.set(Math.sin(this.t*2)*.2,.45,-.55);}
 dispose(){this.scene.remove(this.root);this.root.traverse(o=>{o.geometry?.dispose?.();o.material?.dispose?.()})}
}
