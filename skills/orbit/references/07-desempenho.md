# 7. Desempenho: carregar rápido e não travar

Meça antes e depois. O que trava celular quase nunca é o tamanho do download: é o trabalho de desenhar.

## Medir (cole no console, com o site em modo celular e no build final, não no dev)

`templates/medicao/medir-rolagem.js` rola a página inteira quadro a quadro e devolve: tempo médio por
quadro (meta ≤ 20 ms), quantos quadros lentos (> 20 ms), os piores por seção e quantos travamentos
longos (Long Animation Frames). Meça também a página parada (deve ficar perto de 16,7 ms).

Resultado no site da Word MNR (celular, rolando tudo): média 41,6 → 23,1 ms; travadas longas 64 → 9;
pior travada no topo 1,1 s → 0,1 s.

## O que mais pesava e a correção

| Problema | Correção |
|---|---|
| Vitrine montava 14 sites completos para mostrar só o começo | modo "topo" (só faixa + menu + 1ª seção) e montagem **um por vez no ocioso** depois do carregamento (`idle.ts`) |
| Cópias escondidas (versão computador e celular do mesmo exemplo) | montar só a versão que cabe na tela, e só quando perto/ocioso |
| Rolagem automática dentro do exemplo com `scrollTop` (redesenha tudo) | mover o conteúdo com `translate3d` (placa de vídeo) |
| Elementos movidos por JS a cada quadro sem camada própria | `will-change: transform` nos que se movem com a rolagem |
| Variável CSS mudando no pai de uma seção inteira a cada rolagem | aplicar a variável só no elemento que usa, e só quando o valor muda |
| Re-render do exemplo a cada letra digitada no endereço | `useMemo` no elemento do site de exemplo |
| Desfoque (`blur`) em entradas, feixes de luz e detalhes | sem desfoque no celular; feixes desligados no celular |
| Menu fixo com `backdrop-filter` | menu sólido no celular |
| Animações internas das miniaturas (poste de barbeiro, faixas) | paradas dentro da vitrine |
| Animações rodando fora da tela | `PauseOffscreen.ts` (`[data-off] * { animation-play-state: paused }`) |
| Exemplo mudando força recalcular a página | `contain: layout paint style` nos visores |

## Carregamento

- HTML pré-renderizado (aparece antes do JS) + `preload` da fonte principal (`prerender.mjs`).
- Imagens em WebP com `srcset` (640 e 1200), `loading="lazy"` exceto a primeira tela (`fetchPriority="high"`).
- Fontes locais (@fontsource); só as usadas são baixadas.
- Cache longo para `/assets/*` (arquivos com hash) no `vercel.json`.

## Não faça

- `content-visibility: auto` em seções com animação ligada à rolagem: muda a altura da página enquanto
  rola e desalinha as animações (tentei e tirei).
- Medir no servidor de desenvolvimento (é mais lento por natureza) ou com o painel do navegador escondido
  (o navegador para de desenhar e a medição não vale).
