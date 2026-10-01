export class WorldColliders{
 constructor(phase){this.phase=phase;this.items=this.build(phase)}
 build(p){
  const common=[{x:0,z:0,r:1.5}];
  if(p==='floresta')return common.concat([{x:5,z:8,r:1.1},{x:-9,z:15,r:1.3},{x:12,z:-5,r:1}]);
  if(p==='vila')return common.concat([{x:-5,z:7,r:1.4},{x:7,z:5,r:1.4},{x:10,z:-8,r:1.2},{x:-11,z:-6,r:1.3}]);
  return common.concat([{x:-6,z:10,r:1.5},{x:7,z:15,r:1.6},{x:0,z:22,r:1.8}]);
 }
}