---
name: orbit
description: Orbit, o método completo da Word MNR para criar sites profissionais bonitos, rápidos e seguros, do briefing até a publicação na Vercel. Junta, numa skill só, direção de arte (design-taste-frontend), sistema de design e crítica (impeccable), animação e movimento (animate, apple-design, emil-design-eng e as skills de animação), componentes shadcn via MCP, desempenho no celular, segurança e deploy, com os comandos e modelos prontos. Use sempre que o usuário pedir para criar, fazer, desenhar, refazer ou melhorar um site, landing page, site de uma página, página de empresa, portfólio ou página de produto ("cria um site", "faz um site para a minha padaria", "quero um site futurista", "monta uma landing page"), ou para deixar um site mais bonito, profissional, animado, leve no celular, seguro ou pronto para a Vercel.
---

# Orbit: o método Word MNR para criar sites

Esta skill é o processo inteiro usado para criar o site da Word MNR, transformado em receita. Ela
coordena 16 skills de outros autores (ver "Onde estão as skills incluídas"). Leia cada uma só quando a
fase pedir; não carregue tudo de uma vez.

Neste documento, `<skill>` é a pasta desta skill (onde está este SKILL.md).

## Onde estão as skills incluídas

As skills do mapa no fim deste documento são baixadas das fontes originais pelo instalador, na versão
testada com este método (autores, licenças e commits em `<skill>/skills.lock.json`). Quando uma fase
pedir `<skill>/skills/<nome>`, use a primeira destas pastas que tiver um `SKILL.md`:

1. `<skill>/skills/<nome>/` (instalação com `--dentro`);
2. `~/.claude/skills/<nome>/` (instalação padrão; no Windows, `%USERPROFILE%\.claude\skills\<nome>`);
3. `.claude/skills/<nome>/` na raiz do projeto.

Se nenhuma existir, rode `node <skill>/ferramentas/baixar-skills.mjs` (Node 18+ e internet, menos de um
minuto) e continue; `--verificar` mostra o que está instalado. Sem internet, siga a fase com as regras
desta skill e avise o cliente o que não deu para usar.

## Regras de ouro (aprendidas com cliente de verdade)

1. **Pergunte antes de desenhar.** Público, ramo, tom, cores ou logo, referências, contatos, o que NÃO
   quer. Pedido vago vira pergunta curta com opções (ferramenta de perguntas). Ver `references/01-briefing.md`.
2. **Referência é inspiração, nunca molde.** Copiar o tema de um site de referência é o erro que o cliente
   mais nota ("você praticamente copiou o tema"). Pegue a ideia, não o layout nem as cores.
3. **A paleta sai da logo.** Poucas cores, contraste AA, nada de neon ou texto em degradê sem pedido.
   "Não muito colorido" é um pedido comum: monocromático frio + uma luz suave resolve.
4. **Títulos em até duas linhas.** Centralize abertura do topo e de seções; conteúdo de cartões, listas e
   textos longos ficam à esquerda.
5. **Nada inventado.** Sem depoimentos, números ou clientes falsos. Exemplo é marcado como ilustrativo.
6. **Movimento com propósito e com saída.** Toda animação tem versão para movimento reduzido. No celular,
   menos desfoque e menos camadas. Animação ligada à rolagem precisa ser *sensível*: a mensagem principal
   aparece até a metade do trecho.
7. **Teste de verdade, em três telas.** Computador (1280×800), tela baixa (650×540) e celular (375×812).
   Confira corte lateral (nada pode passar da largura da tela) e meça a rolagem quadro a quadro.
8. **Toda alteração termina publicável:** build sem erro e pasta da Vercel atualizada (`npm run vercel:pasta`).
9. **Mostre e confirme o caminho** (direção visual, nome da frase, posição de um elemento) antes de
   construir tudo; ajuste rápido com base no print do cliente.

## As fases

| Fase | O que sai | Leia |
|---|---|---|
| 1. Briefing | PRODUCT.md (quem, para quem, prova real, contatos) | `references/01-briefing.md` |
| 2. Direção de arte | DESIGN.md + folha de direção | `references/02-direcao.md`, `skills/design-taste-frontend/SKILL.md`, `skills/impeccable/SKILL.md` |
| 3. Projeto | Vite + React + TS + Tailwind 4 + shadcn + Motion, HTML pré-renderizado | `references/03-stack.md` |
| 4. Seções | página de uma tela por vez, conteúdo em `src/content.ts` | `references/04-secoes.md` |
| 5. Movimento | entradas, demonstração, rolagem presa, brilhos | `references/05-movimento.md`, `skills/animate/SKILL.md` |
| 6. Revisão de design | inspector, lint, crítica, casos extremos | `references/06-revisao.md` |
| 7. Desempenho | sem travar no celular, carregamento leve | `references/07-desempenho.md`, `skills/animation-performance/SKILL.md` |
| 8. Segurança | cabeçalhos, CSP, dependências | `references/08-seguranca.md` |
| 9. Publicar | pasta pronta para a Vercel | `references/09-publicar.md` |
| — | Lições e armadilhas | `references/licoes.md` |

Faça as fases em ordem na primeira versão; depois, cada pedido do cliente volta só à fase que importa
(e sempre termina na 9).

## Comandos rápidos

```bash
# projeto novo (detalhes em references/03-stack.md)
npm create vite@latest meu-site -- --template react-ts
cd meu-site && npm i react-dom motion lucide-react radix-ui class-variance-authority clsx tailwind-merge @fontsource-variable/geist @fontsource-variable/geist-mono
npm i -D tailwindcss @tailwindcss/vite tw-animate-css @types/node sharp

# direção de arte (taste) — rode na raiz do projeto
node <skill>/skills/design-taste-frontend/scripts/draw.mjs --list sectors
node <skill>/skills/design-taste-frontend/scripts/draw.mjs --sector <setor> --brief "<uma linha sobre o negócio>"
node <skill>/skills/design-taste-frontend/scripts/inspect.mjs http://localhost:5173
node <skill>/skills/design-taste-frontend/scripts/lint.mjs src

# sistema de design e crítica (impeccable)
<skill>/skills/impeccable/scripts/impeccable context        # no Windows: impeccable.cmd
#   comandos da skill: shape · critique · audit · polish · animate · harden · optimize · typeset · layout

# componentes shadcn (MCP) — uma vez por computador
claude mcp add shadcn -s user -- npx -y @jpisnice/shadcn-ui-mcp-server

# rodar, gerar e publicar
npm run dev
npm run build                 # checa tipos, gera o site e pré-renderiza o HTML
npm run vercel:pasta          # build + copia só o site pronto para ../<projeto>-vercel
npm audit --omit=dev          # vulnerabilidades do que vai para o ar
```

```bash
# skills incluídas
node <skill>/ferramentas/baixar-skills.mjs --verificar   # o que está instalado
node <skill>/ferramentas/baixar-skills.mjs               # baixa o que faltar
```

Modelos prontos (scripts, componentes, configuração, medição) estão em `templates/`; o índice está em
`templates/LEIA-ME.md`.

## Mapa das skills incluídas

| Skill | Quando usar |
|---|---|
| `design-taste-frontend` (Leonxlnx) | direção de arte, anti "cara de IA", inspector em navegador real, fotos livres (`assets.mjs`) |
| `impeccable` (Paul Bakaus) | PRODUCT.md / DESIGN.md, crítica, auditoria, polimento, tipografia, cor, layout |
| `animate` (Emil Kowalski, assim como as demais abaixo) | decidir e escrever qualquer animação (propósito, curva, duração, interrupção) |
| `apple-design` | movimento físico com molas, vidro, profundidade, tipografia estilo Apple |
| `emil-design-eng` | acabamento de componentes e detalhes invisíveis |
| `animation-performance` | animação travando: propriedades baratas, camadas, `will-change` |
| `find-animation-opportunities` / `improve-animations` / `review-animations` / `remove-animations` | achar, auditar, revisar ou enxugar animações |
| `animation-vocabulary` | descobrir o nome de um efeito que o cliente descreve |
| `mobile-native` | sensação de app no celular (100vh, toque, zoom em campos, área segura) |
| `break-ui` | testar com dados extremos (nomes longos, vazio, emoji) |
| `pick-ui-library` / `prototype` / `ask-sonner` | escolher biblioteca, prototipar rápido, avisos (toasts) |

Se a mesma skill existir em mais de um lugar, vale a ordem de "Onde estão as skills incluídas".

## Entrega

Ao terminar cada rodada, diga ao cliente, em português simples: o que mudou, o que foi conferido (e em
quais telas), o que não deu para conferir e onde está a pasta para publicar. Sem jargão técnico.
