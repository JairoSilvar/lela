# Assets e licenças

Arquivos obtidos em 29/09/2026. Os modelos abaixo são recursos reais glTF 2.0 carregados pelo GLTFLoader, não substitutos geométricos do personagem/cenário.

| Recurso | Autor e fonte | Licença | Uso/adaptação |
|---|---|---|---|
| Chibi Witch (`witch.glb`) | AliceCassie — https://poly.pizza/m/dKexfKQOOl | CC0 1.0 | Bruxa principal e 4 NPCs. Modelo estático: pose dos braços/pernas, cor do vestido, escala e orientação adaptadas por código. |
| Witch Broom (`broom.glb`) | MiniPoly — https://poly.pizza/m/gwE8397gO3 | CC0 1.0 | Vassoura de todas as bruxas. Escala, rotação e acabamento ajustados. |
| Halloween Bits 1.0 | Kay Lousberg / KayKit — https://github.com/KayKit-Game-Assets/KayKit-Halloween-Bits-1.0 | CC0 1.0 | Árvores, abóboras, lanternas, cripta, lápides, arco e santuário. Árvores coníferas tingidas de verde-azulado. |
| Three.js 0.170.0 + GLTFLoader, BufferGeometryUtils, SkeletonUtils | Three.js contributors — https://github.com/mrdoob/three/tree/r170 | MIT | Motor 3D e importação de modelos. |
| Terreno, pedras, vegetação complementar, cogumelos, lua, anéis, brilhos e partículas | Criados para este projeto | Incluídos com o projeto | Geometria procedural. (Os efeitos sonoros e a trilha NÃO são procedurais: ver a seção "Áudio" abaixo.) |

Os arquivos glTF KayKit utilizados: `tree_dead_large`, `tree_dead_medium`, `tree_pine_orange_large`, `tree_pine_yellow_large`, `pumpkin_orange_jackolantern`, `pumpkin_orange_small`, `lantern_standing`, `crypt`, `gravestone`, `arch` e `shrine`, com buffers `.bin` e atlas `halloweenbits_texture.png`. `candle_triple` está incluído/carregado para expansão, mas não foi instanciado no cenário desta versão.

CC0 permite copiar, modificar e redistribuir, inclusive comercialmente. As duas páginas de Poly Pizza identificavam explicitamente os modelos como “Public Domain (CC0)” e `Licence: CC0 1.0`. Os metadados de origem e hashes dos arquivos estão em `assets/manifest.json`. Não foram usados assets pagos nem Poly Haven.

- Texto original da licença KayKit: `assets/KayKit-LICENSE.txt`.
- Texto original da licença Three.js: `vendor/THREE-LICENSE.txt`.
- CC0: https://creativecommons.org/publicdomain/zero/1.0/
- Texto legal CC0: https://creativecommons.org/publicdomain/zero/1.0/legalcode

O código específico deste protótipo pode ser usado e modificado pelo solicitante. As licenças de terceiros acima acompanham os respectivos recursos.

## Texturas recuperadas na v44

- Fantasy Town Kit — Kenney, CC0: https://kenney.nl/assets/fantasy-town-kit
- Modular Dungeon Kit — Kenney, CC0: https://kenney.nl/assets/modular-dungeon-kit

As texturas `Models/GLB format/Textures/colormap.png` dos pacotes oficiais foram incluídas nos caminhos esperados pelos GLBs originais. As licenças dos pacotes estão nas respectivas pastas de assets. Nenhum modelo da v43 foi substituído.

## Estado da documentação de autoria (revisão v46)

Esta seção separa o que está comprovado pelos arquivos de licença incluídos no pacote do que **ainda precisa ser documentado antes de qualquer publicação**. Nada abaixo foi presumido como licenciado.

### Comprovado por arquivo de licença no pacote
- **Personagem e roupas** (`assets/characters/lelinha/`): licenças Quaternius em `assets/licenses/Quaternius_BaseCharacters_License.txt` e `Quaternius_Outfits_License.txt` (CC0 1.0). Na v46 a textura do figurino é recolorida em tempo de execução (`src/hero-recolor-v46.js`); os arquivos originais não são alterados.
- **Kenney** (Fantasy Town Kit, Modular Dungeon Kit, Nature, partículas): CC0, com `LICENSE.txt` nas pastas de `assets/kenney/`.
- **Efeitos sonoros** (`assets/audio/sfx/`): textos de licença/fonte em `assets/audio/licenses/` (Kenney RPG Audio, 80 CC0 RPG SFX, TinySized SFX).

### PENDENTE — sem fonte nem licença registradas no pacote
- **Trilha sonora** (`assets/audio/music/menu.mp3`, `fase-1.mp3`, `fase-2.mp3`, `fase-3.mp3`, ~13 MB): autor, fonte e licença não estão documentados. Preencher antes de publicar.
- **Animações** `assets/animations/UAL1_Standard.glb` e `UAL2_Standard.glb`: o nome sugere a Universal Animation Library, mas não há arquivo de licença no pacote. Confirmar a origem e incluir o texto da licença.
- **Criaturas** (`assets/creatures/Deer`, `Bat`, `Ghost`, `Cyclops`.gltf): sem metadados de autoria nos arquivos e sem licença no pacote.
- **Ambiente** (`assets/environment/*_FirstAge*.gltf`: TownCenter, Houses, WatchTower, Windmill): idem.

Cada item acima deve ganhar uma linha na tabela principal (autor, URL de origem, licença) e o texto da licença em `assets/licenses/`.
