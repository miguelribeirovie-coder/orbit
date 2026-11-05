# 8. Segurança

Um site estático (sem servidor, banco ou login) já tem pouca superfície de ataque. O que fazer:

1. **Cabeçalhos** (em `vercel.json`, modelo em `templates/config/vercel.json`):
   - `Content-Security-Policy`: `default-src 'self'`; `script-src 'self' 'sha256-<hash do script embutido>'`;
     `style-src 'self' 'unsafe-inline'` (estilos inline do React); `img-src 'self' data:`; `font-src 'self'`;
     `object-src 'none'`; `base-uri 'none'`; `form-action 'none'`; `frame-ancestors 'none'`; `upgrade-insecure-requests`.
   - `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
     `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (câmera, microfone,
     localização, pagamento desligados), `Cross-Origin-Opener-Policy` e `Cross-Origin-Resource-Policy: same-origin`.
2. **Hash do script embutido** (o `document.documentElement.classList.add("js")` do `index.html`):
   ```bash
   node -e "console.log('sha256-'+require('crypto').createHash('sha256').update('document.documentElement.classList.add(\"js\")').digest('base64'))"
   ```
   O `pasta-vercel.mjs` recalcula o hash a partir do HTML final automaticamente.
3. **Testar a política** antes de publicar: copie o `index.html` do build com a CSP numa `<meta>` e confira
   o console (zero erros). Apague o arquivo de teste depois.
4. **Links externos** com `rel="noopener noreferrer"`. Nada de `dangerouslySetInnerHTML`, `eval`, segredos no código.
5. **Dependências:** `npm audit --omit=dev` (o que vai para o ar). Alertas só em ferramentas de
   desenvolvimento (ex.: potrace) não vão para o site — explique isso ao cliente.
6. Nunca prometa "100% seguro": diga o que foi fechado e que a superfície é mínima.
