# Spooky Mundo Rosa — Fase 1 v2

## PC / Windows
Não abra o index.html por duplo clique (file://): módulos JavaScript são bloqueados por CORS.
Dê duplo clique em INICIAR_JOGO.bat. Ele abre http://localhost:8080 usando Python.

## Vercel / Git
Projeto estático. Coloque o conteúdo da pasta game na raiz do repositório/site. Não exige build.

## Controles
PC: WASD ou setas; Espaço pula.
Celular/tablet: joystick analógico à esquerda, botão PULAR à direita e arraste no lado direito da tela para mover a câmera. Multitouch, portrait/landscape e safe-area.

## Correções v2
- Incluída assets/graveyard/Textures/colormap.png usada pelos GLB Kenney.
- Incluído T_Eye_Normal_png.png exigido pelo GLTF da Lelinha.
- Corrigido o contador do loading: eram 5 carregamentos reais, mas a v1 esperava 8 e por isso podia ficar presa mesmo com assets carregados.
- Timeout de segurança de 10 s para a tela de loading.
- Controles touch refeitos com joystick analógico e câmera por arrasto.
