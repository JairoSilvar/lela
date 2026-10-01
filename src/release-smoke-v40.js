export async function runReleaseSmoke(){
 const results=[];
 const check=(name,ok,detail='')=>results.push({name,ok:!!ok,detail});
 check('WebGL',!!document.createElement('canvas').getContext('webgl'));
 check('localStorage',(()=>{try{localStorage.setItem('__l40','1');localStorage.removeItem('__l40');return true}catch{return false}})());
 check('Audio',typeof Audio!=='undefined');
 check('Pointer Events','PointerEvent'in window);
 check('RAF',typeof requestAnimationFrame==='function');
 return results
}