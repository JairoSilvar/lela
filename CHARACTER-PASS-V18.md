# v18 — Character & Animation Reliability Pass

## Alterações implementadas
- Clonagem do personagem skinned passou a usar `SkeletonUtils.clone`, preservando corretamente a ligação entre `SkinnedMesh`, esqueleto e bones.
- Voo normal usa `Driving_Loop`, criando pose sentada/compatível com a vassoura em vez de manter Lelinha em pé.
- Turbo mantém `Spell_Simple_Idle_Loop` para feedback mágico.
- Movimento no solo ganhou transição Idle → Walk → Jog → Sprint conforme velocidade/boost.
- Fallback do personagem original e todos os sistemas da v17 foram preservados.

## Motivo técnico
`Object3D.clone(true)` não é a estratégia segura para duplicar personagens com `SkinnedMesh`. O projeto já continha `SkeletonUtils.js`, então a v18 passa a usar a rotina específica para rigs do Three.js.
