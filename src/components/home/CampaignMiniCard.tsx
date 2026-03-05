import { Heart, IndianRupee } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CampaignMiniCardProps {
  campaign: {
    id: string;
    brand: string;
    logo: string;
    title: string;
    budget: string;
    category: string;
    compensationType?: string;
    tagline?: string;
  };
  index?: number;
}

const CampaignMiniCard = ({ campaign, index = 0 }: CampaignMiniCardProps) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const compType = campaign.compensationType || "Paid";

  return (
    <div
      onClick={() => navigate(`/campaigns/${campaign.id}`)}
      className="border border-border rounded-2xl p-3.5 cursor-pointer hover-lift active:scale-[0.97] transition-transform duration-150 bg-card opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
          {campaign.logo && campaign.logo.startsWith("http") ? (
            <img src={campaign.logo} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <span className="text-sm font-heading font-bold text-primary">{campaign.brand.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-heading font-semibold text-foreground truncate">{campaign.title}</h4>
          <p className="text-[11px] text-muted-foreground">{campaign.brand}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 hover:bg-secondary transition-colors"
        >
          <Heart className={`w-4 h-4 transition-all duration-200 ${saved ? "text-red-500 fill-red-500 scale-110" : "text-muted-foreground"}`} />
        </button>
      </div>
      <div className="flex items-center gap-2 mt-2.5">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
          compType === "Barter" ? "bg-accent/10 text-accent" :
          compType === "Hybrid" ? "bg-chart-4/10 text-chart-4" :
          "bg-emerald-500/10 text-emerald-600"
        }`}>
          {compType}
        </span>
        <span className="text-xs font-heading font-semibold text-foreground flex items-center gap-0.5">
          <IndianRupee className="w-3 h-3" /> {campaign.budget}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground">{campaign.category}</span>
      </div>
    </div>
  );
};

export default CampaignMiniCard;
