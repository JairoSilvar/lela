# QA v46 — o que foi e o que NÃO foi validado

## Executado (Chromium headless, WebGL por software, sem GPU)
- Sintaxe de todos os `.js`/`.mjs` (`node --check`) e grafo de imports: sem referências quebradas; `juice-v46.js` e `hero-recolor-v46.js` alcançáveis a partir de `main.js`.
- Suíte `?qa` embutida: **47/47** (janela 480×270), console sem erros, nenhuma resposta HTTP ≥ 400. Resultado em `qa/v46-integration-results.json`.
- Node: storage 4/4, gameplay 3/3, auditoria de assets (191 referências, 0 falhas, 0 externas).
- Servidor: 200, 206 (bytes conferidos contra o arquivo), sufixo `bytes=-500`, 416, traversal (404), 404; o navegador recebe 206 para o MP3.
- Comparação visual v45 × v46 da heroína: `qa/v46-heroina-v45-esquerda-v46-direita.png`.

## Ressalvas
- Em 1280×720 com render por software, o teste "Movimento e subida no loop real" excede seu timeout de 5 s de relógio (a simulação avança em câmera lenta). Isolado, o movimento funciona. Não é evidência de regressão, mas também não foi reproduzido em GPU.
- Medições de draw calls/triângulos (≈418–468 / ≈207k) são do ambiente de teste e só indicativas.

## NÃO validado
- Celular físico, Safari/iOS, GPU real, FPS sustentado, deploy no Vercel, sessão longa com jogador humano.
- Colisão do palácio em voo: os colisores seguem o mesmo formato dos já testados (troncos) e as dimensões foram conferidas contra a geometria, mas ninguém voou contra o castelo.
- Linhas de velocidade/pulso em movimento: o código foi carregado sem erros, mas a aparência animada não foi inspecionada em tela real (o render por software não tem fluidez para julgar).
- Licenças da trilha, animações UAL, criaturas e ambiente (ver `CREDITOS.md`).
