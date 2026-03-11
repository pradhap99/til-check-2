import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BrandBottomNav from "@/components/BrandBottomNav";
import { Bell, Plus, Users, Briefcase, IndianRupee, UserCheck, ArrowRight, CheckCircle, X, BarChart3, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockStats = [
  { label: "Active Campaigns", value: "3", icon: Briefcase, color: "text-accent" },
  { label: "Total Applications", value: "47", icon: Users, color: "text-emerald-500" },
  { label: "Creators Hired", value: "12", icon: UserCheck, color: "text-blue-400" },
  { label: "Total Spent", value: "₹3.2L", icon: IndianRupee, color: "text-accent" },
];

const mockCampaigns = [
  { id: "1", title: "Lenskart SS'26 — Style Your Vision", budget: "₹8L–15L", date: "Apr 1 — Apr 20", status: "Active", applications: 18, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=200&fit=crop" },
  { id: "2", title: "Mamaearth Vitamin C Range", budget: "₹3L–7L", date: "Mar 28 — Apr 12", status: "Reviewing", applications: 32, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=200&fit=crop" },
  { id: "3", title: "boAt Summer Audio Launch", budget: "₹5L–10L", date: "Apr 5 — Apr 25", status: "Active", applications: 12, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop" },
];

const mockApplications = [
  { id: "a1", name: "Priya Sharma", followers: "245K", niche: "Beauty", date: "2 hours ago", status: "Pending", initials: "PS" },
  { id: "a2", name: "Arjun Mehta", followers: "189K", niche: "Tech", date: "5 hours ago", status: "Pending", initials: "AM" },
  { id: "a3", name: "Sneha Kapoor", followers: "312K", niche: "Fashion", date: "1 day ago", status: "Accepted", initials: "SK" },
  { id: "a4", name: "Rahul Verma", followers: "98K", niche: "Food", date: "1 day ago", status: "Pending", initials: "RV" },
  { id: "a5", name: "Kavya Nair", followers: "156K", niche: "Fitness", date: "2 days ago", status: "Declined", initials: "KN" },
];

const BrandDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const brandName = user?.user_metadata?.full_name || "Brand";

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
                <h1 className="text-base font-heading font-bold text-foreground">{brandName} Dashboard</h1>
                <p className="text-[10px] text-muted-foreground">Manage campaigns & creators</p>
              </div>
            </div>
            <Link to="/notifications" className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
              <Bell className="w-[18px] h-[18px] text-muted-foreground" />
            </Link>
          </header>

          {/* Stats */}
          <div className="px-5 mt-4 grid grid-cols-2 gap-2">
            {mockStats.map((s, i) => (
              <div key={i} className="border border-border rounded-2xl p-4 bg-card animate-fade-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
                <p className={`text-2xl font-heading font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Active Campaigns */}
          <section className="mt-5">
            <div className="flex items-center justify-between px-5 mb-3">
              <h3 className="font-heading font-bold text-[15px] text-foreground">Your Active Campaigns</h3>
              <Link to="/campaigns" className="text-xs text-accent font-medium flex items-center gap-0.5">View all <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
              {mockCampaigns.map((c, i) => (
                <div key={c.id} className="min-w-[260px] max-w-[260px] shrink-0 rounded-2xl overflow-hidden bg-card border border-border animate-scale-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="relative h-[110px]">
                    <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <Badge className={`absolute top-2 right-2 text-[9px] border-0 font-heading ${c.status === "Active" ? "bg-emerald-500/90 text-white" : "bg-accent/90 text-accent-foreground"}`}>
                      {c.status}
                    </Badge>
                  </div>
                  <div className="p-3">
                    <h4 className="text-[12px] font-heading font-bold text-foreground line-clamp-1">{c.title}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{c.budget} · {c.date}</p>
                    <div className="flex gap-2 mt-2.5">
                      <Button size="sm" className="flex-1 h-7 text-[10px] rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground font-heading" onClick={() => navigate(`/campaigns/${c.id}/manage`)}>
                        View Applications ({c.applications})
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Applications */}
          <section className="px-5 mt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-bold text-[15px] text-foreground">Recent Applications</h3>
              <Link to="/campaigns" className="text-xs text-accent font-medium flex items-center gap-0.5">All <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="space-y-2">
              {mockApplications.map((app, i) => (
                <div key={app.id} className="border border-border rounded-xl p-3.5 flex items-center gap-3 animate-fade-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-accent/10 text-accent font-heading font-bold text-xs">{app.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-medium text-sm text-foreground">{app.name}</p>
                    <p className="text-[10px] text-muted-foreground">{app.followers} · {app.niche} · {app.date}</p>
                  </div>
                  {app.status === "Pending" ? (
                    <div className="flex gap-1.5">
                      <button className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center hover:bg-emerald-500/20 transition-colors">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      </button>
                      <button className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors">
                        <X className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  ) : (
                    <Badge className={`text-[9px] border-0 ${app.status === "Accepted" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}`}>
                      {app.status}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="px-5 mt-5 mb-6">
            <h3 className="font-heading font-bold text-[15px] text-foreground mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Post New Campaign", icon: Plus, to: "/brand/post-campaign", primary: true },
                { label: "View All Applicants", icon: Users, to: "/campaigns" },
                { label: "Escrow Payments", icon: IndianRupee, to: "/escrow" },
                { label: "Analytics", icon: BarChart3, to: "/analytics" },
              ].map((a, i) => (
                <Button
                  key={i}
                  variant={a.primary ? "default" : "outline"}
                  className={`h-12 rounded-xl text-xs font-heading ${a.primary ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}`}
                  onClick={() => navigate(a.to)}
                >
                  <a.icon className="w-4 h-4 mr-1.5" /> {a.label}
                </Button>
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
