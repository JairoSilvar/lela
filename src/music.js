import {storage} from './storage.js';
// Trilha por contexto. Para adicionar novas faixas, copie o arquivo para
// assets/audio/music/ e altere/expanda MUSIC_TRACKS abaixo.
export const MUSIC_TRACKS = {
  menu: './assets/audio/music/menu.mp3',
  floresta: './assets/audio/music/fase-1.mp3',
  vila: './assets/audio/music/fase-2.mp3',
  castelo: './assets/audio/music/fase-3.mp3'
};

export class MusicPlayer {
  constructor(){
    this.el=new Audio();
    this.el.loop=true;
    this.el.preload='auto';
    this.el.volume=.42;
    this.enabled=true;
    this.unlocked=false;
    this.context=null;
    try{
      const saved=storage.getItem('wf-music-enabled');
      if(saved!==null)this.enabled=saved==='1';
      const vol=parseFloat(storage.getItem('wf-music-volume'));
      if(Number.isFinite(vol))this.el.volume=Math.max(0,Math.min(1,vol));
    }catch{}
    const unlock=()=>{this.unlocked=true;this.playCurrent();};
    window.addEventListener('pointerdown',unlock,{once:true,passive:true});
    window.addEventListener('keydown',unlock,{once:true});
  }
  setContext(context){
    if(!MUSIC_TRACKS[context])context='menu';
    if(this.context===context)return this.playCurrent();
    this.context=context;
    const src=MUSIC_TRACKS[context];
    this.el.pause();
    this.el.currentTime=0;
    this.el.src=src;
    this.el.load();
    this.playCurrent();
  }
  playCurrent(){
    if(!this.enabled||!this.unlocked||!this.context)return;
    const p=this.el.play();
    if(p&&p.catch)p.catch(()=>{});
  }
  setEnabled(on){
    this.enabled=!!on;
    try{storage.setItem('wf-music-enabled',this.enabled?'1':'0');}catch{}
    if(this.enabled)this.playCurrent(); else this.el.pause();
    return this.enabled;
  }
  toggle(){return this.setEnabled(!this.enabled);}
  setVolume(v){
    this.el.volume=Math.max(0,Math.min(1,Number(v)||0));
    try{storage.setItem('wf-music-volume',String(this.el.volume));}catch{}
    return this.el.volume;
  }
}
