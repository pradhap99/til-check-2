import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, X, ChevronRight, MapPin } from "lucide-react";

interface Recommendation {
  id: string;
  type: "campaign" | "creator";
  title: string;
  subtitle: string;
  matchPercent: number;
  reason: string;
  avatar?: string;
  location?: string;
}

const RecommendationCarousel = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Recommendation[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    generateRecommendations();
  }, [user, role]);

  const generateRecommendations = async () => {
    if (role === "creator") {
      // Recommend campaigns to creators
      const [{ data: creatorProfile }, { data: campaigns }, { data: applied }] = await Promise.all([
        supabase.from("creator_profiles").select("*").eq("user_id", user!.id).maybeSingle(),
        supabase.from("campaigns").select("*").eq("status", "active").limit(20),
        supabase.from("campaign_applications").select("campaign_id").eq("creator_user_id", user!.id),
      ]);

      const appliedIds = new Set((applied || []).map(a => a.campaign_id));
      const cp = creatorProfile;
      const { data: profile } = await supabase.from("profiles").select("location_city").eq("user_id", user!.id).maybeSingle();

      const scored = (campaigns || [])
        .filter(c => !appliedIds.has(c.id))
        .map(c => {
          let score = 0;
          let reasons: string[] = [];
          // Niche match (40%)
          if (cp?.primary_niche && c.niche_targeting?.includes(cp.primary_niche)) {
            score += 40;
            reasons.push(`Matches your ${cp.primary_niche} niche`);
          } else if (cp?.secondary_niches?.some((n: string) => c.niche_targeting?.includes(n))) {
            score += 25;
            reasons.push("Related to your content categories");
          }
          // City match (20%)
          if (profile?.location_city && c.location_targeting?.includes(profile.location_city)) {
            score += 20;
            reasons.push(`Based in ${profile.location_city}`);
          }
          // Follower range (20%)
          if (cp?.instagram_followers) {
            const range = c.follower_range || "";
            if (range.includes("micro") && cp.instagram_followers >= 10000 && cp.instagram_followers <= 100000) { score += 20; reasons.push("Your follower count fits"); }
            else if (range.includes("macro") && cp.instagram_followers > 100000) { score += 20; reasons.push("Your reach qualifies"); }
            else { score += 10; }
          }
          // Engagement (10%)
          if (cp?.engagement_rate && cp.engagement_rate >= (c.min_engagement_rate || 0)) {
            score += 10;
            reasons.push("Great engagement rate");
          }
          // Recency (10%)
          const daysOld = (Date.now() - new Date(c.created_at).getTime()) / 86400000;
          if (daysOld < 7) { score += 10; reasons.push("Posted recently"); }
          else if (daysOld < 14) { score += 5; }

          return {
            id: c.id,
            type: "campaign" as const,
            title: c.title,
            subtitle: `₹${parseInt(c.budget_per_creator || c.total_budget || "0").toLocaleString("en-IN")}`,
            matchPercent: Math.min(score, 100),
            reason: reasons[0] || "Recommended for you",
          };
        })
        .filter(r => r.matchPercent >= 20)
        .sort((a, b) => b.matchPercent - a.matchPercent)
        .slice(0, 8);

      setItems(scored);
    } else if (role === "brand") {
      // Recommend creators to brands
      const [{ data: brandCampaigns }, { data: creators }] = await Promise.all([
        supabase.from("campaigns").select("niche_targeting, location_targeting, follower_range").eq("brand_user_id", user!.id).limit(5),
        supabase.from("creator_profiles").select("user_id, primary_niche, instagram_followers, engagement_rate, instagram_handle").limit(50),
      ]);

      const niches = new Set((brandCampaigns || []).flatMap(c => c.niche_targeting || []));
      const locations = new Set((brandCampaigns || []).flatMap(c => c.location_targeting || []));

      const creatorIds = (creators || []).map(c => c.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, location_city, avatar_url").in("user_id", creatorIds);
      const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));

      const scored = (creators || []).map(c => {
        let score = 0;
        let reasons: string[] = [];
        const p = profileMap.get(c.user_id);
        if (c.primary_niche && niches.has(c.primary_niche)) { score += 40; reasons.push(`Expert in ${c.primary_niche}`); }
        if (p?.location_city && locations.has(p.location_city)) { score += 20; reasons.push(`Based in ${p.location_city}`); }
        if (c.instagram_followers && c.instagram_followers > 10000) { score += 20; reasons.push(`${(c.instagram_followers / 1000).toFixed(0)}K followers`); }
        if (c.engagement_rate && c.engagement_rate > 3) { score += 10; reasons.push(`${c.engagement_rate}% engagement`); }
        score += 10;

        return {
          id: c.user_id,
          type: "creator" as const,
          title: p?.full_name || "Creator",
          subtitle: c.primary_niche || "Creator",
          matchPercent: Math.min(score, 100),
          reason: reasons[0] || "Active on platform",
          avatar: p?.avatar_url,
          location: p?.location_city,
        };
      })
        .filter(r => r.matchPercent >= 20)
        .sort((a, b) => b.matchPercent - a.matchPercent)
        .slice(0, 8);

      setItems(scored);
    }
  };

  const handleDismiss = (id: string) => {
    setDismissed(prev => new Set([...prev, id]));
  };

  const visible = items.filter(i => !dismissed.has(i.id));

  if (visible.length === 0) return null;

  return (
    <section className="mt-5">
      <div className="flex items-center gap-2 mb-3 px-5">
        <Sparkles className="w-4 h-4 text-accent" />
        <h3 className="font-heading font-semibold text-sm text-foreground">Recommended for You</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
        {visible.map((item, i) => (
          <div
            key={item.id}
            className="min-w-[200px] max-w-[200px] border border-border rounded-xl p-3.5 shrink-0 hover-lift cursor-pointer relative group opacity-0 animate-fade-up"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
            onClick={() => navigate(item.type === "campaign" ? `/campaigns/${item.id}` : `/creators/${item.id}`)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); handleDismiss(item.id); }}
              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-accent/10 text-accent border-0 text-[9px] font-heading">
                {item.matchPercent}% match
              </Badge>
            </div>

            <h4 className="font-heading font-semibold text-xs text-foreground truncate">{item.title}</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">{item.subtitle}</p>

            {item.location && (
              <p className="text-[9px] text-muted-foreground mt-1 flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" /> {item.location}
              </p>
            )}

            <p className="text-[9px] text-accent mt-2 font-medium">{item.reason}</p>

            <div className="flex items-center gap-1 mt-2 text-[9px] text-muted-foreground">
              <span>View details</span>
              <ChevronRight className="w-2.5 h-2.5" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendationCarousel;
