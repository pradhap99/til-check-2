import { Link, useNavigate } from "react-router-dom";
import { creators } from "@/data/mockData";
import CreatorCard from "@/components/CreatorCard";
import { ArrowRight, Plus, Sparkles, Shield, Wallet, Video, MessageSquare, UserCheck, ChefHat } from "lucide-react";

const trendingStyles = [
  { label: "UGC Talking Head", icon: MessageSquare, color: "bg-primary/10 text-primary" },
  { label: "POV Vlog", icon: Video, color: "bg-accent/10 text-accent" },
  { label: "Get Ready With Me", icon: UserCheck, color: "bg-chart-4/10 text-chart-4" },
  { label: "Food Plating", icon: ChefHat, color: "bg-chart-2/10 text-chart-2" },
];

interface BrandHomeContentProps {
  stats: { activeCampaigns: number; applicationsCount: number; totalEarnings: number };
  statsLoading: boolean;
}

const BrandHomeContent = ({ stats, statsLoading }: BrandHomeContentProps) => {
  const navigate = useNavigate();
  const recommendedCreators = creators.slice(0, 4);

  return (
    <>
      {/* Quick Stats Strip */}
      <section className="px-5 mt-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Active Campaigns", value: stats.activeCampaigns },
            { label: "Pending Apps", value: stats.applicationsCount },
            { label: "In Review", value: 0 },
          ].map((s, i) => (
            <div key={i} className="border border-border rounded-xl p-3 text-center bg-background">
              <p className="text-lg font-heading font-bold text-foreground">{statsLoading ? "—" : s.value}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-5 mt-4">
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Plus, label: "Create", to: "/campaigns/create" },
            { icon: Sparkles, label: "Recommend", to: "/recommendations" },
            { icon: Shield, label: "Escrow", to: "/escrow" },
            { icon: Wallet, label: "Payments", to: "/earnings" },
          ].map((action, i) => (
            <Link key={i} to={action.to} className="border border-border rounded-xl p-2.5 text-center hover:bg-secondary/50 transition-all btn-micro flex flex-col items-center gap-1.5 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
              <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center">
                <action.icon className="w-3.5 h-3.5 text-foreground" />
              </div>
              <p className="text-[9px] font-medium text-foreground">{action.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended Creators */}
      <section className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-semibold text-sm text-foreground">Recommended Creators</h3>
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

      {/* Trending Content Styles */}
      <section className="px-5 mt-6 mb-4">
        <h3 className="font-heading font-semibold text-sm text-foreground mb-3">Trending Content Styles</h3>
        <div className="grid grid-cols-2 gap-2">
          {trendingStyles.map((style, i) => (
            <button
              key={i}
              onClick={() => navigate("/creators")}
              className="border border-border rounded-xl p-4 text-left hover:bg-secondary/50 transition-all btn-micro opacity-0 animate-fade-up"
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
