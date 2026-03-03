import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, Users, Eye, Target, BarChart3, Zap, Star, Award,
  ArrowUp, ArrowDown, IndianRupee, Briefcase, Heart, MessageCircle
} from "lucide-react";

const Analytics = () => {
  const { user, role } = useAuth();
  const [stats, setStats] = useState({
    campaigns: 0, applications: 0, accepted: 0, totalEarned: 0,
    creatorsWorked: 0, avgRating: 4.8,
  });
  const [creatorProfile, setCreatorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      if (role === "creator") {
        const [{ count: appCount }, { count: acceptedCount }, cpResult] = await Promise.all([
          supabase.from("campaign_applications").select("*", { count: "exact", head: true }).eq("creator_user_id", user.id),
          supabase.from("campaign_applications").select("*", { count: "exact", head: true }).eq("creator_user_id", user.id).eq("status", "accepted"),
          supabase.from("creator_profiles").select("*").eq("user_id", user.id).maybeSingle(),
        ]);
        setCreatorProfile(cpResult.data);
        setStats(prev => ({
          ...prev,
          applications: appCount || 0,
          accepted: acceptedCount || 0,
        }));
      } else {
        const [{ count: campCount }, { count: appCount }] = await Promise.all([
          supabase.from("campaigns").select("*", { count: "exact", head: true }).eq("brand_user_id", user.id),
          supabase.from("campaign_applications").select("*, campaigns!inner(brand_user_id)", { count: "exact", head: true }).eq("campaigns.brand_user_id", user.id),
        ]);
        setStats(prev => ({
          ...prev,
          campaigns: campCount || 0,
          applications: appCount || 0,
        }));
      }
      setLoading(false);
    };
    fetchStats();
  }, [user, role]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 rounded-xl gradient-primary animate-pulse-glow" />
        </div>
      </Layout>
    );
  }

  const acceptanceRate = stats.applications > 0 ? Math.round((stats.accepted / stats.applications) * 100) : 0;

  return (
    <Layout>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-heading font-bold text-foreground">Analytics</h1>
        <p className="text-xs text-muted-foreground">
          {role === "creator" ? "Track your growth & performance" : "Campaign performance & ROI"}
        </p>
      </header>

      {/* Overview Cards */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-2.5">
        {role === "creator" ? (
          <>
            <StatCard icon={Eye} label="Profile Views" value="—" trend="+12%" up />
            <StatCard icon={Briefcase} label="Applications" value={stats.applications.toString()} />
            <StatCard icon={Target} label="Acceptance Rate" value={`${acceptanceRate}%`} />
            <StatCard icon={Star} label="Avg Rating" value={stats.avgRating.toFixed(1)} />
            <StatCard icon={Users} label="Followers" value={creatorProfile?.instagram_followers ? `${(creatorProfile.instagram_followers / 1000).toFixed(0)}K` : "—"} />
            <StatCard icon={TrendingUp} label="Engagement" value={creatorProfile?.engagement_rate ? `${creatorProfile.engagement_rate}%` : "—"} />
          </>
        ) : (
          <>
            <StatCard icon={Briefcase} label="Campaigns" value={stats.campaigns.toString()} />
            <StatCard icon={Users} label="Applications" value={stats.applications.toString()} />
            <StatCard icon={IndianRupee} label="Total Spent" value="—" />
            <StatCard icon={TrendingUp} label="Avg ROI" value="—" />
            <StatCard icon={Star} label="Creator Rating" value="4.8" />
            <StatCard icon={Zap} label="Avg Engagement" value="—" />
          </>
        )}
      </div>

      {/* Performance Section */}
      {role === "creator" && (
        <>
          {/* Social Stats */}
          <div className="px-4 mt-5">
            <h3 className="font-heading font-bold text-sm text-foreground mb-3">Social Performance</h3>
            <div className="space-y-2">
              {[
                { platform: "Instagram", followers: creatorProfile?.instagram_followers || 0, icon: "📸", color: "bg-accent/10" },
                { platform: "YouTube", followers: creatorProfile?.youtube_subscribers || 0, icon: "📹", color: "bg-destructive/10" },
                { platform: "TikTok", followers: creatorProfile?.tiktok_followers || 0, icon: "🎵", color: "bg-primary/10" },
              ].filter(p => p.followers > 0).map((p, i) => (
                <div key={i} className="glass-card rounded-2xl p-3.5 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${p.color} flex items-center justify-center text-lg`}>{p.icon}</div>
                  <div className="flex-1">
                    <p className="font-heading font-semibold text-sm text-card-foreground">{p.platform}</p>
                    <p className="text-[10px] text-muted-foreground">{p.followers.toLocaleString("en-IN")} followers</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">Connected</Badge>
                </div>
              ))}
              {(!creatorProfile?.instagram_followers && !creatorProfile?.youtube_subscribers) && (
                <div className="text-center py-8">
                  <p className="text-xs text-muted-foreground">Connect your social accounts to see analytics</p>
                </div>
              )}
            </div>
          </div>

          {/* Growth Tips */}
          <div className="px-4 mt-5 mb-4">
            <h3 className="font-heading font-bold text-sm text-foreground mb-3">💡 Growth Recommendations</h3>
            <div className="space-y-2">
              {[
                { title: "Post Reels consistently", desc: "Creators who post 4+ Reels/week see 3x more brand inquiries", icon: "🎬" },
                { title: "Optimize your rate card", desc: "Profiles with rate cards get 2x more campaign applications", icon: "💰" },
                { title: "Respond within 24 hours", desc: "Fast responders get prioritized in brand search results", icon: "⚡" },
                { title: "Keep media kit updated", desc: "Updated media kits with recent metrics increase trust", icon: "📊" },
              ].map((tip, i) => (
                <div key={i} className="glass-card rounded-2xl p-3.5 flex items-start gap-3 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}>
                  <span className="text-lg mt-0.5">{tip.icon}</span>
                  <div>
                    <p className="font-heading font-semibold text-xs text-card-foreground">{tip.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Brand: Campaign Performance */}
      {role === "brand" && (
        <div className="px-4 mt-5 mb-4">
          <h3 className="font-heading font-bold text-sm text-foreground mb-3">Campaign Insights</h3>
          <div className="space-y-2">
            {[
              { title: "Optimize creator selection", desc: "Focus on creators with 3-8% engagement rates for best ROI", icon: "🎯" },
              { title: "Content diversity matters", desc: "Campaigns with Reels + Stories get 2.5x more reach than feed-only", icon: "📱" },
              { title: "Tier-2 city creators", desc: "20% lower rates with comparable engagement. Great for budget campaigns", icon: "🏙️" },
              { title: "Festival campaign timing", desc: "Start campaigns 3-4 weeks before major festivals for maximum impact", icon: "🎉" },
            ].map((tip, i) => (
              <div key={i} className="glass-card rounded-2xl p-3.5 flex items-start gap-3 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}>
                <span className="text-lg mt-0.5">{tip.icon}</span>
                <div>
                  <p className="font-heading font-semibold text-xs text-card-foreground">{tip.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, up }: { icon: any; label: string; value: string; trend?: string; up?: boolean }) => (
  <div className="glass-card rounded-2xl p-3.5">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-3.5 h-3.5 text-primary" />
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
    <div className="flex items-end justify-between">
      <p className="font-heading font-bold text-lg text-card-foreground">{value}</p>
      {trend && (
        <span className={`text-[10px] font-heading font-medium flex items-center gap-0.5 ${up ? "text-primary" : "text-destructive"}`}>
          {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />} {trend}
        </span>
      )}
    </div>
  </div>
);

export default Analytics;
