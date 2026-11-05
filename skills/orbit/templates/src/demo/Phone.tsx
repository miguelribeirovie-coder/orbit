// Celular no estilo iPhone: moldura, ilha no topo, barra de status e a barra de endereço flutuante do Safari.
// Tudo desenhado em tamanho real (390×844) e reduzido junto com o site.
import type { MotionValue } from "motion/react";
import type { ReactNode } from "react";
import { Viewport } from "./Viewport";

function StatusIcons() {
  return (
    <span className="ip-icons">
      <svg viewBox="0 0 18 12" width="18" height="12"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
      <svg viewBox="0 0 16 12" width="16" height="12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0z" /><path d="M3.4 6.9a6.5 6.5 0 0 1 9.2 0l-1.4 1.4a4.5 4.5 0 0 0-6.4 0z" /><path d="M1.2 4.7a9.6 9.6 0 0 1 13.6 0l-1.4 1.4a7.6 7.6 0 0 0-10.8 0z" /></svg>
      <svg viewBox="0 0 27 13" width="27" height="13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity="0.4" /><rect x="2" y="2" width="18" height="9" rx="2" /><rect x="25" y="4.5" width="1.6" height="4" rx="0.8" opacity="0.4" /></svg>
    </span>
  );
}

export function Phone({
  host,
  bg,
  ink,
  scroll,
  native = false,
  label,
  children,
}: {
  host: string;
  bg: string;
  ink: string;
  scroll?: MotionValue<number>;
  native?: boolean;
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="ip" aria-hidden={native ? undefined : true}>
      <div className="ip-screen">
        <Viewport
          w={390}
          h={844}
          scroll={scroll}
          native={native}
          label={label}
          topInset={54}
          overlay={
            <>
              <div className="ip-status" style={{ background: bg, color: ink }}>
                <span>9:41</span>
                <StatusIcons />
              </div>
              <span className="ip-island" />
              <div className="ip-bottom">
                <span className="ip-pill">
                  <span className="ip-aa">aA</span>
                  <span className="ip-host">{host}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-2.6-6.4" /><path d="M21 4v5h-5" /></svg>
                </span>
                <span className="ip-home" />
              </div>
            </>
          }
        >
          {children}
        </Viewport>
      </div>
    </div>
  );
}
