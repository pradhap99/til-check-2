import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex items-baseline gap-1 rounded-full px-3 py-1 font-numeric leading-none tabular-nums",
  {
    variants: {
      tone: {
        neutral: "bg-secondary text-secondary-foreground ring-1 ring-inset ring-border",
        primary: "bg-primary/12 text-primary ring-1 ring-inset ring-primary/25",
        emerald: "bg-emerald/12 text-emerald ring-1 ring-inset ring-emerald/30",
        glass:   "bg-card/70 backdrop-blur text-foreground ring-1 ring-inset ring-border/50",
      },
      size: {
        sm: "h-6 text-xs px-2.5",
        md: "h-7 text-sm",
        lg: "h-8 text-base px-3.5",
      },
    },
    defaultVariants: { tone: "primary", size: "md" },
  },
);

export interface PriceTagProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof tagVariants> {
  /** Numeric amount; pass a string only for explicit ranges. */
  amount: number | string;
  /** Currency symbol (defaults to $). */
  currency?: string;
  /** Optional "/month", "/post", etc. */
  suffix?: string;
  /** Render as a value range, e.g. `[1000, 2500]`. */
  range?: [number, number];
}

const fmt = new Intl.NumberFormat("en-US");

function display(amount: number | string) {
  if (typeof amount === "string") return amount;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 10_000) return `${Math.round(amount / 1_000)}k`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}k`;
  return fmt.format(amount);
}

const PriceTag = React.forwardRef<HTMLSpanElement, PriceTagProps>(
  (
    { amount, currency = "$", suffix, range, tone, size, className, "data-numeric": _, ...props },
    ref,
  ) => {
    const label = range
      ? `${currency}${display(range[0])} – ${currency}${display(range[1])}`
      : `${currency}${display(amount)}`;
    return (
      <span
        ref={ref}
        className={cn(tagVariants({ tone, size }), className)}
        data-numeric="true"
        {...props}
      >
        <span className="font-semibold">{label}</span>
        {suffix && <span className="text-[0.85em] opacity-70">{suffix}</span>}
      </span>
    );
  },
);
PriceTag.displayName = "PriceTag";

export { PriceTag };
