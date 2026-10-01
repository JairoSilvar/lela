export class MobileCombatV38{
 constructor(){if(!matchMedia('(pointer:coarse)').matches)return;const b=document.createElement('button');b.id='cast-v38';b.type='button';b.setAttribute('aria-label','Lançar magia');b.textContent='✦';b.addEventListener('pointerdown',e=>{e.preventDefault();window.dispatchEvent(new Event('lelinha-cast-v36'))});document.body.appendChild(b);this.button=b}
}