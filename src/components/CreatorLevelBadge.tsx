import { CREATOR_LEVELS, getCreatorLevel } from "@/lib/creatorLevels";
import { Award, Lock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CreatorLevelBadgeProps {
  followers: number;
  engagementRate?: number;
  completedCampaigns?: number;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
  showBenefits?: boolean;
}

const CreatorLevelBadge = ({ followers, engagementRate = 0, completedCampaigns = 0, size = "sm", showProgress = false, showBenefits = false }: CreatorLevelBadgeProps) => {
  const { current, next, progressPercent, progressLabel } = getCreatorLevel(followers, engagementRate, completedCampaigns);

  if (size === "sm") {
    return (
      <Badge className={`bg-gradient-to-r ${current.badgeGradient} text-white border-0 text-[8px] px-1.5 py-0 gap-0.5`}>
        <Award className="w-2.5 h-2.5" /> L{current.level}
      </Badge>
    );
  }

  if (size === "md") {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${current.badgeGradient} flex items-center justify-center shadow-elev-2`}>
          <Award className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <p className="text-[11px] font-heading font-semibold text-foreground">{current.name}</p>
          <p className="text-[9px] text-muted-foreground">{current.basePay}</p>
        </div>
      </div>
    );
  }

  // Large with progress
  return (
    <div className="border border-border rounded-2xl p-4 bg-card">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${current.badgeGradient} flex items-center justify-center shadow-elev-3`}>
          <Award className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-heading font-bold text-foreground">Level {current.level}: {current.name}</p>
          </div>
          <p className="text-[10px] text-muted-foreground">Base Pay: {current.basePay}</p>
        </div>
      </div>

      {showProgress && next && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground">Progress to Level {next.level}</span>
            <span className="text-[10px] font-heading font-medium text-foreground">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${current.badgeGradient} transition-all duration-700`} style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="text-[9px] text-muted-foreground mt-1.5">{progressLabel}</p>
        </div>
      )}

      {showBenefits && next && (
        <div className="mt-3 p-2.5 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-[10px] font-heading font-medium text-primary flex items-center gap-1">
            <Lock className="w-3 h-3" /> At Level {next.level}, you'll unlock:
          </p>
          <p className="text-[9px] text-muted-foreground mt-0.5">{next.unlockedBrands}</p>
          <p className="text-[9px] text-primary font-medium mt-0.5">Base Pay: {next.basePay}</p>
        </div>
      )}
    </div>
  );
};

export default CreatorLevelBadge;
