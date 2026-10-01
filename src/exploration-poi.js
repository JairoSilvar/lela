import * as T from 'three';
export class ExplorationPOI{
constructor(scene,phase){this.scene=scene;this.phase=phase;this.root=new T.Group();this.root.name='ExplorationPOI-v30';scene.add(this.root);this.items=[];this.found=new Set();this.build()}
build(){const sets={floresta:[[-13,1,9,'Clareira Lunar'],[15,1,13,'Árvore Ancestral'],[5,1,-15,'Pedra das Fadas']],vila:[[-12,1,10,'Poço dos Desejos'],[13,1,8,'Mercado Antigo'],[3,1,-14,'Jardim Secreto']],castelo:[[-10,1,14,'Torre Esquecida'],[10,1,19,'Pátio Arcano'],[0,1,28,'Santuário Antigo']]};const mat=new T.MeshBasicMaterial({color:0xffb6e2,transparent:true,opacity:.72,depthWrite:false,blending:T.AdditiveBlending});for(const p of sets[this.phase]||[]){const m=new T.Mesh(new T.TorusGeometry(.55,.055,8,24),mat.clone());m.position.set(p[0],p[1],p[2]);m.rotation.x=Math.PI/2;m.userData.name=p[3];this.root.add(m);this.items.push(m)}}
update(dt,pos){for(const m of this.items){m.rotation.z+=dt*.55;m.material.opacity=.5+Math.sin(performance.now()*.003+m.position.x)*.18;if(pos&&!this.found.has(m)&&pos.distanceTo(m.position)<2.2){this.found.add(m);m.visible=false;return{reward:30,message:`Descoberta: ${m.userData.name} · +30 essência`}}}return null}
status(){return`${this.found.size}/${this.items.length} locais descobertos`}
dispose(){this.scene.remove(this.root);this.root.traverse(o=>{o.geometry?.dispose?.();o.material?.dispose?.()})}
}