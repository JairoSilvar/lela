export class AnimationStateV36{
 constructor(){this.map=new WeakMap()}
 bind(object,mixer,clips=[]){if(!object||!mixer)return;const actions={};for(const c of clips)actions[c.name.toLowerCase()]=mixer.clipAction(c);this.map.set(object,{mixer,actions,current:null})}
 play(object,state){const d=this.map.get(object);if(!d)return;const keys=Object.keys(d.actions);const aliases={idle:['idle'],patrol:['walk'],chase:['run','walk'],attack:['attack'],flee:['run'],alert:['idle'],dead:['death','die']};let key=null;for(const q of aliases[state]||[state]){key=keys.find(k=>k.includes(q));if(key)break}if(!key||d.current===key)return;d.actions[d.current]?.fadeOut(.15);d.actions[key].reset().fadeIn(.15).play();d.current=key}
}