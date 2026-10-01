export class GameAudioBus{
 constructor(){
  this.enabled=true; this.master=.72; this.last={};
  this.bank={
   ui:["assets/audio/kenney/ui/sfx_01.ogg","assets/audio/kenney/ui/sfx_02.ogg","assets/audio/kenney/ui/sfx_03.ogg"],
   impact:["assets/audio/kenney/impact/sfx_01.ogg","assets/audio/kenney/impact/sfx_02.ogg","assets/audio/kenney/impact/sfx_03.ogg"],
   reward:["assets/audio/kenney/ui/sfx_04.ogg","assets/audio/kenney/ui/sfx_05.ogg"],
   land:["assets/audio/kenney/impact/sfx_04.ogg","assets/audio/kenney/impact/sfx_05.ogg"]
  };
 }
 play(type,{volume=.55,pitch=1,cooldown=.08}={}){
  if(!this.enabled)return;
  const now=performance.now()/1000;
  if(now-(this.last[type]||0)<cooldown)return;
  this.last[type]=now;
  const list=this.bank[type]||this.bank.ui;
  const src=list[(Math.random()*list.length)|0];
  const a=new Audio(src);
  a.volume=Math.max(0,Math.min(1,volume*this.master));
  a.playbackRate=Math.max(.82,Math.min(1.18,pitch+(Math.random()-.5)*.055));
  a.play().catch(()=>{});
 }
 ui(){this.play("ui",{volume:.32,cooldown:.045})}
 impact(){this.play("impact",{volume:.45,pitch:.96})}
 reward(){this.play("reward",{volume:.48,pitch:1.04,cooldown:.2})}
 land(){this.play("land",{volume:.42,pitch:.94,cooldown:.16})}
}