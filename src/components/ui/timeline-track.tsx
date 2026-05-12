import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineStep {
  id: string;
  label: string;
  /** Optional descriptor under the label (date, count, etc). */
  helper?: string;
}

export type TimelineStatus = "complete" | "current" | "upcoming" | "skipped" | "failed";

interface TimelineTrackProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: TimelineStep[];
  /** Zero-based index of the active step. */
  currentIndex: number;
  /** Per-step status overrides (id → status). Default: derived from currentIndex. */
  statusMap?: Record<string, TimelineStatus>;
  orientation?: "horizontal" | "vertical";
  /** Compact variant for cards. */
  compact?: boolean;
}

function defaultStatus(i: number, currentIndex: number): TimelineStatus {
  if (i < currentIndex) return "complete";
  if (i === currentIndex) return "current";
  return "upcoming";
}

const dotClass: Record<TimelineStatus, string> = {
  complete: "bg-emerald text-primary-foreground",
  current:  "bg-champagne text-primary-foreground ring-4 ring-champagne/25 animate-pulse-glow-gold",
  upcoming: "bg-secondary text-muted-foreground ring-1 ring-border",
  skipped:  "bg-secondary text-muted-foreground ring-1 ring-border line-through",
  failed:   "bg-destructive text-destructive-foreground",
};

const connectorClass: Record<TimelineStatus, string> = {
  complete: "bg-emerald",
  current:  "bg-gradient-to-r from-emerald to-champagne",
  upcoming: "bg-border",
  skipped:  "bg-border",
  failed:   "bg-destructive/60",
};

const TimelineTrack = React.forwardRef<HTMLDivElement, TimelineTrackProps>(
  (
    { steps, currentIndex, statusMap, orientation = "horizontal", compact, className, ...props },
    ref,
  ) => {
    const horizontal = orientation === "horizontal";
    return (
      <div
        ref={ref}
        role="list"
        aria-label="Progress"
        className={cn(
          horizontal ? "flex w-full items-start" : "flex flex-col gap-3",
          className,
        )}
        {...props}
      >
        {steps.map((step, i) => {
          const status = statusMap?.[step.id] ?? defaultStatus(i, currentIndex);
          const isLast = i === steps.length - 1;
          if (horizontal) {
            return (
              <div
                key={step.id}
                role="listitem"
                aria-current={status === "current" ? "step" : undefined}
                className="flex flex-1 items-start min-w-0"
              >
                <div className="flex flex-col items-center gap-1.5 min-w-0">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center rounded-full text-xs font-semibold transition-all duration-base ease-out-soft",
                      compact ? "size-5" : "size-6",
                      dotClass[status],
                    )}
                  >
                    {status === "complete" ? <Check className={cn(compact ? "size-3" : "size-3.5")} /> : i + 1}
                  </span>
                  <div className="text-center min-w-0 w-full">
                    <p
                      className={cn(
                        "text-[11px] sm:text-xs font-medium truncate",
                        status === "current" ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </p>
                    {!compact && step.helper && (
                      <p className="text-[10px] text-muted-foreground/80 truncate">
                        {step.helper}
                      </p>
                    )}
                  </div>
                </div>
                {!isLast && (
                  <span
                    aria-hidden
                    className={cn(
                      "mx-1 sm:mx-2 mt-2.5 h-0.5 flex-1 rounded-full",
                      connectorClass[status],
                    )}
                  />
                )}
              </div>
            );
          }
          // Vertical
          return (
            <div
              key={step.id}
              role="listitem"
              aria-current={status === "current" ? "step" : undefined}
              className="flex items-start gap-3"
            >
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold transition-all duration-base ease-out-soft",
                    dotClass[status],
                  )}
                >
                  {status === "complete" ? <Check className="size-3.5" /> : i + 1}
                </span>
                {!isLast && (
                  <span
                    aria-hidden
                    className={cn("mt-1 w-0.5 flex-1 min-h-6 rounded-full", connectorClass[status])}
                  />
                )}
              </div>
              <div className="-mt-0.5 pb-2">
                <p
                  className={cn(
                    "text-sm font-medium",
                    status === "current" ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </p>
                {step.helper && (
                  <p className="text-xs text-muted-foreground/80">{step.helper}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);
TimelineTrack.displayName = "TimelineTrack";

export { TimelineTrack };
