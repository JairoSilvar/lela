import * as T from 'three';

/** Sky Traffic v49: witches follow world routes and use an actual seated broom silhouette. */
export class SkyCompanionsV49 {
  constructor(scene){this.scene=scene;this.root=new T.Group();this.root.name='SkyTraffic-v49';scene.add(this.root);this.t=0;this.actors=[];this.routes=[
    [new T.Vector3(28,20,76),new T.Vector3(76,28,35),new T.Vector3(136,24,18),new T.Vector3(160,31,-42)],
    [new T.Vector3(146,19,88),new T.Vector3(108,34,46),new T.Vector3(74,30,-8),new T.Vector3(38,23,-62)],
    [new T.Vector3(22,26,-44),new T.Vector3(64,38,-70),new T.Vector3(116,43,-64),new T.Vector3(166,29,-18)]
  ];this._build();}
  limb(r=.045,l=.24,mat){return new T.Mesh(new T.CapsuleGeometry(r,l,4,7),mat)}
  witch(p){const g=new T.Group(),cloth=new T.MeshStandardMaterial({color:p.cloth,roughness:.72,emissive:p.emissive,emissiveIntensity:.15}),skin=new T.MeshStandardMaterial({color:0xe2b394,roughness:.82}),dark=new T.MeshStandardMaterial({color:p.dark,roughness:.8}),wood=new T.MeshStandardMaterial({color:0x5c3a1e,roughness:.92}),hat=new T.MeshStandardMaterial({color:p.hat,roughness:.6});
    const broom=new T.Mesh(new T.CylinderGeometry(.035,.045,2.35,7),wood);broom.rotation.z=Math.PI/2;broom.position.set(0,.34,0);g.add(broom);const br=new T.Mesh(new T.ConeGeometry(.13,.44,8),new T.MeshStandardMaterial({color:0xb99a5c,roughness:.9}));br.rotation.z=-Math.PI/2;br.position.set(1.12,.34,0);g.add(br);
    const torso=new T.Mesh(new T.CapsuleGeometry(.23,.48,5,9),cloth);torso.position.set(0,.72,.02);torso.rotation.x=.22;g.add(torso);const head=new T.Mesh(new T.SphereGeometry(.22,12,9),skin);head.position.set(0,1.15,-.03);g.add(head);const brim=new T.Mesh(new T.CylinderGeometry(.32,.32,.035,16),hat);brim.position.set(0,1.34,-.03);g.add(brim);const cone=new T.Mesh(new T.ConeGeometry(.2,.5,14),hat);cone.position.set(.02,1.58,-.03);cone.rotation.z=-.12;g.add(cone);
    for(const s of [-1,1]){ // thighs angle down around broom; shins tuck back; hands reach the handle
      const thigh=this.limb(.058,.28,dark);thigh.position.set(s*.13,.43,.10);thigh.rotation.x=.72;thigh.rotation.z=s*.16;g.add(thigh);
      const shin=this.limb(.05,.25,dark);shin.position.set(s*.15,.25,.30);shin.rotation.x=1.12;shin.rotation.z=s*.08;g.add(shin);
      const upper=this.limb(.048,.22,cloth);upper.position.set(s*.19,.78,-.08);upper.rotation.z=s*.28;upper.rotation.x=.75;g.add(upper);
      const fore=this.limb(.042,.20,skin);fore.position.set(s*.14,.57,-.18);fore.rotation.z=-s*.12;fore.rotation.x=1.18;g.add(fore);
      const hand=new T.Mesh(new T.SphereGeometry(.055,8,6),skin);hand.position.set(s*.105,.43,-.08);g.add(hand);
    }g.scale.setScalar(.92);return g;}
  _build(){const ps=[{cloth:0xc47a2a,emissive:0x3a2008,hat:0x2a1a40,dark:0x2a1830},{cloth:0x3a4a8a,emissive:0x12183a,hat:0x8a6a20,dark:0x1a2038},{cloth:0x6a2040,emissive:0x2a0a18,hat:0x1a3040,dark:0x201018}];ps.forEach((p,i)=>{const a=this.witch(p);a.userData={route:i,u:i*.27,speed:.018+i*.002};this.root.add(a);this.actors.push(a)});}
  routePoint(route,u){const n=route.length,scaled=((u%1)+1)%1*n,i=Math.floor(scaled),f=scaled-i,a=route[i%n],b=route[(i+1)%n];return a.clone().lerp(b,T.MathUtils.smoothstep(f,0,1));}
  update(dt){this.t+=dt;for(const a of this.actors){const u=a.userData;u.u=(u.u+dt*u.speed)%1;const p=this.routePoint(this.routes[u.route],u.u),ahead=this.routePoint(this.routes[u.route],u.u+.006);a.position.lerp(p,1-Math.exp(-3*dt));const d=ahead.clone().sub(p);a.rotation.y=Math.atan2(d.x,d.z);a.rotation.z=T.MathUtils.damp(a.rotation.z,T.MathUtils.clamp(-d.x*.012,-.24,.24),4,dt);a.position.y+=Math.sin(this.t*1.7+u.route)*.08;}}
  dispose(){this.scene.remove(this.root);this.root.traverse(o=>{o.geometry?.dispose?.();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose?.())}});this.actors=[];}
}
