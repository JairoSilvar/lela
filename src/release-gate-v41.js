export class ReleaseGateV41{
 evaluate({runtime,errors=[],assets=true,save=true}={}){
  const reasons=[];if(!assets)reasons.push('critical-assets');if(!save)reasons.push('save-validation');if(errors.length>3)reasons.push('runtime-errors');
  if(runtime?.avgFps!=null&&runtime.avgFps<28)reasons.push('performance');
  return{pass:reasons.length===0,reasons}
 }
}