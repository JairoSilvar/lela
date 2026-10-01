# Lelinha — Benchmark gamer e direção 2026

## Posicionamento
Aventura mágica 3D vertical: dominar a vassoura, descobrir do céu, pousar, explorar a pé, resolver missões e retornar ao voo com novas possibilidades.

## Referências por pilar
- The Pathless: traversal prazeroso, exploração orgânica, landmarks, puzzles e integração de deslocamento ao game loop.
- Sky: Children of the Light: controles touch acessíveis e dois comportamentos de voo (precisão/hover e glider/cruzeiro).
- Alto's Odyssey: fácil de aprender/difícil de dominar, combos, objetivos, biomas, Zen e Photo Mode.
- Quidditch Champions: vassouras com atributos, progressão e estilos de pilotagem.
- Little Witch in the Woods: fantasia cotidiana de bruxa, exploração, moradores, enciclopédia, crafting e vassouras.

## Padrões de produto
1. Movimento precisa ser divertido antes de adicionar conteúdo.
2. Poucos controles visíveis; ações contextuais.
3. 60 FPS como alvo moderno, 30 FPS estáveis em hardware fraco.
4. Qualidade adaptativa, frame pacing, budgets de draw calls/triângulos/áudio.
5. Acessibilidade: sensibilidade, inverter Y, assistência, tamanho/opacidade dos controles, redução de camera shake e haptics configuráveis.
6. Feedback multimodal: visual + áudio + haptic para ações importantes.
7. Retenção por mastery e conteúdo, não por fricção: ranks, ghost, desafios, segredos, missões e desbloqueios.
8. Mundo denso e memorável em vez de mapa enorme e vazio.

## Roadmap de ponta a ponta
- v9: Equipment & Challenge — vassouras com perfis, Time Trial, ghost local.
- v10: Controls & Accessibility — remapeamento, gamepad, haptics, presets, assistência.
- v11: Living World — clima, dia/noite, criaturas, áudio ambiental e landmarks.
- v12: Mission Depth — NPCs, diálogos, puzzles, missões híbridas e escolhas leves.
- v13: Magic & Progression — feitiços, builds, crafting enxuto, Grimório/Bestiário.
- v14: Cinematic Adventure — rival, bosses não-letais, eventos in-engine, narrativa ambiental.
- v15: Gamer Polish — Photo/Zen, PWA, loading/streaming, telemetria local de performance, bateria QA.

## Critérios de qualidade
Nenhuma versão remove recursos existentes. Toda mudança deve ser testável isoladamente. Controles mobile devem permanecer limpos. Voo e câmera têm prioridade sobre quantidade de conteúdo. Save deve ser versionado e tolerar dados antigos. Áudio nunca deve sobrepor faixas por erro de estado. O jogo deve continuar publicável como site estático na Vercel.
