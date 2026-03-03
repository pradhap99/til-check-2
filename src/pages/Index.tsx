import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { creators, campaigns } from "@/data/mockData";
import CreatorCard from "@/components/CreatorCard";
import CampaignCard from "@/components/CampaignCard";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, TrendingUp, Users, BarChart3, Bell, Search, MessageCircle, Briefcase, Wallet, Plus } from "lucide-react";

const Index = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const topCreators = creators.slice(0, 4);
  const topCampaigns = campaigns.slice(0, 3);
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [unreadMsgs, setUnreadMsgs] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase.from("notifications").select("*", { count: "exact", head: true })
      .eq("user_id", user.id).eq("read", false)
      .then(({ count }) => setUnreadNotifs(count || 0));

    supabase.from("messages").select("*", { count: "exact", head: true })
      .neq("sender_id", user.id).is("read_at", null)
      .then(({ count }) => setUnreadMsgs(count || 0));
  }, [user]);

  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <Layout>
      {/* Header */}
      <header className="px-4 pt-6 pb-1 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-body">{greeting}</p>
          <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">Hi, {firstName}</h1>
        </div>
        <div className="flex items-center gap-1.5">
          <Link to="/messages" className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center relative">
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
            {unreadMsgs > 0 && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent" />}
          </Link>
          <Link to="/notifications" className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center relative">
            <Bell className="w-4 h-4 text-muted-foreground" />
            {unreadNotifs > 0 && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent" />}
          </Link>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 mt-3">
        <div onClick={() => navigate("/creators")} className="cursor-pointer">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <div className="w-full h-10 pl-9 pr-4 rounded-lg bg-secondary border border-border/50 flex items-center">
              <span className="text-sm text-muted-foreground">Search creators, campaigns...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <section className="px-4 mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Active Creators", value: "12.4K", icon: Users },
          { label: "Live Campaigns", value: "2,847", icon: Briefcase },
          { label: "Avg. Engagement", value: "5.8%", icon: TrendingUp },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-lg p-3 text-center opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
            <stat.icon className="w-4 h-4 mx-auto text-primary mb-1.5" />
            <p className="font-heading font-bold text-sm text-card-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="px-4 mt-4">
        <div className="grid grid-cols-3 gap-2">
          {(role === "brand" ? [
            { icon: Plus, label: "New Campaign", to: "/campaigns/create" },
            { icon: Search, label: "Find Creators", to: "/creators" },
            { icon: Wallet, label: "Payments", to: "/earnings" },
          ] : [
            { icon: Briefcase, label: "Live Campaigns", to: "/campaigns" },
            { icon: Wallet, label: "Earnings", to: "/earnings" },
            { icon: BarChart3, label: "Analytics", to: "/analytics" },
          ]).map((action, i) => (
            <Link key={i} to={action.to} className="glass-card rounded-lg p-3 text-center hover-lift flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                <action.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-[10px] font-heading font-medium text-card-foreground">{action.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Creators */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-sm text-foreground">Top Creators</h3>
          <Link to="/creators" className="text-xs text-primary font-heading font-medium flex items-center gap-0.5">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {topCreators.map((creator, i) => (
            <div key={creator.id} onClick={() => navigate(`/creators/${creator.id}`)}>
              <CreatorCard creator={creator} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* Live Campaigns */}
      <section className="px-4 mt-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-sm text-foreground">Live Campaigns</h3>
          <Link to="/campaigns" className="text-xs text-primary font-heading font-medium flex items-center gap-0.5">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {topCampaigns.map((campaign, i) => (
            <div key={campaign.id} onClick={() => navigate(`/campaigns/${campaign.id}`)}>
              <CampaignCard campaign={campaign} index={i} />
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
