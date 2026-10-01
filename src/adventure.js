import {storage} from './storage.js';
import * as T from 'three';
export class AdventureSystem{
 constructor(scene,phase='floresta'){this.scene=scene;this.phase=phase;this.stage=Number(storage.getItem('wf-story-'+phase)||0);this.rival=null;this.timer=0;this.makeRival();this.fragment=new T.Mesh(new T.OctahedronGeometry(.5),new T.MeshStandardMaterial({color:0xffa5ed,emissive:0xff4bcc,emissiveIntensity:1}));this.fragment.visible=false;this.fragmentPlaced=false;this.scene.add(this.fragment)}
 makeRival(){const g=new T.Group(),body=new T.Mesh(new T.CapsuleGeometry(.35,.9,4,8),new T.MeshStandardMaterial({color:0x56396f,roughness:.55,emissive:0x160c25,emissiveIntensity:.4}));body.position.y=.8;g.add(body);const broom=new T.Mesh(new T.CylinderGeometry(.045,.06,1.8,6),new T.MeshStandardMaterial({color:0x5a3828,roughness:.9}));broom.rotation.z=Math.PI/2;broom.position.y=.3;g.add(broom);g.visible=false;this.scene.add(g);this.rival=g}
 start(){if(this.stage===0){this.stage=1;this.timer=0;this.persist();this.rival.visible=true;return'A rival mascarada apareceu · siga o rastro violeta'}return null}
 update(dt,pos){if(this.stage===1){this.timer+=dt;this.rival.visible=true;const a=this.timer*.42;this.rival.position.set(pos.x+Math.cos(a)*10,pos.y+3+Math.sin(a*1.7)*2,pos.z-14+Math.sin(a)*8);this.rival.lookAt(pos);if(this.timer>28){this.stage=2;this.rival.visible=false;this.persist();this.placeFragment(pos);return'PERSEGUIÇÃO CONCLUÍDA · a rival deixou um fragmento lunar'}}if(this.stage===2){if(!this.fragmentPlaced)this.placeFragment(pos);this.fragment.rotation.y+=dt;this.fragment.rotation.z+=dt*.3}return null}
 placeFragment(pos){this.fragment.position.copy(pos).add(new T.Vector3(2,0,0));this.fragment.visible=true;this.fragmentPlaced=true}
 nearest(pos){return this.stage===2&&this.fragmentPlaced&&this.fragment.position.distanceTo(pos)<4}
 interact(pos){if(pos&&this.nearest(pos)){this.stage=3;this.fragment.visible=false;this.persist();return'FRAGMENTO LUNAR RECUPERADO · novo capítulo registrado'}return null}
 persist(){storage.setItem('wf-story-'+this.phase,String(this.stage))}
 dispose(){this.scene.remove(this.fragment);this.fragment.geometry.dispose();this.fragment.material.dispose();this.scene.remove(this.rival);this.rival?.traverse(o=>{o.geometry?.dispose?.();o.material?.dispose?.()})}
}
