# 5. Movimento

Antes de animar algo, leia `<skill>/skills/animate/SKILL.md` (decide se anima, propósito, curva, duração,
interrupção). Para molas e sensação física, `skills/apple-design`; para acabamento, `skills/emil-design-eng`.
Para nomear um efeito que o cliente descreveu, `skills/animation-vocabulary`.

## Princípios

- Molas sem quique para interface (`type: "spring", bounce: 0`), curvas longas de saída para entradas
  (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Anime só `transform` e `opacity`. Desfoque (`filter: blur`) só no computador e em poucas coisas.
- Tudo com `prefers-reduced-motion`: a versão reduzida mostra o estado final, parado.
- Pause animações fora da tela (`templates/src/components/PauseOffscreen.ts`).

## Receitas prontas (em `templates/`)

| Efeito | Onde |
|---|---|
| Entrada das seções (sobe + aparece, sem desfoque no celular) | `src/components/Reveal.ts` |
| Brilho que segue o mouse nos cartões (`.spot`) | `src/components/Spotlight.ts` + `css/efeitos.css` |
| Estrelinhas que piscam | `src/components/Sparkles.tsx` |
| Montar partes pesadas quando o navegador está ocioso | `src/components/idle.ts` |
| Navegador Safari, iPhone e visor em escala real (com rolagem automática por transform) | `src/demo/` |
| Planeta/anel de vidro iluminado por trás, nascendo atrás da janela, pulsando luz | `css/planeta.css` |
| Palco preso na tela durante a rolagem (sticky) + frase no meio do planeta | `css/planeta.css` + `src/Hero.exemplo.tsx` |
| Faixa infinita (marquee) que para no hover | `css/efeitos.css` (`.marquee`) |
| Borda de luz girando no cartão em destaque | `css/efeitos.css` (`.beam`) |
| Linha do tempo que acende com a rolagem | `css/efeitos.css` (`.flow`) |
| Horizonte que sobe com a rolagem no fim da página | `css/efeitos.css` (`.final__horizon`) |

## Rolagem presa (scrollytelling) — como fazer direito

1. Um **trilho** (`.stage-pin`) contém o palco (`.stage`, `position: sticky`) e um espaçador
   (`.stage-pin__run`) com a altura do trecho. O ancestral não pode ter `overflow: hidden` (use `clip`).
2. O progresso é calculado no evento de rolagem: `(fundoDoPalco - topoDoEspaçador) / alturaDoEspaçador`
   → 0 quando gruda, 1 quando solta. Passe por uma mola leve (`useSpring`, stiffness ~280, damping ~36).
3. Trecho **curto**: ~55vh no celular, ~65vh no computador. A mensagem principal entra entre 30% e 60%.
   Trechos longos parecem travados ("cheguei na metade do site e o texto não apareceu").
4. **Tamanho limitado pela altura da tela** (`--stage-w: min(100cqi, 1040px, (100vh - 90px)/0.8)`) para
   o palco caber inteiro em telas baixas.
5. Elementos que se movem com a rolagem recebem `will-change: transform`.
6. Teste em 1280×800, 650×540 e 375×812 medindo posições com script, não só no olho.

## Planeta fiel a uma referência (vídeo)

Estude a referência **quadro a quadro** (desenhe frames do vídeo num `<canvas>` e amplie o recorte)
antes de construir. O planeta do vídeo de referência era: anel de vidro grosso iluminado por trás, luz que
corre pelo anel da esquerda para a direita enquanto ele sobe de trás do painel, miolo escuro com brilho
perto do topo e névoa branca acima. Primeiras tentativas "parecidas" (arco fino gigante) foram rejeitadas:
copie a **estrutura** e a **sequência** da animação, troque só as cores para a paleta do cliente.
