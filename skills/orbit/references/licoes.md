# Lições do projeto Word MNR (o que o cliente pediu, aprovou e rejeitou)

## Aprovado
- Direção "Grafite e gelo": escuro em degraus, texto gelo, luz suave; paleta tirada da logo.
- Demonstração realista: Safari claro + iPhone com sites de exemplo completos rolando, digitando o
  próximo endereço e carregando ("gostei demais").
- Um tema criativo por ramo (padaria, salão, barbearia, loja, lava-rápido, clínica, advocacia).
- Planeta de vidro iluminado por trás, pulsando luz; ao rolar, o celular sai, a janela vai para o canto
  e uma frase surge no meio do planeta.
- Horizonte do mesmo planeta no fim da página, subindo com a rolagem.
- Etapas com ícones em selos ligados por uma linha de luz (no lugar de bolinhas simples).
- Créditos de foto num link discreto; atendimento "Qualquer cidade, 100% online".

## Rejeitado (não repita)
- Copiar o tema de um site de referência.
- Paleta muito colorida.
- "Eclipse" como arco fino gigante sem animação visível: o cliente queria fiel ao vídeo.
- Animação de rolagem sutil demais em telas estreitas; trecho preso longo demais.
- Planeta grande demais em tela baixa (650×540) e janela pequena demais/cortada.
- Bloco grande de créditos de foto no rodapé.

## Pedidos recorrentes do cliente
- "Deixe mais realista / mais fiel ao vídeo" → estude a referência quadro a quadro.
- "Está cortado no celular" → confira 320, 375 e 650 px, `overflow-x: clip` no body, recorte elementos
  decorativos largos dentro de uma caixa com `overflow: hidden`.
- "Está pesado / travando" → meça (07-desempenho) e corrija o que redesenha a cada quadro.
- "Me dê a pasta para a Vercel" e "atualize sempre a pasta" → `npm run vercel:pasta` ao fim de cada mudança.
- Prefere textos centralizados onde fizer sentido de design.

## Armadilhas técnicas vividas
- Arquivo `.tsx` virou bytes NUL ao fechar o app no meio de um salvamento → checar e recriar.
- Captura de tela "parada" com o painel escondido; `requestAnimationFrame` não dispara → mostrar o painel.
- `content-visibility` desalinhou animações ligadas à rolagem → removido.
- `overflow: hidden` no topo impediu o `sticky` → `overflow: clip`.
