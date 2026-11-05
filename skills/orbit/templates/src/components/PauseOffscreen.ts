// Pausa as animações em CSS das seções que estão fora da tela (economiza bateria e deixa a rolagem lisa).
import { useEffect } from "react";

export function usePauseOffscreen() {
  useEffect(() => {
    const zonas = Array.from(document.querySelectorAll<HTMLElement>("main > section, body footer"));
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) el.removeAttribute("data-off");
          else el.setAttribute("data-off", "");
        }
      },
      { rootMargin: "200px 0px" },
    );
    zonas.forEach((z) => io.observe(z));
    return () => io.disconnect();
  }, []);
}
