import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Value 0–5; halves allowed. */
  value: number;
  /** Total stars. */
  max?: number;
  /** Interactive mode: emits onChange when a star is clicked. */
  onChange?: (next: number) => void;
  size?: "sm" | "md" | "lg";
  /** Show numeric value next to stars. */
  showValue?: boolean;
  /** Locked / read-only. */
  readOnly?: boolean;
}

const sizeMap = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
} as const;

const RatingStars = React.forwardRef<HTMLDivElement, RatingStarsProps>(
  (
    { value, max = 5, onChange, size = "md", showValue, readOnly, className, ...props },
    ref,
  ) => {
    const [hover, setHover] = React.useState<number | null>(null);
    const interactive = !!onChange && !readOnly;
    const displayValue = hover ?? value;

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-1", className)}
        role={interactive ? "radiogroup" : "img"}
        aria-label={`Rated ${value.toFixed(1)} out of ${max}`}
        {...props}
      >
        <div
          className="flex items-center gap-0.5"
          onMouseLeave={() => setHover(null)}
        >
          {Array.from({ length: max }, (_, i) => {
            const idx = i + 1;
            const filled = displayValue >= idx;
            const half = !filled && displayValue >= idx - 0.5;
            return (
              <button
                type="button"
                key={idx}
                role={interactive ? "radio" : undefined}
                aria-checked={interactive ? value === idx : undefined}
                tabIndex={interactive ? 0 : -1}
                disabled={!interactive}
                onMouseEnter={() => interactive && setHover(idx)}
                onClick={() => onChange?.(idx)}
                className={cn(
                  "relative",
                  interactive
                    ? "cursor-pointer transition-transform duration-fast ease-out-soft hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                    : "cursor-default",
                )}
              >
                <Star
                  aria-hidden
                  className={cn(
                    sizeMap[size],
                    filled
                      ? "fill-champagne text-champagne"
                      : "text-muted-foreground/40",
                  )}
                />
                {half && (
                  <Star
                    aria-hidden
                    className={cn(
                      sizeMap[size],
                      "absolute inset-0 fill-champagne text-champagne",
                    )}
                    style={{ clipPath: "inset(0 50% 0 0)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
        {showValue && (
          <span
            className="font-numeric text-xs text-muted-foreground tabular-nums"
            data-numeric="true"
          >
            {value.toFixed(1)}
          </span>
        )}
      </div>
    );
  },
);
RatingStars.displayName = "RatingStars";

export { RatingStars };
