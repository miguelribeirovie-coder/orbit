// Agenda trabalho para quando o navegador estiver ocioso: monta partes pesadas aos poucos,
// sem disputar quadro com a rolagem nem com as animações.
type ComOcioso = Window & {
  requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/** Roda `fn` num momento ocioso (ou depois de `limite` ms). Devolve a função que cancela. */
export function quandoOcioso(fn: () => void, limite = 1200) {
  const w = window as ComOcioso;
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(fn, { timeout: limite });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(fn, 120);
  return () => window.clearTimeout(id);
}

/** Espera a página terminar de carregar (imagens, fontes do topo) e então chama `fn`. */
export function depoisDoCarregamento(fn: () => void, folga = 600) {
  let t = 0;
  const vai = () => {
    t = window.setTimeout(fn, folga);
  };
  if (document.readyState === "complete") vai();
  else window.addEventListener("load", vai, { once: true });
  return () => {
    window.removeEventListener("load", vai);
    window.clearTimeout(t);
  };
}
