# Modelos (templates)

Arquivos reais do site da Word MNR, prontos para copiar e adaptar. Troque textos, cores e nomes do
cliente; mantenha a lógica (é ela que já foi testada em computador, tela baixa e celular).

| Pasta | O que tem |
|---|---|
| `config/` | `vite.config.ts`, `tsconfig.json`, `index.html` (meta, classe `js`, marcador do HTML), `vercel.json` (CSP e cabeçalhos de segurança, cache) |
| `scripts/` | `prerender.mjs` (HTML pré-renderizado + preload da fonte), `pasta-vercel.mjs` (pasta pronta para a Vercel, hash da CSP), `logo.mjs` (vetoriza logo com sharp + potrace), `images.mjs` / `demo-images.mjs` (fotos em WebP 640/1200) |
| `src/` | `entry-client.tsx` e `entry-server.tsx` (hidratação), `lib/utils.ts` (`cn`) |
| `src/components/` | `Reveal.ts` (entradas), `Spotlight.ts` (brilho do mouse), `PauseOffscreen.ts`, `idle.ts` (montar no ocioso), `Sparkles.tsx`, `Logo.tsx` (logo em SVG com vão), `Bento.tsx` (cartões com mini-telas), `ui/` (botão, campo, acordeão shadcn no tema escuro) |
| `src/demo/` | `Safari.tsx`, `Phone.tsx`, `Viewport.tsx` (site em tamanho real reduzido; rolagem automática por transform), `DemoSite.tsx` (com modo `topo` para miniaturas), `demo.css` |
| `src/*.exemplo.tsx` | Seções completas de referência: topo com planeta e palco preso (`Hero`), vitrine infinita (`Vitrine`), etapas com linha de luz (`ComoFunciona`), chamada final com horizonte (`Chamada`) |
| `css/` | `tokens.css` (paleta e tipos), `planeta.css` (planeta + palco preso + frase), `efeitos.css` (bento, selo, brilho do mouse, borda girando, etapas, horizonte, desempenho) |
| `medicao/` | `medir-rolagem.js` (fluidez quadro a quadro), `checar-corte.js` (nada passando da tela) |

Os arquivos de exemplo importam `@/content`, `@/demo/...` etc. do projeto original: ajuste os imports
e o conteúdo ao copiar.
