# Halloween Rosa — Lelinha v53 · Stable Juice

Base: **v52 Stability Fixes** (sem reabrir vazamento de Sky Traffic).

## O que entra

1. **Feedback de combate (da linha 48.2)**  
   - Números flutuantes de dano  
   - Crítico dourado no boss / ✦ na morte  
   - Shake leve de câmera  
   - Callback `onHit` no `CreatureCombatV35`

2. **ZEN / PHOTO profundos**  
   - ZEN esconde missão, mapa, combo, HUD gamer, brand  
   - PHOTO limpa tela para captura  

3. **Céu → terra com histerese**  
   - Camada celeste **entra** em y>24 e **sai** em y<20  
   - Evita flicker na fronteira e garante `visible=false` + limpeza de hints ao descer  

## O que NÃO mexe (preservado da v52)

- Dispose correto de `SkyCompanionsV49` em start/troca de fase  
- Guards G/GC e recovery  
- visibilitychange / áudio em background  
- Otimizações de `flight.js`  
- Testes browser de leak/resilience  
- Buggy, Cyclops telegrafado, soft-lock, touch primário/secundário, pausa scrollável  

## Como validar

```
npm start
# http://localhost:4173
npm run test:all
npm run test:browser   # se tiver Playwright
```

Checklist humano:
1. 5× subir ao céu e descer — cenário terrestre idêntico todas as vezes  
2. Atacar Cyclops — números + tremor  
3. Z e P — HUD some como esperado  
4. Reiniciar 5× — um único grupo Sky Traffic  


## v53.1 — Audio hygiene

Corrigido ruído de fundo tipo “serra” / loop estranho:

1. **Removido pad contínuo** de 3 osciladores em `effects.js` (110 / 165 / 220 Hz ligados o tempo todo com Som: on).
2. **Vento procedural** passou de ruído branco agressivo para ruído rosa + lowpass mais grave e ganho menor.
3. **phaseOsc** não empilha mais ao trocar de fase; ganho reduzido.
4. **Ambient** com volume máximo limitado; default mais baixo.
5. Cooldown em land / wood para não repetir em rajada; passos mais espaçados.

Se ainda ouvir algo estranho: baixe o slider **Ambiente** na pausa ou desligue Som e religue (recria o grafo limpo).
