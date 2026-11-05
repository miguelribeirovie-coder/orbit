// shadcn/ui Input (via shadcn MCP): campo grafite, borda fina clara, foco azul-gelo.
import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-14 w-full min-w-0 rounded-2xl border border-[var(--line-2)] bg-[var(--g0)] px-5 text-[length:var(--step-body)] text-[var(--text)] outline-none",
        "caret-[var(--ice)] placeholder:text-[var(--text-3)] selection:bg-[var(--ice)] selection:text-[var(--ice-ink)]",
        "transition-[border-color,box-shadow] duration-150 focus-visible:border-[var(--mist)] focus-visible:ring-[3px] focus-visible:ring-[var(--focus)]",
        className
      )}
      {...props}
    />
  );
}

export { Input };
