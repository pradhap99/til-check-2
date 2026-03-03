import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { creators, campaigns } from "@/data/mockData";
import CreatorCard from "@/components/CreatorCard";
import CampaignCard from "@/components/CampaignCard";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Sparkles, TrendingUp, Users, Zap, Bell, Search, MessageCircle } from "lucide-react";

const Index = () => {
  const { user, role } = useAuth();
  const topCreators = creators.slice(0, 3);
  const topCampaigns = campaigns.slice(0, 3);
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";

  return (
    <Layout>
      {/* Header */}
      <header className="px-4 pt-6 pb-2 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-heading">Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}</p>
          <h1 className="text-xl font-heading font-bold text-foreground">Hi, {firstName} 👋</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/messages" className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center relative">
            <MessageCircle className="w-4.5 h-4.5 text-muted-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-background" />
          </Link>
          <Link to="/notifications" className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center relative">
            <Bell className="w-4.5 h-4.5 text-muted-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-background" />
          </Link>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 mt-3">
        <Link to="/creators" className="block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <div className="w-full h-11 pl-10 pr-4 rounded-2xl bg-secondary/70 border border-border/50 flex items-center">
              <span className="text-sm text-muted-foreground">Search creators, campaigns...</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Hero Card */}
      <section className="px-4 py-4">
        <div className="gradient-primary rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/10 rounded-full -translate-y-12 translate-x-12" />
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-primary-foreground/5 rounded-full translate-y-8 -translate-x-8" />
          <div className="relative z-10">
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 mb-2.5 text-[10px]">
              🚀 {role === "brand" ? "Find Creators" : "New Opportunities"}
            </Badge>
            <h2 className="text-xl font-heading font-bold text-primary-foreground leading-tight">
              {role === "brand" 
                ? <>Discover Top<br/>Indian Creators</>
                : <>Your Next Big<br/>Collab Awaits</>
              }
            </h2>
            <p className="text-primary-foreground/80 text-xs mt-1.5 leading-relaxed">
              {role === "brand" 
                ? "10,000+ verified creators ready for your next campaign."
                : "500+ brands looking for creators like you."
              }
            </p>
            <Button size="sm" className="mt-3 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-heading h-9 text-xs rounded-xl">
              {role === "brand" ? "Browse Creators" : "Explore Campaigns"} <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="px-4 grid grid-cols-3 gap-2.5">
        {[
          { icon: Users, label: "Creators", value: "10K+", color: "text-primary" },
          { icon: TrendingUp, label: "Campaigns", value: "2.5K+", color: "text-accent" },
          { icon: Zap, label: "Matches", value: "50K+", color: "text-primary" },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-3 text-center opacity-0 animate-fade-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}>
            <stat.icon className={`w-4.5 h-4.5 mx-auto ${stat.color} mb-1`} />
            <p className="font-heading font-bold text-base text-card-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="px-4 mt-5">
        <div className="flex gap-2.5">
          {(role === "brand" ? [
            { emoji: "🎯", label: "Post Campaign", to: "/campaigns/create" },
            { emoji: "🔍", label: "Find Creators", to: "/creators" },
            { emoji: "📊", label: "My Campaigns", to: "/campaigns" },
          ] : [
            { emoji: "🔥", label: "Live Campaigns", to: "/campaigns" },
            { emoji: "📈", label: "My Stats", to: "/profile" },
            { emoji: "💼", label: "Applications", to: "/profile" },
          ]).map((action, i) => (
            <Link key={i} to={action.to} className="flex-1 glass-card rounded-2xl p-3 text-center hover-lift">
              <span className="text-xl">{action.emoji}</span>
              <p className="text-[10px] font-heading font-medium text-card-foreground mt-1">{action.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Creators */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-base text-foreground">Top Creators</h3>
          <Link to="/creators" className="text-xs text-primary font-heading font-medium flex items-center gap-0.5">
            See all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2.5">
          {topCreators.map((creator, i) => (
            <CreatorCard key={creator.id} creator={creator} index={i} />
          ))}
        </div>
      </section>

      {/* Live Campaigns */}
      <section className="px-4 mt-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-base text-foreground">🔥 Live Campaigns</h3>
          <Link to="/campaigns" className="text-xs text-primary font-heading font-medium flex items-center gap-0.5">
            See all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2.5">
          {topCampaigns.map((campaign, i) => (
            <CampaignCard key={campaign.id} campaign={campaign} index={i} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
