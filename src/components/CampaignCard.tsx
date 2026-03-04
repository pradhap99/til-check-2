import { Campaign } from "@/data/mockData";
import { Calendar, Users, Flame, Sparkles } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
  index?: number;
}

const categoryColors: Record<string, string> = {
  Tech: "category-strip-tech",
  Fashion: "category-strip-fashion",
  Beauty: "category-strip-beauty",
  Food: "category-strip-food",
  Fitness: "category-strip-fitness",
  Travel: "category-strip-travel",
  Gaming: "category-strip-gaming",
  Finance: "category-strip-finance",
  Comedy: "category-strip-comedy",
  Lifestyle: "category-strip-lifestyle",
};

const CampaignCard = ({ campaign, index = 0 }: CampaignCardProps) => {
  const slotsLeft = campaign.slots - campaign.filled;
  const progress = (campaign.filled / campaign.slots) * 100;
  const isHot = progress >= 70;
  const isNew = index === 0;

  return (
    <div
      className={`border border-border rounded-xl p-4 cursor-pointer hover-lift btn-micro opacity-0 animate-fade-up category-strip ${categoryColors[campaign.category] || ""}`}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start gap-3 pl-2">
        <img
          src={typeof campaign.logo === 'string' && campaign.logo.startsWith('http') ? campaign.logo : ''}
          alt={campaign.brand}
          className="w-10 h-10 rounded-lg object-cover bg-secondary shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-heading font-semibold text-sm text-foreground truncate">{campaign.title}</h3>
            {isHot && (
              <span className="badge-hot text-[8px] px-1.5 py-0.5 rounded-full font-heading font-bold flex items-center gap-0.5 shrink-0">
                <Flame className="w-2.5 h-2.5" /> Hot
              </span>
            )}
            {isNew && !isHot && (
              <span className="badge-new text-[8px] px-1.5 py-0.5 rounded-full font-heading font-bold flex items-center gap-0.5 shrink-0">
                <Sparkles className="w-2.5 h-2.5" /> New
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{campaign.brand}</p>
        </div>
        <span className="font-heading font-bold text-sm text-foreground shrink-0">{campaign.budget}</span>
      </div>

      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground pl-2">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {campaign.deadline}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" /> {slotsLeft} slots left
        </span>
      </div>

      <div className="mt-3 pl-2">
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isHot ? "bg-destructive" : "bg-foreground"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex gap-1.5 mt-2.5 flex-wrap pl-2">
        {campaign.platforms.map((p) => (
          <span key={p} className="text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground font-medium">{p}</span>
        ))}
        <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground font-medium">{campaign.category}</span>
      </div>
    </div>
  );
};

export default CampaignCard;
