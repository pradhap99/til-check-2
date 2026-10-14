import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ComingSoonBadgeProps {
  className?: string;
}

/**
 * Small visible label for any payment feature that is not live yet (UPI payouts, escrow, vouchers,
 * bank transfers, invoicing). Same badge style as SampleBadge.
 */
const ComingSoonBadge = ({ className }: ComingSoonBadgeProps) => (
  <Badge
    data-testid="coming-soon-badge"
    className={cn("bg-accent/10 text-accent border-0 px-1.5 py-0 font-medium shrink-0 whitespace-nowrap hover:bg-accent/10", className)}
  >
    <Clock className="w-2.5 h-2.5 mr-0.5" />Coming soon
  </Badge>
);

export default ComingSoonBadge;
