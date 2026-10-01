export class AutosaveV39{
 constructor(save,seconds=25){this.save=save;this.every=seconds;this.t=0}
 update(dt,ctx){this.t+=dt;if(this.t<this.every)return false;this.t=0;return this.save?.save?.(ctx)||false}
}