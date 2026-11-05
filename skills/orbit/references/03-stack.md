# 3. Projeto e stack

Vite + React 19 + TypeScript, Tailwind CSS v4, componentes shadcn/ui (buscados pelo MCP do shadcn),
Motion (motion.dev), ícones lucide-react, fontes por @fontsource (sem Google Fonts: tudo servido pelo
próprio site). O HTML final é **pré-renderizado** (o conteúdo aparece antes do JavaScript carregar).

## Criar

```bash
npm create vite@latest meu-site -- --template react-ts
cd meu-site
npm i motion lucide-react radix-ui class-variance-authority clsx tailwind-merge @fontsource-variable/geist @fontsource-variable/geist-mono
npm i -D tailwindcss @tailwindcss/vite tw-animate-css @types/node sharp
```

Copie de `<skill>/templates/`:

| Arquivo | Para |
|---|---|
| `config/vite.config.ts` | plugins React + Tailwind, alias `@` → `src` |
| `config/tsconfig.json` | caminhos `@/*` |
| `config/index.html` | meta viewport, cor do tema, classe `js` no `<html>`, marcador `<!--app-html-->` |
| `src/entry-client.tsx` / `src/entry-server.tsx` | hidrata no build, monta do zero no dev |
| `src/lib/utils.ts` + `src/components/ui/button.tsx` | `cn()` e botão shadcn com variantes |
| `scripts/prerender.mjs` | injeta o HTML no `index.html` e pré-carrega a fonte principal |
| `scripts/pasta-vercel.mjs` | copia só o site pronto para `../<projeto>-vercel` com `vercel.json` de segurança |
| `config/vercel.json` | cabeçalhos de segurança e cache |

Scripts do `package.json`:

```json
"dev": "vite",
"build": "tsc --noEmit -p . && vite build --outDir dist/client && vite build --ssr src/entry-server.tsx --outDir dist/server && node scripts/prerender.mjs",
"preview": "vite preview --outDir dist/client",
"vercel:pasta": "npm run build && node scripts/pasta-vercel.mjs"
```

## shadcn pelo MCP

Uma vez por computador:

```bash
claude mcp add shadcn -s user -- npx -y @jpisnice/shadcn-ui-mcp-server
```

Se o MCP der *timeout* ao abrir (comum no Windows), instale global e aponte para o arquivo:

```bash
npm i -g @jpisnice/shadcn-ui-mcp-server
claude mcp add shadcn -s user -- node "<pasta global do npm>/node_modules/@jpisnice/shadcn-ui-mcp-server/build/index.js"
```

Use o MCP para buscar o código de cada componente (button, input, toggle-group, accordion, label…) e
adapte ao tema escuro do projeto. Sem o MCP, escreva o componente à mão no mesmo padrão (radix + cva).

## Organização

```
src/
  content.ts          ← TODO o texto e os contatos (o cliente edita aqui)
  styles.css          ← tokens (:root), base, seções — tudo dentro de @layer components
  fx.css              ← efeitos (importado depois do styles.css no entry-client)
  App.tsx             ← ordem das seções + hooks globais (revelar, brilho do mouse, pausar fora da tela)
  sections/*.tsx      ← uma seção por arquivo
  components/*.tsx    ← Logo, Nav, ícones, utilitários
  demo/               ← Safari, iPhone, Viewport e sites de exemplo (se o site mostrar demonstrações)
```

## Armadilhas da stack

- **CSS fora de camada vence o Tailwind.** Coloque o CSS próprio em `@layer components`.
- **Hidratação:** no cliente, `hydrateRoot` só se `#root` já tiver filho; senão `createRoot`.
- **`scroll-behavior: smooth` global** atrapalha ferramentas e âncoras: use `html:focus-within { scroll-behavior: smooth }`.
- **Unidades `cq*` dentro de transform 3D** quebram: desenhe sites de exemplo em tamanho real e reduza por `scale`.
- **`overflow: hidden` mata `position: sticky`** nos filhos: use `overflow: clip`.
- **Windows:** heredoc no bash às vezes falha com textos longos — escreva arquivos com a ferramenta de
  escrita ou um script `.mjs`. Se um arquivo aparecer "cheio de zeros" (bytes NUL), recrie-o.
