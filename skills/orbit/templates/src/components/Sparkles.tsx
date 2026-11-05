// Estrelinhas de quatro pontas que piscam devagar (decoração; ficam paradas com movimento reduzido).
export type Ponto = { x: string; y: string; s: number; d: string };

const padrao: Ponto[] = [
  { x: "14%", y: "20%", s: 14, d: "0s" },
  { x: "84%", y: "16%", s: 10, d: "1.2s" },
  { x: "70%", y: "4%", s: 7, d: "2.1s" },
  { x: "28%", y: "6%", s: 8, d: "0.7s" },
  { x: "93%", y: "30%", s: 12, d: "1.7s" },
];

export function Sparkles({ className = "sparkles", pontos = padrao }: { className?: string; pontos?: Ponto[] }) {
  return (
    <span className={className} aria-hidden="true">
      {pontos.map((p, i) => (
        <svg key={i} viewBox="0 0 24 24" width={p.s} height={p.s} style={{ left: p.x, top: p.y, animationDelay: p.d }}>
          <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0z" />
        </svg>
      ))}
    </span>
  );
}
