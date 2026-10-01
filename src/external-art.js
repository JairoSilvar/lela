import * as T from 'three';
export class ExternalArtLoader{
 constructor(){this.available={character:false,environment:false};}
 async probe(){
  for(const [k,u] of Object.entries({character:'./assets/external/lelinha.glb',environment:'./assets/external/environment.glb'})){
   try{const r=await fetch(u,{method:'HEAD',cache:'no-store'});this.available[k]=r.ok}catch{this.available[k]=false}
  }return this.available;
 }
}
