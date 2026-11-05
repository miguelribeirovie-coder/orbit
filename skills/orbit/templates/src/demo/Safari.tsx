// Janela de navegador no estilo do Safari para macOS (modo claro): botões da janela, setas,
// barra de endereço com cadeado e a barra azul de carregamento.
import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { ChevronLeft, ChevronRight, Copy, Lock, PanelLeft, Plus, RotateCw, Share } from "lucide-react";

export type AddressState = { text: string; mode: "page" | "typing" | "selected" };

/** Barra azul de carregamento: aparece entre 0 e 1 e some ao terminar. */
function ProgressBar({ value }: { value: MotionValue<number> }) {
  const opacity = useTransform(value, (v) => (v > 0 && v < 1 ? 1 : 0));
  return <motion.span className="sf-progress" style={{ scaleX: value, opacity }} />;
}

export function Safari({
  address,
  progress,
  children,
  className = "",
}: {
  address: AddressState;
  progress?: MotionValue<number>;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`sf ${className}`}>
      <div className="sf-bar" aria-hidden="true">
        <span className="sf-lights"><i /><i /><i /></span>
        <span className="sf-nav">
          <PanelLeft />
          <ChevronLeft className="sf-off" />
          <ChevronRight className="sf-off" />
        </span>
        <span className={`sf-addr sf-addr--${address.mode}`}>
          {address.mode === "page" ? (
            <>
              <Lock className="sf-lock" />
              <span className="sf-host">{address.text}</span>
              <RotateCw className="sf-reload" />
            </>
          ) : (
            <span className="sf-input">
              <span className={address.mode === "selected" ? "sf-sel" : undefined}>{address.text}</span>
              {address.mode === "typing" && <span className="sf-caret" />}
            </span>
          )}
          {progress && <ProgressBar value={progress} />}
        </span>
        <span className="sf-tools">
          <Share />
          <Plus />
          <Copy />
        </span>
      </div>
      <div className="sf-view">{children}</div>
    </div>
  );
}
