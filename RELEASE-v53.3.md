# Halloween Rosa — Lelinha v53.3 · Mobile & PC Hardening

Base: v53.2 (pausa scrollável + touch/PC).

## Novidades

### Mobile
- `viewport` com `maximum-scale=1` e `user-scalable=no` (menos zoom acidental).
- `body` fixo + `overscroll-behavior:none` (página não “puxa” ao jogar).
- Bloqueio de gestos de pinch do Safari (`gesturestart`…).
- Previne double-tap zoom em canvas/controles.
- HUD mais compacto; em telas &lt;400px a caixa de missão some para priorizar o voo.
- `visualViewport` resize/scroll → `resize()` (barra de endereço some/aparece).
- Safe-area e alvos de toque herdados da 53.2.

### PC
- Clique **fora** do painel de pausa (no fundo escuro) → Continuar.
- Clique **dentro** do painel não fecha.
- Na pausa, botões Continuar / Recomeçar / Menu em **linha** em telas largas.
- Cursor crosshair no canvas; default quando pausado.

### Preservado
- Pausa com cabeçalho + scroll + rodapé fixo (Menu principal sempre visível).
- Áudio sem serra (53.1).
- Sky Traffic estável (52).
- Soft-lock, ATACAR, ZEN/PHOTO, hit feedback.

## Rodar
```
npm start
# http://localhost:4173
```

## Checklist
1. Celular: jogar sem zoom da página; pausa rola e Menu principal embaixo.
2. PC: Esc → clique no fundo escuro retoma; botões da pausa lado a lado.
3. Subir/descer do céu 3× sem estado residual.
