# Verificação — 29/09/2026

Executado no navegador integrado do Codex, carregando os arquivos pelo servidor HTTP local.

## Verificações automatizadas em navegador

24/24 passaram, sem erros ou avisos no console no momento da consulta:

- Carregamento dos 14 modelos locais e renderização WebGL 2.
- Entradas neutras finitas; teclado simultâneo; pulso por pressionamento; liberação das teclas ao perder foco.
- Eventos simulados do botão touch e cancelamento. O teste simulado substitui apenas a captura do ponteiro; não equivale a um teste físico multitoque.
- Movimento, subida, descida, curva, turbo, consumo e recuperação de energia.
- Reação ao solo, tronco e borda do mapa; posição finita da câmera.
- Quantidades de anéis/essências/NPCs, instancing e deslocamento dos NPCs.
- Criação/liberação do pulso visual e restauração dos colecionáveis.

Na cena da verificação: 121 chamadas de renderização e 426.222 triângulos. Isso é uma contagem daquela câmera/cena, não uma medição de FPS em celular.

## Verificação da interface

- Menu inicial, início do voo, HUD, coleta de anel e essência e pausa conferidos visualmente.
- Layout conferido em 1280 × 720 e 390 × 844; direcional e quatro botões touch visíveis sem sobreposição crítica.
- Botão de magia touch acionado no navegador e mensagem do pulso confirmada.
- Ritual encerrado em 90 segundos; tela de resultado, continuação em exploração livre e reinício conferidos no navegador.
- Erro inicial de entrada neutra corrigido antes desta entrega.

## Como repetir

Com o servidor aberto, visite http://localhost:4173/tests.html. Os testes importam os mesmos módulos usados pelo jogo e apresentam os resultados na página.

Não foi usado um celular/tablet físico. Não foram medidos consumo de bateria, estabilidade térmica ou compatibilidade com Safari/iOS. O projeto requer navegador moderno com WebGL 2 e suporte a módulos/import maps. Não houve publicação em hospedagem externa.


