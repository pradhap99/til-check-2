import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarStackItem {
  src?: string | null;
  fallback: string;
  alt?: string;
}

interface AvatarStackProps extends React.HTMLAttributes<HTMLDivElement> {
  people: AvatarStackItem[];
  /** Max visible avatars; the rest collapse into a "+N" chip. */
  max?: number;
  size?: "xs" | "sm" | "md" | "lg";
  /** Show a numeric overflow chip after the avatars. */
  overflow?: boolean;
}

const sizeMap = {
  xs: { ring: "size-6 text-[10px]", overlap: "-ml-2" },
  sm: { ring: "size-7 text-xs",     overlap: "-ml-2" },
  md: { ring: "size-9 text-sm",     overlap: "-ml-2.5" },
  lg: { ring: "size-11 text-base",  overlap: "-ml-3" },
} as const;

const AvatarStack = React.forwardRef<HTMLDivElement, AvatarStackProps>(
  ({ people, max = 4, size = "sm", overflow = true, className, ...props }, ref) => {
    const visible = people.slice(0, max);
    const remaining = Math.max(0, people.length - max);
    const dims = sizeMap[size];
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center", className)}
        aria-label={`${people.length} people`}
        {...props}
      >
        {visible.map((p, i) => (
          <Avatar
            key={i}
            className={cn(
              dims.ring,
              i > 0 && dims.overlap,
              "ring-2 ring-card",
            )}
          >
            {p.src ? <AvatarImage src={p.src} alt={p.alt ?? p.fallback} /> : null}
            <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
              {p.fallback}
            </AvatarFallback>
          </Avatar>
        ))}
        {overflow && remaining > 0 && (
          <span
            className={cn(
              dims.ring,
              dims.overlap,
              "inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground font-medium ring-2 ring-card",
              "font-numeric tabular-nums",
            )}
            data-numeric="true"
          >
            +{remaining}
          </span>
        )}
      </div>
    );
  },
);
AvatarStack.displayName = "AvatarStack";

export { AvatarStack };
