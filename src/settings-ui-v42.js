export class SettingsUIV42{
 constructor(settings,access){this.s=settings;this.a=access;this.bind()}
 bind(){
  const $=id=>document.getElementById(id),on=(id,ev,fn)=>$(id)?.addEventListener(ev,fn);
  for(const [id,key] of [['v39-sens','cameraSensitivity'],['v39-particles','particles'],['v39-hud','hudScale']])if($(id))$(id).value=this.s.data[key];for(const [id,key] of [['v41-contrast','highContrast'],['v41-flashes','reducedFlashes'],['v41-large','largeText'],['v41-subtitles','subtitles']])if($(id))$(id).checked=this.a.data[key];
  if($('v39-vibration'))$('v39-vibration').checked=this.s.data.vibration;if($('v41-shake'))$('v41-shake').value=this.a.data.cameraShake;
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