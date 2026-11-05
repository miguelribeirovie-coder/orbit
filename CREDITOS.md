# Créditos

O Orbit é um método que coordena o trabalho de outras pessoas. Nenhuma das skills abaixo fica
copiada neste repositório: o instalador baixa cada uma do repositório original, no commit fixado em
[`skills/orbit/skills.lock.json`](skills/orbit/skills.lock.json), e grava a licença do autor
dentro da pasta da skill, junto com um `.orbit.json` que diz de onde ela veio.

## taste-skill, de Leonxlnx

- Repositório: https://github.com/Leonxlnx/taste-skill · site: https://tasteskill.dev
- Licença: MIT
- Commit usado: `af8a897996e159ccc89c9da535dff714d5dba62d` (pasta `skills/taste-skill`)
- Skill: `design-taste-frontend`

## Impeccable, de Paul Bakaus

- Repositório: https://github.com/pbakaus/impeccable · site: https://impeccable.style
- Licença: Apache 2.0 (o instalador leva também o `NOTICE.md` do projeto)
- Commit usado: `6f269c4d8dec384388b386e2a130ff90d4f48de3` (pasta `.claude/skills/impeccable`)
- Skill: `impeccable`

## Skills de Emil Kowalski

- Repositório: https://github.com/emilkowalski/skills · página: https://emilkowal.ski/skill
- Licença: MIT
- Commit usado: `f1090bec277140d02ed202440185ad9d02ac1490` (pasta `skills/`)
- Skills: `animate`, `apple-design`, `emil-design-eng`, `animation-performance`,
  `animation-vocabulary`, `find-animation-opportunities`, `improve-animations`, `review-animations`,
  `remove-animations`, `mobile-native`, `break-ui`, `pick-ui-library`, `prototype`, `ask-sonner`

## Outras ferramentas citadas pelo método

- [shadcn/ui](https://ui.shadcn.com) (MIT): os componentes em `templates/src/components/ui/` seguem o
  padrão shadcn, adaptados ao tema escuro.
- [shadcn-ui MCP server](https://www.npmjs.com/package/@jpisnice/shadcn-ui-mcp-server)
  (`@jpisnice/shadcn-ui-mcp-server`): acesso aos componentes shadcn pelo Claude Code.
- [Vite](https://vite.dev), [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com),
  [Motion](https://motion.dev), [Lucide](https://lucide.dev), [Geist](https://vercel.com/font) e
  [Vercel](https://vercel.com).

## Por que versões fixas

As skills de terceiros mudam rápido. O método foi escrito e testado com estas versões exatas (os
comandos citados, como `draw.mjs` e `inspect.mjs`, existem nelas). Quem quiser arriscar a mais nova pode
instalar com `--mais-recente`; para atualizar o método de vez, veja [CONTRIBUTING.md](CONTRIBUTING.md).
