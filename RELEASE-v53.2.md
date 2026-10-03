# Halloween Rosa — Lelinha v53.2 · Mobile & PC UI

Base: v53.1 (áudio limpo) + v52 (estabilidade Sky Traffic).

## Correções desta versão

### Pausa (PC e celular) — o bug das capturas
- Painel **centralizado** (não mais meia tela cortando o título).
- Estrutura em 3 partes:
  1. **Cabeçalho** fixo (título)
  2. **Área com scroll** (sensibilidade, volumes, qualidade…)
  3. **Rodapé fixo**: Continuar voo · Recomeçar · Menu principal
- Labels completas (“Sensibilidade vertical” não corta mais).
- Safe-area (notch / home indicator) respeitada.

### Touch (celular)
- Colunas primária / secundária (ATACAR, MAGIA, TURBO, AÇÃO).
- Escala e opacidade via CSS variables (`--control-scale`, `--control-opacity`).
- Layout canhoto inverte joystick e botões.
- Alvos mínimos ~44px no header.

### Desktop (PC)
- Controles touch ocultos com ponteiro fino.
- Dicas de teclado visíveis na pausa.
- Esc continua / fecha pausa (já existente).

### Áudio (herdado v53.1)
- Sem pad contínuo tipo “serra”.
- Vento suave, ambient mais baixo (slider default 18).

### Estabilidade (herdado v52)
- Sky Traffic sem vazamento.
- Céu→terra com histerese.
- Guards e background.

## Como rodar
```
npm start
# http://localhost:4173
```

## Checklist rápido
**PC:** Esc → painel central com Menu principal visível → Continuar.  
**Celular:** pausa → rolar opções → botões sempre embaixo → ATACAR no voo.
