import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MapPin, Calendar, Users, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BrandBottomNav from "@/components/BrandBottomNav";

const tabs = ["All", "Live", "Reviewing", "Draft", "Completed"];

const mockCampaigns = [
  { id: "1", title: "Lenskart SS'26 — Style Your Vision", niche: "Fashion", date: "Apr 1 — Apr 20", location: "Pan India", budget: "₹8L–15L", status: "Live", filled: 8, total: 15, views: "2.4M", er: "4.2%", applications: 18, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=200&fit=crop", platforms: ["Instagram", "YouTube"] },
  { id: "2", title: "Mamaearth Vitamin C Range", niche: "Beauty", date: "Mar 28 — Apr 12", location: "Delhi, Mumbai", budget: "₹3L–7L", status: "Reviewing", filled: 3, total: 10, views: "890K", er: "3.8%", applications: 32, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=200&fit=crop", platforms: ["Instagram"] },
  { id: "3", title: "boAt Summer Audio Launch", niche: "Tech", date: "Apr 5 — Apr 25", location: "Pan India", budget: "₹5L–10L", status: "Live", filled: 12, total: 20, views: "1.8M", er: "4.5%", applications: 12, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop", platforms: ["YouTube", "Instagram"] },
  { id: "4", title: "Myntra End of Season Sale", niche: "Fashion", date: "Mar 15 — Mar 30", location: "Pan India", budget: "₹10L–20L", status: "Completed", filled: 25, total: 25, views: "5.2M", er: "3.9%", applications: 65, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=200&fit=crop", platforms: ["Instagram"] },
  { id: "5", title: "Nykaa Summer Glow", niche: "Beauty", date: "—", location: "Mumbai", budget: "₹4L–8L", status: "Draft", filled: 0, total: 12, views: "—", er: "—", applications: 0, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=200&fit=crop", platforms: ["Instagram", "YouTube"] },
];

const statusStyles: Record<string, string> = {
  Live: "bg-teal-500/15 text-teal-400 border border-teal-500/20",
  Reviewing: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  Draft: "bg-zinc-800 text-zinc-500 border border-zinc-700",
  Completed: "bg-zinc-800 text-zinc-500 border border-zinc-700",
};

const BrandCampaigns = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const filtered = activeTab === "All" ? mockCampaigns : mockCampaigns.filter(c => c.status === activeTab);

  return (
    <div className="min-h-screen" style={{ background: "#09090B" }}>
      <main className="pb-24 max-w-lg mx-auto">
        <header className="px-5 pt-6 pb-2 flex items-center justify-between">
          <h1 className="text-lg font-bold text-[#FAFAFA]">Campaigns</h1>
          <Button
            size="sm"
            className="h-9 rounded-xl px-4 text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-400 text-black hover:scale-[1.02] transition-transform border-0"
            onClick={() => navigate("/brand/post-campaign")}
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> New Campaign
          </Button>
        </header>

        {/* Filter Tabs */}
        <div className="px-5 mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {tabs.map(t => {
            const count = t === "All" ? mockCampaigns.length : mockCampaigns.filter(c => c.status === t).length;
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === t
                    ? "bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold"
                    : "border border-white/10 text-zinc-400 hover:border-amber-500/40 hover:text-amber-400"
                }`}
              >
                {t} ({count})
              </button>
            );
          })}
        </div>

        {/* Campaign Cards */}
        <div className="px-5 mt-4 space-y-3 pb-6">
          {filtered.map((c, i) => (
            <div
              key={c.id}
              className="rounded-2xl overflow-hidden border border-white/5 animate-fade-slide-up"
              style={{ background: "#111113", boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4)", animationDelay: `${i * 80}ms` }}
            >
              <div className="flex gap-3 p-4">
                <img src={c.image} alt={c.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-[13px] font-bold text-[#FAFAFA] line-clamp-1">{c.title}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] text-amber-500 font-medium">{c.niche}</span>
                        <span className="text-[10px] text-amber-500 font-semibold">{c.budget}</span>
                      </div>
                    </div>
                    <Badge className={`text-[9px] shrink-0 ${statusStyles[c.status]}`}>{c.status}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-zinc-400 flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {c.location}</span>
                    <span className="text-[10px] text-zinc-400 flex items-center gap-0.5"><Calendar className="w-3 h-3" /> {c.date}</span>
                  </div>
                  {/* Progress */}
                  <div className="mt-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users className="w-3 h-3 text-zinc-500" />
                      <span className="text-[10px] text-zinc-300">{c.filled}/{c.total} creators</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400" style={{ width: `${(c.filled / c.total) * 100}%` }} />
                    </div>
                  </div>
                  {/* Performance */}
                  {(c.status === "Live" || c.status === "Completed") && c.views !== "—" && (
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-zinc-400 flex items-center gap-0.5"><Eye className="w-3 h-3" /> <span className="text-teal-400">{c.views}</span></span>
                      <span className="text-[10px] text-zinc-400 flex items-center gap-0.5"><Heart className="w-3 h-3" /> <span className="text-teal-400">{c.er} ER</span></span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 px-4 pb-4">
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
      </main>
      <BrandBottomNav />
    </div>
  );
};

export default BrandCampaigns;
