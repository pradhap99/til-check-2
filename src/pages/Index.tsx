import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { creators, campaigns } from "@/data/mockData";
import CreatorCard from "@/components/CreatorCard";
import CampaignCard from "@/components/CampaignCard";
import Layout from "@/components/Layout";
import RecommendationCarousel from "@/components/RecommendationCarousel";
import SkeletonCard from "@/components/SkeletonCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight, Bell, Search, MessageCircle, Briefcase, Wallet,
  Plus, TrendingUp, Users, Sparkles, FileText, Shield, IndianRupee,
  CheckCircle, Clock
} from "lucide-react";

const Index = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const topCreators = creators.slice(0, 4);
  const topCampaigns = campaigns.slice(0, 3);
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [unreadMsgs, setUnreadMsgs] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingPayments: 0,
    activeCampaigns: 0,
    applicationsCount: 0,
  });

  useEffect(() => {
    if (!user) return;

    supabase.from("notifications").select("*", { count: "exact", head: true })
      .eq("user_id", user.id).eq("read", false)
      .then(({ count }) => setUnreadNotifs(count || 0));
    supabase.from("messages").select("*", { count: "exact", head: true })
      .neq("sender_id", user.id).is("read_at", null)
      .then(({ count }) => setUnreadMsgs(count || 0));

    const loadStats = async () => {
      if (role === "creator") {
        const { data: txs } = await supabase.from("transactions").select("amount, status").eq("payee_user_id", user.id);
        const totalEarnings = (txs || []).filter(t => t.status === "completed").reduce((s, t) => s + Number(t.amount), 0);
        const pendingPayments = (txs || []).filter(t => t.status === "pending").reduce((s, t) => s + Number(t.amount), 0);
        const { count: appsCount } = await supabase.from("campaign_applications").select("*", { count: "exact", head: true }).eq("creator_user_id", user.id);
        const { count: activeCount } = await supabase.from("campaign_applications").select("*", { count: "exact", head: true }).eq("creator_user_id", user.id).eq("status", "accepted");
        setStats({ totalEarnings, pendingPayments, activeCampaigns: activeCount || 0, applicationsCount: appsCount || 0 });
      } else {
        const { data: txs } = await supabase.from("transactions").select("amount, status").eq("payer_user_id", user.id);
        const totalEarnings = (txs || []).filter(t => t.status === "completed").reduce((s, t) => s + Number(t.amount), 0);
        const { count: campCount } = await supabase.from("campaigns").select("*", { count: "exact", head: true }).eq("brand_user_id", user.id).eq("status", "active");
        const { data: myCampaigns } = await supabase.from("campaigns").select("id").eq("brand_user_id", user.id);
        let appsCount = 0;
        if (myCampaigns && myCampaigns.length > 0) {
          const { count } = await supabase.from("campaign_applications").select("*", { count: "exact", head: true }).in("campaign_id", myCampaigns.map(c => c.id)).eq("status", "pending");
          appsCount = count || 0;
        }
        setStats({ totalEarnings, pendingPayments: 0, activeCampaigns: campCount || 0, applicationsCount: appsCount });
      }
      setStatsLoading(false);
    };
    loadStats();
  }, [user, role]);

  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <Layout>
      <div className="radial-gradient-bg">
        {/* Header */}
        <header className="px-5 pt-6 pb-1 flex items-center justify-between">
          <div className="opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
            <p className="text-xs text-muted-foreground">{greeting}</p>
            <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">{firstName} 👋</h1>
          </div>
          <div className="flex items-center gap-1">
            <Link to="/messages" className="w-9 h-9 rounded-lg flex items-center justify-center relative hover:bg-secondary transition-colors btn-micro">
              <MessageCircle className="w-[18px] h-[18px] text-muted-foreground" />
              {unreadMsgs > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive animate-pulse" />}
            </Link>
            <Link to="/notifications" className="w-9 h-9 rounded-lg flex items-center justify-center relative hover:bg-secondary transition-colors btn-micro">
              <Bell className="w-[18px] h-[18px] text-muted-foreground" />
              {unreadNotifs > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive animate-pulse" />}
            </Link>
          </div>
        </header>

        {/* Search */}
        <div className="px-5 mt-4">
          <div onClick={() => navigate(role === "brand" ? "/creators" : "/campaigns")} className="cursor-pointer">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <div className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary border border-border flex items-center hover:border-accent/30 transition-colors">
                <span className="text-sm text-muted-foreground">Search creators, campaigns...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Stats */}
        <section className="px-5 mt-5">
          {statsLoading ? (
            <div className="bg-primary rounded-xl p-4 h-28 skeleton-shimmer" />
          ) : (
            <div className="bg-primary text-primary-foreground rounded-xl p-4 relative overflow-hidden hover-lift transition-all animate-glow-pulse">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-foreground/5 rounded-full -translate-y-6 translate-x-6" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-accent/10 rounded-full translate-y-4 -translate-x-4" />
              <div className="relative z-10">
                <p className="text-[10px] text-primary-foreground/70 uppercase tracking-wider font-heading">
                  {role === "brand" ? "Total Spent" : "Total Earnings"}
                </p>
                <p className="text-2xl font-heading font-bold mt-1">₹{stats.totalEarnings.toLocaleString("en-IN")}</p>
                <div className="flex gap-3 mt-3">
                  <div>
                    <p className="text-[9px] text-primary-foreground/60">{role === "brand" ? "Active Campaigns" : "Active Projects"}</p>
                    <p className="text-sm font-heading font-bold">{stats.activeCampaigns}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-primary-foreground/60">{role === "brand" ? "Pending Reviews" : "Applications"}</p>
                    <p className="text-sm font-heading font-bold">{stats.applicationsCount}</p>
                  </div>
                  {role === "creator" && stats.pendingPayments > 0 && (
                    <div>
                      <p className="text-[9px] text-primary-foreground/60">Pending</p>
                      <p className="text-sm font-heading font-bold">₹{stats.pendingPayments.toLocaleString("en-IN")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="px-5 mt-4">
          <div className="grid grid-cols-4 gap-2">
            {(role === "brand" ? [
              { icon: Plus, label: "Create", to: "/campaigns/create" },
              { icon: Sparkles, label: "Recommend", to: "/recommendations" },
              { icon: Shield, label: "Escrow", to: "/escrow" },
              { icon: Wallet, label: "Payments", to: "/earnings" },
            ] : [
              { icon: Briefcase, label: "Campaigns", to: "/campaigns" },
              { icon: FileText, label: "Applications", to: "/applications" },
              { icon: Shield, label: "Escrow", to: "/escrow" },
              { icon: Wallet, label: "Earnings", to: "/earnings" },
            ]).map((action, i) => (
              <Link key={i} to={action.to} className="border border-border rounded-lg p-2.5 text-center hover:bg-secondary/50 hover:border-accent/20 transition-all btn-micro flex flex-col items-center gap-1.5 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
                <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center">
                  <action.icon className="w-3.5 h-3.5 text-foreground" />
                </div>
                <p className="text-[9px] font-medium text-foreground">{action.label}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Recommendations Carousel */}
        <RecommendationCarousel />

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
      </div>
    </Layout>
  );
};

export default Index;
