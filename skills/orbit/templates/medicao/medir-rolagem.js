// Mede a fluidez da rolagem: cole no console do navegador (ou rode pela ferramenta de JavaScript)
// com o site no build final (npm run build && npm run preview), em modo celular (375×812).
// Rola a página inteira, 14 px por quadro, e devolve o tempo por quadro e os piores pontos por seção.
// Meta: média ≤ 20 ms (perto de 16,7 ms = 60 quadros por segundo) e poucos quadros acima de 50 ms.
(async () => {
  document.documentElement.style.scrollBehavior = "auto";
  const secoes = [...document.querySelectorAll("main > section, body > footer, body footer")].map((s) => [
    s.id || String(s.className).split(" ")[0],
    s.getBoundingClientRect().top + scrollY,
  ]);
  const onde = (y) => {
    let n = "?";
    for (const [id, t] of secoes) if (y + 400 >= t) n = id;
    return n;
  };
  const quadros = [];
  const longos = [];
  let po;
  try {
    po = new PerformanceObserver((l) => l.getEntries().forEach((e) => longos.push([Math.round(e.duration), onde(scrollY)])));
    po.observe({ type: "long-animation-frame" });
  } catch {}
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 500));
  let ultimo = performance.now();
  let y = 0;
  const H = document.documentElement.scrollHeight - innerHeight;
  await new Promise((fim) => {
    function passo(t) {
      quadros.push([t - ultimo, onde(scrollY)]);
      ultimo = t;
      y += 14;
      window.scrollTo(0, y);
      if (y < H) requestAnimationFrame(passo);
      else fim();
    }
    requestAnimationFrame(passo);
  });
  po?.disconnect();
  const lentos = quadros.filter((q) => q[0] > 20);
  const porSecao = {};
  const pior = {};
  lentos.forEach(([, s]) => (porSecao[s] = (porSecao[s] || 0) + 1));
  quadros.forEach(([d, s]) => (pior[s] = Math.max(pior[s] || 0, Math.round(d))));
  const resultado = {
    quadros: quadros.length,
    mediaMs: Math.round((quadros.reduce((a, b) => a + b[0], 0) / quadros.length) * 10) / 10,
    lentosAcimaDe20ms: lentos.length,
    travadasLongas: longos.length,
    lentosPorSecao: porSecao,
    piorPorSecaoMs: pior,
  };
  console.table(resultado.piorPorSecaoMs);
  console.log(resultado);
  return resultado;
})();
