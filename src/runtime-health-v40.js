export class RuntimeHealthV40{
 constructor(){this.samples=[];this.warnings=[]}
 sample(q,errors=[]){if(q)this.samples.push(q);if(this.samples.length>30)this.samples.shift();if(errors.length>5&&!this.warnings.includes('errors'))this.warnings.push('errors')}
 report(){const fps=this.samples.map(x=>x?.fps).filter(Number.isFinite);return{samples:fps.length,avgFps:fps.length?fps.reduce((a,b)=>a+b,0)/fps.length:null,warnings:[...this.warnings]}}
}