export class AccessibilityV41{
 constructor(){this.key='lelinha-access-v41';this.data={highContrast:false,reducedFlashes:false,largeText:false,cameraShake:1,subtitles:true};this.load()}
 load(){try{Object.assign(this.data,JSON.parse(localStorage.getItem(this.key)||'{}'))}catch{}}
 save(){try{localStorage.setItem(this.key,JSON.stringify(this.data))}catch{}}
 apply(){const r=document.documentElement;r.classList.toggle('v41-contrast',this.data.highContrast);r.classList.toggle('v41-large-text',this.data.largeText);r.classList.toggle('v41-reduced-flashes',this.data.reducedFlashes)}
}