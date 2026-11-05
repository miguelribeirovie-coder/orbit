// Logo Word MNR (versão principal, fundo Grafite) e o símbolo MNR, vetorizados de media/brand/logo-sheet.webp.
// Letras em Gelo, barra em Aço, com o vão do desenho original dos dois lados da barra.
import { useId } from "react";
import { logo } from "./logo-paths";

type Variant = "main" | "symbol";
const GAP = 12; // 3px na escala original × 4

export function Logo({ variant = "main", className, title }: { variant?: Variant; className?: string; title?: string }) {
  const v = logo[variant];
  const id = useId().replace(/:/g, "");
  const clip = `vao-${id}`;
  const right = v.bar.x + v.bar.w + GAP;
  return (
    <svg
      viewBox={`0 0 ${v.w} ${v.h}`}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <clipPath id={clip}>
          <rect x="0" y="0" width={v.bar.x - GAP} height={v.h} />
          <rect x={right} y="0" width={v.w - right} height={v.h} />
        </clipPath>
      </defs>
      <path className="logo__letters" fillRule="evenodd" clipPath={`url(#${clip})`} d={v.letters} />
      <rect className="logo__bar" x={v.bar.x} y={v.bar.y} width={v.bar.w} height={v.bar.h} />
    </svg>
  );
}
