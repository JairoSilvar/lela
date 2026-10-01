# Halloween Rosa — Estrelando Lelinha · QA v44

Data: 01/10/2026. Base: ZIP v43 GLTFLoader Hotfix encontrado em Downloads.

**Classificação: candidata consolidada, validada localmente nos casos abaixo. Não plenamente aprovada para produção ou mobile.** Há pendências de cobertura e integração descritas adiante; passar esta suíte não equivale a terminar todo o jogo.

## Resultados executados

| Verificação | Resultado | Evidência / alcance |
|---|---:|---|
| Integração em navegador real Chromium/WebGL | 47/47 | qa/integration-results.json; loop real + estados controlados |
| Regressões históricas de voo/input/render | 24/24 | qa/legacy-results.txt |
| Save inválido, estrutura corrompida, MP zero, storage negado | 4/4 | tests/storage-tests.mjs, executado em Node |
| Progressão das três regiões, equipamento e Time Trial | 3/3 | tests/gameplay-tests.mjs, executado em Node |
| Sintaxe JavaScript | 84 arquivos, zero falhas | qa/syntax-results.json |
| Referências, dependências GLTF/GLB e casing | 189 referências, zero falhas | ASSET-AUDIT-v44.json |
| Arquivos assets/vendor/src via HTTP | 222/222 | qa/http-audit.json; status 200 e tamanho correto |
| Network capturado na sessão integrada | 222 requisições, 0 respostas diferentes de 200 | qa/network-results.json; servidor local |
| Console da rodada integrada | Sem erros ou avisos capturados | exceções também monitoradas pela suíte |
| Ritual real de 90 segundos | Chegou naturalmente ao resultado | qa/long-session.json; voo sem completar os 18 anéis |
| Reload e continuar save pela interface | Posição, 35 essências e exploração restauradas | observação direta; pausa real confirmada |
| Configurações e acessibilidade | Painéis abriram/fecharam; reduzir flashes alternado | observação direta; partículas testadas pela suíte |
| Layout 390 × 844 | Jogo iniciou e controles apareceram | iframe em navegador real; não é aparelho físico |

A suíte integrada carrega Lelinha e 86 animações, 23 modelos Kenney, Deer/Bat/Ghost/Cyclops; exercita voo, subida, pouso/montagem, Lumen/projéteis, cooldown, Aegis, Ventus, Blink, pausa, HP/XP/loot, respawn, Visão Mágica, investigação, restauração de save, reconstrução de regiões, três fases e telegraph/strike/recovery do Cyclops, runas, qualidade e resultado. As verificações do chefe usam HP/posição controlados e chamadas dos métodos reais: não representam uma luta completa vencida manualmente. Carregar 86 animações não comprova inspeção visual de cada clipe.

## Correções principais

- Texturas colormap oficiais dos packs Kenney restauradas com licenças; imports Three/GLTFLoader locais e compatíveis; remoção das sondagens a external/lelinha.glb e external/environment.glb inexistentes.
- Corrigida a referência progressionSystem que interrompia o loop. Recursos de combate, progressão e save conectados ao estado efetivo da partida.
- Pausa congela simulação; reinício e troca de região limpam criaturas, projéteis, loot e HUD. Geometrias compartilhadas dos assets não são destruídas indevidamente.
- Magia respeita custo e cooldown; XP e loot creditados uma vez; criaturas mortas não atacam; Cyclops usa um ciclo de ataque com aviso e dano único.
- Save inclui sessão, missão, inimigos, runas, checkpoint, loot, desafio e pontuação. MP zero preservado e falha de armazenamento indicada sem alegar persistência.
- Fragmento da rival ligado à ação contextual, com recompensa única de 100 essências e estágio persistido.
- Câmera, pouso, colisão e turbo corrigidos; E reservado à ação contextual. Óculos acompanham a cabeça e só são exibidos quando a câmera está à frente; laços e brilhos procedurais que flutuavam sobre a cabeça foram ocultados.
- Joystick flutuante usa coordenadas limitadas à tela e retorna à base visível ao soltar/cancelar; pausa, perda de foco e rotação liberam captura. Modo foto mantém controles e saída acessíveis. Sete regressões específicas passaram, além de arrastar/soltar pelo navegador em layout estreito.
- Menu sai do gameplay; painéis compactos e roláveis, ferramentas fora do botão de pausa, barra do chefe contida no HUD, identificação correta da região.
- Anéis e efeitos ajustados; malhas estáticas agrupadas, runas instanciadas, distância de detalhe/culling, limites de resolução por qualidade e HUD atualizado a 10 Hz.
- Falhas de carregamento e contexto WebGL têm retorno visível. INICIAR.bat não encerra processos alheios na porta utilizada.

## Desempenho medido

Na amostra de 90 frames, qualidade alta, DPR 1,5: mediana 16.8 ms, p95 33.4 ms, 364 draw calls, 205864 triângulos, 156 geometrias e 68 texturas. É uma amostra curta no computador desta sessão, sensível a carga e abas em segundo plano. Não comprova 60 FPS sustentados nem desempenho mobile. A sessão longa teve variação maior. Não há comparação antes/depois controlada que justifique anunciar ganho percentual.

## Limitações e pendências para aprovação plena

1. Deploy Vercel não foi testado: nenhum endereço atual foi disponibilizado/localizado. HTTP local não comprova cache, cabeçalhos, publicação ou comportamento do servidor de produção.
2. Nenhum celular físico, Safari/iOS, multitouch simultâneo, giroscópio, gamepad, vibração, aquecimento, bateria ou sessão longa mobile foi validado. Áudio foi carregado e seus controles exercitados, sem validação auditiva em aparelhos.
3. No wrapper responsivo foi registrado um TypeError de MutationObserver sem URL/stack. A string não existe no código entregue e não apareceu na suíte principal; a origem não foi determinada. Ver qa/mobile-console.json. Não classificamos o Console mobile como integralmente aprovado.
4. A narrativa da rival agora tem cronômetro próprio e fragmento visível coletável pela ação contextual, com teste contra coleta duplicada. Módulos históricos de crafting/inventário/remapeamento permanecem preservados, sem comprovação de integração completa por interface.
5. Culling e redução de detalhe estão ativos; não foi criada uma cadeia de malhas LOD alternativas para todos os modelos. Balanceamento, cobertura de cada obstáculo, todas as animações, migração de todo save antigo e perda/restauração forçada de contexto WebGL exigem testes adicionais.
6. Não houve playthrough humano completo de todas as missões, segredos e finais. A suíte usa cenários controlados para testar os sistemas efetivos, além da sessão natural de 90 segundos.
7. Preservação comprovada contra a v43: nenhum dos 269 arquivos originais removido e todos os 129 assets originais intactos. Isso não prova equivalência com cada versão 1–42, cuja história completa não foi fornecida. Documentos antigos foram mantidos como histórico; suas afirmações de aprovação não substituem este relatório.

## Reproduzir e checklist de regressão

Extraia o ZIP inteiro. Com Node instalado, execute INICIAR.bat ou npm start e abra http://localhost:4173. Não abra index.html diretamente por file://.

- [x] npm run audit — referências locais e casing.
- [x] node tests/storage-tests.mjs e node tests/gameplay-tests.mjs.
- [x] /tests.html — regressões históricas.
- [x] /?qa — clicar Executar regressão v44, aguardar e baixar JSON.
- [x] Iniciar, pausar, retomar, reiniciar, mudar região e restaurar save.
- [x] HP/MP/XP/loot, respawn e fases do Cyclops em cenários controlados.
- [x] Inspecionar interface desktop e layout estreito.
- [ ] Repetir no endereço publicado, com Network/Console preservados.
- [ ] Jogar todas as missões e integrar os fluxos históricos pendentes.
- [ ] Validar celulares Android/iOS com movimento e magia simultâneos.
- [ ] Medir 15–30 minutos por perfil Lite/Balanced/High em aparelhos-alvo.
- [ ] Investigar a ocorrência MutationObserver do wrapper responsivo.

Os testes de QA alteram progresso/saves da origem usada. Execute em uma origem ou perfil separado do seu save pessoal. O painel QA só é carregado com ?qa. O ZIP inclui fonte, dependências locais, assets, testes, licenças e evidências; não inclui node_modules nem exige instalação de pacotes.
