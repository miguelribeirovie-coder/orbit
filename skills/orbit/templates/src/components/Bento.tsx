import type { ReactNode } from "react";
import { motion, MotionConfig } from "motion/react";
import { bento, quemSomos } from "@/content";
import { Check } from "@/components/Icons";
import { Sparkles } from "@/components/Sparkles";

const once = { once: true, amount: 0.5 } as const;
const entra = (delay: number) => ({
  initial: { opacity: 0, y: 12, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: once,
  transition: { type: "spring" as const, bounce: 0, duration: 0.6, delay },
});

function Chat() {
  const c = bento.chat;
  return (
    <div className="chat">
      <div className="chat__head">
        <span className="chat__av">M</span>
        <span className="chat__who">
          <b>{c.contato}</b>
          <small>
            <i className="chat__on" /> {c.status}
          </small>
        </span>
      </div>
      <motion.p className="chat__b chat__b--in" {...entra(0.25)}>
        {c.cliente}
      </motion.p>
      <motion.p className="chat__b chat__b--out" {...entra(0.95)}>
        {c.resposta}
      </motion.p>
      <motion.span className="chat__typing" {...entra(1.6)}>
        <i />
        <i />
        <i />
      </motion.span>
    </div>
  );
}

const brilhosSelo = [
  { x: "18%", y: "20%", s: 12, d: "0s" },
  { x: "82%", y: "16%", s: 9, d: "1.1s" },
  { x: "88%", y: "70%", s: 13, d: "2s" },
  { x: "12%", y: "76%", s: 8, d: "0.6s" },
  { x: "70%", y: "90%", s: 7, d: "2.7s" },
];

function Selo() {
  return (
    <div className="seal">
      <span className="seal__glow" />
      <span className="seal__ring" />
      <span className="seal__orbit" />
      <svg className="seal__shield" viewBox="0 0 64 72">
        <defs>
          <linearGradient id="escudo-face" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.45" stopColor="#dbe3ea" />
            <stop offset="1" stopColor="#8995a1" />
          </linearGradient>
          <linearGradient id="escudo-borda" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#5d6873" />
          </linearGradient>
        </defs>
        <path d="M32 2 60 12v20c0 18-12 31-28 38C16 63 4 50 4 32V12L32 2z" fill="url(#escudo-borda)" />
        <path d="M32 7.5 55 16v16.4c0 15-9.8 26-23 32.2C18.8 58.4 9 47.4 9 32.4V16L32 7.5z" fill="url(#escudo-face)" />
        <path d="M32 7.5 55 16v16.4c0 4-.7 7.8-2 11.2L32 7.5z" fill="#fff" opacity="0.35" />
        <path d="m21 36 7.5 7.5L44 27" fill="none" stroke="#23272c" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Sparkles pontos={brilhosSelo} />
      <motion.span className="seal__chip" {...entra(0.5)}>
        <Check aria-hidden="true" /> {bento.contrato.selo}
      </motion.span>
    </div>
  );
}

function Etapas() {
  const e = bento.entrega;
  return (
    <div className="steps">
      <ol>
        {e.etapas.map((s, i) => (
          <motion.li key={s.nome} className={`steps__row is-${s.estado}`} {...entra(0.15 + i * 0.18)}>
            <span className="steps__dot">{s.estado === "feito" && <Check aria-hidden="true" />}</span>
            <span className="steps__name">{s.nome}</span>
            {s.estado === "agora" ? (
              <span className="steps__bar">
                <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: e.progresso }} viewport={once} transition={{ duration: 1.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }} />
              </span>
            ) : (
              <span className="steps__bar steps__bar--empty" />
            )}
          </motion.li>
        ))}
      </ol>
      <motion.span className="chip-float" {...entra(1.2)}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2c.5 5.2 4.8 9.5 10 10-5.2.5-9.5 4.8-10 10-.5-5.2-4.8-9.5-10-10C7.2 11.5 11.5 7.2 12 2z" />
        </svg>
        {e.chip}
      </motion.span>
    </div>
  );
}

function Pedidos() {
  const s = bento.suporte;
  return (
    <div className="tickets">
      <div className="tickets__head">
        <b>{s.titulo}</b>
        <span>{s.plano}</span>
      </div>
      <ul>
        {s.itens.map((t, i) => (
          <motion.li key={t.texto} {...entra(0.2 + i * 0.2)}>
            <span>{t.texto}</span>
            <span className={t.status === "Feito" ? "pill pill--ok" : "pill pill--now"}>{t.status}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const telas: Record<string, ReactNode> = {
  "Atendimento direto": <Chat />,
  "Contrato sempre": <Selo />,
  "Entrega ágil": <Etapas />,
  "Suporte depois": <Pedidos />,
};
const ordem = ["Atendimento direto", "Contrato sempre", "Entrega ágil", "Suporte depois"];

/** Grade de cartões (bento) com uma mini-tela para cada diferencial. */
export function Bento() {
  const itens = ordem.map((n) => quemSomos.diferenciais.find((d) => d.nome === n)).filter((d) => d !== undefined);
  return (
    <MotionConfig reducedMotion="user">
      <ul className="bento">
        {itens.map((d, i) => (
          <li key={d.nome} className="bento__card glass spot" data-reveal={String(i % 2)}>
            <div className="bento__ui" aria-hidden="true">
              {telas[d.nome]}
            </div>
            <div className="bento__txt">
              <h3 className="lead">{d.nome}</h3>
              <p>{d.texto}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="bento__note">{bento.nota}</p>
    </MotionConfig>
  );
}
