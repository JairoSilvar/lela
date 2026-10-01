export class ReleaseLifecycleV42{
 constructor({saveValidator,releaseGate,runtime,errors}){this.saveValidator=saveValidator;this.releaseGate=releaseGate;this.runtime=runtime;this.errors=errors;this.state='boot'}
 boot(save){this.state='boot';const valid=this.saveValidator?.validate(save)||null;this.state='ready';return valid}
 evaluate(){return this.releaseGate?.evaluate({runtime:this.runtime?.report?.(),errors:this.errors?.snapshot?.()||[],assets:true,save:true})||{pass:false,reasons:['gate-unavailable']}}
}