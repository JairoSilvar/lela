export class EntityCullingV40{
 constructor(){this.items=[];this.last=0}
 track(object,{far=50}={}){if(object&&!this.items.some(x=>x.object===object))this.items.push({object,far})}
 update(camera,quality='balanced'){
  if(!camera)return;const mult=quality==='lite'?.65:quality==='high'?1.15:1;
  for(const x of this.items){const d=camera.position.distanceTo(x.object.position);x.object.visible=d<x.far*mult}
 }
 prune(){this.items=this.items.filter(x=>x.object?.parent)}
}