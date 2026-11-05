// Visor de um site em tamanho real (W×H), reduzido por escala para caber na moldura.
// Rola sozinho quando recebe `scroll` (0 a 1, Motion), ou com o mouse quando `native` está ligado.
// A rolagem automática move o conteúdo com transform (a placa de vídeo faz o trabalho, sem redesenhar
// o site inteiro a cada quadro), o que deixa o topo leve no celular.
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { MotionValue } from "motion/react";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Viewport({
  w,
  h,
  scroll,
  native = false,
  topInset = 0,
  overlay,
  children,
  label,
}: {
  w: number;
  h: number;
  scroll?: MotionValue<number>;
  native?: boolean;
  topInset?: number;
  overlay?: ReactNode;
  children: ReactNode;
  label?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0.5);

  useIsoLayoutEffect(() => {
    const el = outer.current;
    if (!el) return;
    const update = () => {
      if (el.clientWidth) setS(el.clientWidth / w);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);

  useEffect(() => {
    const sc = scroller.current;
    const ct = content.current;
    if (!scroll || native || !sc || !ct) return;
    let max = 0;
    const apply = (f: number) => {
      ct.style.transform = `translate3d(0, ${-Math.round(f * max)}px, 0)`;
    };
    // Mede a altura do site uma vez e de novo só quando ela muda (troca de site, imagens carregando).
    const medir = () => {
      max = Math.max(0, ct.offsetHeight - sc.clientHeight);
      apply(scroll.get());
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(ct);
    const off = scroll.on("change", apply);
    return () => {
      off();
      ro.disconnect();
    };
  }, [scroll, native]);

  return (
    <div ref={outer} className="vp" style={{ aspectRatio: `${w} / ${h}` }}>
      <div className="vp__layer" style={{ width: w, height: h, transform: `scale(${s})` }}>
        <div
          ref={scroller}
          className={native ? "vp__scroll vp__scroll--native" : "vp__scroll"}
          tabIndex={native ? 0 : -1}
          aria-label={native ? label : undefined}
          role={native ? "region" : undefined}
        >
          <div ref={content} className={scroll && !native ? "vp__content vp__content--auto" : "vp__content"} style={{ paddingTop: topInset }}>
            {children}
          </div>
        </div>
        {overlay}
      </div>
    </div>
  );
}
