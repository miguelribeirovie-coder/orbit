# 9. Publicar (Vercel)

## A pasta pronta

`npm run vercel:pasta` faz o build e copia **só o site final** para `../<projeto>-vercel`:
HTML, CSS, JS, imagens, `vercel.json` (segurança + cache) e um `LEIA-ME.txt`. Material de referência
local (ex.: `public/_ref`) fica de fora.

**Regra:** toda alteração no site termina com `npm run vercel:pasta`, para a pasta sempre ter a versão
mais nova. Avise o cliente que a pasta foi atualizada.

## Subir

- Pelo terminal, dentro da pasta: `npx vercel` (prévia) e `npx vercel --prod` (no ar).
- Pelo GitHub: suba o conteúdo da pasta num repositório e importe na Vercel com
  *Framework Preset: Other*, *Build Command* vazio, *Output Directory* vazio.
- Alternativa: importar o projeto-fonte com `vercel.json` de build (`npm run build`, saída `dist/client`).

## Antes de publicar

- Preencher contatos reais em `src/content.ts` (WhatsApp/Instagram/e-mail) e o endereço do site.
- Quando houver domínio: `<link rel="canonical">`, `og:url` e `og:image` no `index.html`.
- `npm audit --omit=dev`, build sem erro, teste da CSP sem erros no console.
