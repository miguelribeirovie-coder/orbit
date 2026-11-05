// Entradas das seções com a Motion (motion.dev): sobe 24px e perde um leve desfoque, em sequência.
// O conteúdo já vem visível no HTML; só o que está abaixo da dobra é escondido, e só com JavaScript.
import { useEffect } from "react";
import { animate, inView } from "motion";

export function useRevealAll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    // No celular e em telas de toque: sem desfoque (é o efeito que mais pesa) e um deslocamento menor.
    const leve = window.matchMedia("(max-width: 999px), (hover: none)").matches;
    const fold = window.innerHeight * 0.95;
    const stops: (() => void)[] = [];

    for (const el of items) {
      if (el.getBoundingClientRect().top < fold) continue;
      const order = Number(el.dataset.reveal || 0);
      el.style.opacity = "0";
      el.style.transform = leve ? "translateY(16px)" : "translateY(24px)";
      if (!leve) el.style.filter = "blur(6px)";
      stops.push(
        inView(
          el,
          () => {
            animate(
              el,
              leve ? { opacity: 1, transform: "translateY(0px)" } : { opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" },
              { duration: leve ? 0.6 : 0.8, delay: order * (leve ? 0.06 : 0.08), ease: [0.16, 1, 0.3, 1] }
            ).then(() => {
              el.style.filter = "";
            });
          },
          { amount: 0.1 }
        )
      );
    }
    return () => stops.forEach((s) => s());
  }, []);
}
