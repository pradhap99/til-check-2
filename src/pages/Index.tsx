import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { creators, campaigns } from "@/data/mockData";
import CreatorCard from "@/components/CreatorCard";
import CampaignCard from "@/components/CampaignCard";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Bell, Search, MessageCircle, Briefcase, Wallet, BarChart3, Plus, TrendingUp, Users } from "lucide-react";

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
      <header className="px-5 pt-6 pb-1 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{greeting}</p>
          <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">{firstName}</h1>
        </div>
        <div className="flex items-center gap-1">
          <Link to="/messages" className="w-9 h-9 rounded-lg flex items-center justify-center relative hover:bg-secondary transition-colors">
            <MessageCircle className="w-[18px] h-[18px] text-muted-foreground" />
            {unreadMsgs > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />}
          </Link>
          <Link to="/notifications" className="w-9 h-9 rounded-lg flex items-center justify-center relative hover:bg-secondary transition-colors">
            <Bell className="w-[18px] h-[18px] text-muted-foreground" />
            {unreadNotifs > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />}
          </Link>
        </div>
      </header>

      {/* Search */}
      <div className="px-5 mt-4">
        <div onClick={() => navigate(role === "brand" ? "/creators" : "/campaigns")} className="cursor-pointer">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <div className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary border border-border flex items-center">
              <span className="text-sm text-muted-foreground">Search creators, campaigns...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <section className="px-5 mt-5 grid grid-cols-3 gap-2">
        {[
          { label: "Active Creators", value: "12.4K", icon: Users },
          { label: "Live Campaigns", value: "2,847", icon: Briefcase },
          { label: "Avg. Engagement", value: "5.8%", icon: TrendingUp },
        ].map((stat, i) => (
          <div key={i} className="border border-border rounded-lg p-3 text-center opacity-0 animate-fade-up" style={{ animationDelay: `${i * 50}ms`, animationFillMode: "forwards" }}>
            <p className="font-heading font-bold text-base text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="px-5 mt-4">
        <div className="grid grid-cols-3 gap-2">
          {(role === "brand" ? [
            { icon: Plus, label: "New Campaign", to: "/campaigns/create" },
            { icon: Search, label: "Find Creators", to: "/creators" },
            { icon: Wallet, label: "Payments", to: "/earnings" },
          ] : [
            { icon: Briefcase, label: "Campaigns", to: "/campaigns" },
            { icon: Wallet, label: "Earnings", to: "/earnings" },
            { icon: BarChart3, label: "Analytics", to: "/analytics" },
          ]).map((action, i) => (
            <Link key={i} to={action.to} className="border border-border rounded-lg p-3 text-center hover-lift flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
                <action.icon className="w-4 h-4 text-foreground" />
              </div>
              <p className="text-[10px] font-medium text-foreground">{action.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Creators */}
      <section className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-semibold text-sm text-foreground">Top Creators</h3>
          <Link to="/creators" className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-0.5 transition-colors">
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
      <section className="px-5 mt-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-semibold text-sm text-foreground">Live Campaigns</h3>
          <Link to="/campaigns" className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-0.5 transition-colors">
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
