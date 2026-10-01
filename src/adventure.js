import * as T from 'three';
export class AdventureSystem{
 constructor(scene,phase='floresta'){this.scene=scene;this.phase=phase;this.stage=Number(localStorage.getItem('wf-story-'+phase)||0);this.rival=null;this.timer=0;this.makeRival()}
 makeRival(){const g=new T.Group(),body=new T.Mesh(new T.CapsuleGeometry(.35,.9,4,8),new T.MeshStandardMaterial({color:0x56396f,roughness:.55,emissive:0x160c25,emissiveIntensity:.4}));body.position.y=.8;g.add(body);const broom=new T.Mesh(new T.CylinderGeometry(.045,.06,1.8,6),new T.MeshStandardMaterial({color:0x5a3828,roughness:.9}));broom.rotation.z=Math.PI/2;broom.position.y=.3;g.add(broom);g.visible=false;this.scene.add(g);this.rival=g}
 start(){if(this.stage===0){this.stage=1;this.persist();this.rival.visible=true;return'A rival mascarada apareceu · siga o rastro violeta'}return null}
 update(dt,pos){this.timer+=dt;if(this.stage===1){this.rival.visible=true;const a=this.timer*.42;this.rival.position.set(pos.x+Math.cos(a)*10,pos.y+3+Math.sin(a*1.7)*2,pos.z-14+Math.sin(a)*8);this.rival.lookAt(pos);if(this.timer>28){this.stage=2;this.persist();return'PERSEGUIÇÃO CONCLUÍDA · a rival deixou um fragmento lunar'}}return null}
 interact(){if(this.stage===2){this.stage=3;this.persist();return'FRAGMENTO LUNAR RECUPERADO · novo capítulo registrado'}return null}
 persist(){localStorage.setItem('wf-story-'+this.phase,String(this.stage))}
 dispose(){this.scene.remove(this.rival);this.rival?.traverse(o=>{o.geometry?.dispose?.();o.material?.dispose?.()})}
}
