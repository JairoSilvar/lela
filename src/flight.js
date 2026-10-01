import * as T from 'three';
import {ground} from './world.js';

export class Flight{
  constructor(model,camera,world){
    this.model=model;
    this.camera=camera;
    this.world=world;
    this.position=new T.Vector3();
    this.velocity=new T.Vector3();
    this.forward=new T.Vector3(0,0,-1);
    this.look=new T.Vector3();
    this.perfectTimer=0;
    this.perfectStreak=0;
    this.nearObstacle=false;
    this.mode="precision";this.lookYaw=0;this.lookPitch=0;
    this.grounded=false;
    this.broomBlend=1;
    this.broomTarget=1;
    this.profile={speed:1,accel:1,control:1,stability:1,turbo:1};
    this.reset();
  }

  reset(){
    this.position.set(0,7,90);
    this.velocity.set(0,0,0);
    this.yaw=-.16;this.lookYaw=0;this.lookPitch=0;
    this.speed=0;
    this.energy=100;
    this.boosting=false;
    this.bump=0;
    this.bank=0;
    this.perfectTimer=0;
    this.perfectStreak=0;
    this.nearObstacle=false;
    this.grounded=false;
    this.broomTarget=1; this.broomBlend=1;
    this.syncBroom(0,true);
    this.model.position.copy(this.position);
    this.camera.position.copy(this.position).add(new T.Vector3(0,4.5,11));
    this.look.copy(this.position);
  }

  setProfile(stats){ this.profile={...this.profile,...stats}; }

  toggleMode(){ this.mode=this.mode==="precision"?"cruise":"precision"; return this.mode; }

  canLand(){
    const floor=ground(this.position.x,this.position.z);
    return !this.grounded && this.position.y-floor<5.5 && this.speed<10;
  }

  land(){
    if(!this.canLand()) return false;
    this.grounded=true; this.boosting=false; this.speed=0; this.velocity.set(0,0,0);
    this.broomTarget=0;
    this.position.y=ground(this.position.x,this.position.z)+1.05;
    return true;
  }

  mount(){
    if(!this.grounded) return false;
    this.grounded=false; this.position.y=ground(this.position.x,this.position.z)+2.2; this.speed=3;
    this.broomTarget=1;
    return true;
  }

  syncBroom(dt=0,instant=false){
    const holder=this.model?.userData?.broomHolder;
    if(!holder) return;
    if(instant) this.broomBlend=this.broomTarget;
    else this.broomBlend=T.MathUtils.damp(this.broomBlend,this.broomTarget,this.broomTarget?10:13,dt);
    const k=T.MathUtils.smoothstep(this.broomBlend,0,1);
    const base=holder.userData.baseScale||new T.Vector3(1,1,1);
    holder.scale.copy(base).multiplyScalar(Math.max(.001,k));
    holder.visible=k>.025;
    // A tiny magical lift/drop avoids a hard pop when mounting or dismounting.
    holder.position.y=.05+(1-k)*.28;
  }

  updateGround(dt,input){
    this.syncBroom(dt);
    const floor=ground(this.position.x,this.position.z)+1.05;
    this.yaw-=input.turn*2.1*dt;
    const forward=new T.Vector3(-Math.sin(this.yaw),0,-Math.cos(this.yaw));
    const right=new T.Vector3(Math.cos(this.yaw),0,-Math.sin(this.yaw));
    const f=T.MathUtils.clamp(input.throttle,-1,1), side=T.MathUtils.clamp(input.turn,-1,1);
    const running=!!input.boost;
    const move=forward.multiplyScalar(Math.max(0,f)).add(right.multiplyScalar(side*.72));
    if(move.lengthSq()>1) move.normalize();
    const walk=running?7.2:4.1;
    this.velocity.lerp(move.multiplyScalar(walk),1-Math.exp(-8*dt)); this.velocity.y=0;
    this.position.addScaledVector(this.velocity,dt); this.position.y=floor; this.speed=this.velocity.length();
    this.model.position.copy(this.position); this.model.rotation.set(0,this.yaw,0);
    const back=new T.Vector3(0,2.7,7.2).applyAxisAngle(new T.Vector3(0,1,0),this.yaw);
    const desired=this.position.clone().add(back); desired.y=Math.max(desired.y,floor+2.4);
    this.camera.position.lerp(desired,1-Math.exp(-7*dt));
    const target=this.position.clone().add(new T.Vector3(0,1.25,0)).add(new T.Vector3(-Math.sin(this.yaw),0,-Math.cos(this.yaw)).multiplyScalar(3));
    this.look.lerp(target,1-Math.exp(-8*dt)); this.camera.lookAt(this.look);
    this.camera.fov=T.MathUtils.damp(this.camera.fov,58,5,dt); this.camera.updateProjectionMatrix();
    // Jog bridges the large visual speed gap between walking and sprinting.
    const groundAnim=this.speed<.45?'Idle_Loop':running?'Sprint_Loop':this.speed>3.15?'Jog_Fwd_Loop':'Walk_Loop';
    this.model.userData.animation?.update(dt,groundAnim);
  }

  update(dt,input){
    this.syncBroom(dt);
    if(this.grounded){ this.updateGround(dt,input); return; }
    this.bump=Math.max(0,this.bump-dt);
    const precision=this.mode==="precision";
    this.yaw-=input.turn*(precision?1.5:1.05)*this.profile.control*dt;

    // Base target speeds
    this.boosting=!!input.boost&&this.energy>1;
    let cruise=(precision?7.5:11)*this.profile.speed;
    let maxThrottle=(precision?13.5:18)*this.profile.speed;
    if(this.boosting){
      maxThrottle=(precision?22:31)*this.profile.turbo;
      this.energy=Math.max(0,this.energy-dt*24);
    }else{
      this.energy=Math.min(100,this.energy+dt*12);
    }

    // Pitch from lift input + actual vertical velocity
    const climbFactor=T.MathUtils.clamp(this.velocity.y/10,-1,1);
    // Diving (nose down) gains speed; climbing hard loses speed
    let diveBonus=0;
    if(climbFactor<-.15){
      diveBonus=Math.abs(climbFactor)*8; // up to +8 on steep dive
    }else if(climbFactor>.25){
      diveBonus=-climbFactor*5; // lose speed climbing
    }
    // Tight turns bleed speed
    const turnBleed=Math.abs(input.turn)*(precision?.18:.28)*this.speed;

    let target;
    if(input.throttle<-.15) target=0;
    else if(input.throttle>.15||this.boosting) target=maxThrottle+diveBonus;
    else target=cruise+diveBonus*.5;
    target=Math.max(0,target-turnBleed);

    this.speed=T.MathUtils.damp(this.speed,target,1.6*this.profile.accel,dt);

    this.forward.set(-Math.sin(this.yaw),0,-Math.cos(this.yaw));
    const desired=this.forward.clone().multiplyScalar(this.speed);
    desired.y=input.lift*(precision?(this.boosting?12:8.5):(this.boosting?10:6.5));
    // Extra gravity feel when not lifting
    if(input.lift<.1) desired.y-=1.8;
    this.velocity.lerp(desired,1-Math.exp(-(precision?4.2:2.15)*this.profile.stability*dt));
    this.position.addScaledVector(this.velocity,dt);

    // Ground
    const floor=ground(this.position.x,this.position.z)+1.3;
    if(this.position.y<floor){
      this.position.y=T.MathUtils.lerp(this.position.y,floor,.7);
      this.velocity.y=Math.max(0,this.velocity.y);
      this.speed*=Math.exp(-2*dt);
    }
    this.position.y=Math.min(62,this.position.y);

    // Colliders
    this.nearObstacle=false;
    let closestDist=99;
    for(const c of this.world.colliders){
      if(this.position.y>c.y+c.height+1||this.position.y<c.y-1) continue;
      let dx=this.position.x-c.x,dz=this.position.z-c.z;
      let d=Math.hypot(dx,dz);
      const r=c.r+.7;
      const gap=d-r;
      if(gap<3.2&&gap>0){
        this.nearObstacle=true;
        if(gap<closestDist) closestDist=gap;
      }
      if(d<r){
        if(d<.001){dx=1;dz=0;d=1;}
        this.position.x+=dx/d*(r-d)*.65;
        this.position.z+=dz/d*(r-d)*.65;
        this.speed*=Math.exp(-6*dt);
        this.bump=.25;
        this.perfectTimer=0;
        this.perfectStreak=0;
      }
    }

    // Perfect Flight: sustained proximity without collision
    if(this.nearObstacle&&this.bump<=0&&this.speed>6){
      this.perfectTimer+=dt;
      if(this.perfectTimer>0.85){
        this.perfectStreak++;
        this.perfectTimer=0;
      }
    }else{
      this.perfectTimer=Math.max(0,this.perfectTimer-dt*1.5);
    }

    // Soft map border
    const dx=this.position.x-90,dz=this.position.z,dist=Math.hypot(dx,dz);
    if(dist>240){
      this.position.x-=dx/dist*(dist-240)*dt*2;
      this.position.z-=dz/dist*(dist-240)*dt*2;
      this.speed*=Math.exp(-dt);
    }

    this.bank=T.MathUtils.damp(this.bank,input.turn*(precision?.32:.52),precision?5:3.5,dt);
    this.model.position.copy(this.position);
    // Broom pose: driving is a much better seated flight silhouette than standing idle.
    // Boost swaps to spell casting to keep the magical feedback from v17.
    this.model.userData.animation?.update(dt,this.boosting?'Spell_Simple_Idle_Loop':'Driving_Loop');
    this.model.rotation.set(
      T.MathUtils.damp(this.model.rotation.x,this.velocity.y*.03-input.lift*.08,3,dt),
      this.yaw,
      this.bank
    );
    this.model.position.y+=Math.sin(performance.now()*.002)*.06;

    // Camera
    this.lookYaw=T.MathUtils.clamp(this.lookYaw+(input.lookX||0)*dt*2,-1.2,1.2);this.lookPitch=T.MathUtils.clamp(this.lookPitch+(input.lookY||0)*dt*2,-.5,.5);
    const mobile=matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0||innerWidth<760;
    // Mobile camera: a slightly higher/longer chase view keeps the witch near the
    // useful middle of the screen while preserving a clear view of rings ahead.
    const camDist=this.boosting?(mobile?15:13.5):(mobile?12.4:10.5);
    const camHeight=mobile?5.2:3.6;
    const offset=new T.Vector3(0,camHeight+Math.max(0,-this.velocity.y)*(mobile?.04:.08),camDist).applyAxisAngle(new T.Vector3(0,1,0),this.yaw);
    offset.applyAxisAngle(new T.Vector3(0,1,0),this.lookYaw);offset.y+=this.lookPitch*5;const desiredCamera=this.position.clone().add(offset);
    desiredCamera.y=Math.max(desiredCamera.y,ground(desiredCamera.x,desiredCamera.z)+2);
    // Pull camera in near obstacles
    if(this.nearObstacle){
      const pull=T.MathUtils.clamp(1-closestDist/3.2,0,.35);
      desiredCamera.lerp(this.position,pull*.25);
    }
    this.camera.position.lerp(desiredCamera,1-Math.exp(-(mobile?5.2:4)*dt));
    const lookDistance=mobile?10:8;
    const lookY=this.position.y+(mobile?0.75:0)+this.velocity.y*(mobile?.16:.3);
    const lookTarget=this.position.clone().add(this.forward.clone().multiplyScalar(lookDistance));
    lookTarget.y=lookY;
    this.look.lerp(lookTarget,1-Math.exp(-(mobile?6:5)*dt));
    this.camera.lookAt(this.look);
    // FOV punch on boost / dive
    const baseFov=(precision?60:64)+((this.boosting?(precision?7:10):0)+Math.max(0,-climbFactor)*(precision?4:7))*(input.motion??1);
    this.camera.fov=T.MathUtils.damp(this.camera.fov,baseFov,3,dt);
    this.camera.updateProjectionMatrix();
  }

  // Called by main when perfect streak ticks for score
  consumePerfectBonus(){
    if(this.perfectStreak>0){
      const n=this.perfectStreak;
      this.perfectStreak=0;
      return n;
    }
    return 0;
  }
}
