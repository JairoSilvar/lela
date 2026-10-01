import * as T from 'three';

export class VisualArtPass{
 constructor(scene,phase='floresta',assets=null){this.scene=scene;this.phase=phase;this.assets=assets;this.root=new T.Group();this.root.name='VisualArtPass';scene.add(this.root);this.props=[];this.build()}
 mat(c,e=0x000000){return new T.MeshStandardMaterial({color:c,roughness:.72,metalness:.04,emissive:e,emissiveIntensity:.18})}
 add(mesh,x,y,z,s=1){mesh.position.set(x,y,z);mesh.scale.setScalar(s);mesh.castShadow=true;mesh.receiveShadow=true;this.root.add(mesh);this.props.push(mesh);return mesh}
 tree(x,z,s=1){const g=new T.Group(),tr=new T.Mesh(new T.CylinderGeometry(.28,.48,4,7),this.mat(0x5b3a2d)),c1=new T.Mesh(new T.ConeGeometry(2.1,4.6,8),this.mat(this.phase==='floresta'?0x315d49:0x455a50));tr.position.y=2;c1.position.y=5;g.add(tr,c1);return this.add(g,x,0,z,s)}
 rock(x,z,s=1){const m=new T.Mesh(new T.DodecahedronGeometry(1,0),this.mat(0x62646f));m.scale.set(1.25,.75,1);return this.add(m,x,.55,z,s)}
 lantern(x,z){const g=new T.Group(),p=new T.Mesh(new T.CylinderGeometry(.05,.08,2.5,6),this.mat(0x29242e)),l=new T.Mesh(new T.SphereGeometry(.22,8,6),new T.MeshStandardMaterial({color:0xffd0e8,emissive:0xff5aa5,emissiveIntensity:2}));p.position.y=1.25;l.position.y=2.45;g.add(p,l);return this.add(g,x,0,z,1)}
 build(){
  // Controlled composition: landmarks + foreground framing, not random asset spam.
  const seed=this.phase==='castelo'?17:this.phase==='vila'?9:3;
  for(let i=0;i<24;i++){const a=i*2.399+seed,r=30+(i%7)*7,x=Math.cos(a)*r,z=Math.sin(a)*r;this.tree(x,z,.75+(i%4)*.12)}
  for(let i=0;i<16;i++){const a=i*1.73+seed,r=20+(i%5)*9;this.rock(Math.cos(a)*r,Math.sin(a)*r,.5+(i%3)*.22)}
  if(this.phase==='vila')for(let i=0;i<10;i++)this.lantern(-22+i*5,-7+Math.sin(i)*4);
  if(this.phase==='castelo')for(let i=0;i<8;i++)this.lantern(Math.cos(i*.785)*24,Math.sin(i*.785)*24);
  const e=this.assets?.environment;
  if(e){
    const place=(src,x,z,h,ry=0)=>{if(!src)return;const m=src.clone(true),box=new T.Box3().setFromObject(m),sz=box.getSize(new T.Vector3()),c=box.getCenter(new T.Vector3()),g=new T.Group();m.position.sub(new T.Vector3(c.x,box.min.y,c.z));g.add(m);g.scale.setScalar(h/Math.max(.001,sz.y));g.position.set(x,0,z);g.rotation.y=ry;g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});this.root.add(g);return g;};
    if(this.phase==='vila'){
      place(e.town,0,-34,11,0); place(e.house,-18,-18,7,.4); place(e.house,18,-20,7,-.55);
      place(e.house,-32,5,6.5,1.05); place(e.house,30,1,6.5,-1.0); place(e.windmill,36,22,13,-.3); place(e.tower,-38,-28,11,.2);
    } else if(this.phase==='castelo'){
      place(e.tower,0,-38,16,0); place(e.tower,-25,-29,13,.25); place(e.tower,25,-29,13,-.25);
      place(e.town,-38,-5,10,.65); place(e.town,38,-5,10,-.65); place(e.house,-20,18,6.5,.35); place(e.house,20,18,6.5,-.35);
    } else {
      place(e.windmill,-34,-34,12,.3); place(e.tower,34,-30,13,-.25); place(e.house,0,-46,7,0);
      place(e.house,-27,14,6,.8); place(e.house,28,16,6,-.75);
    }
  }
 }
 update(t){this.root.children.forEach((o,i)=>{if(o.children?.length>1&&o.children[1]?.material?.emissiveIntensity>1)o.children[1].material.emissiveIntensity=1.6+.4*Math.sin(t*2+i)})}
 dispose(){this.scene.remove(this.root);this.root.traverse(o=>{o.geometry?.dispose?.();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose?.());else o.material?.dispose?.()})}
}
