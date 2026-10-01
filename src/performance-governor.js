export class PerformanceGovernor{
 constructor(){this.mobile=matchMedia("(pointer:coarse)").matches;this.acc=0;this.frames=0;this.fps=60;this.quality=this.mobile?"balanced":"high"}
 update(dt){
  this.acc+=dt;this.frames++;
  if(this.acc>=2){this.fps=this.frames/this.acc;this.frames=0;this.acc=0;
   if(this.mobile&&this.fps<38)this.quality="lite";
   else if(this.fps>52)this.quality=this.mobile?"balanced":"high";
  }
  return this.quality;
 }
}