import { Campaign } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
  index: number;
}

const CampaignCard = ({ campaign, index }: CampaignCardProps) => {
  const progressPercent = (campaign.filled / campaign.slots) * 100;
  const slotsLeft = campaign.slots - campaign.filled;

  return (
    <div
      className="glass-card rounded-2xl p-4 hover-lift cursor-pointer opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center text-xl shrink-0 shadow-md">
          {campaign.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-sm text-card-foreground truncate">{campaign.title}</h3>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-[10px] px-1.5 py-0 shrink-0 ml-1">{campaign.category}</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">by {campaign.brand}</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed">{campaign.description}</p>

      {/* Progress */}
      <div className="mt-3">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">{slotsLeft} slots left</span>
          <span className="font-heading font-semibold text-card-foreground">{campaign.filled}/{campaign.slots}</span>
        </div>
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full gradient-primary rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/50">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="font-heading font-bold text-xs gradient-text">{campaign.budget}</span>
          <span className="flex items-center gap-0.5">
            <Calendar className="w-3 h-3" /> {campaign.deadline}
          </span>
        </div>
        <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
          <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
