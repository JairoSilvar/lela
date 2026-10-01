# v22 — Living Atmosphere Pass

## Visual
- Partículas ambientais específicas por região.
- Floresta/Vila usam motes mágicos suaves; Castelo ganha tonalidade quente/etérea.
- Wisps flutuantes em Médio/Alto.
- Quantidade reduzida automaticamente no perfil Baixo.
- Camada acompanha discretamente a área do jogador sem inundar o mundo.

## Áudio
- Identidade tonal procedural diferente para Floresta, Vila e Castelo.
- Mantidos vento dinâmico, decolagem/pouso, Perfect Ring, passos, magia e UI.
- Estrutura `worldCue` preparada para criaturas/eventos com atenuação simples.

## Acessibilidade/performance
- Respeito a `prefers-reduced-motion`.
- Perfil gráfico Baixo reduz VFX e continua sem sombras caras.
- Nenhum pacote adicional necessário.
- Recursos v1–v21 preservados.
