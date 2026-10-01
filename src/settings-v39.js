export class SettingsV39{
 constructor(){this.key='lelinha-settings';this.data={cameraSensitivity:1,particles:1,hudScale:1,vibration:true,music:.7,sfx:.8};this.load()}
 load(){try{Object.assign(this.data,JSON.parse(localStorage.getItem(this.key)||'{}'))}catch{}}
 save(){try{localStorage.setItem(this.key,JSON.stringify(this.data))}catch{}}
 apply(){document.documentElement.style.setProperty('--hud-scale',this.data.hudScale);window.dispatchEvent(new CustomEvent('lelinha-settings',{detail:this.data}))}
}