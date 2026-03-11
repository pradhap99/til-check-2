import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BrandBottomNav from "@/components/BrandBottomNav";
import { Bell, Settings, Megaphone, Users, UserCheck, IndianRupee, ArrowRight, X, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const kpiCards = [
  { icon: Megaphone, color: "text-teal-400", label: "Live Now", value: "3", sub: null },
  { icon: Users, color: "text-teal-400", label: "Applications", value: "47", sub: "8 new" },
  { icon: UserCheck, color: "text-amber-500", label: "Hired This Month", value: "12", sub: null },
  { icon: IndianRupee, color: "text-amber-500", label: "Total Spent", value: "₹3.2L", sub: "₹45K in escrow" },
];

const quickActions = [
  { emoji: "🚀", label: "Post Campaign", to: "/brand/post-campaign", primary: true },
  { emoji: "🔍", label: "Find Creators", to: "/brand/creators" },
  { emoji: "🔒", label: "Fund Escrow", to: "/brand/payments" },
  { emoji: "📊", label: "Analytics", to: "/analytics" },
];

const mockCampaigns = [
  { id: "1", title: "Lenskart SS'26 — Style Your Vision", date: "Apr 1 — Apr 20", status: "Live", filled: 8, total: 15, applications: 18, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=200&fit=crop", platforms: ["Instagram", "YouTube"] },
  { id: "2", title: "Mamaearth Vitamin C Range", date: "Mar 28 — Apr 12", status: "Reviewing", filled: 3, total: 10, applications: 32, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=200&fit=crop", platforms: ["Instagram"] },
  { id: "3", title: "boAt Summer Audio Launch", date: "Apr 5 — Apr 25", status: "Live", filled: 12, total: 20, applications: 12, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop", platforms: ["YouTube", "Instagram"] },
];

const mockApplications = [
  { id: "a1", name: "Priya Sharma", handle: "@priya_creates", followers: "45K", niche: "Fashion", time: "2h ago", initials: "PS" },
  { id: "a2", name: "Arjun Mehta", handle: "@arjunmehta", followers: "189K", niche: "Tech", time: "5h ago", initials: "AM" },
  { id: "a3", name: "Sneha Kapoor", handle: "@snehakapoor", followers: "312K", niche: "Fashion", time: "1d ago", initials: "SK" },
];

const perfStats = [
  { label: "Views", value: "2.4M", bars: [3, 5, 4, 6] },
  { label: "Engagements", value: "89K", bars: [4, 3, 5, 4] },
  { label: "Content", value: "34", bars: [2, 4, 3, 5] },
  { label: "Avg. ER", value: "4.2%", bars: [5, 4, 6, 5] },
];

const statusStyles: Record<string, string> = {
  Live: "bg-teal-500/15 text-teal-400 border border-teal-500/20",
  Reviewing: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  Draft: "bg-zinc-800 text-zinc-400 border border-zinc-700",
  Completed: "bg-zinc-800 text-zinc-500 border border-zinc-700",
};

const BrandDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const brandName = user?.user_metadata?.full_name || "Lenskart";

  return (
    <div className="min-h-screen" style={{ background: "#09090B" }}>
      <main className="pb-24 max-w-lg mx-auto">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 px-5 pt-5 pb-3" style={{ background: "rgba(9,9,11,0.92)", backdropFilter: "blur(20px)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="font-bold text-black text-sm">{brandName.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-[15px] font-bold text-[#FAFAFA]">{brandName}</h1>
                <p className="text-[11px] text-zinc-400">Brand Account</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Link to="/notifications" className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors relative">
                <Bell className="w-[18px] h-[18px] text-zinc-400" />
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center font-bold">2</span>
              </Link>
              <Link to="/settings" className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors">
                <Settings className="w-[18px] h-[18px] text-zinc-400" />
              </Link>
            </div>
          </div>
          {/* Shimmer gold line */}
          <div className="mt-3 h-px w-full overflow-hidden rounded-full">
            <div className="h-full w-[200%] animate-[shimmer_3s_linear_infinite]" style={{ background: "linear-gradient(90deg, transparent, #F59E0B, transparent, #F59E0B, transparent)" }} />
          </div>
        </header>

        {/* KPI Strip */}
        <div className="px-5 mt-3 flex gap-2.5 overflow-x-auto no-scrollbar pb-1" style={{ animationDelay: "0ms" }}>
          {kpiCards.map((k, i) => (
            <div
              key={i}
              className="min-w-[140px] flex-1 rounded-2xl p-3.5 border border-white/5 animate-fade-slide-up"
              style={{ background: "#111113", boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4)", animationDelay: `${i * 80}ms` }}
            >
              <k.icon className={`w-5 h-5 ${k.color} mb-2`} />
              <p className="text-[28px] font-bold text-[#FAFAFA]" style={{ fontVariantNumeric: "tabular-nums" }}>{k.value}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">{k.label}</p>
              {k.sub && (
                <span className={`text-[10px] mt-1 inline-block ${k.sub.includes("new") ? "text-amber-500 font-medium bg-amber-500/10 px-1.5 py-0.5 rounded-full" : "text-zinc-500"}`}>
                  {k.sub}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="px-5 mt-5 animate-fade-slide-up" style={{ animationDelay: "160ms" }}>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {quickActions.map((a, i) => (
              <button
                key={i}
                onClick={() => navigate(a.to)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${
                  a.primary
                    ? "bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold hover:scale-[1.02]"
                    : "border border-white/10 text-zinc-300 hover:border-amber-500 hover:text-amber-400"
                }`}
              >
                <span>{a.emoji}</span> {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Campaigns */}
        <section className="mt-6 animate-fade-slide-up" style={{ animationDelay: "240ms" }}>
          <div className="flex items-center justify-between px-5 mb-3">
            <h3 className="font-bold text-[15px] text-[#FAFAFA]">Your Campaigns</h3>
            <Link to="/brand/campaigns" className="text-xs text-amber-500 font-medium flex items-center gap-0.5">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="px-5 space-y-3">
            {mockCampaigns.map((c, i) => (
              <div
                key={c.id}
                className="rounded-2xl overflow-hidden border border-white/5 animate-fade-slide-up"
                style={{ background: "#111113", boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4)", animationDelay: `${320 + i * 80}ms` }}
              >
                <div className="flex gap-3 p-3.5">
                  <img src={c.image} alt={c.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-1.5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {c.status === "Live" && <span className="relative flex h-2 w-2 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span></span>}
                          <h4 className="text-[13px] font-bold text-[#FAFAFA] line-clamp-1">{c.title}</h4>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {c.platforms.map(p => (
                            <span key={p} className="text-[9px] rounded-full bg-white/5 text-zinc-400 px-2 py-0.5">{p}</span>
                          ))}
                        </div>
                      </div>
                      <Badge className={`text-[9px] border shrink-0 ${statusStyles[c.status]}`}>{c.status}</Badge>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1.5">{c.date}</p>
                  </div>
                </div>
                {/* Progress */}
                <div className="px-3.5 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-zinc-400">{c.filled}/{c.total} creators filled</span>
                    <span className="text-[10px] text-amber-500 font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>{Math.round((c.filled / c.total) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all" style={{ width: `${(c.filled / c.total) * 100}%` }} />
                  </div>
                </div>
                <div className="flex gap-2 px-3.5 pb-3.5 pt-1">
                  <Button
                    size="sm"
                    className="flex-1 h-9 text-[11px] rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold hover:scale-[1.02] transition-transform border-0"
                    onClick={() => navigate("/brand/applications")}
                  >
                    View Applications ({c.applications})
                  </Button>
                  <Button size="sm" className="h-9 px-4 rounded-xl text-[11px] font-medium bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New Applications */}
        <section className="px-5 mt-6 animate-fade-slide-up" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[15px] text-[#FAFAFA]">New Applications (8)</h3>
            <Link to="/brand/applications" className="text-xs text-amber-500 font-medium flex items-center gap-0.5">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-2">
            {mockApplications.map((app, i) => (
              <div
                key={app.id}
                className="rounded-xl p-3 flex items-center gap-3 border border-white/5 animate-fade-slide-up"
                style={{ background: "#111113", animationDelay: `${480 + i * 60}ms` }}
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-amber-500/10 text-amber-500 font-bold text-xs">{app.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#FAFAFA]">{app.name}</p>
                  <p className="text-[10px] text-zinc-500">{app.handle} · {app.followers} · {app.niche} · {app.time}</p>
                </div>
                <div className="flex gap-1.5">
                  <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </button>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
                    <XCircle className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* This Week Performance */}
        <section className="px-5 mt-6 mb-6 animate-fade-slide-up" style={{ animationDelay: "560ms" }}>
          <h3 className="font-bold text-[15px] text-[#FAFAFA] mb-3">This Week</h3>
          <div className="grid grid-cols-4 gap-2.5">
            {perfStats.map((s, i) => (
              <div key={i} className="rounded-xl p-3 border border-white/5 text-center" style={{ background: "#111113" }}>
                <div className="flex items-end justify-center gap-[3px] h-6 mb-2">
                  {s.bars.map((h, j) => (
                    <div key={j} className="w-[5px] rounded-sm bg-amber-500/60" style={{ height: `${h * 4}px` }} />
                  ))}
                </div>
                <p className="text-sm font-bold text-[#FAFAFA]" style={{ fontVariantNumeric: "tabular-nums" }}>{s.value}</p>
                <p className="text-[9px] text-zinc-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BrandBottomNav />
    </div>
  );
};

export default BrandDashboard;
