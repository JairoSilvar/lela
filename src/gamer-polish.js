import {storage} from './storage.js';
export class GamerPolish{
 constructor(){this.profile=storage.getItem('wf-perf-profile')||'auto';this.fps=60;this.acc=0;this.frames=0;this.photo=false;this.zen=false;this.ngp=storage.getItem('wf-ngplus')==='1'}
 update(dt,renderer){this.acc+=dt;this.frames++;if(this.acc>=2){this.fps=Math.round(this.frames/this.acc);this.frames=0;this.acc=0;if(this.profile==='auto'&&renderer){const pr=renderer.getPixelRatio();if(this.fps<42&&pr>.8)renderer.setPixelRatio(Math.max(.8,pr-.1));else if(this.fps>57&&pr<1.5)renderer.setPixelRatio(Math.min(1.5,pr+.05));}}}
 togglePhoto(){this.photo=!this.photo;document.body.classList.toggle('photo-mode',this.photo);return this.photo}
 toggleZen(){this.zen=!this.zen;document.body.classList.toggle('zen-mode',this.zen);return this.zen}
 exportSave(){const keys=storage.keys().filter(k=>/^(wf-|lelinha-|witches-)/.test(k));const data={version:44,date:new Date().toISOString(),values:{}};keys.forEach(k=>data.values[k]=storage.getItem(k));return JSON.stringify(data,null,2)}
 setProfile(p){this.profile=p;storage.setItem('wf-perf-profile',p)}
}
