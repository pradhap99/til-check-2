import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { campaigns } from "@/data/mockData";
import { ArrowLeft, MapPin, Calendar, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const categoryConfig: Record<string, { label: string; emoji: string; tags: string[] }> = {
  cafes: { label: "Cafés", emoji: "☕", tags: ["Cafe", "Food"] },
  dining: { label: "Dining", emoji: "🍽️", tags: ["Dining", "Food"] },
  staycations: { label: "Staycations", emoji: "🏖️", tags: ["Staycation", "Travel"] },
  studios: { label: "Studios", emoji: "📸", tags: ["Fashion", "Beauty"] },
  events: { label: "Events", emoji: "🎭", tags: ["Lifestyle", "Comedy"] },
  beauty: { label: "Beauty", emoji: "💄", tags: ["Beauty"] },
  fashion: { label: "Fashion", emoji: "👗", tags: ["Fashion"] },
  tech: { label: "Tech", emoji: "📱", tags: ["Tech"] },
  food: { label: "Food", emoji: "🍔", tags: ["Food"] },
  fitness: { label: "Fitness", emoji: "💪", tags: ["Fitness"] },
};

const campaignImages: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=520&h=320&fit=crop",
  "2": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=520&h=320&fit=crop",
  "3": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=520&h=320&fit=crop",
  "4": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=520&h=320&fit=crop",
  "5": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=520&h=320&fit=crop",
  "6": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=520&h=320&fit=crop",
  "7": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=520&h=320&fit=crop",
  "8": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=520&h=320&fit=crop",
  "cafe-001": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=520&h=320&fit=crop",
  "cafe-002": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=520&h=320&fit=crop",
  "dining-001": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=520&h=320&fit=crop",
  "staycation-001": "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=520&h=320&fit=crop",
};

const categoryImages: Record<string, string> = {
  Tech: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=520&h=320&fit=crop",
  Beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=520&h=320&fit=crop",
  Fashion: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=520&h=320&fit=crop",
  Food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=520&h=320&fit=crop",
  Cafe: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=520&h=320&fit=crop",
  Dining: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=520&h=320&fit=crop",
  Staycation: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=520&h=320&fit=crop",
};

const ExperienceCategory = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(4);

  const config = categoryConfig[category || ""] || { label: category || "", emoji: "📋", tags: [] };

  const filtered = campaigns.filter(c =>
    config.tags.some(tag => c.category === tag || c.platforms?.includes(tag))
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <Layout>
      <div className="page-transition">
        <header className="px-5 pt-6 pb-2 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-heading font-bold text-foreground">{config.emoji} {config.label}</h1>
            <p className="text-[10px] text-muted-foreground">{filtered.length} campaigns available</p>
          </div>
        </header>

        <div className="px-5 mt-4 space-y-4 pb-6">
          {visible.map((campaign, i) => {
            const image = campaignImages[campaign.id] || categoryImages[campaign.category] || categoryImages.Food;
            const slotsLeft = campaign.slots - campaign.filled;
            return (
              <div
                key={campaign.id}
                className="rounded-2xl overflow-hidden bg-card border border-border animate-fade-slide-up cursor-pointer active:scale-[0.98] transition-transform"
                style={{ animationDelay: `${i * 80}ms` }}
                onClick={() => navigate(`/campaigns/${campaign.id}`)}
              >
                <div className="relative h-[160px]">
                  <img src={image} alt={campaign.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-3">
                    <h3 className="text-white font-heading font-bold text-[15px] leading-tight">{campaign.title}</h3>
                  </div>
                  <span className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[10px] font-heading font-bold px-2 py-0.5 rounded-lg">
                    {campaign.budget}
                  </span>
                </div>
                <div className="p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-heading font-bold text-foreground">{campaign.brand.charAt(0)}</span>
                    </div>
                    <span className="text-xs text-foreground font-medium">{campaign.brand}</span>
                  </div>
                  {campaign.location && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="text-[11px] text-muted-foreground">{campaign.location}</span>
                    </div>
                  )}
                  {campaign.date && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="text-[11px] text-muted-foreground">{campaign.date}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">Paid</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Users className="w-3 h-3" /> {slotsLeft} slots left
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="h-8 rounded-xl text-[11px] font-heading bg-accent hover:bg-accent/90 text-accent-foreground btn-hover-lift"
                      onClick={(e) => { e.stopPropagation(); navigate(`/campaigns/${campaign.id}`); }}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {hasMore && (
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl font-heading text-sm"
              onClick={() => setVisibleCount(v => v + 4)}
            >
              Load More ({filtered.length - visibleCount} remaining)
            </Button>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-2">{config.emoji}</p>
              <p className="text-sm text-muted-foreground">No campaigns in {config.label} yet</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ExperienceCategory;
