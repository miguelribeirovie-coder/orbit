# 6. Revisão de design

Rode com o site no ar localmente (`npm run dev`, ou `npm run build && npm run preview` para o final).

1. **Inspector do taste** (navegador real; mede contraste, imagens, telas vazias, "cara de IA"):
   ```bash
   node <skill>/skills/design-taste-frontend/scripts/inspect.mjs http://localhost:5173
   node <skill>/skills/design-taste-frontend/scripts/lint.mjs src
   node <skill>/skills/design-taste-frontend/scripts/scenes.mjs http://localhost:5173   # se houver cenas de rolagem
   ```
   Alertas que são escolha consciente do cliente (ex.: "mono", "glass", "poucas fotos" num site escuro
   sem fotos) podem ficar — explique o porquê.
2. **Crítica e polimento (impeccable):** comandos `critique`, `audit`, `polish`, `typeset`, `layout`,
   `harden` (estados de erro/vazio), `optimize`. Leia a referência de cada comando antes.
3. **Casos extremos:** `skills/break-ui` (nome enorme, campo vazio, emoji, texto longo).
4. **Celular de verdade:** `skills/mobile-native` (100vh, zoom em campo, área segura, toque).
5. **Animação:** `skills/review-animations` para revisar; `skills/remove-animations` se ficou "pesado".

## Checagens que sempre faço no navegador

```js
// corte lateral: nada pode passar da largura da tela
[document.documentElement.scrollWidth, innerWidth]
// elementos que passam da tela sem um ancestral que recorte
[...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1)
```

Telas: 1280×800, 1440×900, 650×540 (tela baixa) e 375×812 (celular). Tire print do começo, meio e fim
de cada animação de rolagem.
