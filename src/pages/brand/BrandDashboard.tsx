import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BrandBottomNav from "@/components/BrandBottomNav";
import { Bell, Settings, Megaphone, Users, CheckCircle, IndianRupee, ArrowRight, X, ExternalLink, Eye, Heart, FileText, BarChart3, MessageSquare, CreditCard, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockStats = [
  { emoji: "📊", label: "Active Campaigns", value: "3", sub: "12 slots remaining" },
  { emoji: "📎", label: "Applications", value: "47", sub: "8 new today", highlight: true },
  { emoji: "✅", label: "Creators Hired", value: "12", sub: "This month" },
  { emoji: "💸", label: "Total Spent", value: "₹3.2L", sub: "₹45K in escrow" },
];

const quickActions = [
  { emoji: "🚀", label: "Post Campaign", to: "/brand/post-campaign", primary: true },
  { emoji: "👥", label: "Find Creators", to: "/brand/creators" },
  { emoji: "💳", label: "Fund Escrow", to: "/brand/payments" },
  { emoji: "📊", label: "Analytics", to: "/analytics" },
  { emoji: "💬", label: "Messages", to: "/messages" },
];

const mockCampaigns = [
  { id: "1", title: "Lenskart SS'26 — Style Your Vision", date: "Apr 1 — Apr 20", status: "Live", filled: 8, total: 15, applications: 18, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=200&fit=crop" },
  { id: "2", title: "Mamaearth Vitamin C Range", date: "Mar 28 — Apr 12", status: "Reviewing", filled: 3, total: 10, applications: 32, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=200&fit=crop" },
  { id: "3", title: "boAt Summer Audio Launch", date: "Apr 5 — Apr 25", status: "Live", filled: 12, total: 20, applications: 12, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop" },
];

const mockApplications = [
  { id: "a1", name: "Priya Sharma", handle: "@priya_creates", followers: "45K", niche: "Fashion", time: "2h ago", initials: "PS" },
  { id: "a2", name: "Arjun Mehta", handle: "@arjunmehta", followers: "189K", niche: "Tech", time: "5h ago", initials: "AM" },
  { id: "a3", name: "Sneha Kapoor", handle: "@snehakapoor", followers: "312K", niche: "Fashion", time: "1d ago", initials: "SK" },
];

const perfStats = [
  { label: "Views Generated", value: "2.4M" },
  { label: "Engagements", value: "89K" },
  { label: "Content Pieces", value: "34" },
  { label: "Avg. ER", value: "4.2%" },
];

const BrandDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const brandName = user?.user_metadata?.full_name || "Lenskart";

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20 max-w-lg mx-auto">
        <div className="page-transition">
          {/* Header */}
          <header className="px-5 pt-6 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <span className="font-heading font-bold text-accent text-sm">{brandName.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-base font-heading font-bold text-foreground">{brandName}</h1>
                <p className="text-[10px] text-muted-foreground">Brand Account</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/notifications" className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors relative">
                <Bell className="w-[18px] h-[18px] text-muted-foreground" />
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-destructive text-[9px] text-white flex items-center justify-center font-bold">2</span>
              </Link>
              <Link to="/settings" className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                <Settings className="w-[18px] h-[18px] text-muted-foreground" />
              </Link>
            </div>
          </header>

          {/* Insight Strip */}
          <div className="px-5 mt-4 grid grid-cols-2 gap-2">
            {mockStats.map((s, i) => (
              <div key={i} className="border border-border rounded-2xl p-4 bg-card animate-fade-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="text-lg">{s.emoji}</span>
                <p className="text-2xl font-heading font-bold text-foreground mt-1">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
                <p className={`text-[9px] mt-0.5 ${s.highlight ? "text-accent font-medium" : "text-muted-foreground"}`}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="px-5 mt-5">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {quickActions.map((a, i) => (
                <button
                  key={i}
                  onClick={() => navigate(a.to)}
                  className={`shrink-0 h-9 px-4 rounded-full text-xs font-heading font-medium flex items-center gap-1.5 transition-all ${
                    a.primary
                      ? "bg-accent text-accent-foreground"
                      : "bg-card border border-border text-foreground hover:border-accent/50"
                  }`}
                >
                  <span>{a.emoji}</span> {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Campaigns */}
          <section className="mt-5">
            <div className="flex items-center justify-between px-5 mb-3">
              <h3 className="font-heading font-bold text-[15px] text-foreground">Your Live Campaigns</h3>
              <Link to="/brand/campaigns" className="text-xs text-accent font-medium flex items-center gap-0.5">View all <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="px-5 space-y-3">
              {mockCampaigns.map((c, i) => (
                <div key={c.id} className="border border-border rounded-2xl overflow-hidden bg-card animate-fade-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex gap-3 p-3">
                    <img src={c.image} alt={c.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-[12px] font-heading font-bold text-foreground line-clamp-1 flex-1">{c.title}</h4>
                        <Badge className={`text-[8px] border-0 shrink-0 ${c.status === "Live" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                          {c.status}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-accent mt-0.5">{c.date}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] text-muted-foreground">{c.filled}/{c.total} creators filled</span>
                          <span className="text-[9px] text-accent font-medium">{Math.round((c.filled / c.total) * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-secondary">
                          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(c.filled / c.total) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 px-3 pb-3">
                    <Button size="sm" className="flex-1 h-8 text-[10px] rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground font-heading" onClick={() => navigate("/brand/applications")}>
                      View Applications ({c.applications})
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-3 rounded-lg text-[10px] font-heading">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* New Applications */}
          <section className="px-5 mt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-bold text-[15px] text-foreground">New Applications (8)</h3>
              <Link to="/brand/applications" className="text-xs text-accent font-medium flex items-center gap-0.5">View all <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="space-y-2">
              {mockApplications.map((app, i) => (
                <div key={app.id} className="border border-border rounded-xl p-3.5 flex items-center gap-3 animate-fade-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-accent/10 text-accent font-heading font-bold text-xs">{app.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-medium text-sm text-foreground">{app.name}</p>
                    <p className="text-[10px] text-muted-foreground">{app.handle} · {app.followers} · {app.niche} · {app.time}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center hover:bg-emerald-500/20 transition-colors">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors">
                      <X className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Campaign Performance */}
          <section className="px-5 mt-5 mb-6">
            <h3 className="font-heading font-bold text-[15px] text-foreground mb-3">This Week</h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {perfStats.map((s, i) => (
                <div key={i} className="shrink-0 border border-border rounded-xl px-4 py-3 bg-card min-w-[110px]">
                  <p className="text-lg font-heading font-bold text-foreground">{s.value}</p>
                  <p className="text-[9px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <BrandBottomNav />
    </div>
  );
};

export default BrandDashboard;
