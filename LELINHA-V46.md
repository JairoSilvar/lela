# Halloween Rosa — Estrelando Lelinha v47

Base: v45 Mundo Rosa. Passe de **legibilidade visual, sensação de velocidade, colisão do castelo e higiene do pacote**. Nenhum sistema da v45 foi removido.

## O que mudou

### Visual
- **Heroína deixa de ser uma silhueta preta.** Causa raiz: a textura do figurino (`T_Ranger_BaseColor.png`) tem RGB médio ~(66,65,37) e a v45 a multiplicava por roxo, o que resulta em quase preto. Agora `src/hero-recolor-v47.js` remapeia a *luminância* da textura para uma paleta violeta → magenta → rosa (preservando dobras e costuras) e adiciona leve auto-iluminação. Se o canvas/`getImageData` não estiver disponível, cai na tinta antiga. Arquivos de asset originais intactos.
- **Terreno com manchas de cor** (clareiras, solo mais claro/escuro) em vez de ruído por vértice uniforme. Mantém exatamente 2 chamadas de `rng()` por vértice, então a geração determinística do mundo não muda.
- **Câmera desktop mais próxima** (distância 10,5→9,3; turbo 13,5→12,4; altura 3,6→3,4): a heroína ocupava ~8% da altura da tela. Mobile inalterado.

### Sensação de velocidade (`src/juice-v47.js`, só CSS)
- Vinheta suave, linhas de velocidade radiais proporcionais à velocidade/turbo e pulso rosa ao ligar o turbo.
- Respeita `prefers-reduced-motion`, o ajuste de movimento do jogador e "reduzir flashes"; some no menu e no modo foto.

### Jogabilidade
- **O palácio rosa deixa de ser atravessável**: 5 colisores cilíndricos (corpo + 4 torres) registrados nos três pontos em que o mundo é construído (início, troca de região, restauração de save).

### Infraestrutura
- `server.mjs`: **HTTP Range (206/416)**, `Accept-Ranges`, mais tipos MIME (`.webp`, `.jpg`, `.txt`, `.md`), `HEAD`. Verificado: o navegador passa a receber 206 para o MP3.
- `CREDITOS.md`: corrigida a afirmação de que o áudio é procedural/sem material externo e adicionada a seção "Pendente de documentação" (trilha, animações UAL, criaturas, ambiente).
- `MANIFEST-SHA256.json` regenerado (estava com os hashes da v44); `package.json` em 46.0.0 com scripts de teste.
- Diagnóstico `__flightDiagnostics()` agora inclui `boosting`.

## Não alterado de propósito
- A dica de controles ("↑/↓ muda a altura…") dura 3 s de **tempo de jogo**; só parece permanente em renderização por software lenta. Não foi tratada como bug.
- Dois chips fixos no topo central (clima e feitiço) permanecem; avaliar com playtest em celular antes de mexer.
