import { useEffect, useMemo, useRef, useState } from "react";
import { animate, easeInOut, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type AnimationPlaybackControls } from "motion/react";
import { hero, linkInstagram } from "@/content";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "@/components/Icons";
import { Safari, type AddressState } from "@/demo/Safari";
import { Phone } from "@/demo/Phone";
import { Viewport } from "@/demo/Viewport";
import { DemoSite } from "@/demo/DemoSite";
import { demoMeta, dominio } from "@/demo/sites";
import { Sparkles } from "@/components/Sparkles";

const ease = [0.45, 0, 0.2, 1] as const;

// Estrelinhas em volta do topo do planeta (posições relativas ao planeta).
const brilhos = [
  { x: "6%", y: "12%", s: 13, d: "0s" },
  { x: "95%", y: "10%", s: 10, d: "1.4s" },
  { x: "80%", y: "-3%", s: 7, d: "2.3s" },
  { x: "22%", y: "-2%", s: 8, d: "0.8s" },
  { x: "101%", y: "22%", s: 9, d: "3s" },
];

/**
 * A sequência do topo, como alguém navegando: rola o site atual, seleciona o endereço,
 * digita o próximo, a barra azul carrega e o novo site aparece. Pausa fora da tela.
 */
function useBrowsing(section: React.RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion();
  const ex = hero.exemplos;
  const [idx, setIdx] = useState(0);
  const [addr, setAddr] = useState<AddressState>({ text: dominio(ex[0].nome), mode: "page" });
  const [shown, setShown] = useState(true);
  const scroll = useMotionValue(0);
  const progress = useMotionValue(0);
  const visible = useRef(true);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [section]);

  useEffect(() => {
    if (reduce) return;
    let alive = true;
    let current: AnimationPlaybackControls | null = null;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const ready = async () => {
      while (alive && (!visible.current || document.hidden)) await wait(400);
    };
    const run = async (mv: typeof scroll, to: number, opts: Parameters<typeof animate>[2]) => {
      current = animate(mv, to, opts as never);
      await current;
      current = null;
    };

    (async () => {
      let i = 0;
      await wait(2200);
      while (alive) {
        await ready();
        await run(scroll, 0.42, { duration: 3, ease });
        if (!alive) break;
        await wait(900);
        await ready();
        await run(scroll, 1, { duration: 2.6, ease });
        if (!alive) break;
        await wait(1200);
        await ready();

        const next = (i + 1) % ex.length;
        const host = dominio(ex[next].nome);
        setAddr({ text: dominio(ex[i].nome), mode: "selected" });
        await wait(520);
        for (let n = 1; n <= host.length && alive; n++) {
          setAddr({ text: host.slice(0, n), mode: "typing" });
          await wait(48 + Math.random() * 46);
        }
        if (!alive) break;
        await wait(380);

        setAddr({ text: host, mode: "page" });
        progress.set(0.04);
        await run(progress, 0.72, { duration: 0.55, ease: "easeOut" });
        setShown(false);
        await wait(140);
        i = next;
        setIdx(i);
        scroll.set(0);
        await wait(80);
        setShown(true);
        await run(progress, 1, { duration: 0.35, ease: "easeOut" });
        progress.set(0);
        await wait(1700);
      }
    })();

    return () => {
      alive = false;
      current?.stop();
    };
  }, [reduce, ex, scroll, progress]);

  return { atual: ex[idx], addr, shown, scroll, progress };
}

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const run = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { atual, addr, shown, scroll, progress } = useBrowsing(section);
  const meta = demoMeta[atual.ramo] ?? demoMeta.padaria;

  // A janela acompanha o ponteiro com uma mola sem quique (só com mouse).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 110, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 110, damping: 20, mass: 0.6 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-3, 3]);

  // Fase 1: a janela começa inclinada para trás e fica de frente conforme a página rola.
  const { scrollYProgress } = useScroll({ target: pin, offset: ["start end", "start 0.1"] });
  const scrollTilt = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const rotateX = useTransform([scrollTilt, sy], ([t, y]: number[]) => t + (0.5 - y) * 3 - 1.5);

  // Fase 2: o planeta fica parado na tela (sticky) e, conforme o dedo rola, o celular sai de cena,
  // a janela diminui e vai para o canto direito (o lugar do celular) e uma frase surge no meio do planeta.
  // Três tamanhos: celular (até 640px), intermediário (até 999px) e computador.
  const [estreito, setEstreito] = useState(false);
  const [celular, setCelular] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 999px)");
    const mc = window.matchMedia("(max-width: 640px)");
    const ver = () => {
      setEstreito(mq.matches);
      setCelular(mc.matches);
    };
    ver();
    mq.addEventListener("change", ver);
    mc.addEventListener("change", ver);
    return () => {
      mq.removeEventListener("change", ver);
      mc.removeEventListener("change", ver);
    };
  }, []);
  // Progresso do trilho: 0 quando o palco gruda na tela, 1 quando ele solta (medido a cada quadro de rolagem).
  const trilho = useMotionValue(0);
  useEffect(() => {
    const st = stage.current;
    const rn = run.current;
    if (!st || !rn || reduce) return;
    let fundo = 0;
    const medir = () => {
      fundo = (parseFloat(getComputedStyle(st).top) || 0) + st.offsetHeight;
    };
    const calc = () => {
      const r = rn.getBoundingClientRect();
      if (!r.height) return trilho.set(0);
      trilho.set(Math.min(1, Math.max(0, (fundo - r.top) / r.height)));
    };
    // A rolagem já chega no ritmo dos quadros: calcula direto (uma medida só por evento).
    const pedir = () => calc();
    const mudar = () => {
      medir();
      pedir();
    };
    medir();
    calc();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", mudar);
    return () => {
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", mudar);
    };
  }, [reduce, trilho]);
  const fase = useSpring(trilho, { stiffness: 280, damping: 36, mass: 0.25 });
  // Curva suave (acelera e desacelera) para a janela não andar "duro" com o dedo.
  const suave = { ease: easeInOut };
  const janelaX = useTransform(fase, [0, 0.7], ["0%", estreito ? "23%" : "31%"], suave);
  const janelaY = useTransform(fase, [0, 0.7], ["0%", celular ? "76%" : estreito ? "70%" : "57%"], suave);
  const janelaS = useTransform(fase, [0, 0.7], [1, celular ? 0.5 : estreito ? 0.52 : 0.5], suave);
  const janelaR = useTransform(fase, [0, 0.7], [0, estreito ? 6 : 8], suave);
  // O celular sai logo no começo: desce, vai para a direita e some, abrindo o lugar para a janela.
  const foneX = useTransform(fase, [0, 0.28], ["0%", estreito ? "50%" : "70%"]);
  const foneY = useTransform(fase, [0, 0.28], ["0%", "26%"]);
  const foneS = useTransform(fase, [0, 0.28], [1, 0.8]);
  const foneR = useTransform(fase, [0, 0.28], [0, -16]);
  const foneO = useTransform(fase, [0, 0.22], [1, 0]);
  // A frase entra no meio do planeta quando a janela já saiu da frente.
  const fraseO = useTransform(fase, [0.28, 0.6], [0, 1]);
  const fraseY = useTransform(fase, [0.28, 0.6], [26, 0]);
  const fraseS = useTransform(fase, [0.28, 0.6], [0.94, 1]);
  // No computador o planeta encolhe um pouco para caber inteiro na tela enquanto está preso.
  const orbS = useTransform(fase, [0, 0.7], [1, estreito ? 1 : 0.84], suave);
  const baixoO = useTransform(fase, [0.08, 0.55], [0, 1]);

  useEffect(() => {
    const el = stage.current;
    if (!el || reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px.set(Math.max(-0.5, Math.min(0.5, (e.clientX - r.left) / r.width - 0.5)));
      py.set(Math.max(-0.5, Math.min(0.5, (e.clientY - r.top) / r.height - 0.5)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, px, py]);

  const page = { opacity: shown ? 1 : 0, transition: "opacity 180ms ease" };
  // Os sites de exemplo só mudam quando troca o ramo (não a cada letra digitada no endereço).
  const siteGrande = useMemo(() => <DemoSite ramo={atual.ramo} nome={atual.nome} eager />, [atual.ramo, atual.nome]);
  const siteCelular = useMemo(() => <DemoSite ramo={atual.ramo} nome={atual.nome} mobile eager />, [atual.ramo, atual.nome]);

  return (
    <section id="inicio" ref={section} className="hero" aria-labelledby="hero-titulo">
      <div className="hero__light" aria-hidden="true" />
      <div className="hero__rays" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="wrap hero__grid">
        <h1 id="hero-titulo" className="display hero__title">
          {hero.linhas.map((l, i) => (
            <span className="line" key={l} data-in style={{ ["--i" as string]: i }}>
              {l}
            </span>
          ))}
        </h1>
        <div className="hero__copy">
          <p data-in style={{ ["--i" as string]: 2 }}>{hero.apoio}</p>
          <div className="hero__actions" data-in style={{ ["--i" as string]: 3 }}>
            <a href={linkInstagram()} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "ice" })}>
              {hero.acao} <ArrowRight className="arrow" aria-hidden="true" />
            </a>
            <a href="#como-funciona" className={buttonVariants({ variant: "link" })}>
              {hero.link}
            </a>
          </div>
          <p className="hero__note" data-in style={{ ["--i" as string]: 4 }}>{hero.nota}: sites criados para mostrar o estilo do trabalho.</p>
        </div>

        {/* O trilho: enquanto ele passa, o palco fica parado na tela e a animação anda com a rolagem. */}
        <div ref={pin} className="stage-pin">
          <div ref={stage} className="stage" data-in style={{ ["--i" as string]: 3 }}>
            <motion.div className="orb" aria-hidden="true" style={reduce ? undefined : { scale: orbS }}>
              <span className="orb__pulse" />
              <span className="orb__bloom" />
              <span className="orb__hole" />
              <span className="orb__fireglow" />
              <span className="orb__glass" />
              <span className="orb__fire" />
              <span className="orb__rim" />
              <motion.span className="orb__low" style={reduce ? { opacity: 1 } : { opacity: baixoO }} />
              <Sparkles pontos={brilhos} />
            </motion.div>
            {!reduce && (
              <motion.div className="stage__phrase" style={{ opacity: fraseO, y: fraseY, scale: fraseS }}>
                <p className="stage__phrase-t">
                  {hero.planeta.linhas.map((l) => (
                    <span className="line" key={l}>
                      {l}
                    </span>
                  ))}
                </p>
                <p className="stage__phrase-s">{hero.planeta.apoio}</p>
              </motion.div>
            )}
            <motion.div
              className="stage__tilt"
              style={reduce ? { rotateY: 0, rotateX: 4, transformPerspective: 1800 } : { rotateY, rotateX, scale, transformPerspective: 1800 }}
            >
              <motion.div
                className="stage__win"
                data-ui
                role="img"
                aria-label={`Exemplo: o site da ${atual.nome} aberto num navegador e num celular.`}
                style={reduce ? undefined : { x: janelaX, y: janelaY, scale: janelaS, rotateY: janelaR, transformPerspective: 1600, transformOrigin: "50% 0%" }}
              >
                <Safari address={addr} progress={progress}>
                  <div style={page}>
                    <Viewport w={1280} h={800} scroll={scroll}>
                      {siteGrande}
                    </Viewport>
                  </div>
                </Safari>
              </motion.div>
              <motion.div
                className="stage__phone"
                data-ui
                style={reduce ? undefined : { x: foneX, y: foneY, scale: foneS, rotateY: foneR, opacity: foneO, transformPerspective: 1200 }}
              >
                <div style={page}>
                  <Phone host={dominio(atual.nome)} bg={meta.bg} ink={meta.ink} scroll={scroll}>
                    {siteCelular}
                  </Phone>
                </div>
              </motion.div>
            </motion.div>
          </div>
          <div ref={run} className="stage-pin__run" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
