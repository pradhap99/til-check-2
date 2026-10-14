import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SampleBadgeProps {
  className?: string;
}

/**
 * Small visible label for any section that renders hardcoded sample rows.
 * Matches the app's existing "Example" badge style (accent tint, tag icon).
 * Never put it on data that comes from Supabase.
 */
const SampleBadge = ({ className }: SampleBadgeProps) => (
  <Badge
    data-testid="sample-badge"
    className={cn("bg-accent/10 text-accent border-0 px-1.5 py-0 font-medium shrink-0 whitespace-nowrap hover:bg-accent/10", className)}
  >
    <Tag className="w-2.5 h-2.5 mr-0.5" />Sample data
  </Badge>
);

export default SampleBadge;
