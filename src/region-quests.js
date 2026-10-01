export class RegionQuests{
 constructor(phase){this.phase=phase;this.count=0;this.complete=false}
 encounter(){if(this.complete)return null;this.count++;const need=this.phase==='vila'?3:2;if(this.count>=need){this.complete=true;return{reward:100,message:this.phase==='floresta'?'Missão: Ecos da Floresta concluída · +100 essência':this.phase==='vila'?'Missão: Corações da Vila concluída · +100 essência':'Missão: Segredos do Castelo concluída · +100 essência'}}return{reward:20,message:`Missão regional ${this.count}/${need} · +20 essência`}}
 status(){if(this.complete)return'Missão regional concluída';const need=this.phase==='vila'?3:2;return`Exploração regional ${this.count}/${need}`}
}
