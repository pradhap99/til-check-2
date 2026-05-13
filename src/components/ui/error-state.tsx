import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: React.ReactNode;
  /** Show a retry CTA. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Compact inline style for cards. */
  inline?: boolean;
}

const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      title = "Something went wrong",
      description = "We couldn't load this just now. It's worth another try.",
      onRetry,
      retryLabel = "Try again",
      inline,
      className,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center text-center px-6",
        inline ? "py-6 gap-3" : "py-14 gap-4",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-destructive/12 text-destructive",
          inline ? "size-10" : "size-14",
        )}
      >
        <AlertTriangle className={cn(inline ? "size-5" : "size-7")} aria-hidden />
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className={cn(inline ? "text-sm" : "text-base sm:text-lg", "font-semibold tracking-tight")}>
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw aria-hidden /> {retryLabel}
        </Button>
      )}
    </div>
  ),
);
ErrorState.displayName = "ErrorState";

export { ErrorState };
