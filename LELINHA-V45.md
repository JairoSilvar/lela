# Halloween Rosa — Estrelando Lelinha v45

## Passe Mundo Rosa + jogabilidade

- Vassoura agora é um mount controlável por estado. No pouso ela desmaterializa suavemente em vez de ficar atravessando/grudada na personagem; na remontagem reaparece rapidamente antes do voo.
- Reset garante o estado correto da vassoura no voo.
- Removida a exibição dos óculos procedurais duplicados que podiam aparecer deslocados/flutuando; o sistema permanece preservado para ajuste futuro sem interferir no modelo principal.
- Novo landmark `MundoRosaPalace-v45`: castelo rosa visível como referência espacial, com torres, telhados e portal.
- Nova alameda cerimonial rosa ligando a região de jogo ao castelo.
- Jardins em camadas com árvores floridas rosas para dar foreground/midground e profundidade ao cenário.
- Paleta da Floresta Encantada aproximada do Mundo Rosa: névoa rosa/lilás, árvores rosa/magenta e água turquesa contrastante.
- Vila de Halloween passa a manter a identidade rosa/roxa em vez de abandonar a linguagem do Mundo Rosa.
- Mantidos os sistemas existentes de voo, solo, combate, magia, criaturas, progressão, desafios, áudio, HUD, touch e fases.

## Validação local executada

- `node --check` em todos os módulos de `src/` e testes: aprovado.
- Auditoria estática de referências locais relativas: sem referências ausentes detectadas.

## Observação de QA

Esta entrega foi produzida diretamente no chat. A validação disponível aqui cobre estrutura/sintaxe e referências locais; não deve ser confundida com uma sessão manual completa de gameplay em navegador real/dispositivo físico.
