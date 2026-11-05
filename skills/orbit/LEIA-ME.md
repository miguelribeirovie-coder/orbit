# Orbit (método Word MNR)

O processo completo usado para criar o site da Word MNR, numa skill só: briefing, direção de arte,
construção, movimento, revisão, desempenho no celular, segurança e publicação na Vercel, com comandos,
modelos de código e as melhores skills de design do momento, baixadas das fontes originais.

Página do projeto: https://github.com/miguelribeirovie-coder/orbit

## Instalar

O jeito mais fácil é pelo instalador, na raiz do repositório:

```bash
node instalar.mjs
```

Ele copia esta pasta para `~/.claude/skills/orbit` (no Windows, `C:\Users\<seu usuário>\.claude\skills\orbit`)
e baixa as 16 skills de terceiros para `~/.claude/skills`, cada uma com a licença do autor.

Se você copiou só esta pasta, complete com:

```bash
node ferramentas/baixar-skills.mjs            # ou --dentro, para guardar tudo em orbit/skills
node ferramentas/baixar-skills.mjs --verificar
```

Depois, abra uma sessão nova do Claude Code. A skill aparece como `orbit`.

## Usar

- Peça normalmente: "cria um site para a minha barbearia", "quero uma landing page futurista para a minha
  clínica", "deixa esse site mais leve no celular". A skill entra sozinha.
- Ou chame direto: `/orbit`.

## Uma vez por computador (componentes shadcn)

```bash
claude mcp add shadcn -s user -- npx -y @jpisnice/shadcn-ui-mcp-server
```

Os scripts de direção de arte (design-taste-frontend) precisam de Node 22+ e Chrome/Edge instalados.

## O que tem dentro

| Pasta | Conteúdo |
|---|---|
| `SKILL.md` | o roteiro principal (regras de ouro, fases, comandos, mapa das skills) |
| `references/` | uma página por fase + lições do projeto Word MNR |
| `templates/` | código real do site (scripts, componentes, CSS do planeta e efeitos, medições) |
| `ferramentas/` | `baixar-skills.mjs` (baixa as skills de terceiros) e `verificar.mjs` (confere se está tudo inteiro) |
| `skills.lock.json` | de onde vem cada skill de terceiros, em qual versão e com qual licença |
| `skills/` | onde ficam as skills de terceiros quando instaladas com `--dentro` |

## Licenças

O método (este SKILL.md, `references/`, `templates/` e `ferramentas/`) é da Word MNR, sob licença MIT.
As skills de terceiros não ficam neste repositório: são baixadas das fontes originais e mantêm as
licenças dos autores (MIT para Emil Kowalski e Leonxlnx, Apache 2.0 para a impeccable, de Paul Bakaus).
