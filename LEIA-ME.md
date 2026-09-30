# Halloween Rosa — Lelinha Bruxa Encantada

**Identidade visual atual:** protótipo rebrandado com a paleta rosa / roxo / dourado inspirada em *Halloween Rosa — Estrelando Lelinha Bruxa Encantada*.

O núcleo de voo, ritual de 90 segundos e exploração livre permanece o mesmo. A personagem 3D ainda usa o modelo genérico Chibi + vassoura; a identidade “Lelinha” está na interface, textos, cores de cena e efeitos.

---

# Halloween Rosa — Protótipo de Voo (Lelinha)

Primeira versão jogável da Floresta dos Sussurros. Jogo 3D estilizado com modelos GLB/glTF locais. Ritual de 90 segundos e exploração livre depois do resultado. Não é a Fase 1 definitiva de 6–10 minutos.

## Abrir no Windows

1. Extraia o ZIP inteiro.
2. Com Node.js 20 ou mais recente instalado, abra `INICIAR.bat`.
3. O jogo abre em http://localhost:4173. Mantenha a janela do servidor aberta enquanto joga.

Alternativa: execute `node server.mjs` ou `npm start` na pasta do projeto. Nenhuma instalação de dependências é necessária. Não abra `index.html` diretamente por `file://`: os navegadores bloqueiam o carregamento dos módulos/modelos nesse modo.

Em celular/tablet, use um endereço HTTP servido pelo computador na mesma rede, ou hospede a pasta como site estático. O firewall/rede precisa permitir acesso à porta 4173. O projeto também pode ser publicado em um serviço de hospedagem estática, incluindo Vercel, sem etapa de compilação. Nenhuma publicação foi realizada nesta entrega.

## Controles

| Ação | PC | Celular/tablet |
|---|---|---|
| Virar livremente | A / D | Direcional para os lados |
| Acelerar / frear até parar | W / S | Direcional para cima / baixo |
| Subir / descer | ↑ / ↓ ou E / Q | Botões ↑ / ↓ |
| Turbo | Segurar Shift | Segurar TURBO |
| Pulso de magia | Espaço | Botão ✦ |
| Pausa | Esc ou Ⅱ | Botão Ⅱ |
| Tela cheia | F ou ⛶ | ⛶ |
| Som | M | Botão Som |
| Voltar à clareira | R | Recomeçar ritual na pausa |

A bruxa mantém um voo de cruzeiro quando o acelerador está neutro. É possível frear, virar em qualquer direção, subir, descer e sair da trilha. Não é um endless runner. O pulso atrai essências a até 13 metros e tem recarga de 1,5 segundo.

## Novidades desta build (Floresta Encantada v1 — núcleo)

- **Física de voo:** mergulho ganha velocidade; subida forte e curvas fechadas reduzem velocidade.
- **Perfect Flight:** voar rente a obstáculos sem colidir gera bônus de essência.
- **Anéis em alturas variadas** e atalhos internos na rota.
- **Rio da Lua** e marcadores das 3 regiões (Floresta Profunda, Rio da Lua, Ruínas da Academia).
- `INICIAR.bat` encerra automaticamente servidor anterior na porta 4173.

## Implementado

- Bruxa Chibi e vassoura GLB reais; pose de voo adaptada do modelo estático.
- Câmera de perseguição amortecida, inclinação nas curvas e aumento suave do campo de visão no turbo.
- Voo livre, limite de altura e borda suave do mapa.
- Colisões simplificadas com troncos, pedras, construções e solo; reduzem velocidade e afastam a bruxa sem morte.
- 18 anéis, 54 essências, pontuação, bônus por rasante, energia de turbo e pulso coletor.
- Ritual de 90 segundos, resultado, reinício e exploração sem limite de tempo após o ritual.
- 4 bruxas NPC em trajetórias circulares com variação de altura.
- Floresta densa com quatro variantes de árvores KayKit, cemitério, cripta, arco, santuário, abóboras e lanternas.
- Lua, estrelas, névoa de distância, luzes direcionais, brilhos, cogumelos, vegetação e partículas.
- Minimapa no PC; interface responsiva com direcional multitoque.
- Som sintetizado opcional, ligado pelo botão de som ou pela tecla M.
- Recorde local do melhor ritual, estatísticas finais e indicador visual de turbo pronto.
- Modo de tela cheia pelo botão ⛶ ou pela tecla F.
- Malhas instanciadas, materiais/geometrias compartilhados e partículas reaproveitadas. Qualidade automática reduz resolução quando os quadros ficam lentos; opções Alta e Leve na pausa.

## Limites desta versão

Visual low-poly estilizado, sem fotorealismo. A personagem original não tem esqueleto/animações: a pose foi adaptada nos vértices, com inclinação do conjunto em voo. NPCs seguem trajetórias, sem inteligência de combate. As colisões usam volumes aproximados, não a malha detalhada; a câmera encurta a distância diante de volumes aproximados, mas pode ter oclusões em copas densas; anéis não bloqueiam a câmera. Não há sombras dinâmicas, bloom por pós-processamento ou LOD de malha por distância. Pedras, grama, cogumelos e efeitos são procedurais. Não há salvamento de campanha ou multiplayer.

## Organização para expansão

- `src/assets.js`: carregamento, normalização e montagem da bruxa/vassoura.
- `src/world.js`: cenário, trajetória, NPCs e colecionáveis.
- `src/flight.js`: voo, câmera e colisões.
- `src/input.js`: teclado, ponteiros e direcional.
- `src/effects.js`: partículas e áudio.
- `src/main.js`: estados do jogo, regras do ritual, HUD e qualidade.
- `assets/`: modelos e texturas locais.
- `vendor/`: Three.js e utilitários locais, versão 0.170.0.
- `tests.html` e `tests/checks.js`: verificações reproduzíveis no navegador.

Consulte `CREDITOS.md` para autoria/licenças e `TESTES.md` para o que foi verificado. Todos os recursos necessários ao jogo estão incluídos; não há chamadas a CDN em tempo de execução.

