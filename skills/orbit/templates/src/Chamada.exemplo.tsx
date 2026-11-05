import { useEffect, useRef } from "react";
import { scroll } from "motion";
import { chamada, contato, linkEmail, linkInstagram } from "@/content";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, InstagramIcon, Mail } from "@/components/Icons";
import { Sparkles } from "@/components/Sparkles";

// Estrelinhas sobre o horizonte (posições relativas à faixa do pé da seção).
const brilhos = [
  { x: "14%", y: "52%", s: 11, d: "0.4s" },
  { x: "30%", y: "30%", s: 7, d: "1.8s" },
  { x: "71%", y: "26%", s: 9, d: "1s" },
  { x: "88%", y: "48%", s: 12, d: "2.6s" },
];

export function Chamada() {
  const sec = useRef<HTMLElement>(null);

  // O horizonte nasce conforme a pessoa rola até o fim do site: a rolagem vira --fp (0 a 1).
  // O valor vai só para o "céu" (poucos elementos) e só quando muda: a rolagem fica leve.
  useEffect(() => {
    const el = sec.current;
    const ceu = el?.querySelector<HTMLElement>(".final__sky");
    if (!el || !ceu || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sai = (t: number) => 1 - Math.pow(1 - t, 2);
    let atual = "";
    const aplicar = (p: number) => {
      const v = sai(Math.min(1, Math.max(0, p))).toFixed(3);
      if (v !== atual) ceu.style.setProperty("--fp", (atual = v));
    };
    aplicar(0);
    return scroll(aplicar, { target: el, offset: ["start 75%", "end end"] });
  }, []);

  return (
    <section ref={sec} id="orcamento" className="sec sec--g1 final" aria-labelledby="cta-titulo">
      <div className="final__light" aria-hidden="true" />
      <div className="final__sky" aria-hidden="true">
        <Sparkles pontos={brilhos} />
        <div className="final__horizon">
          <span className="final__glow" />
          <span className="final__line" />
          <span className="final__rim" />
          <span className="final__glint" />
        </div>
      </div>
      <div className="wrap">
        <h2 id="cta-titulo" className="display" data-reveal="0">{chamada.titulo}</h2>
        <p data-reveal="1">{chamada.texto}</p>

        {/* Cartão do perfil: o arroba à esquerda e o botão de ação à direita, numa pílula só. */}
        <a className="composer glass" href={linkInstagram()} target="_blank" rel="noopener noreferrer" data-reveal="2">
          <span className="composer__id">
            <span className="composer__av" aria-hidden="true">
              <InstagramIcon />
            </span>
            <span className="composer__txt">
              <b>@{contato.instagram}</b>
              <small>{chamada.perfil}</small>
            </span>
          </span>
          <span className={buttonVariants({ variant: "ice" })}>
            {chamada.whats} <ArrowRight className="arrow" aria-hidden="true" />
          </span>
        </a>

        <div className="final__alt" data-reveal="3">
          <span>{chamada.ou}</span>
          <a href={linkEmail()} className={buttonVariants({ variant: "glass", size: "sm" })}>
            <Mail aria-hidden="true" /> {chamada.email}
          </a>
        </div>
      </div>
    </section>
  );
}
