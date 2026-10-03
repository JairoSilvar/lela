# Halloween Rosa — Lelinha v53.4 · Menu + Touch limpos

## Problemas que você reportou
1. Difícil voltar ao **menu principal** na pausa.
2. Botões do celular **atrapalham a visão** do jogo.

## Correções

### Pausa / Menu principal
- **Continuar**, **Menu principal** e **Recomeçar** ficam no **topo** do painel (primeira coisa que se vê).
- Não é preciso rolar para achar o Menu principal.
- IDs únicos (sem botões duplicados que quebram o clique).
- Clique no fundo escuro ainda retoma no PC.

### Touch minimalista
- Só **3 botões** principais à direita:
  - **✦** atacar/magia
  - **TURBO**
  - **POUSAR / AÇÃO** (contextual)
- Controles extras (MAGIA, CAM, MODO, VISÃO) atrás do botão **···**
- Joystick e botões mais **transparentes** e menores
- Removidos ▲▼ (o stick já sobe/desce)
- Opacidade padrão ~68% (menos parede na tela)
- Info de velocidade movida para o **topo**, não compete com o stick

## Rodar
```
npm start
```
Publique no Vercel e use Ctrl+Shift+R.
