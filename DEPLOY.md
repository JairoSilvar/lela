# Deploy — Halloween Rosa / Witches' Flight

## Vercel (recomendado)

1. Suba a pasta do projeto para o GitHub (este diretório inteiro).
2. Em [vercel.com](https://vercel.com): **New Project** → importe o repositório.
3. **Root Directory**: pasta do jogo (onde está o `index.html`).
4. **Framework Preset**: Other (site estático).
5. Deploy. Não precisa de build command nem `server.mjs`.

A URL pública abre direto no PC e no celular.

## GitHub Pages

Settings → Pages → Branch `main` / pasta `/` (ou `/docs` se copiar os arquivos para lá).

## Local

```bash
npx serve .
# ou
node server.mjs
```

## Celular

- Abra a URL do Vercel no navegador do celular.
- Controles: direcional (esquerda) + ↑↓ TURBO ✦ (direita).
- Na **pausa**, ative **Inclinar celular** para virar inclinando o aparelho (iOS pede permissão).
- Use **Tela cheia** (⛶) para melhor experiência.
