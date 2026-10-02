import * as T from 'three';
export class WaterV46{
 constructor(scene,world){this.scene=scene;this.world=world;this.t=0;this.items=[];this.build()}
 build(){for(const o of this.world.decor||[]){if(!o.isMesh||!o.material?.transparent||!o.geometry?.attributes?.position)continue;const c=o.material.color;if(!c)continue;const b=c.b,g=c.g;if(b>g*.75){o.material.roughness=.18;o.material.metalness=.12;o.material.opacity=.78;o.material.envMapIntensity=.4;o.userData.waterV47BaseY=o.position.y;o.userData.waterV47Emissive=o.material.emissiveIntensity||.2;this.items.push(o)}}}
 update(dt){this.t+=dt;for(const m of this.items){m.material.emissiveIntensity=m.userData.waterV47Emissive+Math.sin(this.t*1.6+m.id)*.012;m.position.y=m.userData.waterV47BaseY+Math.sin(this.t*.85+m.id)*.035}}
}
