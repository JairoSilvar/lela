export class LODV39{
 constructor(){this.items=[]}
 add(object,{near=22,far=48}={}){if(object)this.items.push({object,near,far})}
 update(camera){if(!camera)return;for(const x of this.items){const d=camera.position.distanceTo(x.object.position);x.object.visible=d<x.far}}
 clear(){this.items.length=0}
}