// Confere se algo passa da largura da tela (o "site cortado no celular").
// Cole no console em 320, 375 e 650 px de largura; role a página inteira antes (partes montam ao chegar).
(() => {
  const W = document.documentElement.clientWidth;
  const fora = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (!r.width || r.right <= W + 1) continue;
    let p = el.parentElement;
    let recortado = false;
    while (p && p !== document.body) {
      if (getComputedStyle(p).overflowX !== "visible") {
        recortado = true;
        break;
      }
      p = p.parentElement;
    }
    if (!recortado) fora.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} → ${Math.round(r.right)}px`);
  }
  const resultado = { larguraDaTela: W, larguraDaPagina: document.documentElement.scrollWidth, passamDaTela: fora.slice(0, 20) };
  console.log(resultado);
  return resultado;
})();
