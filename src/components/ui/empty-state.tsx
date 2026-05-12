import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lottie or illustration node (e.g. a <Player /> from lottie-react). */
  illustration?: React.ReactNode;
  /** Title — short, sentence case. */
  title: string;
  /** Body — one or two short lines. */
  description?: React.ReactNode;
  /** Primary action. */
  action?: { label: string; onClick?: () => void; href?: string };
  /** Tone affects illustration tint and copy color. */
  tone?: "neutral" | "primary" | "emerald";
  /** Compact variant for inline empties (sidebars, cards). */
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "py-8 gap-3",
  md: "py-14 gap-4",
  lg: "py-20 gap-5",
} as const;

const toneMap = {
  neutral: "text-foreground",
  primary: "text-foreground",
  emerald: "text-foreground",
} as const;

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    { illustration, title, description, action, tone = "neutral", size = "md", className, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      role="status"
      className={cn(
        "flex flex-col items-center justify-center text-center px-6",
        sizeMap[size],
        toneMap[tone],
        className,
      )}
      {...props}
    >
      {illustration && (
        <div className="size-32 sm:size-40 [&_svg]:size-full [&>div]:size-full opacity-95">
          {illustration}
        </div>
      )}
      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base sm:text-lg font-semibold tracking-tight">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      {action && (
        action.href ? (
          <a
            href={action.href}
            className="mt-2 inline-flex h-10 items-center rounded-md bg-gradient-brand px-4 text-sm font-medium text-primary-foreground shadow-elev-2 transition-transform duration-base ease-out-soft hover:-translate-y-px"
          >
            {action.label}
          </a>
        ) : (
          <Button variant="gradient" size="default" onClick={action.onClick} className="mt-2">
            {action.label}
          </Button>
        )
      )}
    </div>
  ),
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
