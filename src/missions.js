const MISSIONS={
  floresta:{id:'sino-floresta',title:'O Sino da Floresta',intro:'Uma presença antiga chama entre as árvores.',start:'sino',finish:'runa',rings:3,steps:['Encontre o Sino Perdido com a Visão Mágica','Monte na vassoura e atravesse 3 anéis','Volte ao solo e examine a Runa do Bosque'],reward:250},
  vila:{id:'porta-lua',title:'A Porta da Lua Rosa',intro:'Uma carta fala de uma passagem que só responde a quem domina o céu.',start:'carta',finish:'lanterna',rings:4,steps:['Encontre a Carta da Vila','Atravesse 4 anéis para carregar a carta de magia','Examine a Lanterna Sussurrante'],reward:300},
  castelo:{id:'eco-torre',title:'O Eco da Torre',intro:'Uma voz presa nas torres procura os selos do luar.',start:'eco',finish:'brasao',rings:5,steps:['Encontre o Eco da Torre','Atravesse 5 anéis para reunir energia lunar','Examine o Brasão Lunar'],reward:400}
};
const KEY='lelinha-grimorio-v7';
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{"entries":{},"completed":{}}')}catch{return {entries:{},completed:{}}}}
function write(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch{}}
export class MissionSystem{
  constructor(phase){this.phase=phase;this.def=MISSIONS[phase]||MISSIONS.floresta;this.data=read();this.step=this.data.completed[this.def.id]?3:0;this.rings=0;this.active=this.step>0&&this.step<3;}
  resetSession(){this.rings=0;if(!this.data.completed[this.def.id]){this.step=0;this.active=false}}
  onDiscovery(secret){this.data.entries[`${this.phase}:${secret.id}`]={name:secret.name,text:secret.text,phase:this.phase};write(this.data);let message='';let reward=0;
    if(this.step===0&&secret.id===this.def.start){this.step=1;this.active=true;this.rings=0;message=`MISSÃO INICIADA · ${this.def.title}`;}
    else if(this.step===2&&secret.id===this.def.finish){this.step=3;this.active=false;this.data.completed[this.def.id]=true;write(this.data);reward=this.def.reward;message=`MISSÃO CONCLUÍDA · ${this.def.title} · +${reward} essência`;}
    return {message,reward};
  }
  onRing(){if(this.step!==1)return null;this.rings++;if(this.rings>=this.def.rings){this.step=2;return `OBJETIVO CONCLUÍDO · volte ao solo e procure ${this.finishName()}`;}return `${this.def.title} · anéis ${this.rings}/${this.def.rings}`;}
  finishName(){const names={floresta:'a Runa do Bosque',vila:'a Lanterna Sussurrante',castelo:'o Brasão Lunar'};return names[this.phase]||'o selo final'}
  objective(){if(this.data.completed[this.def.id])return `Missão concluída · ${this.def.title}`;if(this.step===0)return `Missão da região · procure pistas com a Visão Mágica`;if(this.step===1)return `${this.def.title} · atravesse ${this.rings}/${this.def.rings} anéis`;if(this.step===2)return `${this.def.title} · examine ${this.finishName()}`;return this.def.title}
  get completed(){return !!this.data.completed[this.def.id]}
  render(){const entries=Object.values(this.data.entries);const completed=Object.keys(this.data.completed).length;const current=this.def;return `<div class="grim-summary"><b>${entries.length}</b><span>descobertas</span><b>${completed}/3</b><span>missões regionais</span></div><section class="grim-mission"><span>MISSÃO DA REGIÃO</span><h3>${current.title}</h3><p>${current.intro}</p>${current.steps.map((s,i)=>`<div class="grim-step ${this.step>i?'done':this.step===i?'current':''}">${this.step>i?'✓':'◇'} ${s}</div>`).join('')}</section><section class="grim-entries"><span>DESCOBERTAS</span>${entries.length?entries.map(e=>`<article><b>${e.name}</b><p>${e.text}</p></article>`).join(''):'<p>Nenhuma descoberta registrada. Use a Visão Mágica durante a exploração.</p>'}</section>`}
}
