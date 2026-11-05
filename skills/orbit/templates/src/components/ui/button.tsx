// shadcn/ui Button (via shadcn MCP), com as variantes do site: azul-gelo, vidro e link.
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "btn group/btn inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-medium",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--focus)]",
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        ice: "bg-[var(--ice)] text-[var(--ice-ink)] hover:bg-white",
        glass: "glass-btn text-[var(--text)] hover:bg-[rgb(255_255_255/0.1)]",
        link: "px-0 text-[var(--text)] underline decoration-[var(--steel)] decoration-2 underline-offset-[6px] hover:decoration-[var(--mist)]",
      },
      size: {
        sm: "h-9 px-4 text-[length:var(--step-small)] [&_svg]:size-4",
        default: "h-12 px-6 text-[length:var(--step-body)] [&_svg]:size-[18px]",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "ice", size: "default" },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
