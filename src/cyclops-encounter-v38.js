import * as T from 'three';
export class CyclopsEncounterV38{
 constructor(boss,vitals,audio,toast){this.boss=boss;this.vitals=vitals;this.audio=audio;this.toast=toast;this.state='idle';this.timer=0;this.hit=false;this.marker=new T.Mesh(new T.RingGeometry(2.1,2.4,48),new T.MeshBasicMaterial({color:0xff5599,transparent:true,opacity:.55,side:T.DoubleSide,depthWrite:false}));this.marker.rotation.x=-Math.PI/2;this.marker.visible=false}
 update(dt,player){
  const e=this.boss?.entity;if(!e||e.dead||!player){this.marker.visible=false;return null;}
  if(!this.marker.parent)e.object.parent.add(this.marker);this.marker.position.copy(e.object.position);this.marker.position.y+=.05;this.marker.visible=this.state==='telegraph';this.marker.scale.setScalar(this.boss.phase===3?3.2/2.4:1);const d=e.object.position.distanceTo(player);this.timer=Math.max(0,this.timer-dt);
  if(this.state==='idle'&&d<12){this.state='engaged';this.toast?.('Guardião Cyclops despertou');this.audio?.impact()}
  if(this.state==='engaged'&&d<12&&this.timer<=0){
   const phase=this.boss.phase||1;this.state='telegraph';this.timer=phase===3?.55:.8;this.hit=false;
   return{type:'telegraph',phase}
  }
  if(this.state==='telegraph'&&this.timer<=0){this.state='strike';this.timer=.28;return{type:'strike',radius:this.boss.phase===3?3.2:2.4,damage:this.boss.phase===3?24:16}}
  if(this.state==='strike'&&this.timer<=0){this.state='recover';this.timer=this.boss.phase===3?.7:1.05;return{type:'recover'}}
  if(this.state==='recover'&&this.timer<=0){this.state='engaged';this.timer=this.boss.phase===1?1.7:1.25}
  return null
 }
 resolve(event,player){
  if(event?.type!=='strike'||!player||this.hit)return false;
  const e=this.boss?.entity;if(!e)return false;
  if(e.object.position.distanceTo(player)<=event.radius){this.hit=true;return this.vitals?.damage(event.damage)}
  return false
 }
}