import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** ISO-8601 string or Date or epoch ms. */
  deadline: string | Date | number;
  /** Update interval in ms. Default 60_000 (every minute). */
  intervalMs?: number;
  /** Show the clock icon. */
  icon?: boolean;
  /** Force urgency style. By default urgency triggers under 24h. */
  urgent?: boolean;
  /** Custom format for short ranges. */
  expiredLabel?: string;
}

function diffParts(target: number) {
  const ms = Math.max(0, target - Date.now());
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86_400);
  const hours = Math.floor((total % 86_400) / 3_600);
  const minutes = Math.floor((total % 3_600) / 60);
  return { ms, days, hours, minutes };
}

function format({ ms, days, hours, minutes }: ReturnType<typeof diffParts>) {
  if (ms === 0) return null;
  if (days >= 1) return `${days}d ${hours}h`;
  if (hours >= 1) return `${hours}h ${minutes}m`;
  return `${Math.max(1, minutes)}m`;
}

const CountdownPill = React.forwardRef<HTMLSpanElement, CountdownPillProps>(
  ({ deadline, intervalMs = 60_000, icon = true, urgent, expiredLabel = "Closed", className, ...props }, ref) => {
    const targetMs = React.useMemo(() => {
      if (deadline instanceof Date) return deadline.getTime();
      if (typeof deadline === "number") return deadline;
      return new Date(deadline).getTime();
    }, [deadline]);

    const [parts, setParts] = React.useState(() => diffParts(targetMs));
    React.useEffect(() => {
      setParts(diffParts(targetMs));
      const id = window.setInterval(() => setParts(diffParts(targetMs)), intervalMs);
      return () => window.clearInterval(id);
    }, [targetMs, intervalMs]);

    const label = format(parts);
    const isUrgent = urgent ?? (parts.ms > 0 && parts.days < 1);
    const isExpired = label === null;

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium leading-none ring-1 ring-inset",
          "font-numeric",
          isExpired
            ? "bg-secondary text-muted-foreground ring-border"
            : isUrgent
              ? "bg-status-hot/12 text-status-hot ring-status-hot/30"
              : "bg-secondary text-secondary-foreground ring-border",
          className,
        )}
        {...props}
      >
        {icon && <Clock aria-hidden className="size-3" />}
        {isExpired ? expiredLabel : label}
      </span>
    );
  },
);
CountdownPill.displayName = "CountdownPill";

export { CountdownPill };
