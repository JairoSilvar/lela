export class PerceptionV37{
 constructor(){this.memory=new WeakMap()}
 sense(object,target,{notice=10,forget=15}={}){
  if(!object||!target)return false;const d=object.position.distanceTo(target);
  const seen=this.memory.get(object)||false;const next=seen?d<forget:d<notice;
  this.memory.set(object,next);return next
 }
}