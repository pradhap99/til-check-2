import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  TrendingUp, Users, Eye, Target, BarChart3, Star,
  ArrowUp, ArrowDown, Briefcase
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
        setStats(prev => ({ ...prev, applications: appCount || 0, accepted: acceptedCount || 0 }));
      } else {
        const [{ count: campCount }, { count: appCount }] = await Promise.all([
          supabase.from("campaigns").select("*", { count: "exact", head: true }).eq("brand_user_id", user.id),
          supabase.from("campaign_applications").select("*, campaigns!inner(brand_user_id)", { count: "exact", head: true }).eq("campaigns.brand_user_id", user.id),
        ]);
        setStats(prev => ({ ...prev, campaigns: campCount || 0, applications: appCount || 0 }));
      }
      setLoading(false);
    };
    fetchStats();
  }, [user, role]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-6 h-6 rounded-md bg-foreground animate-pulse-glow" />
        </div>
      </Layout>
    );
  }

  const acceptanceRate = stats.applications > 0 ? Math.round((stats.accepted / stats.applications) * 100) : 0;

  return (
    <Layout>
      <header className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-heading font-bold text-foreground">Analytics</h1>
        <p className="text-xs text-muted-foreground">
          {role === "creator" ? "Track your growth & performance" : "Campaign performance & ROI"}
        </p>
      </header>

      {/* Overview Cards */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-2">
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
            <StatCard icon={TrendingUp} label="Total Spent" value="—" />
            <StatCard icon={BarChart3} label="Avg ROI" value="—" />
            <StatCard icon={Star} label="Creator Rating" value="4.8" />
            <StatCard icon={Target} label="Avg Engagement" value="—" />
          </>
        )}
      </div>

      {/* Social Performance */}
      {role === "creator" && (
        <div className="px-5 mt-5">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-3">Social Performance</h3>
          <div className="space-y-2">
            {[
              { platform: "Instagram", followers: creatorProfile?.instagram_followers || 0, color: "bg-secondary" },
              { platform: "YouTube", followers: creatorProfile?.youtube_subscribers || 0, color: "bg-secondary" },
              { platform: "TikTok", followers: creatorProfile?.tiktok_followers || 0, color: "bg-secondary" },
            ].filter(p => p.followers > 0).map((p, i) => (
              <div key={i} className="border border-border rounded-lg p-3.5 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${p.color} flex items-center justify-center`}>
                  <span className="text-xs font-heading font-bold text-foreground">{p.platform.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <p className="font-heading font-medium text-sm text-foreground">{p.platform}</p>
                  <p className="text-xs text-muted-foreground">{p.followers.toLocaleString("en-IN")} followers</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground font-medium">Connected</span>
              </div>
            ))}
            {(!creatorProfile?.instagram_followers && !creatorProfile?.youtube_subscribers) && (
              <div className="text-center py-8">
                <p className="text-xs text-muted-foreground">Connect your social accounts to see analytics</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="px-5 mt-5 mb-4">
        <h3 className="font-heading font-semibold text-sm text-foreground mb-3">
          {role === "creator" ? "Growth Recommendations" : "Campaign Insights"}
        </h3>
        <div className="space-y-2">
          {(role === "creator" ? [
            { title: "Post Reels consistently", desc: "Creators posting 4+ Reels/week see 3x more brand inquiries" },
            { title: "Optimize your rate card", desc: "Profiles with rate cards get 2x more campaign invitations" },
            { title: "Respond within 24 hours", desc: "Fast responders are prioritized in brand search results" },
            { title: "Keep media kit updated", desc: "Updated media kits with recent metrics increase trust" },
          ] : [
            { title: "Optimize creator selection", desc: "Focus on creators with 3-8% engagement rates for best ROI" },
            { title: "Content diversity matters", desc: "Campaigns with Reels + Stories get 2.5x more reach" },
            { title: "Tier-2 city creators", desc: "20% lower rates with comparable engagement for budget campaigns" },
            { title: "Festival campaign timing", desc: "Start 3-4 weeks before major festivals for maximum impact" },
          ]).map((tip, i) => (
            <div key={i} className="border border-border rounded-lg p-3.5 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
              <p className="font-heading font-medium text-sm text-foreground">{tip.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, up }: { icon: any; label: string; value: string; trend?: string; up?: boolean }) => (
  <div className="border border-border rounded-lg p-3.5">
    <div className="flex items-center gap-1.5 mb-1">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
    <div className="flex items-end justify-between">
      <p className="font-heading font-bold text-lg text-foreground">{value}</p>
      {trend && (
        <span className={`text-[10px] font-medium flex items-center gap-0.5 ${up ? "text-success" : "text-destructive"}`}>
          {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />} {trend}
        </span>
      )}
    </div>
  </div>
);

export default Analytics;
