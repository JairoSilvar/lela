import {storage} from './storage.js';
import * as T from 'three';

/**
 * AdventureSystem v48 — rival com silhueta SEATED na vassoura e paleta distinta da Lelinha.
 * Lelinha = rosa/magenta. Rival = teal/esmeralda + chapéu âmbar (contraste imediato).
 * Pose: torso inclinado, pernas à frente ao longo da vassoura (não de pé).
 */
export class AdventureSystem{
  constructor(scene,phase='floresta'){
    this.scene=scene;
    this.phase=phase;
    this.stage=Number(storage.getItem('wf-story-'+phase)||0);
    this.rival=null;
    this.timer=0;
    this.makeRival();
    this.fragment=new T.Mesh(
      new T.OctahedronGeometry(.5),
      new T.MeshStandardMaterial({color:0xffa5ed,emissive:0xff4bcc,emissiveIntensity:1})
    );
    this.fragment.visible=false;
    this.fragmentPlaced=false;
    this.scene.add(this.fragment);
  }

  makeRival(){
    const g=new T.Group();
    // Paleta distinta: teal/esmeralda (não rosa da Lelinha)
    const cloth=new T.MeshStandardMaterial({color:0x1a8a7a,roughness:.68,emissive:0x0a3a32,emissiveIntensity:.28});
    const accent=new T.MeshStandardMaterial({color:0x2ec4a8,roughness:.55,emissive:0x0d4a40,emissiveIntensity:.18});
    const skin=new T.MeshStandardMaterial({color:0xd4a88c,roughness:.82});
    const dark=new T.MeshStandardMaterial({color:0x1a2a38,roughness:.8});
    const wood=new T.MeshStandardMaterial({color:0x5a3a1f,roughness:.92});
    const amber=new T.MeshStandardMaterial({color:0xd4a017,roughness:.45,emissive:0x6a5010,emissiveIntensity:.35});

    // Torso inclinado à frente (pose de pilotagem sentada)
    const torso=new T.Mesh(new T.CapsuleGeometry(.26,.52,4,8),cloth);
    torso.position.set(0,.58,.05);
    torso.rotation.x=.55; // mais inclinado = silhueta sentada
    g.add(torso);

    // Capa/ombro
    const cape=new T.Mesh(new T.BoxGeometry(.55,.35,.12),accent);
    cape.position.set(0,.78,-.12);
    cape.rotation.x=.4;
    g.add(cape);

    const head=new T.Mesh(new T.SphereGeometry(.24,12,9),skin);
    head.position.set(0,1.05,.12);
    g.add(head);

    // Chapéu âmbar (marca visual forte vs chapéu escuro da Lelinha)
    const brim=new T.Mesh(new T.CylinderGeometry(.36,.36,.04,16),amber);
    brim.position.set(0,1.26,.12);
    g.add(brim);
    const hat=new T.Mesh(new T.ConeGeometry(.22,.55,14),amber);
    hat.position.set(.03,1.54,.12);
    hat.rotation.z=-.12;
    g.add(hat);

    // Vassoura horizontal sob o corpo
    const broom=new T.Mesh(new T.CylinderGeometry(.04,.05,2.4,7),wood);
    broom.rotation.z=Math.PI/2;
    broom.position.set(0,.32,0);
    g.add(broom);
    // Vassourinha (palha)
    const bristles=new T.Mesh(new T.ConeGeometry(.14,.45,8),new T.MeshStandardMaterial({color:0xc4a060,roughness:.9}));
    bristles.rotation.z=-Math.PI/2;
    bristles.position.set(1.15,.32,0);
    g.add(bristles);

    // Pernas à frente, ao longo da vassoura (sentada, NÃO de pé)
    for(const side of [-1,1]){
      const upper=new T.Mesh(new T.CapsuleGeometry(.065,.32,3,6),dark);
      upper.position.set(side*.14,.42,.18);
      upper.rotation.x=1.35; // quase horizontal
      upper.rotation.z=side*.12;
      g.add(upper);
      const lower=new T.Mesh(new T.CapsuleGeometry(.055,.28,3,6),dark);
      lower.position.set(side*.16,.28,.55);
      lower.rotation.x=1.45;
      g.add(lower);
    }

    // Braços segurando a vassoura
    for(const side of [-1,1]){
      const arm=new T.Mesh(new T.CapsuleGeometry(.05,.28,3,5),cloth);
      arm.position.set(side*.32,.62,.05);
      arm.rotation.z=side*.85;
      arm.rotation.x=.4;
      g.add(arm);
    }

    g.rotation.x=-.04;
    g.visible=false;
    this.scene.add(g);
    this.rival=g;
  }

  start(){
    if(this.stage===0){
      this.stage=1;
      this.timer=0;
      this.persist();
      this.rival.visible=true;
      return 'A rival de teal apareceu · siga o rastro esmeralda';
    }
    return null;
  }

  update(dt,pos){
    if(this.stage===1){
      this.timer+=dt;
      this.rival.visible=true;
      const a=this.timer*.42;
      this.rival.position.set(
        pos.x+Math.cos(a)*10,
        pos.y+3+Math.sin(a*1.7)*2,
        pos.z-14+Math.sin(a)*8
      );
      this.rival.lookAt(pos);
      // leve bank de voo
      this.rival.rotation.z=Math.sin(a*1.3)*.18;
      if(this.timer>28){
        this.stage=2;
        this.rival.visible=false;
        this.persist();
        this.placeFragment(pos);
        return 'PERSEGUIÇÃO CONCLUÍDA · a rival deixou um fragmento lunar';
      }
    }
    if(this.stage===2){
      if(!this.fragmentPlaced) this.placeFragment(pos);
      this.fragment.rotation.y+=dt;
      this.fragment.rotation.z+=dt*.3;
    }
    return null;
  }

  placeFragment(pos){
    this.fragment.position.copy(pos).add(new T.Vector3(2,0,0));
    this.fragment.visible=true;
    this.fragmentPlaced=true;
  }

  nearest(pos){
    return this.stage===2&&this.fragmentPlaced&&this.fragment.position.distanceTo(pos)<4;
  }

  interact(pos){
    if(pos&&this.nearest(pos)){
      this.stage=3;
      this.fragment.visible=false;
      this.persist();
      return 'FRAGMENTO LUNAR RECUPERADO · novo capítulo registrado';
    }
    return null;
  }

  persist(){
    storage.setItem('wf-story-'+this.phase,String(this.stage));
  }

  dispose(){
    this.scene.remove(this.fragment);
    this.fragment.geometry.dispose();
    this.fragment.material.dispose();
    this.scene.remove(this.rival);
    this.rival?.traverse(o=>{o.geometry?.dispose?.();o.material?.dispose?.()});
  }
}
