# Músicas — Mobile v3

A trilha está em `assets/audio/music/` e o mapeamento em `src/music.js`.

- `menu.mp3` — menu principal
- `fase-1.mp3` — Floresta Encantada
- `fase-2.mp3` — Vila de Halloween
- `fase-3.mp3` — Castelo da Lua

Cada faixa toca em loop enquanto o jogador permanece no respectivo contexto. Ao trocar de fase ou voltar ao menu, a faixa anterior é interrompida antes da próxima começar.

Em navegadores móveis, a música começa após a primeira interação do usuário, conforme as regras de autoplay. O botão **Música** liga/desliga a trilha, e o controle de volume fica no menu de pausa.

## Adicionar outras músicas
Copie o novo arquivo para `assets/audio/music/` usando nome simples (sem espaços/acentos) e registre o caminho em `MUSIC_TRACKS`, no arquivo `src/music.js`.
