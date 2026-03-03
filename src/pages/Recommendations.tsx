import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Sparkles, Users, TrendingUp, Star, MessageCircle, Bookmark,
  BookmarkCheck, ChevronRight, Filter, RefreshCw, Zap, CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecommendedCreator {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  primary_niche: string | null;
  instagram_followers: number;
  engagement_rate: number;
  verified: boolean;
  rate_reel: string | null;
  rate_feed_post: string | null;
  matchScore: number;
  matchReasons: string[];
  location_city?: string | null;
}

const Recommendations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [creators, setCreators] = useState<RecommendedCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [brandProfile, setBrandProfile] = useState<any>(null);
  const [activeCampaign, setActiveCampaign] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    loadRecommendations();
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) return;
    setLoading(true);

    // Fetch brand profile for matching
    const { data: bp } = await supabase
      .from("brand_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    setBrandProfile(bp);

    // Fetch active campaigns for context
    const { data: campaigns } = await supabase
      .from("campaigns")
      .select("*")
      .eq("brand_user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1);
    const campaign = campaigns?.[0];
    setActiveCampaign(campaign);

    // Fetch all creator profiles with user profiles
    const { data: creatorProfiles } = await supabase
      .from("creator_profiles")
      .select("*")
      .eq("onboarding_completed", true)
      .order("instagram_followers", { ascending: false })
      .limit(50);

    if (!creatorProfiles || creatorProfiles.length === 0) {
      setCreators([]);
      setLoading(false);
      return;
    }

    const userIds = creatorProfiles.map(c => c.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, avatar_url, location_city")
      .in("user_id", userIds);
    const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));

    // Fetch saved creators
    const { data: saved } = await supabase
      .from("saved_creators")
      .select("creator_user_id")
      .eq("brand_user_id", user.id);
    setSavedIds(new Set((saved || []).map(s => s.creator_user_id)));

    // Score creators based on campaign fit
    const scored: RecommendedCreator[] = creatorProfiles.map(cp => {
      const profile = profileMap.get(cp.user_id);
      let score = 50; // base
      const reasons: string[] = [];

      // Niche match
      if (campaign?.niche_targeting?.length > 0) {
        const campaignNiches = (campaign.niche_targeting as string[]).map(n => n.toLowerCase());
        if (cp.primary_niche && campaignNiches.includes(cp.primary_niche.toLowerCase())) {
          score += 25;
          reasons.push("Niche match");
        }
        if (cp.secondary_niches?.some((n: string) => campaignNiches.includes(n.toLowerCase()))) {
          score += 10;
        }
      }

      // Engagement rate bonus
      if (cp.engagement_rate && cp.engagement_rate > 5) {
        score += 15;
        reasons.push("High engagement");
      } else if (cp.engagement_rate && cp.engagement_rate > 3) {
        score += 8;
        reasons.push("Good engagement");
      }

      // Follower range match
      if (campaign?.follower_range) {
        const range = campaign.follower_range;
        const followers = cp.instagram_followers || 0;
        if (range === "nano" && followers >= 1000 && followers < 10000) { score += 15; reasons.push("Follower match"); }
        if (range === "micro" && followers >= 10000 && followers < 50000) { score += 15; reasons.push("Follower match"); }
        if (range === "mid" && followers >= 50000 && followers < 500000) { score += 15; reasons.push("Follower match"); }
        if (range === "macro" && followers >= 500000) { score += 15; reasons.push("Follower match"); }
      }

      // Platform match
      if (campaign?.required_platforms?.length > 0) {
        const requiredPlatforms = (campaign.required_platforms as string[]).map(p => p.toLowerCase());
        if (requiredPlatforms.includes("instagram") && cp.instagram_handle) {
          score += 10;
          reasons.push("Instagram active");
        }
        if (requiredPlatforms.includes("youtube") && cp.youtube_channel) {
          score += 10;
          reasons.push("YouTube active");
        }
      }

      // Verified bonus
      if (cp.verified) {
        score += 5;
        reasons.push("Verified");
      }

      // Location match
      if (campaign?.location_targeting?.length > 0 && profile?.location_city) {
        if ((campaign.location_targeting as string[]).some((l: string) => l.toLowerCase() === profile.location_city?.toLowerCase())) {
          score += 10;
          reasons.push("Location match");
        }
      }

      // Budget fit
      if (campaign?.budget_per_creator && cp.rate_reel) {
        const budget = parseInt(campaign.budget_per_creator);
        const rate = parseInt(cp.rate_reel);
        if (rate <= budget) {
          score += 10;
          reasons.push("Within budget");
        }
      }

      if (reasons.length === 0) reasons.push("Active creator");

      return {
        user_id: cp.user_id,
        full_name: profile?.full_name || "Creator",
        avatar_url: profile?.avatar_url,
        primary_niche: cp.primary_niche,
        instagram_followers: cp.instagram_followers || 0,
        engagement_rate: cp.engagement_rate || 0,
        verified: cp.verified || false,
        rate_reel: cp.rate_reel,
        rate_feed_post: cp.rate_feed_post,
        matchScore: Math.min(score, 99),
        matchReasons: reasons.slice(0, 3),
        location_city: profile?.location_city,
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    setCreators(scored.slice(0, 20));
    setLoading(false);
  };

  const toggleSave = async (creatorUserId: string) => {
    if (!user) return;
    if (savedIds.has(creatorUserId)) {
      await supabase.from("saved_creators").delete()
        .eq("brand_user_id", user.id).eq("creator_user_id", creatorUserId);
      setSavedIds(prev => { const n = new Set(prev); n.delete(creatorUserId); return n; });
    } else {
      await supabase.from("saved_creators").insert({
        brand_user_id: user.id, creator_user_id: creatorUserId
      });
      setSavedIds(prev => new Set(prev).add(creatorUserId));
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-primary";
    if (score >= 60) return "text-accent";
    return "text-muted-foreground";
  };

  return (
    <Layout>
      <header className="px-5 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-heading font-bold text-foreground">Recommendations</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {activeCampaign
            ? `AI-matched creators for "${activeCampaign.title}"`
            : "Creators matched to your brand profile"
          }
        </p>
      </header>

      {/* Context Card */}
      {activeCampaign && (
        <div className="px-5 mt-3">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground">Matching for campaign</p>
                <p className="font-heading font-semibold text-sm text-foreground">{activeCampaign.title}</p>
              </div>
              <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={loadRecommendations}>
                <RefreshCw className="w-3 h-3" /> Refresh
              </Button>
            </div>
            <div className="flex gap-1.5 mt-2">
              {(activeCampaign.niche_targeting as string[])?.slice(0, 3).map((n: string) => (
                <Badge key={n} variant="secondary" className="text-[9px]">{n}</Badge>
              ))}
              {activeCampaign.budget_per_creator && (
                <Badge variant="secondary" className="text-[9px]">₹{parseInt(activeCampaign.budget_per_creator).toLocaleString("en-IN")}/creator</Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Creator List */}
      <div className="px-5 mt-4 space-y-2.5 mb-4">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 rounded-xl gradient-primary animate-pulse-glow mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-heading">Analyzing creator profiles...</p>
          </div>
        ) : creators.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-heading font-medium text-muted-foreground">No recommendations yet</p>
            <p className="text-xs text-muted-foreground mt-1">Create a campaign to get AI-powered creator matches</p>
            <Button variant="gradient" className="mt-4 rounded-xl" onClick={() => navigate("/campaigns/create")}>
              Create Campaign
            </Button>
          </div>
        ) : (
          creators.map((creator, i) => (
            <div key={creator.user_id} className="border border-border rounded-xl p-4 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 50}ms`, animationFillMode: "forwards" }}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={creator.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${creator.full_name}`}
                    alt={creator.full_name}
                    className="w-12 h-12 rounded-lg object-cover bg-secondary"
                  />
                  {creator.verified && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <CheckCircle className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-sm text-foreground truncate">{creator.full_name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {creator.primary_niche && (
                      <Badge variant="secondary" className="text-[9px]">{creator.primary_niche}</Badge>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {creator.instagram_followers >= 1000 ? `${(creator.instagram_followers/1000).toFixed(0)}K` : creator.instagram_followers} followers
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1">
                    <Zap className={`w-3.5 h-3.5 ${getScoreColor(creator.matchScore)}`} />
                    <span className={`font-heading font-bold text-sm ${getScoreColor(creator.matchScore)}`}>{creator.matchScore}%</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground">match</p>
                </div>
              </div>

              {/* Match reasons */}
              <div className="flex gap-1.5 mt-2.5">
                {creator.matchReasons.map((reason, j) => (
                  <Badge key={j} className="bg-primary/5 text-primary border-0 text-[9px]">{reason}</Badge>
                ))}
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 mt-2.5">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{creator.engagement_rate.toFixed(1)}% ER</span>
                </div>
                {creator.rate_reel && (
                  <span className="text-[10px] text-muted-foreground">₹{parseInt(creator.rate_reel).toLocaleString("en-IN")}/reel</span>
                )}
                {creator.location_city && (
                  <span className="text-[10px] text-muted-foreground">{creator.location_city}</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => toggleSave(creator.user_id)}>
                  {savedIds.has(creator.user_id) ? <BookmarkCheck className="w-3.5 h-3.5 text-primary" /> : <Bookmark className="w-3.5 h-3.5" />}
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs rounded-lg flex-1" onClick={() => navigate(`/creators/${creator.user_id}`)}>
                  View Profile <ChevronRight className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="gradient" className="h-8 text-xs rounded-lg flex-1" onClick={() => navigate(`/creators/${creator.user_id}`)}>
                  Invite to Campaign
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Recommendations;
