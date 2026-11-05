import { useEffect, useRef, useState } from "react";
import { depoisDoCarregamento, quandoOcioso } from "@/components/idle";
import { hero, ramos, vitrine } from "@/content";
import { ArrowRight } from "@/components/Icons";
import { Viewport } from "@/demo/Viewport";
import { DemoSite } from "@/demo/DemoSite";
import { demoMeta, dominio } from "@/demo/sites";

/** Pede ao "Experimente" para mostrar um ramo e rola até ele. */
export function abrirRamo(ramo: string) {
  window.dispatchEvent(new CustomEvent("wm:ramo", { detail: ramo }));
  const alvo = document.getElementById("experimente");
  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  alvo?.scrollIntoView({ behavior: reduz ? "auto" : "smooth" });
}

/**
 * Faixa infinita com os sete sites de exemplo em miniatura (no lugar da faixa de logos de clientes).
 * Para no hover; com movimento reduzido vira uma fileira que se rola com o dedo.
 * Os sites são montados um por vez, nos momentos ociosos depois que a página carrega
 * (nunca todos de uma vez no meio da rolagem). Se a pessoa chegar antes, o resto vem rápido.
 */
export function Vitrine() {
  const faixa = useRef<HTMLDivElement>(null);
  const itens = hero.exemplos;
  const total = itens.length * 2;
  const [quantos, setQuantos] = useState(0);

  useEffect(() => {
    let cancelar = () => {};
    let pressa = false;
    let n = 0;
    const proximo = () => {
      n = Math.min(total, n + 1);
      setQuantos(n);
      if (n < total) cancelar = quandoOcioso(proximo, pressa ? 80 : 1500);
    };
    const fimCarga = depoisDoCarregamento(() => (cancelar = quandoOcioso(proximo)), 900);
    const el = faixa.current;
    const io = el
      ? new IntersectionObserver(([e]) => {
          if (e.isIntersecting) pressa = true;
        }, { rootMargin: "800px 0px" })
      : null;
    if (el && io) io.observe(el);
    return () => {
      fimCarga();
      cancelar();
      io?.disconnect();
    };
  }, [total]);

  return (
    <section className="vitrine" aria-labelledby="vit-titulo">
      <div className="wrap">
        <h2 id="vit-titulo" className="vitrine__cap" data-reveal="0">
          {vitrine.titulo} <span>{vitrine.texto}</span>
        </h2>
      </div>
      <div ref={faixa} className="marquee" data-reveal="1">
        <ul className="marquee__track">
          {[...itens, ...itens].map((e, i) => {
            const copia = i >= itens.length;
            const rotulo = ramos.find((r) => r.id === e.ramo)?.rotulo ?? e.nome;
            const meta = demoMeta[e.ramo] ?? demoMeta.padaria;
            return (
              <li key={i} className="marquee__item" aria-hidden={copia || undefined}>
                <div className="vt">
                  <div className="vt__win" data-ui inert>
                    <div className="vt__bar">
                      <i />
                      <i />
                      <i />
                      <span className="vt__host">{dominio(e.nome)}</span>
                    </div>
                    <div className="vt__page" style={{ background: meta.bg }}>
                      {i < quantos && (
                        <Viewport w={1280} h={800}>
                          <DemoSite ramo={e.ramo} nome={e.nome} topo />
                        </Viewport>
                      )}
                    </div>
                  </div>
                  <div className="vt__cap">
                    <span>{rotulo}</span>
                    <span className="vt__go">
                      {vitrine.acao} <ArrowRight aria-hidden="true" />
                    </span>
                  </div>
                  <a
                    className="vt__link"
                    href="#experimente"
                    tabIndex={copia ? -1 : undefined}
                    onClick={(ev) => {
                      ev.preventDefault();
                      abrirRamo(e.ramo);
                    }}
                  >
                    <span className="sr-only">
                      {vitrine.acao}: exemplo de {rotulo}, {e.nome}
                    </span>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
