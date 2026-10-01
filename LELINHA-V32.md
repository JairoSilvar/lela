# v32 — Physics & AI Foundation

## Física / personagem
- Gravidade controlada no modo terrestre.
- Ground clamp e estado grounded.
- Character collider simplificado.
- Proxies de colisão por região, baratos para mobile.
- Estrutura pronta para trocar proxies por colliders derivados dos modelos.

## IA
- Máquina de estados base: idle, patrol, alert, chase, attack e flee.
- Perfis neutral, passive e hostile.
- Cooldown de ataque para impedir spam.

## Gameplay
- Vida e magia introduzidas como sistema interno.
- Invulnerabilidade curta após dano.
- Regeneração gradual de magia.
- Integração com SFX de impacto da v31.

## Estratégia
Esta versão cria a fundação antes de conectar todos os monstros 3D.
Isso reduz regressões e permite testar física/IA separadamente.
Todos os recursos anteriores foram preservados.
