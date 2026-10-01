export class SaveValidationV40{
 validate(d){
  if(!d||typeof d!=='object')return null;
  const phases=new Set(['floresta','vila','castelo']);
  if(!phases.has(d.phase))d.phase='floresta';
  if(!d.position||![d.position.x,d.position.y,d.position.z].every(Number.isFinite))d.position={x:0,y:1,z:0};
  if(!d.vitals)d.vitals={health:100,magic:100};
  d.vitals.health=Math.max(1,Math.min(100,Number(d.vitals.health)||100));
  d.vitals.magic=Math.max(0,Math.min(100,Number(d.vitals.magic)||100));
  d.saveVersion=Math.max(1,Number(d.saveVersion)||1);return d
 }
}