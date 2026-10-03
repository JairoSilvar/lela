import * as T from 'three';
/** Sky Adventure v49: navigation, starfield, altitude landmarks and a discoverable ceiling secret. */
export class SkyAdventureV49{
 constructor(scene){this.scene=scene;this.root=new T.Group();this.root.name='SkyAdventure-v49';scene.add(this.root);this.root.visible=false;this.collected=new Set();this.t=0;this.secretFound=false;this.lastHint='';this.build()}
 build(){const cloudMat=new T.MeshStandardMaterial({color:0xffd9ef,roughness:1,transparent:true,opacity:.78,depthWrite:false});for(let i=0;i<22;i++){const g=new T.Group(),a=i*2.399,r=36+(i%7)*15,y=30+(i%6)*5;for(let j=0;j<4;j++){const m=new T.Mesh(new T.SphereGeometry(2.2+(j%2)*1.15,9,6),cloudMat);m.position.set((j-1.5)*2.3,Math.sin(j)*.8,(j%2)*1.2);g.add(m)}g.position.set(90+Math.cos(a)*r,y,Math.sin(a)*r);g.userData={a,r,y,spd:.012+(i%4)*.003};this.root.add(g)}
  const starGeo=new T.BufferGeometry(),pts=[];for(let i=0;i<520;i++){const a=Math.random()*Math.PI*2,r=95+Math.random()*230,y=48+Math.random()*120;pts.push(90+Math.cos(a)*r,y,Math.sin(a)*r)}starGeo.setAttribute('position',new T.Float32BufferAttribute(pts,3));this.stars=new T.Points(starGeo,new T.PointsMaterial({color:0xffe8fb,size:.65,transparent:true,opacity:.9,depthWrite:false,blending:T.AdditiveBlending}));this.root.add(this.stars);
  const ringMat=new T.MeshBasicMaterial({color:0xff8fd2,transparent:true,opacity:.86});this.rings=[];for(let i=0;i<7;i++){const a=i/7*Math.PI*2,r=38+(i%2)*12,y=36+i*3.2,m=new T.Mesh(new T.TorusGeometry(3.2,.16,8,32),ringMat.clone());m.position.set(90+Math.cos(a)*r,y,Math.sin(a)*r);m.rotation.y=-a;m.userData.id=i;this.root.add(m);this.rings.push(m)}
  this.portal=new T.Mesh(new T.TorusGeometry(6,.34,10,48),new T.MeshBasicMaterial({color:0xc9a0ff,transparent:true,opacity:.76,blending:T.AdditiveBlending,depthWrite:false}));this.portal.position.set(90,57,-72);this.root.add(this.portal);
  // Celestial compass: three beacons make the upper layer readable from a distance.
  this.beacons=[];[[35,51,-35,0x8fdcff],[148,54,22,0xffd27d],[92,60,-82,0xd7a8ff]].forEach(([x,y,z,c])=>{const b=new T.Mesh(new T.OctahedronGeometry(1.25),new T.MeshBasicMaterial({color:c,transparent:true,opacity:.9,blending:T.AdditiveBlending}));b.position.set(x,y,z);this.root.add(b);this.beacons.push(b)});
  this.secret=new T.Group();const moon=new T.Mesh(new T.SphereGeometry(2.25,18,12),new T.MeshBasicMaterial({color:0xffd5f3,transparent:true,opacity:.92}));const halo=new T.Mesh(new T.TorusGeometry(3.25,.11,8,40),new T.MeshBasicMaterial({color:0xff9ddd,transparent:true,opacity:.8,blending:T.AdditiveBlending}));halo.rotation.x=Math.PI/2;this.secret.add(moon,halo);this.secret.position.set(90,61,-5);this.root.add(this.secret);
 }
 update(dt,pos){this.t+=dt;
  // v51: the celestial layer is deterministic. Once the player descends it is hidden,
  // preventing stars/clouds/portal from leaking into the ground presentation.
  const y=pos?pos.y:-99;if(this.root.visible){if(y<20){this.root.visible=false;this.lastHint='';}}else if(y>24){this.root.visible=true;}if(!this.root.visible){this.lastHint='';return null;}
  this.portal.rotation.z+=dt*.22;this.secret.rotation.y+=dt*.18;this.stars.material.opacity=.78+Math.sin(this.t*.7)*.1;this.beacons.forEach((b,i)=>{b.rotation.y+=dt*(.35+i*.08);b.scale.setScalar(1+Math.sin(this.t*2+i)*.12)});for(const o of this.root.children){if(o.userData?.spd){const u=o.userData,a=u.a+this.t*u.spd;o.position.x=90+Math.cos(a)*u.r;o.position.z=Math.sin(a)*u.r}}if(!pos)return null;
  for(const r of this.rings){if(r.visible&&pos.distanceTo(r.position)<4){r.visible=false;this.collected.add(r.userData.id);return{reward:20,message:`CÉU ROSA · selo celeste ${this.collected.size}/7 · +20 essência`}}}
  if(!this.secretFound&&pos.y>59&&pos.distanceTo(this.secret.position)<7){this.secretFound=true;return{reward:250,message:'SEGREDO DO CÉU · Santuário da Lua encontrado · +250 essência'}}
  if(pos.y>54&&pos.distanceTo(this.portal.position)<8)return{reward:0,message:'PORTAL DA LUA ROSA · siga os selos e procure o segredo acima das nuvens'};
  const band=pos.y>57?'LIMITE CELESTE':pos.y>46?'ALTA ATMOSFERA':pos.y>32?'ROTAS CELESTES':'';if(band&&band!==this.lastHint){this.lastHint=band;return{reward:0,message:`${band} · estrelas e faróis indicam pontos de interesse`}}if(!band)this.lastHint='';return null}
 dispose(){this.scene.remove(this.root);this.root.traverse(o=>{o.geometry?.dispose?.();o.material?.dispose?.()})}
}
