import * as T from 'three';
// Only static procedural meshes with equivalent geometry/material are batched.
// GLTF skins, textured models and animated emissive lights retain their own nodes.
export function batchStatic(root){
 root.updateMatrixWorld(true);const groups=new Map(),inverse=root.matrixWorld.clone().invert();
 root.traverse(o=>{const m=o.material,g=o.geometry;if(!o.isMesh||o.isSkinnedMesh||o.isInstancedMesh||!g?.parameters||Array.isArray(m)||m.map||m.transparent||m.emissiveIntensity>1)return;
 const key=JSON.stringify([g.type,g.parameters,m.type,m.color?.getHex(),m.emissive?.getHex(),m.emissiveIntensity,m.roughness,m.metalness,m.side]);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(o)});
 for(const nodes of groups.values()){if(nodes.length<2)continue;const first=nodes[0],mesh=new T.InstancedMesh(first.geometry.clone(),first.material.clone(),nodes.length);mesh.castShadow=first.castShadow;mesh.receiveShadow=first.receiveShadow;mesh.name='v44-static-batch';nodes.forEach((o,i)=>{mesh.setMatrixAt(i,new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld));o.removeFromParent();o.geometry.dispose();o.material.dispose()});mesh.computeBoundingSphere();root.add(mesh)}
}
