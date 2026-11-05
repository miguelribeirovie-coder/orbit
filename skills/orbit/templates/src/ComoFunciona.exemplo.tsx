import { useEffect, useRef } from "react";
import { scroll } from "motion";
import { FileSignature, MessagesSquare, Rocket, WandSparkles, type LucideIcon } from "lucide-react";
import { comoFunciona } from "@/content";

const icones: LucideIcon[] = [MessagesSquare, FileSignature, WandSparkles, Rocket];

/**
 * Etapas ligadas por uma linha de luz. Conforme a página rola, a luz corre pela linha (Motion scroll)
 * e cada etapa acende quando ela passa. Com movimento reduzido, tudo já aparece aceso.
 */
export function ComoFunciona() {
  const box = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = box.current;
    const ol = list.current;
    if (!el || !ol) return;
    const itens = Array.from(ol.children) as HTMLElement[];
    const linha = el.querySelector<HTMLElement>(".flow__track") ?? el;
    let atual = "";
    const acender = (p: number) => {
      const v = p.toFixed(3);
      if (v === atual) return;
      atual = v;
      linha.style.setProperty("--p", v);
      const n = itens.length;
      itens.forEach((li, i) => {
        const on = p >= (n === 1 ? 0 : i / (n - 1)) - 0.001;
        if ((li.dataset.on === "true") !== on) li.dataset.on = String(on);
      });
    };
    // No celular a linha vai do primeiro ao último ícone: mede essa distância.
    const medir = () => {
      const nos = ol.querySelectorAll<HTMLElement>(".flow__node");
      if (nos.length > 1) el.style.setProperty("--len", `${nos[nos.length - 1].offsetTop + nos[nos.length - 1].parentElement!.offsetTop - nos[0].offsetTop - nos[0].parentElement!.offsetTop}px`);
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(ol);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      acender(1);
      return () => ro.disconnect();
    }
    acender(0);
    const parar = scroll(acender, { target: ol, offset: ["start 80%", "end 60%"] });
    return () => {
      parar();
      ro.disconnect();
    };
  }, []);

  return (
    <section id="como-funciona" className="sec sec--g1" aria-labelledby="como-titulo">
      <div className="wrap">
        <div className="sec-head sec-head--center">
          <h2 id="como-titulo" className="head" data-reveal="0">{comoFunciona.titulo}</h2>
          <p data-reveal="1">{comoFunciona.texto}</p>
        </div>

        <div ref={box} className="flow">
          <div className="flow__track" aria-hidden="true">
            <span className="flow__fill" />
            <span className="flow__head">
              <i />
            </span>
          </div>
          <ol ref={list} className="flow__list">
            {comoFunciona.passos.map((p, i) => {
              const Icone = icones[i] ?? Rocket;
              return (
                <li key={p.nome} className="flow__step" data-on="false" data-reveal={String(i)}>
                  <span className="flow__node" aria-hidden="true">
                    <Icone />
                  </span>
                  <div className="flow__card glass spot">
                    <div className="flow__top">
                      <span className="flow__num">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flow__who">{p.quem}</span>
                    </div>
                    <h3 className="lead">{p.nome}</h3>
                    <p>{p.texto}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
