export class GraphicsProfile{
 constructor(renderer,input){this.renderer=renderer;this.input=input;this.mode=localStorage.getItem('wf-graphics')||'auto';this.mobile=!!input?.touch;this.apply(this.mode)}
 resolved(){if(this.mode!=='auto')return this.mode;const mem=navigator.deviceMemory||4,cores=navigator.hardwareConcurrency||4;if(this.mobile&&(mem<=3||cores<=4))return'low';if(this.mobile||mem<=6)return'medium';return'high'}
 apply(mode=this.mode){this.mode=mode;localStorage.setItem('wf-graphics',mode);const q=this.resolved(),r=this.renderer,dpr=Math.min(devicePixelRatio||1,q==='low'?1:q==='medium'?1.35:1.7);r.setPixelRatio(dpr);r.shadowMap.enabled=q!=='low';r.shadowMap.type=2;document.body.dataset.graphics=q;return q}
}