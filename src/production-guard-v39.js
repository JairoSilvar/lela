export class ProductionGuardV39{
 constructor(){this.errors=[];this.max=20;window.addEventListener('error',e=>this.push(e.message));window.addEventListener('unhandledrejection',e=>this.push(String(e.reason||'promise rejection')))}
 push(x){this.errors.push({t:Date.now(),message:String(x).slice(0,240)});if(this.errors.length>this.max)this.errors.shift()}
 snapshot(){return this.errors.slice()}
}