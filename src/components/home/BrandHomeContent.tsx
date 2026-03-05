import { Link, useNavigate } from "react-router-dom";
import { creators, campaigns } from "@/data/mockData";
import CreatorCard from "@/components/CreatorCard";
import { ArrowRight, Plus, Sparkles, Shield, Wallet, Video, MessageSquare, UserCheck, ChefHat, TrendingUp, Users, FileCheck, BarChart3, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import CountUp from "@/components/CountUp";

const trendingStyles = [
  { label: "UGC Talking Head", icon: MessageSquare, color: "bg-primary/10 text-primary" },
  { label: "POV Vlog", icon: Video, color: "bg-accent/10 text-accent" },
  { label: "Get Ready With Me", icon: UserCheck, color: "bg-chart-4/10 text-chart-4" },
  { label: "Food Plating", icon: ChefHat, color: "bg-chart-2/10 text-chart-2" },
];

const campaignImages: Record<string, string> = {
  Tech: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=520&h=280&fit=crop",
  Beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=520&h=280&fit=crop",
  Fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=520&h=280&fit=crop",
  Finance: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=520&h=280&fit=crop",
};

interface BrandHomeContentProps {
  stats: { activeCampaigns: number; applicationsCount: number; totalEarnings: number };
  statsLoading: boolean;
}

const BrandHomeContent = ({ stats, statsLoading }: BrandHomeContentProps) => {
  const navigate = useNavigate();
  const recommendedCreators = creators.slice(0, 4);
  const myCampaigns = campaigns.slice(0, 3);

  return (
    <>
      {/* Hero Stats Row — 4 cards */}
      <section className="px-5 mt-4">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Active Campaigns", value: stats.activeCampaigns, icon: Sparkles, color: "text-primary", dotColor: "bg-emerald-500" },
            { label: "Total Applications", value: stats.applicationsCount, icon: Users, color: "text-accent", trend: "+12 this week" },
            { label: "Shortlisted", value: 0, icon: FileCheck, color: "text-chart-4" },
            { label: "Completed", value: 0, icon: BarChart3, color: "text-chart-2" },
          ].map((s, i) => (
            <div key={i} className="border border-border rounded-2xl p-4 bg-card opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                {s.dotColor && <span className={`w-2 h-2 rounded-full ${s.dotColor} animate-pulse`} />}
              </div>
              <p className={`text-2xl font-heading font-bold ${s.color}`}>
                {statsLoading ? "—" : <CountUp end={s.value} duration={1200} />}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
              {s.trend && <p className="text-[9px] text-emerald-500 font-medium mt-0.5 flex items-center gap-0.5"><TrendingUp className="w-2.5 h-2.5" />{s.trend}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-5 mt-4">
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Plus, label: "Create", to: "/campaigns/create", gradient: "from-violet-500 to-purple-600" },
            { icon: Sparkles, label: "Recommend", to: "/recommendations", gradient: "from-amber-400 to-orange-500" },
            { icon: Shield, label: "Escrow", to: "/escrow", gradient: "from-teal-400 to-emerald-500" },
            { icon: Wallet, label: "Payments", to: "/earnings", gradient: "from-pink-400 to-rose-500" },
          ].map((action, i) => (
            <Link key={i} to={action.to} className="rounded-2xl p-3 text-center active:scale-90 transition-all duration-150 flex flex-col items-center gap-2 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-[10px] font-heading font-semibold text-foreground">{action.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Your Campaigns */}
      <section className="mt-5">
        <div className="flex items-center justify-between px-5 mb-3">
          <h3 className="font-heading font-bold text-[15px] text-foreground">Your Campaigns</h3>
          <Link to="/campaigns" className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-0.5 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
          {myCampaigns.map((campaign, i) => {
            const image = campaignImages[campaign.category] || campaignImages.Tech;
            const slotsLeft = campaign.slots - campaign.filled;
            const progress = (campaign.filled / campaign.slots) * 100;
            return (
              <div
                key={campaign.id}
                onClick={() => navigate(`/campaigns/${campaign.id}`)}
                className="min-w-[260px] max-w-[260px] shrink-0 rounded-2xl overflow-hidden bg-card border border-border shadow-sm cursor-pointer active:scale-[0.97] transition-transform duration-150 opacity-0 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
              >
                <div className="relative h-[120px]">
                  <img src={image} alt={campaign.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-lg ${campaign.filled >= campaign.slots - 2 ? "bg-destructive text-white" : "bg-emerald-500 text-white"}`}>
                    {slotsLeft} slots left
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="text-[13px] font-heading font-semibold text-foreground leading-tight line-clamp-1">{campaign.title}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{campaign.budget}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex -space-x-1.5">
                      {[0, 1, 2].map(j => (
                        <div key={j} className="w-5 h-5 rounded-full bg-secondary border-2 border-card flex items-center justify-center">
                          <span className="text-[7px] font-bold text-muted-foreground">{j + 1}</span>
                        </div>
                      ))}
                    </div>
                    <span className="text-[9px] text-muted-foreground">{campaign.filled} applications</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-2 h-7 text-[10px] rounded-lg" onClick={(e) => { e.stopPropagation(); navigate(`/campaigns/${campaign.id}/manage`); }}>
                    View applications <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recommended Creators */}
      <section className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-[15px] text-foreground">Recommended Creators</h3>
          <Link to="/creators" className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-0.5 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {recommendedCreators.map((creator, i) => (
            <div key={creator.id} className="min-w-[260px] shrink-0" onClick={() => navigate(`/creators/${creator.id}`)}>
              <CreatorCard creator={creator} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* Campaign Performance — Summary card */}
      <section className="px-5 mt-5">
        <div className="rounded-2xl p-5 bg-[hsl(222,47%,11%)] border border-accent/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-sm text-white">Campaign Performance</h3>
            <Eye className="w-4 h-4 text-accent" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Reach", value: "2.4M" },
              { label: "Engagement", value: "180K" },
              { label: "Avg ROI", value: "3.2X" },
            ].map((m, i) => (
              <div key={i} className="text-center">
                <p className="text-lg font-heading font-bold text-white">{m.value}</p>
                <p className="text-[9px] text-purple-300">{m.label}</p>
              </div>
            ))}
          </div>
          {/* Mini bar chart */}
          <div className="flex items-end gap-1.5 mt-4 h-12">
            {[40, 65, 45, 80, 55, 90].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm bg-accent/30 relative overflow-hidden" style={{ height: `${h}%` }}>
                <div className="absolute bottom-0 inset-x-0 bg-accent rounded-t-sm" style={{ height: `${h * 0.6}%` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].map(m => (
              <span key={m} className="text-[8px] text-purple-300/50 flex-1 text-center">{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Content Styles */}
      <section className="px-5 mt-5 mb-6">
        <h3 className="font-heading font-semibold text-sm text-foreground mb-3">Trending Content Styles</h3>
        <div className="grid grid-cols-2 gap-2">
          {trendingStyles.map((style, i) => (
            <button
              key={i}
              onClick={() => navigate("/creators")}
              className="border border-border rounded-xl p-4 text-left hover:bg-secondary/50 transition-all active:scale-95 opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${style.color}`}>
                <style.icon className="w-4 h-4" />
              </div>
              <p className="text-xs font-heading font-semibold text-foreground">{style.label}</p>
            </button>
          ))}
        </div>
      </section>
    </>
  );
};

export default BrandHomeContent;
