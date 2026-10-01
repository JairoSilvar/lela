import * as T from 'three';
import {ground} from './world.js';

const DATA={
  floresta:[
    {id:'runa',name:'Runa do Bosque',x:18,z:58,text:'Uma runa antiga pulsa sob as raízes. A Visão Mágica revela um caminho esquecido.'},
    {id:'sino',name:'Sino Perdido',x:-24,z:34,text:'Você encontrou o primeiro fragmento do Sino da Floresta.'},
    {id:'cogumelo',name:'Cogumelo Lunar',x:36,z:8,text:'Um ingrediente raro foi registrado no Grimório.'}
  ],
  vila:[
    {id:'lanterna',name:'Lanterna Sussurrante',x:20,z:48,text:'A chama reage à magia de Lelinha e aponta para a praça.'},
    {id:'carta',name:'Carta da Vila',x:-18,z:18,text:'Uma carta fala de uma porta que só aparece sob a lua rosa.'},
    {id:'abobora',name:'Abóbora Rúnica',x:34,z:-8,text:'Símbolos mágicos foram adicionados ao Grimório.'}
  ],
  castelo:[
    {id:'brasao',name:'Brasão Lunar',x:12,z:44,text:'O brasão do castelo desperta quando Lelinha se aproxima.'},
    {id:'eco',name:'Eco da Torre',x:-26,z:16,text:'Uma voz distante pede que você procure três selos lunares.'},
    {id:'cristal',name:'Cristal da Lua',x:30,z:-18,text:'O cristal amplia a Visão Mágica por alguns instantes.'}
  ]
};

export class Exploration{
  constructor(scene,world){this.scene=scene;this.world=world;this.points=[];this.active=false;this.range=26;this.build();}
  build(){const list=DATA[this.world.phaseId]||DATA.floresta;for(const d of list){const y=ground(d.x,d.z)+1.15;const group=new T.Group();group.position.set(d.x,y,d.z);const gem=new T.Mesh(new T.OctahedronGeometry(.45),new T.MeshStandardMaterial({color:0xff9ec8,emissive:0xe85aad,emissiveIntensity:1.5,roughness:.25}));const ring=new T.Mesh(new T.TorusGeometry(.85,.035,8,32),new T.MeshBasicMaterial({color:0xffd98a,transparent:true,opacity:.75}));ring.rotation.x=Math.PI/2;group.add(gem,ring);this.scene.add(group);this.points.push({...d,group,gem,ring,found:false});}}
  dispose(){this.points.forEach(p=>this.scene.remove(p.group));this.points=[];}
  nearest(pos,max=4.2){let best=null,dist=max;for(const p of this.points){if(p.found)continue;const d=p.group.position.distanceTo(pos);if(d<dist){dist=d;best=p}}return best;}
  interact(pos){const p=this.nearest(pos);if(!p)return null;p.found=true;p.group.visible=false;return p;}
  toggleVision(){this.active=!this.active;return this.active;}
  update(t,pos){for(const p of this.points){if(p.found)continue;p.gem.rotation.y+=.015;p.ring.rotation.z=t*.35;const d=p.group.position.distanceTo(pos);const visible=this.active&&d<this.range;p.group.visible=visible||d<7;const s=visible?1.15:1;p.group.scale.lerp(new T.Vector3(s,s,s),.12);}}
  get found(){return this.points.filter(p=>p.found).length}
}
