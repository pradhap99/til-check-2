import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BrandBottomNav from "@/components/BrandBottomNav";

const tabs = ["All", "Live", "Reviewing", "Completed", "Draft"];

const mockCampaigns = [
  { id: "1", title: "Lenskart SS'26 — Style Your Vision", category: "Fashion", date: "Apr 1 — Apr 20", location: "Pan India", budget: "₹8L–15L", status: "Live", filled: 8, total: 15, views: "2.4M", er: "4.2%", applications: 18, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=200&fit=crop" },
  { id: "2", title: "Mamaearth Vitamin C Range", category: "Beauty", date: "Mar 28 — Apr 12", location: "Delhi, Mumbai", budget: "₹3L–7L", status: "Reviewing", filled: 3, total: 10, views: "890K", er: "3.8%", applications: 32, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=200&fit=crop" },
  { id: "3", title: "boAt Summer Audio Launch", category: "Tech", date: "Apr 5 — Apr 25", location: "Pan India", budget: "₹5L–10L", status: "Live", filled: 12, total: 20, views: "1.8M", er: "4.5%", applications: 12, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop" },
  { id: "4", title: "Myntra End of Season Sale", category: "Fashion", date: "Mar 15 — Mar 30", location: "Pan India", budget: "₹10L–20L", status: "Completed", filled: 25, total: 25, views: "5.2M", er: "3.9%", applications: 65, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=200&fit=crop" },
  { id: "5", title: "Nykaa Summer Glow", category: "Beauty", date: "—", location: "Mumbai", budget: "₹4L–8L", status: "Draft", filled: 0, total: 12, views: "—", er: "—", applications: 0, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=200&fit=crop" },
];

const statusColor: Record<string, string> = {
  Live: "bg-emerald-500/15 text-emerald-400",
  Reviewing: "bg-amber-500/15 text-amber-400",
  Completed: "bg-muted text-muted-foreground",
  Draft: "bg-secondary text-muted-foreground",
};

const BrandCampaigns = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All" ? mockCampaigns : mockCampaigns.filter(c => c.status === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20 max-w-lg mx-auto">
        <div className="page-transition">
          <header className="px-5 pt-6 pb-2 flex items-center justify-between">
            <h1 className="text-lg font-heading font-bold text-foreground">My Campaigns</h1>
            <Button size="sm" className="h-8 rounded-xl text-xs font-heading bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => navigate("/brand/post-campaign")}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Post New
            </Button>
          </header>

          <div className="px-5 mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)} className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium whitespace-nowrap transition-all ${activeTab === t ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                {t} {t !== "All" && `(${mockCampaigns.filter(c => c.status === t).length})`}
              </button>
            ))}
          </div>

          <div className="px-5 mt-4 space-y-3 pb-6">
            {filtered.map((c, i) => (
              <div key={c.id} className="border border-border rounded-2xl overflow-hidden bg-card animate-fade-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex gap-3 p-3">
                  <img src={c.image} alt={c.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-[12px] font-heading font-bold text-foreground line-clamp-1 flex-1">{c.title}</h4>
                      <Badge className={`text-[8px] border-0 shrink-0 ${statusColor[c.status]}`}>{c.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{c.category}</span>
                      <span className="text-[9px] text-accent font-medium">{c.budget}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[9px] text-muted-foreground flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {c.location}</span>
                      <span className="text-[9px] text-muted-foreground flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" /> {c.date}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[9px] text-foreground font-medium">{c.filled}/{c.total} creators</span>
                      {c.status === "Live" && <span className="text-[9px] text-accent">{c.views} views · {c.er} ER</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 px-3 pb-3">
                  <Button size="sm" className="flex-1 h-8 text-[10px] rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground font-heading" onClick={() => navigate("/brand/applications")}>
                    View Applications ({c.applications})
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-3 rounded-lg text-[10px] font-heading">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BrandBottomNav />
    </div>
  );
};

export default BrandCampaigns;
