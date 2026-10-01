# v40 — World Systems & Release Hardening

## Produção
- EntityCulling com distância escalada pelos perfis Lite/Balanced/High.
- CollisionRegistry separa obstáculos, triggers e semântica do mundo.
- Checkpoint inicial ligado a trigger real.
- SaveValidation protege contra saves incompletos/corrompidos.
- RuntimeHealth acumula amostras de QA e erros para diagnóstico.
- Release smoke test cobre WebGL, localStorage, áudio, Pointer Events e RAF.

## Filosofia
Esta versão reduz riscos de release sem adicionar peso gráfico desnecessário.
Todos os sistemas e assets da v39 foram preservados.
