export class RecoveryV42{
 constructor(){this.shown=false}
 show(message='O jogo encontrou um problema.'){if(this.shown)return;this.shown=true;const d=document.createElement('div');d.id='recovery-v42';d.innerHTML=`<div><h2>Recuperação</h2><p>${message}</p><button>Recarregar jogo</button></div>`;d.querySelector('button').onclick=()=>location.reload();document.body.appendChild(d)}
}