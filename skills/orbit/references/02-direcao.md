# 2. Direção de arte → DESIGN.md

## Passo a passo

1. **Tire a direção do baralho (taste).** Leia `<skill>/skills/design-taste-frontend/SKILL.md` (só a parte
   da fase atual). Rode, na raiz do projeto:
   ```bash
   node <skill>/skills/design-taste-frontend/scripts/draw.mjs --list sectors
   node <skill>/skills/design-taste-frontend/scripts/draw.mjs --sector <setor> --brief "<uma linha>"
   node <skill>/skills/design-taste-frontend/scripts/draw.mjs <mesmos argumentos> --direction <id escolhido>
   ```
   Mostre as três direções ao cliente com nomes simples ("Grafite e gelo", "Papel e tinta"…) e deixe ele
   escolher. Guarde a escolhida (`draw.mjs --show` reimprime).
2. **Feche o sistema (impeccable).** Leia `<skill>/skills/impeccable/SKILL.md`, rode `impeccable context`
   e use o comando `shape` para a primeira tela. Escreva o **DESIGN.md**: cores (tokens com nome e hex),
   tipografia (no máximo 5 tamanhos), espaçamento, raios, componentes, regras com nome ("A logo manda",
   "Duas linhas no máximo") e o que não fazer.
3. **Paleta a partir da logo.** Extraia as cores da logo (amostre os pixels, não chute). Monte degraus de
   fundo (4 a 5 tons), texto principal, texto secundário com contraste ≥ 7:1, um tom de destaque.
   Se a logo é imagem, vetorize (ver `templates/scripts/logo.mjs`: sharp + potrace, buracos com
   `fill-rule="evenodd"`, barras medidas como retângulo).
4. **Tipografia.** Uma família boa (ex.: Geist) para tudo, mono só para dados curtos. Títulos grandes e
   apertados (`letter-spacing` negativo), no máximo duas linhas, `text-wrap: balance`.

## O que funcionou na Word MNR (repetível)

- **Escuro em degraus** (grafite) + texto gelo + uma luz suave atrás do objeto principal.
- **O produto em funcionamento como imagem principal:** uma janela de navegador realista (Safari claro)
  com um site de exemplo completo rolando sozinho, digitando o próximo endereço, barra de carregamento.
- **Sites de exemplo com tema próprio por ramo** (padaria, salão, barbearia, loja, lava-rápido, clínica,
  advocacia), cada um com fonte, cor e seções que fazem sentido para aquele negócio, nunca o mesmo molde.
- **Elemento-assinatura com luz:** um anel/planeta de vidro iluminado por trás que nasce atrás da janela
  (receita em `templates/css/planeta.css`).

## Não faça

- Copiar layout, cores ou tipografia de um site de referência.
- Rótulo pequeno em cima de título; texto em degradê; neon; ícone dentro de quadrado colorido em toda seção.
- Mais de uma cor de destaque; azul "de tecnologia" por padrão.
- Fotos de banco genéricas: prefira fotos livres e reais (`assets.mjs` do taste) com crédito no rodapé,
  num link discreto "Créditos das fotos" quando a licença pedir atribuição (CC BY / CC BY-SA).
