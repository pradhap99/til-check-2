import { Campaign } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, ArrowRight } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
  index: number;
}

const CampaignCard = ({ campaign, index }: CampaignCardProps) => {
  const progressPercent = (campaign.filled / campaign.slots) * 100;

  return (
    <div
      className="glass-card rounded-2xl p-5 hover-lift cursor-pointer opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-2xl">
            {campaign.logo}
          </div>
          <div>
            <h3 className="font-heading font-semibold text-card-foreground">{campaign.brand}</h3>
            <p className="text-sm text-muted-foreground">{campaign.title}</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">{campaign.category}</Badge>
      </div>

      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{campaign.description}</p>

      <div className="flex gap-2 mt-3 flex-wrap">
        {campaign.platforms.map((p) => (
          <Badge key={p} variant="outline" className="text-xs border-border text-muted-foreground">{p}</Badge>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-muted-foreground">Slots filled</span>
          <span className="font-heading font-semibold text-card-foreground">{campaign.filled}/{campaign.slots}</span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-heading font-bold gradient-text">{campaign.budget}</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{campaign.deadline}</span>
          </div>
        </div>
        <Button size="sm" variant="gradient" className="h-8 text-xs">
          Apply <ArrowRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default CampaignCard;
