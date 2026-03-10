import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import CreatorHomeContent from "@/components/home/CreatorHomeContent";
import BrandHomeContent from "@/components/home/BrandHomeContent";
import { Bell, Search, MessageCircle, SlidersHorizontal } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Index = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";
  const avatarUrl = user?.user_metadata?.avatar_url;
  const initials = firstName.charAt(0).toUpperCase();
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [unreadMsgs, setUnreadMsgs] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [userCity, setUserCity] = useState<string | undefined>();
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

    supabase.from("profiles").select("location_city, avatar_url").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data?.location_city) setUserCity(data.location_city); });

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
  const levelProgress = 90;

  return (
    <Layout>
      <div className="radial-gradient-bg">
        {/* Header */}
        <header className="px-5 pt-6 pb-1 flex items-center justify-between">
          <div className="flex items-center gap-3 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
            <Avatar className="w-9 h-9 border-2 border-accent/40">
              <AvatarImage src={avatarUrl} alt={firstName} />
              <AvatarFallback className="bg-accent/20 text-accent font-heading font-bold text-sm">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[10px] text-muted-foreground leading-none">{greeting}</p>
              <h1 className="text-base font-heading font-bold text-foreground tracking-tight leading-tight mt-0.5">{firstName} 👋</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-20 h-1 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${levelProgress}%` }} />
                </div>
                <span className="text-[9px] text-muted-foreground font-medium">Lv1 · {levelProgress}%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link to="/messages" className="w-9 h-9 rounded-lg flex items-center justify-center relative hover:bg-secondary transition-colors btn-micro">
              <MessageCircle className="w-[18px] h-[18px] text-muted-foreground" />
              {unreadMsgs > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive animate-pulse" />}
            </Link>
            <Link to="/alerts" className="w-9 h-9 rounded-lg flex items-center justify-center relative hover:bg-secondary transition-colors btn-micro">
              <Bell className="w-[18px] h-[18px] text-muted-foreground" />
              {unreadNotifs > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive animate-pulse" />}
            </Link>
            <Link to="/profile" className="ml-0.5 btn-micro">
              <Avatar className="w-8 h-8 ring-[1.5px] ring-accent/50 ring-offset-1 ring-offset-background">
                <AvatarImage src={avatarUrl} alt={firstName} />
                <AvatarFallback className="bg-accent/20 text-accent font-heading font-bold text-[11px]">{initials}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Premium Search Bar */}
        <div className="px-5 mt-4">
          <div onClick={() => navigate(role === "brand" ? "/creators" : "/campaigns")} className="cursor-pointer">
            <div className="relative search-bar-premium rounded-full p-[1.5px]">
              <div className="relative flex items-center w-full h-11 rounded-full bg-card">
                <Search className="absolute left-3.5 w-4 h-4 text-accent" />
                <div className="w-full h-full pl-10 pr-12 flex items-center">
                  <span className="text-sm text-muted-foreground/70 italic font-light">Search</span>
                </div>
                <button className="absolute right-2 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center hover:bg-accent/20 transition-colors">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Role-specific content */}
        {role === "brand" ? (
          <BrandHomeContent stats={stats} statsLoading={statsLoading} />
        ) : (
          <CreatorHomeContent stats={stats} statsLoading={statsLoading} userCity={userCity} />
        )}
      </div>
    </Layout>
  );
};

export default Index;
