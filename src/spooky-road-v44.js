import * as T from 'three';
function mat(c,e=0,i=0){return new T.MeshStandardMaterial({color:c,roughness:.72,metalness:.04,emissive:e,emissiveIntensity:i})}
export class SpookyRoadV44{
 constructor(scene,assets){this.scene=scene;this.assets=assets;this.root=new T.Group();this.root.name='SpookyRoadV44';scene.add(this.root);this.t=0;this.build()}
 clone(key){const s=this.assets?.[key];return s?s.clone(true):null}
 place(src,p,s=1,ry=0){if(!src)return null;const g=new T.Group(),m=src.clone(true),b=new T.Box3().setFromObject(m),z=b.getSize(new T.Vector3()),c=b.getCenter(new T.Vector3());m.position.sub(new T.Vector3(c.x,b.min.y,c.z));g.add(m);g.scale.setScalar(s/Math.max(.001,z.y));g.position.copy(p);g.rotation.y=ry;g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});this.root.add(g);return g}
 build(){
  // A composed vertical-slice landmark near the initial play area.
  const pathMat=mat(0x6b245f,0x3a0c36,.28), edgeMat=mat(0x35142f,0x160818,.12);
  const path=new T.Mesh(new T.BoxGeometry(12,.32,86),pathMat);path.position.set(90,-1.5,42);this.root.add(path);
  for(const x of [83.3,96.7]){const rail=new T.Mesh(new T.BoxGeometry(.55,1.1,86),edgeMat);rail.position.set(x,-.9,42);this.root.add(rail)}
  for(let i=0;i<13;i++){
    const z=80-i*6.3;
    for(const x of [82.2,97.8]){
      const lamp=new T.Group(),post=new T.Mesh(new T.CylinderGeometry(.09,.13,2.6,8),mat(0x2a1629));post.position.y=1.3;
      const bulb=new T.Mesh(new T.SphereGeometry(.22,10,8),mat(0xffb04a,0xff6a22,2.5));bulb.position.y=2.65;lamp.add(post,bulb);lamp.position.set(x,-1.3,z);this.root.add(lamp);
      if(i%2===0)this.place(this.assets?.pumpkin_orange_jackolantern,new T.Vector3(x+(x<90?-1:1)*1.0,-1.35,z+.6),1.05,i*.4);
    }
    if(i<10){const star=new T.Mesh(new T.OctahedronGeometry(.42,0),mat(0xffdc55,0xff8a24,2.4));star.position.set(90,-.05,z-1.5);star.rotation.z=.4;star.userData.star=true;this.root.add(star)}
  }
  // Portal landmark
  const ring=new T.Mesh(new T.TorusGeometry(3.1,.34,14,48),mat(0xff73dd,0xff2cbb,3.2));ring.position.set(90,2.0,-38);this.root.add(ring);this.portal=ring;
  const inner=new T.Mesh(new T.CircleGeometry(2.72,48),new T.MeshBasicMaterial({color:0xb32cff,transparent:true,opacity:.42,side:T.DoubleSide,blending:T.AdditiveBlending,depthWrite:false}));inner.position.copy(ring.position);inner.position.z+=.08;this.root.add(inner);this.inner=inner;
  // Castle-like silhouette from available towers/environment
  const tower=this.assets?.environment?.tower;
  if(tower){this.place(tower,new T.Vector3(90,-2,-58),22,0);this.place(tower,new T.Vector3(78,-2,-62),16,.15);this.place(tower,new T.Vector3(102,-2,-62),16,-.15)}
  // Pink canopy framing
  const trunk=mat(0x4b213e),leaf=mat(0xd632a1,0x5a0b49,.24);
  for(let i=0;i<18;i++){const side=i%2?-1:1,z=82-Math.floor(i/2)*10;const g=new T.Group(),tr=new T.Mesh(new T.CylinderGeometry(.45,.72,5.5,7),trunk),cr=new T.Mesh(new T.IcosahedronGeometry(3.2,1),leaf);tr.position.y=2.75;cr.position.y=6.2;g.add(tr,cr);g.position.set(90+side*(12+((i*7)%4)),-1.8,z);g.scale.setScalar(.8+((i*13)%5)*.05);this.root.add(g)}
  // Friendly ghosts as luminous silhouettes, lightweight for mobile.
  for(let i=0;i<5;i++){const g=new T.Group(),body=new T.Mesh(new T.SphereGeometry(.7,14,10),new T.MeshStandardMaterial({color:0xfff2ff,emissive:0xd86cff,emissiveIntensity:1.25,transparent:true,opacity:.9}));body.scale.y=1.2;g.add(body);g.position.set(90+(i%2?-1:1)*(8+i),1.8,55-i*15);g.userData.ghost=true;this.root.add(g)}
  const moon=new T.Mesh(new T.SphereGeometry(18,32,20),new T.MeshBasicMaterial({color:0xff79d2,fog:false}));moon.position.set(90,52,-92);this.root.add(moon);
  const halo=new T.Sprite(new T.SpriteMaterial({color:0xff52c8,transparent:true,opacity:.28,blending:T.AdditiveBlending,depthWrite:false,fog:false}));halo.position.copy(moon.position);halo.scale.set(58,58,1);this.root.add(halo);
 }
 update(dt){this.t+=dt;if(this.portal)this.portal.rotation.z+=dt*.28;if(this.inner){this.inner.material.opacity=.35+.12*Math.sin(this.t*2.2);this.inner.rotation.z-=dt*.12}for(const o of this.root.children)if(o.userData.ghost){o.position.y+=Math.sin(this.t*1.8+o.position.z)*.002;o.rotation.y=Math.sin(this.t*.8+o.position.x)*.15}else if(o.userData.star){o.rotation.y+=dt*1.6;o.position.y+=Math.sin(this.t*3+o.position.z)*.002}}
 dispose(){this.scene.remove(this.root)}
}
