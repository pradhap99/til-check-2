import { Campaign } from "@/data/mockData";
import { Calendar, Users } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
  index?: number;
}

const CampaignCard = ({ campaign, index = 0 }: CampaignCardProps) => {
  const slotsLeft = campaign.slots - campaign.filled;
  const progress = (campaign.filled / campaign.slots) * 100;

  return (
    <div
      className="border border-border rounded-xl p-4 cursor-pointer hover-lift opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start gap-3">
        <img
          src={typeof campaign.logo === 'string' && campaign.logo.startsWith('http') ? campaign.logo : ''}
          alt={campaign.brand}
          className="w-10 h-10 rounded-lg object-cover bg-secondary shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-sm text-foreground truncate">{campaign.title}</h3>
          <p className="text-xs text-muted-foreground">{campaign.brand}</p>
        </div>
        <span className="font-heading font-bold text-sm text-foreground shrink-0">{campaign.budget}</span>
      </div>

      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {campaign.deadline}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" /> {slotsLeft} slots left
        </span>
      </div>

      <div className="mt-3">
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-foreground rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex gap-1.5 mt-2.5 flex-wrap">
        {campaign.platforms.map((p) => (
          <span key={p} className="text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground font-medium">{p}</span>
        ))}
        <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground font-medium">{campaign.category}</span>
      </div>
    </div>
  );
};

export default CampaignCard;
