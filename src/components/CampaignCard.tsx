import { Campaign } from "@/data/mockData";
import { Calendar, Users, Flame, Sparkles, ArrowRight, Lock, Star, MapPin } from "lucide-react";
import { CREATOR_LEVELS } from "@/lib/creatorLevels";

interface CampaignCardProps {
  campaign: Campaign & { compensationType?: string; minCreatorLevel?: number };
  index?: number;
  userLevel?: number;
}

const categoryColors: Record<string, string> = {
  Tech: "category-strip-tech", Fashion: "category-strip-fashion", Beauty: "category-strip-beauty",
  Food: "category-strip-food", Fitness: "category-strip-fitness", Travel: "category-strip-travel",
  Gaming: "category-strip-gaming", Finance: "category-strip-finance", Comedy: "category-strip-comedy",
  Lifestyle: "category-strip-lifestyle", Cafe: "category-strip-food", Dining: "category-strip-food",
  Staycation: "category-strip-travel",
};

const campaignImageMap: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
  "2": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
  "3": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  "4": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
  "5": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400",
  "6": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
  "7": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
  "8": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
  "cafe-001": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
  "cafe-002": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
  "dining-001": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
  "staycation-001": "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400",
};

const categoryImages: Record<string, string> = {
  Tech: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=300&fit=crop",
  Beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=300&fit=crop",
  Fashion: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=300&fit=crop",
  Finance: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=300&fit=crop",
  Food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=300&fit=crop",
  Fitness: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=300&fit=crop",
  Travel: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=300&fit=crop",
  Gaming: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=300&fit=crop",
  Comedy: "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=600&h=300&fit=crop",
  Lifestyle: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&h=300&fit=crop",
  Cafe: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=300&fit=crop",
  Dining: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=300&fit=crop",
  Staycation: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&h=300&fit=crop",
};

const platformColors: Record<string, string> = {
  Instagram: "bg-gradient-to-r from-pink-500 to-pink-600 text-white",
  YouTube: "bg-red-500 text-white",
  Twitter: "bg-blue-400 text-white",
};

const CampaignCard = ({ campaign, index = 0, userLevel = 1 }: CampaignCardProps) => {
  const slotsLeft = campaign.slots - campaign.filled;
  const progress = (campaign.filled / campaign.slots) * 100;
  const isHot = progress >= 70;
  const isNew = index === 0;
  const image = campaignImageMap[campaign.id] || categoryImages[campaign.category] || categoryImages.Tech;
  const compType = (campaign as any).compensationType || "Paid";
  const requiredLevel = (campaign as any).minCreatorLevel || 0;
  const isLocked = requiredLevel > 0 && userLevel < requiredLevel;
  const levelInfo = requiredLevel > 0 ? CREATOR_LEVELS[requiredLevel - 1] : null;

  const deadlineDays = (() => {
    const d = new Date(campaign.deadline);
    if (isNaN(d.getTime())) return 30;
    return Math.ceil((d.getTime() - Date.now()) / 86400000);
  })();
  const deadlineColor = deadlineDays < 7 ? "text-destructive" : deadlineDays < 14 ? "text-amber-500" : "text-muted-foreground";

  return (
    <div
      className={`rounded-2xl overflow-hidden bg-card border border-border shadow-elev-1 cursor-pointer active:scale-[0.97] transition-transform duration-150 opacity-0 animate-fade-up category-strip ${categoryColors[campaign.category] || ""}`}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
    >
      {/* Image Header */}
      <div className="relative h-[140px]">
        <img src={image} alt={campaign.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {isHot && (
          <span className="absolute top-2.5 left-2.5 badge-hot text-[9px] px-2 py-0.5 rounded-full font-heading font-bold flex items-center gap-0.5">
            <Flame className="w-2.5 h-2.5" /> Hot
          </span>
        )}
        {isNew && !isHot && (
          <span className="absolute top-2.5 left-2.5 badge-new text-[9px] px-2 py-0.5 rounded-full font-heading font-bold flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5" /> New
          </span>
        )}
        {requiredLevel > 0 && (
          <span className={`absolute bottom-2.5 left-2.5 text-[9px] px-2 py-0.5 rounded-full font-heading font-bold flex items-center gap-0.5 ${isLocked ? "bg-foreground/80 text-background" : "bg-accent/90 text-accent-foreground"}`}>
            <Star className="w-2.5 h-2.5" /> Level {requiredLevel}+
          </span>
        )}
        <span className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[11px] font-heading font-bold px-2.5 py-1 rounded-lg shadow-elev-2">
          {campaign.budget}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 pl-6">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-7 h-7 rounded-lg bg-secondary overflow-hidden flex items-center justify-center shrink-0">
            {campaign.logo?.startsWith("http") ? (
              <img src={campaign.logo} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <span className="text-xs font-heading font-bold text-foreground">{campaign.brand.charAt(0)}</span>
            )}
          </div>
          <span className="text-xs text-foreground font-medium">{campaign.brand}</span>
        </div>

        <h3 className="font-heading font-bold text-[15px] text-foreground leading-tight">{campaign.title}</h3>

        {/* Location */}
        {campaign.location && (
          <div className="flex items-center gap-1 mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="text-[11px] text-muted-foreground">{campaign.location}</span>
          </div>
        )}

        {/* Deadline + Slots */}
        <div className="flex items-center gap-4 mt-1.5 text-xs">
          <span className={`flex items-center gap-1 font-medium ${deadlineColor}`}>
            <Calendar className="w-3.5 h-3.5" /> {campaign.date || campaign.deadline}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-3.5 h-3.5" /> {slotsLeft} slots left
          </span>
        </div>

        {/* Progress */}
        <div className="mt-3">
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                slotsLeft <= 2 ? "bg-destructive" : slotsLeft <= 4 ? "bg-amber-500" : "bg-accent"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {campaign.platforms.map((p) => (
            <span key={p} className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${platformColors[p] || "bg-secondary text-muted-foreground"}`}>{p}</span>
          ))}
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">{campaign.category}</span>
          {compType !== "Paid" && (
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
              compType === "Barter" ? "bg-accent/10 text-accent" : "bg-blue-500/10 text-blue-500"
            }`}>{compType}</span>
          )}
        </div>

        {/* Apply CTA */}
        {isLocked ? (
          <button className="w-full mt-3 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-heading font-semibold flex items-center justify-center gap-1 cursor-not-allowed" disabled>
            <Lock className="w-3.5 h-3.5" /> Level {requiredLevel} Required
          </button>
        ) : (
          <button className="w-full mt-3 py-2 rounded-xl text-white text-xs font-heading font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform btn-shimmer-hover" style={{ background: "linear-gradient(135deg, hsl(var(--champagne)), hsl(var(--champagne-deep)))" }}>
            Apply Now <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CampaignCard;
