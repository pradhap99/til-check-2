import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ExternalLink, MessageSquare, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import BrandBottomNav from "@/components/BrandBottomNav";

const LEVEL_EMOJIS: Record<number, string> = { 1: "✨", 2: "🌟", 3: "🔥", 4: "💫", 5: "👑", 6: "🥇" };

const filters = ["All", "Fashion", "Beauty", "Food", "Tech", "10K+", "50K+", "1L+"];

const mockCreators = [
  { id: "1", name: "Priya Sharma", handle: "@priya_creates", followers: "45K", niche: "Fashion", er: "4.2%", level: 1, initials: "PS", gradient: "from-pink-500 to-rose-500" },
  { id: "2", name: "Vikram Singh", handle: "@vikram.tech", followers: "120K", niche: "Tech", er: "3.8%", level: 3, initials: "VS", gradient: "from-blue-500 to-indigo-500" },
  { id: "3", name: "Kavya Nair", handle: "@kavyanair", followers: "28K", niche: "Beauty", er: "5.1%", level: 2, initials: "KN", gradient: "from-purple-500 to-pink-500" },
  { id: "4", name: "Arjun T", handle: "@arjun.eats", followers: "89K", niche: "Food", er: "4.5%", level: 3, initials: "AT", gradient: "from-amber-500 to-orange-500" },
  { id: "5", name: "Meera R", handle: "@meera.life", followers: "15K", niche: "Lifestyle", er: "6.2%", level: 2, initials: "MR", gradient: "from-emerald-500 to-teal-500" },
  { id: "6", name: "Rohan K", handle: "@rohan.style", followers: "250K", niche: "Fashion", er: "3.9%", level: 4, initials: "RK", gradient: "from-red-500 to-rose-500" },
];

const mockRoster = [
  { id: "r1", name: "Priya Sharma", initials: "PS", campaign: "Lenskart SS'26", deliverables: "3/4", paymentStatus: "Released", gradient: "from-pink-500 to-rose-500" },
  { id: "r2", name: "Vikram Singh", initials: "VS", campaign: "boAt Summer Audio", deliverables: "4/4", paymentStatus: "In Escrow", gradient: "from-blue-500 to-indigo-500" },
  { id: "r3", name: "Arjun T", initials: "AT", campaign: "Mamaearth Vitamin C", deliverables: "2/3", paymentStatus: "Pending", gradient: "from-amber-500 to-orange-500" },
];

const BrandCreators = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"discover" | "roster">("discover");
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredCreators = mockCreators.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.niche.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeFilter === "All") return true;
    if (["10K+", "50K+", "1L+"].includes(activeFilter)) {
      const num = parseInt(c.followers.replace(/[KLM+]/g, "")) * (c.followers.includes("K") ? 1000 : c.followers.includes("L") ? 100000 : c.followers.includes("M") ? 1000000 : 1);
      if (activeFilter === "10K+") return num >= 10000;
      if (activeFilter === "50K+") return num >= 50000;
      if (activeFilter === "1L+") return num >= 100000;
    }
    return c.niche === activeFilter;
  });

  const paymentColor: Record<string, string> = {
    Released: "bg-emerald-500/15 text-emerald-400",
    "In Escrow": "bg-amber-500/15 text-amber-400",
    Pending: "bg-secondary text-muted-foreground",
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20 max-w-lg mx-auto">
        <div className="page-transition">
          <header className="px-5 pt-6 pb-2">
            <h1 className="text-lg font-heading font-bold text-foreground">Creators</h1>
          </header>

          {/* Tabs */}
          <div className="px-5 mt-2 flex gap-1 p-1 rounded-lg bg-secondary/50">
            {(["discover", "roster"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-md text-xs font-heading font-medium transition-all ${tab === t ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}>
                {t === "discover" ? "Discover" : "My Roster"}
              </button>
            ))}
          </div>

          {tab === "discover" && (
            <>
              <div className="px-5 mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search creators by niche, location, followers" className="pl-9 h-10 rounded-xl" />
                </div>
              </div>
              <div className="px-5 mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {filters.map(f => (
                  <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium whitespace-nowrap ${activeFilter === f ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                    {f}
                  </button>
                ))}
              </div>
              <div className="px-5 mt-4 grid grid-cols-2 gap-2.5 pb-6">
                {filteredCreators.map((c, i) => (
                  <div key={c.id} className="border border-border rounded-2xl p-3.5 bg-card animate-fade-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-2`}>
                        <span className="text-white font-heading font-bold text-sm">{c.initials}</span>
                      </div>
                      <p className="font-heading font-semibold text-sm text-foreground">{c.name} <span className="animate-sparkle-emoji">{LEVEL_EMOJIS[c.level]}</span></p>
                      <p className="text-[9px] text-muted-foreground">{c.handle}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">{c.followers}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{c.niche}</span>
                      </div>
                      <p className="text-[10px] text-accent font-medium mt-1">{c.er} ER</p>
                      <Button size="sm" className="w-full h-7 mt-2.5 text-[10px] rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground font-heading">
                        Invite to Campaign
                      </Button>
                      <Button size="sm" variant="ghost" className="w-full h-6 mt-1 text-[9px] font-heading text-muted-foreground">
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "roster" && (
            <div className="px-5 mt-4 space-y-2.5 pb-6">
              {mockRoster.map((r, i) => (
                <div key={r.id} className="border border-border rounded-2xl p-4 bg-card animate-fade-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center shrink-0`}>
                      <span className="text-white font-heading font-bold text-sm">{r.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-sm text-foreground">{r.name}</p>
                      <p className="text-[10px] text-muted-foreground">{r.campaign}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-foreground font-medium">{r.deliverables} deliverables</span>
                        <Badge className={`text-[8px] border-0 ${paymentColor[r.paymentStatus]}`}>{r.paymentStatus}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1 h-8 rounded-xl text-[10px] font-heading">
                      <MessageSquare className="w-3 h-3 mr-1" /> Message
                    </Button>
                    <Button size="sm" className="flex-1 h-8 rounded-xl text-[10px] bg-accent hover:bg-accent/90 text-accent-foreground font-heading">
                      <RefreshCw className="w-3 h-3 mr-1" /> Re-invite
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <BrandBottomNav />
    </div>
  );
};

export default BrandCreators;
