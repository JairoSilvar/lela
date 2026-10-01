import * as T from 'three';
export class CreatureCombatV35{
 constructor(scene,audio){this.scene=scene;this.audio=audio;this.entities=[];this.projectiles=[];this.tmp=new T.Vector3()}
 bind(object,{name='Criatura',hp=40,damage=8,xp=15,boss=false}={}){
  if(!object)return null;
  const e={object,name,hp,maxHp:hp,damage,xp,boss,dead:false,invuln:0};
  object.userData.combat=e;this.entities.push(e);return e;
 }
 update(dt){
  for(const e of this.entities)e.invuln=Math.max(0,e.invuln-dt);
  for(let i=this.projectiles.length-1;i>=0;i--){
   const p=this.projectiles[i];p.life-=dt;p.mesh.position.addScaledVector(p.dir,p.speed*dt);
   let hit=null;
   for(const e of this.entities){if(e.dead)continue;if(e.object.getWorldPosition(this.tmp).distanceTo(p.mesh.position)<(e.boss?1.35:.8)){hit=e;break}}
   if(hit){this.hit(hit,p.damage);this.scene.remove(p.mesh);p.mesh.geometry.dispose();p.mesh.material.dispose();this.projectiles.splice(i,1);continue}
   if(p.life<=0){this.scene.remove(p.mesh);p.mesh.geometry.dispose();p.mesh.material.dispose();this.projectiles.splice(i,1)}
  }
 }
 dispose(){for(const p of this.projectiles){this.scene.remove(p.mesh);p.mesh.geometry.dispose();p.mesh.material.dispose()}this.projectiles=[];this.entities=[]}
 cast(origin,dir,damage=18){
  const mesh=new T.Mesh(new T.SphereGeometry(.13,10,8),new T.MeshBasicMaterial({color:0xff8cda}));
  mesh.position.copy(origin);this.scene.add(mesh);this.projectiles.push({mesh,dir:dir.clone().normalize(),damage,speed:13,life:2.2});
 }
 hit(e,damage){if(!e||e.dead||e.invuln)return null;e.hp=Math.max(0,e.hp-damage);e.invuln=.18;this.audio?.impact();if(e.hp<=0){e.dead=true;e.deathPosition=e.object.position.clone();e.object.visible=false;return{type:'death',entity:e,xp:e.xp}}return{type:'hit',entity:e}}
}