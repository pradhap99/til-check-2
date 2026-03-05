import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  TrendingUp, Users, Eye, Target, BarChart3, Star,
  ArrowUp, ArrowDown, Briefcase, Instagram, Youtube, Twitter,
  Clock, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";

const mockFollowerGrowth = [
  { month: "Oct", value: 42 }, { month: "Nov", value: 48 },
  { month: "Dec", value: 55 }, { month: "Jan", value: 60 },
  { month: "Feb", value: 72 }, { month: "Mar", value: 85 },
];

const mockTopPosts = [
  { img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=160&h=160&fit=crop", likes: "12.4K", type: "Reel" },
  { img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=160&h=160&fit=crop", likes: "8.9K", type: "Post" },
  { img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=160&h=160&fit=crop", likes: "15.2K", type: "Reel" },
  { img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=160&h=160&fit=crop", likes: "6.1K", type: "Story" },
  { img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=160&h=160&fit=crop", likes: "9.8K", type: "Reel" },
  { img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=160&h=160&fit=crop", likes: "7.3K", type: "Post" },
  { img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=160&h=160&fit=crop", likes: "11.5K", type: "Reel" },
  { img: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=160&h=160&fit=crop", likes: "5.6K", type: "Post" },
  { img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=160&h=160&fit=crop", likes: "13.1K", type: "Reel" },
];

const audienceDemo = { male: 38, female: 57, other: 5 };
const audienceAge = [
  { range: "18-24", pct: 42 }, { range: "25-34", pct: 35 },
  { range: "35-44", pct: 15 }, { range: "45+", pct: 8 },
];
const topCities = [
  { city: "Mumbai", pct: 28 }, { city: "Delhi", pct: 22 },
  { city: "Bangalore", pct: 18 }, { city: "Hyderabad", pct: 12 },
  { city: "Pune", pct: 8 },
];

const bestTimes = [
  [0,0,0,0,0,1,2,3,2,4,5,3,2,1,2,3,5,4,3,5,4,3,2,1],
];

const Analytics = () => {
  const { user, role } = useAuth();
  const [stats, setStats] = useState({ campaigns: 0, applications: 0, accepted: 0, totalEarned: 0, creatorsWorked: 0, avgRating: 4.8 });
  const [creatorProfile, setCreatorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [socialConnected, setSocialConnected] = useState(false);

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
        if (cpResult.data?.instagram_followers) setSocialConnected(true);
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

  if (loading) return <Layout><div className="flex items-center justify-center min-h-[60vh]"><div className="w-6 h-6 rounded-md bg-foreground animate-pulse-glow" /></div></Layout>;

  const acceptanceRate = stats.applications > 0 ? Math.round((stats.accepted / stats.applications) * 100) : 0;
  const maxGrowth = Math.max(...mockFollowerGrowth.map(d => d.value));

  return (
    <Layout>
      <header className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-heading font-bold text-foreground">Analytics</h1>
        <p className="text-xs text-muted-foreground">{role === "creator" ? "Track your growth & performance" : "Campaign performance & ROI"}</p>
      </header>

      {/* Overview Cards */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-2">
        {role === "creator" ? (
          <>
            <StatCard icon={Eye} label="Profile Views" value="1,247" trend="+12%" up />
            <StatCard icon={Briefcase} label="Applications" value={stats.applications.toString()} />
            <StatCard icon={Target} label="Acceptance Rate" value={`${acceptanceRate}%`} />
            <StatCard icon={Star} label="Avg Rating" value={stats.avgRating.toFixed(1)} />
            <StatCard icon={Users} label="Followers" value={creatorProfile?.instagram_followers ? `${(creatorProfile.instagram_followers / 1000).toFixed(0)}K` : "45K"} />
            <StatCard icon={TrendingUp} label="Engagement" value={creatorProfile?.engagement_rate ? `${creatorProfile.engagement_rate}%` : "5.8%"} />
          </>
        ) : (
          <>
            <StatCard icon={Briefcase} label="Campaigns" value={stats.campaigns.toString()} />
            <StatCard icon={Users} label="Applications" value={stats.applications.toString()} />
            <StatCard icon={TrendingUp} label="Total Spent" value="—" />
            <StatCard icon={BarChart3} label="Avg ROI" value="3.2X" trend="+18%" up />
            <StatCard icon={Star} label="Creator Rating" value="4.8" />
            <StatCard icon={Target} label="Avg Engagement" value="8.2%" />
          </>
        )}
      </div>

      {/* Social Performance / Follower Growth */}
      {role === "creator" && (
        <>
          {!socialConnected ? (
            <div className="px-5 mt-5">
              <div className="border border-border rounded-2xl p-5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 mx-auto flex items-center justify-center mb-3">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-sm text-foreground">Connect Instagram</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">See follower growth, top posts, and audience demographics</p>
                <Button size="sm" className="h-9 text-xs rounded-xl" onClick={() => setSocialConnected(true)}>
                  Connect Account
                </Button>
                <p className="text-[9px] text-muted-foreground mt-2">API verification coming soon. Data is self-reported for now.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Follower Growth Chart */}
              <div className="px-5 mt-5">
                <h3 className="font-heading font-semibold text-sm text-foreground mb-3">Follower Growth</h3>
                <div className="border border-border rounded-2xl p-4">
                  <div className="flex items-end gap-2 h-24">
                    {mockFollowerGrowth.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[8px] text-muted-foreground">{d.value}K</span>
                        <div className="w-full rounded-t-sm bg-accent/20 relative" style={{ height: `${(d.value / maxGrowth) * 100}%` }}>
                          <div className="absolute bottom-0 inset-x-0 bg-accent rounded-t-sm" style={{ height: `${60 + i * 5}%` }} />
                        </div>
                        <span className="text-[8px] text-muted-foreground">{d.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Posts */}
              <div className="px-5 mt-5">
                <h3 className="font-heading font-semibold text-sm text-foreground mb-3">Top Performing Posts</h3>
                <div className="grid grid-cols-3 gap-1.5">
                  {mockTopPosts.map((post, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden aspect-square">
                      <img src={post.img} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-bold">{post.likes}</span>
                        <span className="text-white/70 text-[8px]">{post.type}</span>
                      </div>
                      <span className="absolute top-1 right-1 text-[7px] bg-black/60 text-white px-1 py-0.5 rounded">{post.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audience */}
              <div className="px-5 mt-5">
                <h3 className="font-heading font-semibold text-sm text-foreground mb-3">Audience Demographics</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Gender */}
                  <div className="border border-border rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground mb-2">Gender</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden flex">
                        <div className="h-full bg-blue-500 rounded-l-full" style={{ width: `${audienceDemo.male}%` }} />
                        <div className="h-full bg-pink-500" style={{ width: `${audienceDemo.female}%` }} />
                        <div className="h-full bg-gray-400 rounded-r-full" style={{ width: `${audienceDemo.other}%` }} />
                      </div>
                    </div>
                    <div className="flex justify-between mt-1.5 text-[9px] text-muted-foreground">
                      <span>M {audienceDemo.male}%</span>
                      <span>F {audienceDemo.female}%</span>
                    </div>
                  </div>
                  {/* Age */}
                  <div className="border border-border rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground mb-2">Age</p>
                    {audienceAge.map((a, i) => (
                      <div key={i} className="flex items-center gap-1.5 mb-1">
                        <span className="text-[8px] text-muted-foreground w-8">{a.range}</span>
                        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${a.pct}%` }} />
                        </div>
                        <span className="text-[8px] text-muted-foreground w-6 text-right">{a.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Top Cities */}
                <div className="border border-border rounded-xl p-3 mt-2.5">
                  <p className="text-[10px] text-muted-foreground mb-2 flex items-center gap-1"><MapPin className="w-3 h-3" /> Top Cities</p>
                  {topCities.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] text-foreground font-medium w-20">{c.city}</span>
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${c.pct}%` }} />
                      </div>
                      <span className="text-[9px] text-muted-foreground w-8 text-right">{c.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Posting Times */}
              <div className="px-5 mt-5">
                <h3 className="font-heading font-semibold text-sm text-foreground mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-accent" /> Best Posting Times
                </h3>
                <div className="border border-border rounded-xl p-3">
                  <div className="grid grid-cols-12 gap-0.5">
                    {bestTimes[0].map((val, i) => (
                      <div key={i} className="flex flex-col items-center gap-0.5">
                        <div className={`w-full aspect-square rounded-sm ${val >= 4 ? "bg-accent" : val >= 2 ? "bg-accent/40" : "bg-secondary"}`} />
                        {i % 3 === 0 && <span className="text-[6px] text-muted-foreground">{i}h</span>}
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-2 text-center">Peak: 9-11 AM & 6-8 PM IST</p>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Social Platforms */}
      {role === "creator" && socialConnected && (
        <div className="px-5 mt-5">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-3">Connected Platforms</h3>
          <div className="space-y-2">
            {[
              { platform: "Instagram", icon: Instagram, followers: creatorProfile?.instagram_followers || 45000, color: "from-pink-500 to-purple-600", connected: true },
              { platform: "YouTube", icon: Youtube, followers: creatorProfile?.youtube_subscribers || 12000, color: "from-red-500 to-red-600", connected: !!creatorProfile?.youtube_subscribers },
              { platform: "Twitter", icon: Twitter, followers: 8500, color: "from-blue-400 to-blue-600", connected: false },
            ].map((p, i) => (
              <div key={i} className="border border-border rounded-xl p-3.5 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                  <p.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-heading font-medium text-sm text-foreground">{p.platform}</p>
                  <p className="text-xs text-muted-foreground">{p.followers.toLocaleString("en-IN")} followers</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.connected ? "bg-emerald-500/10 text-emerald-600" : "bg-secondary text-muted-foreground"}`}>
                  {p.connected ? "Connected" : "Connect"}
                </span>
              </div>
            ))}
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
  <div className="border border-border rounded-xl p-3.5">
    <div className="flex items-center gap-1.5 mb-1">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
    <div className="flex items-end justify-between">
      <p className="font-heading font-bold text-lg text-foreground">{value}</p>
      {trend && (
        <span className={`text-[10px] font-medium flex items-center gap-0.5 ${up ? "text-emerald-500" : "text-destructive"}`}>
          {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />} {trend}
        </span>
      )}
    </div>
  </div>
);

export default Analytics;
