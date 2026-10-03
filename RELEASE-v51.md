# Halloween Rosa — Lelinha v51 · Stability & Character Pass

## Objetivo
Versão de estabilização. Nenhuma grande feature nova foi adicionada; o foco foi eliminar regressões relatadas na v50 e corrigir a apresentação dos NPCs.

## Correções P0
- **Céu → solo:** a camada `SkyAdventure` agora inicia oculta, só é ativada acima de 22 m e é desligada deterministicamente ao descer. Estrelas, nuvens, Portal, selos, faróis e Santuário deixam de vazar visualmente para a apresentação terrestre.
- **Estado de dica celeste:** resetado ao sair da camada superior, permitindo novas entradas/saídas sem estado residual.
- **Sky Traffic / bruxas NPC:** riders reconstruídos com juntas procedurais ancoradas por pontos (ombro→cotovelo→mão e quadril→joelho→pé). As mãos terminam fisicamente junto ao cabo; pernas ficam dobradas ao redor da vassoura. Como os NPCs usam rig procedural independente, não há AnimationMixer sobrescrevendo a pose.
- **NPCs distintos da Lelinha:** três tons de pele/paletas, cabelo/silhueta, chapéu, roupa, cachecol e acabamento de vassoura diferentes.
- **Atmosfera:** corrigido drift vertical acumulativo dos vaga-lumes (`+=` por frame). A altura agora deriva de `baseY`, evitando estado visual que se degrada com o tempo.

## Preservação
Buggy, combate/Cyclops, céu explorável, sete selos, Portal da Lua Rosa, Santuário/Easter egg, cristais, exploração terrestre, Time Trial/ghost, save/progressão, dungeon, áudio/VFX, acessibilidade e perfis gráficos foram preservados.

## QA executado
- Asset audit: 196 referências, 0 falhas, 0 externas.
- Storage/save: 4/4.
- Gameplay/progressão: 3/3.
- Regressões v51: 3/3 (reset da camada celeste, pose procedural ancorada dos NPCs, ausência de drift vertical acumulativo).
- Sintaxe JavaScript dos arquivos alterados: aprovada.
- ZIP: teste de integridade aprovado.

## Validação visual ainda necessária no dispositivo
A pose dos NPCs foi corrigida geometricamente no código, mas a validação visual final deve ser feita no PC/celular do playtest. Observar mãos no cabo, joelhos, orientação da vassoura, câmera e ciclos repetidos céu→solo. Se houver anomalia visual, registrar captura para ajuste fino de coordenadas.
