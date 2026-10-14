import { ReactNode } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentsComingSoonNoticeProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Banner shown at the top of every payment screen. TIL has no payment provider, so no money
 * moves anywhere in the app. Keep the default copy unless a screen needs a more specific line.
 */
const PaymentsComingSoonNotice = ({ className, children }: PaymentsComingSoonNoticeProps) => (
  <div
    role="note"
    data-testid="payments-coming-soon"
    className={cn("rounded-xl border border-accent/20 bg-accent/5 p-3 flex items-start gap-2.5", className)}
  >
    <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
    <div className="min-w-0">
      <p className="text-xs font-heading font-semibold text-foreground">Payments are coming soon</p>
      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
        {children ?? "TIL doesn't move money yet. Until payments launch, creators and brands settle payment directly."}
      </p>
    </div>
  </div>
);

export default PaymentsComingSoonNotice;
