export class SettingsUIV42{
 constructor(settings,access){this.s=settings;this.a=access;this.bind()}
 bind(){
  const $=id=>document.getElementById(id),on=(id,ev,fn)=>$(id)?.addEventListener(ev,fn);
  const sync=()=>{this.s?.save?.();this.s?.apply?.();this.a?.save?.();this.a?.apply?.()};
  on('v39-sens','input',e=>{this.s.data.cameraSensitivity=+e.target.value;sync()});
  on('v39-particles','input',e=>{this.s.data.particles=+e.target.value;sync()});
  on('v39-hud','input',e=>{this.s.data.hudScale=+e.target.value;sync()});
  on('v39-vibration','change',e=>{this.s.data.vibration=e.target.checked;sync()});
  on('v41-contrast','change',e=>{this.a.data.highContrast=e.target.checked;sync()});
  on('v41-flashes','change',e=>{this.a.data.reducedFlashes=e.target.checked;sync()});
  on('v41-large','change',e=>{this.a.data.largeText=e.target.checked;sync()});
  on('v41-subtitles','change',e=>{this.a.data.subtitles=e.target.checked;sync()});
  on('v41-shake','input',e=>{this.a.data.cameraShake=+e.target.value;sync()});
  on('v39-close','click',()=>{$('settings-v39').hidden=true});
  on('v41-close','click',()=>{$('v41-access').hidden=true});
 }
}