# Mudanças

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e as versões seguem
[SemVer](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-11-05

Primeira versão pública.

### Adicionado
- Método completo da Word MNR em nove fases: briefing, direção de arte, projeto, seções, movimento,
  revisão, desempenho, segurança e publicação na Vercel.
- Modelos de código reais do site da Word MNR: configuração, scripts de pré-renderização e da pasta da
  Vercel, componentes, CSS do planeta e dos efeitos, medições de rolagem e de corte.
- 16 skills de terceiros baixadas das fontes originais, em versões fixas e com as licenças dos autores:
  design-taste-frontend (Leonxlnx), impeccable (Paul Bakaus) e 14 skills de Emil Kowalski.
- Instalador para Windows, Mac e Linux (`instalar.mjs`, `instalar.sh`, `instalar.ps1`), com instalação
  por usuário, por projeto ou dentro da própria skill.
- `baixar-skills.mjs` (baixa, confere e lista as skills de terceiros) e `verificar.mjs` (confere
  frontmatter, links internos, lock e cada arquivo citado pelo método).
- Plugin e marketplace do Claude Code, com o MCP de componentes shadcn já configurado.
- Validação automática em Linux, Mac e Windows, e aviso semanal de versões novas das skills de terceiros.

[1.0.0]: https://github.com/miguelribeirovie-coder/orbit/releases/tag/v1.0.0
