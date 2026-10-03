# Halloween Rosa — Lelinha v52 · Stability Fixes

Revisão sênior da v51 → correções P0/P1 aplicadas e **verificadas em Chromium real** (não só por regex no código).

## Corrigido
1. **Vazamento de Sky Traffic (P0).** `start()` criava `SkyCompanionsV49` sem descartar o anterior, e o ramo de troca de fase descartava o objeto recém-criado.
   Medido na v51 (5 reinícios): 1 → 6 grupos de bruxas NPC, meshes 567 → 872, geometrias 202 → 508. Na v52: 1 grupo, 567 meshes, 203 geometrias, estável, inclusive após trocar de fase.
2. **Ciclo de vida em segundo plano.** `visibilitychange` agora pausa a partida, salva, suspende música e `AudioContext`; ao voltar retoma o áudio (o jogo continua pausado até “Continuar”).
3. **Isolamento de falhas por subsistema.** `G()` (auxiliares: desativa o sistema após 20 falhas, só na sessão) e `GC()` (núcleo de voo/render: nunca desliga; após 120 falhas pausa com tela de recuperação). `window.__guardReport()` mostra contagens. O handler global só pausa em rajada (≥3 erros em 3 s), não no primeiro erro.
4. **Controlador de qualidade único.** `PerformanceGovernor` e `AdaptiveQualityV33` saíram do loop (o resultado de ambos era descartado). Quem decide é a escala de resolução automática do `main.js`, que agora só reage durante jogo ativo.
5. **Custo por frame.** `flight.js`: sem `matchMedia` por frame, sem ~10 alocações de `Vector3` por frame, colliders distantes descartados por distância² antes do `hypot`; `qualityRuntime()` a ~10 Hz; `?qa` lido uma vez. Correção e física independentes de framerate (empurrão de colliders e correção de chão usavam fator fixo por frame).
   Micro-benchmark `flight.update` (408 colliders, desktop headless): 55,5 µs → 46,7 µs. O ganho maior esperado é menos coleta de lixo no celular, **ainda não medido em aparelho**.

## Testes novos (comportamentais, navegador real)
- `tests/browser-session-leak.py` — 8 verificações: reinícios e trocas de fase não aumentam cena/GPU; Sky Traffic único.
- `tests/browser-resilience.py` — 10 verificações: segundo plano, subsistema quebrado, falhas no núcleo, reset por sessão, erro isolado vs rajada.
- Rodar: `npm run test:browser` (requer Python + Playwright com Chromium). Os testes de regex da v51 continuam, mas **não** substituem estes.
- Hooks de QA (só com `?qa`): `window.__qa` e `get()` expõe `scene`, `skyCompanions`.

## Resultado
`npm run test:all` 10/10 · `test:browser` 18/18 · sintaxe dos 92 módulos ok.

## Limitações / não feito
- Renderização por software (headless): serve para lógica e vazamentos, **não** para FPS. Falta playtest em celular real.
- Não tocado: licenças pendentes (trilha, UAL1/2, criaturas, ambiente), código morto (LOD/culling/scheduler/FairPlay/BalanceV41 ainda instanciados sem uso; `performance-governor.js` e `adaptive-quality-v33.js` agora órfãos), carga paralela/poda das animações, cache/`.vercelignore`, `MANIFEST-SHA256.json` (desatualizado).
