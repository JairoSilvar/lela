export class QAMonitorV39{
 constructor(){this.min=999;this.maxDt=0;this.frames=0;this.time=0}
 update(dt){this.frames++;this.time+=dt;this.maxDt=Math.max(this.maxDt,dt);if(this.time>=2){const fps=this.frames/this.time;this.min=Math.min(this.min,fps);this.frames=0;this.time=0;return{fps,minFps:this.min,maxFrameMs:this.maxDt*1000}}return null}
}