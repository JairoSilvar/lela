import * as T from 'three';
export class LootV36{
 constructor(scene){this.scene=scene;this.items=[]}
 dispose(){for(const {m} of this.items){this.scene.remove(m);m.geometry.dispose();m.material.dispose()}this.items=[]}
 drop(pos,value=8){const m=new T.Mesh(new T.OctahedronGeometry(.18),new T.MeshBasicMaterial({color:0xffc4ed}));m.position.copy(pos);m.position.y+=.45;this.scene.add(m);this.items.push({m,value,t:0});return m}
 update(dt,player){let gain=0;for(let i=this.items.length-1;i>=0;i--){const x=this.items[i];x.t+=dt;x.m.rotation.y+=dt*1.8;x.m.position.y+=Math.sin(x.t*3)*.0015;if(player&&x.m.position.distanceTo(player)<1){gain+=x.value;this.scene.remove(x.m);x.m.geometry.dispose();x.m.material.dispose();this.items.splice(i,1)}}return gain}
}