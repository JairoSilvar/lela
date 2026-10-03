import * as T from 'three';

/** v51 Sky Traffic — procedural NPC riders with joints anchored to the broom.
 * No animation mixer can overwrite this pose because these NPCs are independent rigs.
 */
export class SkyCompanionsV49 {
  constructor(scene){this.scene=scene;this.root=new T.Group();this.root.name='SkyTraffic-v51';scene.add(this.root);this.t=0;this.actors=[];this.routes=[
    [new T.Vector3(28,20,76),new T.Vector3(76,28,35),new T.Vector3(136,24,18),new T.Vector3(160,31,-42)],
    [new T.Vector3(146,19,88),new T.Vector3(108,34,46),new T.Vector3(74,30,-8),new T.Vector3(38,23,-62)],
    [new T.Vector3(22,26,-44),new T.Vector3(64,38,-70),new T.Vector3(116,43,-64),new T.Vector3(166,29,-18)]
  ];this._build();}
  segment(a,b,r,mat){const d=b.clone().sub(a),m=new T.Mesh(new T.CylinderGeometry(r,r,d.length(),7),mat);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return m}
  witch(p,i){const g=new T.Group(),cloth=new T.MeshStandardMaterial({color:p.cloth,roughness:.72,emissive:p.emissive,emissiveIntensity:.12}),skin=new T.MeshStandardMaterial({color:p.skin,roughness:.82}),dark=new T.MeshStandardMaterial({color:p.dark,roughness:.8}),wood=new T.MeshStandardMaterial({color:p.wood,roughness:.92}),hat=new T.MeshStandardMaterial({color:p.hat,roughness:.6}),hair=new T.MeshStandardMaterial({color:p.hair,roughness:.9});
    // Broom runs left/right in local X. Rider pelvis is physically above it.
    const broom=new T.Mesh(new T.CylinderGeometry(.038,.05,2.45,8),wood);broom.rotation.z=Math.PI/2;broom.position.set(0,.34,0);g.add(broom);const br=new T.Mesh(new T.ConeGeometry(.14,.48,8),new T.MeshStandardMaterial({color:p.brush,roughness:.95}));br.rotation.z=-Math.PI/2;br.position.set(1.18,.34,0);g.add(br);
    const pelvis=new T.Vector3(0,.52,.04),chest=new T.Vector3(0,.86,-.10),neck=new T.Vector3(0,1.10,-.13);const torso=this.segment(pelvis,chest,.22,cloth);g.add(torso);const head=new T.Mesh(new T.SphereGeometry(.22,14,10),skin);head.position.copy(neck).add(new T.Vector3(0,.15,-.02));g.add(head);
    // Distinct hair silhouettes.
    if(i===0){const h=new T.Mesh(new T.SphereGeometry(.235,12,8,0,Math.PI*2,0,Math.PI*.62),hair);h.position.copy(head.position).add(new T.Vector3(0,.05,.02));g.add(h)}
    if(i===1){for(const x of [-.16,.16]){const h=new T.Mesh(new T.CapsuleGeometry(.055,.34,4,7),hair);h.position.set(x,1.03,.03);h.rotation.z=x>0?-.16:.16;g.add(h)}}
    if(i===2){const h=new T.Mesh(new T.CylinderGeometry(.24,.17,.30,10),hair);h.position.set(0,1.18,.03);g.add(h)}
    const brim=new T.Mesh(new T.CylinderGeometry(.31,.31,.035,16),hat);brim.position.set(0,1.42,-.15);g.add(brim);const cone=new T.Mesh(new T.ConeGeometry(.19,.46,14),hat);cone.position.set(.02,1.66,-.15);cone.rotation.z=(i-1)*.10;g.add(cone);
    for(const s of [-1,1]){
      // Arms: shoulder -> elbow -> hand. Hands are locked just above the broom handle.
      const shoulder=new T.Vector3(s*.19,.90,-.09),elbow=new T.Vector3(s*.27,.66,-.13),handP=new T.Vector3(s*.24,.405,-.055);g.add(this.segment(shoulder,elbow,.052,cloth),this.segment(elbow,handP,.043,skin));const hand=new T.Mesh(new T.SphereGeometry(.058,8,6),skin);hand.name=`NPC-Hand-${s<0?'L':'R'}`;hand.position.copy(handP);g.add(hand);
      // Legs: hip -> knee -> boot. Knees hang below/aside the broom; feet tuck rearward.
      const hip=new T.Vector3(s*.12,.53,.05),knee=new T.Vector3(s*.23,.27,.18),foot=new T.Vector3(s*.24,.16,.47);g.add(this.segment(hip,knee,.066,dark),this.segment(knee,foot,.055,dark));const boot=new T.Mesh(new T.BoxGeometry(.12,.10,.24),dark);boot.position.copy(foot).add(new T.Vector3(0,-.02,.07));g.add(boot);
    }
    // Small face marker/scarf makes NPCs readable but clearly not Lelinha.
    const scarf=new T.Mesh(new T.TorusGeometry(.16,.025,6,18),new T.MeshStandardMaterial({color:p.accent,roughness:.6}));scarf.rotation.x=Math.PI/2;scarf.position.set(0,1.04,-.10);g.add(scarf);g.scale.setScalar(.94);return g;}
  _build(){const ps=[
    {cloth:0xc47a2a,emissive:0x3a2008,hat:0x39204f,dark:0x302038,skin:0xd6a17f,hair:0x402416,wood:0x6a431f,brush:0xc3a268,accent:0xffd27d},
    {cloth:0x3a4a8a,emissive:0x12183a,hat:0x8a6a20,dark:0x17233f,skin:0x9b684e,hair:0x18141f,wood:0x493622,brush:0x9f8558,accent:0x8fdcff},
    {cloth:0x6a2040,emissive:0x2a0a18,hat:0x173a43,dark:0x28121f,skin:0xf0c4a5,hair:0x7a344c,wood:0x70482d,brush:0xd0a66d,accent:0xd7a8ff}
  ];ps.forEach((p,i)=>{const a=this.witch(p,i);a.userData={route:i,u:i*.27,speed:.018+i*.002,baseScale:a.scale.x};this.root.add(a);this.actors.push(a)});}
  routePoint(route,u){const n=route.length,scaled=((u%1)+1)%1*n,i=Math.floor(scaled),f=scaled-i,a=route[i%n],b=route[(i+1)%n];return a.clone().lerp(b,T.MathUtils.smoothstep(f,0,1));}
  update(dt){this.t+=dt;for(const a of this.actors){const u=a.userData;u.u=(u.u+dt*u.speed)%1;const p=this.routePoint(this.routes[u.route],u.u),ahead=this.routePoint(this.routes[u.route],u.u+.006);p.y+=Math.sin(this.t*1.7+u.route)*.08;a.position.lerp(p,1-Math.exp(-3*dt));const d=ahead.clone().sub(p);a.rotation.y=Math.atan2(d.x,d.z);a.rotation.z=T.MathUtils.damp(a.rotation.z,T.MathUtils.clamp(-d.x*.010,-.18,.18),4,dt);}}
  dispose(){this.scene.remove(this.root);this.root.traverse(o=>{o.geometry?.dispose?.();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose?.())}});this.actors=[];}
}
