import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { creators, campaigns } from "@/data/mockData";
import CreatorCard from "@/components/CreatorCard";
import CampaignCard from "@/components/CampaignCard";
import Layout from "@/components/Layout";
import { ArrowRight, Sparkles, TrendingUp, Users, Zap } from "lucide-react";

const Index = () => {
  const topCreators = creators.slice(0, 4);
  const topCampaigns = campaigns.slice(0, 3);

  return (
    <Layout>
      {/* Header */}
      <header className="px-4 pt-6 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold gradient-text">TIL</h1>
          <p className="text-xs text-muted-foreground">India's #1 Creator Marketplace</p>
        </div>
        <Button size="sm" variant="gradient-outline" className="h-8 text-xs">
          <Sparkles className="w-3.5 h-3.5" /> Get Started
        </Button>
      </header>

      {/* Hero */}
      <section className="px-4 py-6">
        <div className="gradient-primary rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/5 rounded-full translate-y-6 -translate-x-6" />
          <div className="relative z-10">
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 mb-3">
              🚀 New Season
            </Badge>
            <h2 className="text-2xl font-heading font-bold text-primary-foreground leading-tight">
              Connect. Create.<br />Collaborate.
            </h2>
            <p className="text-primary-foreground/80 text-sm mt-2">
              Join 10,000+ creators & 500+ D2C brands building India's creator economy.
            </p>
            <Button size="lg" className="mt-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-heading">
              Explore Now <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 grid grid-cols-3 gap-3">
        {[
          { icon: Users, label: "Creators", value: "10K+" },
          { icon: TrendingUp, label: "Campaigns", value: "2.5K+" },
          { icon: Zap, label: "Matches", value: "50K+" },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-3 text-center opacity-0 animate-fade-up" style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}>
            <stat.icon className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="font-heading font-bold text-lg text-card-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Top Creators */}
      <section className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-lg text-foreground">Top Creators</h3>
          <Link to="/creators" className="text-sm text-primary font-medium flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>

        </div>
        <div className="space-y-3">
          {topCreators.map((creator, i) => (
            <CreatorCard key={creator.id} creator={creator} index={i} />
          ))}
        </div>
      </section>

      {/* Live Campaigns */}
      <section className="px-4 mt-8 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-lg text-foreground">🔥 Live Campaigns</h3>
          <Link to="/campaigns" className="text-sm text-primary font-medium flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="space-y-3">
          {topCampaigns.map((campaign, i) => (
            <CampaignCard key={campaign.id} campaign={campaign} index={i} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
