# v35 — Combat Core & Production Pass

## Implementado
- Entidades de criatura agora têm HP, dano, XP, invulnerabilidade e morte.
- Sistema real de projéteis/hit detection preparado para as magias.
- Cyclops promovido a miniboss: 180 HP, 3 fases e telegraph de ataque especial.
- Barra de boss adicionada ao HUD.
- Save versionado (`saveVersion: 2`) com região, posição, vida, magia, progressão e essência.
- SimulationBudget define níveis de atualização por distância para futura expansão populacional.
- CreatureModels v34 conectado ao sistema de combate sem remover os modelos existentes.
- Todos os recursos da v34 preservados.

## Próximas ligações
- mapear input/botão de magia ao `cast()`;
- animações por estado;
- reação visual de hit/death;
- loot físico e respawn/checkpoints;
- colliders mais precisos e profiling mobile.
