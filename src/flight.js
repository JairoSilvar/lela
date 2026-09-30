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
    this.reset();
  }

  reset(){
    this.position.set(0,7,90);
    this.velocity.set(0,0,0);
    this.yaw=-.16;
    this.speed=0;
    this.energy=100;
    this.boosting=false;
    this.bump=0;
    this.bank=0;
    this.perfectTimer=0;
    this.perfectStreak=0;
    this.nearObstacle=false;
    this.model.position.copy(this.position);
    this.camera.position.copy(this.position).add(new T.Vector3(0,4.5,11));
    this.look.copy(this.position);
  }

  update(dt,input){
    this.bump=Math.max(0,this.bump-dt);
    this.yaw-=input.turn*1.25*dt;

    // Base target speeds
    this.boosting=!!input.boost&&this.energy>1;
    let cruise=9;
    let maxThrottle=15;
    if(this.boosting){
      maxThrottle=27;
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
    const turnBleed=Math.abs(input.turn)*.35*this.speed;

    let target;
    if(input.throttle<-.15) target=0;
    else if(input.throttle>.15) target=maxThrottle+diveBonus;
    else target=cruise+diveBonus*.5;
    target=Math.max(0,target-turnBleed);

    this.speed=T.MathUtils.damp(this.speed,target,1.6,dt);

    this.forward.set(-Math.sin(this.yaw),0,-Math.cos(this.yaw));
    const desired=this.forward.clone().multiplyScalar(this.speed);
    desired.y=input.lift*(this.boosting?11:7);
    // Extra gravity feel when not lifting
    if(input.lift<.1) desired.y-=1.8;
    this.velocity.lerp(desired,1-Math.exp(-2.8*dt));
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

    this.bank=T.MathUtils.damp(this.bank,input.turn*.4,4,dt);
    this.model.position.copy(this.position);
    this.model.rotation.set(
      T.MathUtils.damp(this.model.rotation.x,this.velocity.y*.03-input.lift*.08,3,dt),
      this.yaw,
      this.bank
    );
    this.model.position.y+=Math.sin(performance.now()*.002)*.06;

    // Camera
    const mobile=matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0||innerWidth<760;
    // Mobile camera: a slightly higher/longer chase view keeps the witch near the
    // useful middle of the screen while preserving a clear view of rings ahead.
    const camDist=this.boosting?(mobile?15:13.5):(mobile?12.4:10.5);
    const camHeight=mobile?5.2:3.6;
    const offset=new T.Vector3(0,camHeight+Math.max(0,-this.velocity.y)*(mobile?.04:.08),camDist).applyAxisAngle(new T.Vector3(0,1,0),this.yaw);
    const desiredCamera=this.position.clone().add(offset);
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
    const baseFov=62+(this.boosting?8:0)+Math.max(0,-climbFactor)*6;
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
