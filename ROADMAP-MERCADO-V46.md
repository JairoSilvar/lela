# Roadmap para nível de mercado — avaliação sênior (v46)

Avaliação franca: a v46 melhora legibilidade e sensação de voo, mas **não equivale a um jogo de mercado**. Abaixo, o que separa o projeto desse patamar, em ordem de retorno sobre esforço. Itens marcados [feito] entraram na v46.

## 1. Medir antes de otimizar (bloqueia tudo o resto)
- Perfilar em 2–3 aparelhos Android reais (baixo/médio) e 1 iPhone: FPS sustentado 15 min, temperatura, bateria. Hoje só há medição em render por software.
- Meta de orçamento: ≤250 draw calls e ≤150k triângulos em mobile médio (hoje ~410 draw calls / ~207k tri em desktop de teste).
- Perda/restauração de contexto WebGL testada de verdade (hoje só há tela de recuperação).

## 2. Legibilidade e identidade visual
- [feito] Heroína legível (era preta). Próximo: luz de contorno (rim) por camada própria e contorno/outline sutil; revisar o laranja da vassoura/chama, que domina a cena.
- Terreno: [feito] manchas de cor. Próximo: vegetação rasteira instanciada (grama, flores emissivas), caminhos, água com reflexo/espuma. Hoje os "espinhos" escuros são o único detalhe de chão.
- Pós-processamento: bloom leve nas essências/anéis/feitiços e correção de cor por região (exige EffectComposer; medir custo em mobile antes).
- Modelos da Vila (Kenney) aparecem como volumes escuros em parte dos ângulos: revisar materiais/iluminação.

## 3. "Game feel" (o que mais separa protótipo de produto)
- [feito] Linhas de velocidade, vinheta e pulso de turbo.
- Hit-stop e tremor de câmera em acertos; flash de dano; números de dano; som de acerto por tipo.
- Coleta de anel/essência com sequência de áudio ascendente (combo audível) e partículas que voam até o HUD.
- Animações de transição (decolar, pousar, virar) com anticipation/follow-through.

## 4. Onboarding e retenção
- Tutorial por etapas contextuais (hoje: uma dica de 3 s).
- Metas de curto prazo (3 min), médio (sessão) e longo (cosméticos/vassouras); desafios diários; tela de resultado com recompensas claras.
- Telemetria opt-in para saber onde jogadores abandonam.

## 5. Conteúdo e profundidade
- Variedade de inimigos/comportamentos além de Cyclops/Ghost/Bat; mini-bosses; eventos dinâmicos por região.
- Ciclo de progressão com escolhas (árvore de feitiços), não só números.

## 6. Áudio
- Mixagem por ducking (música baixa em diálogo/combate), música adaptativa por intensidade. [Pendente jurídico] documentar licença de toda a trilha antes de publicar.

## 7. Produção e publicação
- PWA/offline, carregamento progressivo (hoje ~15,7 MB de animações antes de liberar o botão), compressão de texturas (KTX2/Basis) e geometria (Draco/meshopt): reduz download e VRAM em mobile.
- Testes automatizados de combate/boss/save em CI; matriz de navegadores.
- Remover ou integrar os módulos de release que hoje só são instanciados (FairPlayV42, BalanceV41, SessionQAV41, InputRouterV41) e o `release-smoke-v40.js` órfão.
