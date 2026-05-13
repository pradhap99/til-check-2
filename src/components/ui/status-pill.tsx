import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * StatusPill — small dot + label combo that visualises entity state
 * (campaign, application, payout). One pill per status, never two side-by-side.
 */
const pillVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium leading-none",
  {
    variants: {
      tone: {
        live:    "bg-status-live/12 text-status-live  ring-1 ring-inset ring-status-live/30",
        pending: "bg-status-pending/14 text-status-pending ring-1 ring-inset ring-status-pending/30",
        closed:  "bg-status-closed/15 text-status-closed ring-1 ring-inset ring-status-closed/30",
        hot:     "bg-status-hot/12 text-status-hot ring-1 ring-inset ring-status-hot/30",
        danger:  "bg-status-danger/14 text-status-danger ring-1 ring-inset ring-status-danger/30",
        info:    "bg-status-info/14 text-status-info ring-1 ring-inset ring-status-info/30",
        neutral: "bg-secondary text-secondary-foreground ring-1 ring-inset ring-border",
      },
      size: {
        sm: "h-5 px-2 text-[10px]",
        md: "h-6 px-2.5 text-xs",
        lg: "h-7 px-3 text-sm",
      },
      pulse: {
        true: "animate-pulse-glow-gold",
        false: "",
      },
    },
    defaultVariants: { tone: "neutral", size: "md", pulse: false },
  },
);

const dotTone: Record<NonNullable<VariantProps<typeof pillVariants>["tone"]>, string> = {
  live:    "bg-status-live",
  pending: "bg-status-pending",
  closed:  "bg-status-closed",
  hot:     "bg-status-hot",
  danger:  "bg-status-danger",
  info:    "bg-status-info",
  neutral: "bg-muted-foreground",
};

export interface StatusPillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {
  hideDot?: boolean;
}

const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(
  ({ className, tone = "neutral", size, pulse, hideDot, children, ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      className={cn(pillVariants({ tone, size, pulse }), className)}
      {...props}
    >
      {!hideDot && (
        <span
          aria-hidden
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full",
            dotTone[tone ?? "neutral"],
            tone === "live" && "animate-pulse",
          )}
        />
      )}
      {children}
    </span>
  ),
);
StatusPill.displayName = "StatusPill";

export { StatusPill, pillVariants };
