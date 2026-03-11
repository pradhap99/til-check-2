import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MessageSquare, RefreshCw, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import BrandBottomNav from "@/components/BrandBottomNav";

const LEVEL_EMOJIS: Record<number, string> = { 1: "✨", 2: "🌟", 3: "🔥", 4: "💫", 5: "👑", 6: "🥇" };

const nicheFilters = ["All", "Fashion", "Beauty", "Food", "Tech", "Lifestyle", "Travel"];
const followerFilters = ["Any", "10K+", "50K+", "1L+", "5L+"];

const mockCreators = [
  { id: "1", name: "Priya Sharma", handle: "@priya_creates", followers: "45K", followersNum: 45000, niche: "Fashion", er: "4.2", level: 1, initials: "PS", gradient: "from-pink-500 to-rose-500", platforms: ["📸"] },
  { id: "2", name: "Vikram Singh", handle: "@vikram.tech", followers: "120K", followersNum: 120000, niche: "Tech", er: "3.8", level: 3, initials: "VS", gradient: "from-blue-500 to-indigo-500", platforms: ["▶️", "📸"] },
  { id: "3", name: "Kavya Nair", handle: "@kavyanair", followers: "28K", followersNum: 28000, niche: "Beauty", er: "5.1", level: 2, initials: "KN", gradient: "from-purple-500 to-pink-500", platforms: ["📸"] },
  { id: "4", name: "Arjun T", handle: "@arjun.eats", followers: "89K", followersNum: 89000, niche: "Food", er: "4.5", level: 3, initials: "AT", gradient: "from-amber-500 to-orange-500", platforms: ["📸", "▶️"] },
  { id: "5", name: "Meera R", handle: "@meera.life", followers: "15K", followersNum: 15000, niche: "Lifestyle", er: "6.2", level: 2, initials: "MR", gradient: "from-emerald-500 to-teal-500", platforms: ["📸"] },
  { id: "6", name: "Rohan K", handle: "@rohan.style", followers: "250K", followersNum: 250000, niche: "Fashion", er: "3.9", level: 4, initials: "RK", gradient: "from-red-500 to-rose-500", platforms: ["▶️", "📸"] },
];

const mockRoster = [
  { id: "r1", name: "Priya Sharma", initials: "PS", campaign: "Lenskart SS'26", deliverables: "3/4", status: "Active", paymentStatus: "Released", gradient: "from-pink-500 to-rose-500" },
  { id: "r2", name: "Vikram Singh", initials: "VS", campaign: "boAt Summer Audio", deliverables: "4/4", status: "Active", paymentStatus: "In Escrow", gradient: "from-blue-500 to-indigo-500" },
  { id: "r3", name: "Arjun T", initials: "AT", campaign: "Mamaearth Vitamin C", deliverables: "2/3", status: "Past", paymentStatus: "Pending", gradient: "from-amber-500 to-orange-500" },
];

const paymentStyles: Record<string, string> = {
  Released: "bg-teal-500/15 text-teal-400",
  "In Escrow": "bg-amber-500/15 text-amber-400",
  Pending: "bg-zinc-800 text-zinc-500",
};

const rosterStatusStyles: Record<string, string> = {
  Active: "bg-teal-500/15 text-teal-400",
  Past: "bg-zinc-800 text-zinc-500",
};

const BrandCreators = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"discover" | "roster">("discover");
  const [activeNiche, setActiveNiche] = useState("All");
  const [activeFollower, setActiveFollower] = useState("Any");
  const [search, setSearch] = useState("");
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());

  const toggleShortlist = (id: string) => {
    setShortlisted(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredCreators = mockCreators.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.niche.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeNiche !== "All" && c.niche !== activeNiche) return false;
    if (activeFollower !== "Any") {
      const min = activeFollower === "10K+" ? 10000 : activeFollower === "50K+" ? 50000 : activeFollower === "1L+" ? 100000 : 500000;
      if (c.followersNum < min) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen" style={{ background: "#09090B" }}>
      <main className="pb-24 max-w-lg mx-auto">
        <header className="px-5 pt-6 pb-2">
          <h1 className="text-lg font-bold text-[#FAFAFA]">Find Creators</h1>
        </header>

        {/* Tabs */}
        <div className="px-5 mt-2 flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
          {(["discover", "roster"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all ${
                tab === t
                  ? "bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold"
                  : "text-zinc-400 hover:text-zinc-300"
              }`}
            >
              {t === "discover" ? "Discover" : "My Roster"}
            </button>
          ))}
        </div>

        {tab === "discover" && (
          <>
            {/* Search */}
            <div className="px-5 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by niche, city, followers…"
                  className="pl-9 h-10 rounded-xl border-white/10 bg-white/5 text-[#FAFAFA] placeholder:text-zinc-500 focus-visible:ring-amber-500/30"
                />
              </div>
            </div>

            {/* Niche Filters */}
            <div className="px-5 mt-3 flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {nicheFilters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveNiche(f)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                    activeNiche === f
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "bg-white/5 text-zinc-400 border border-transparent hover:border-white/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            {/* Follower Filters */}
            <div className="px-5 mt-2 flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {followerFilters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFollower(f)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                    activeFollower === f
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "bg-white/5 text-zinc-400 border border-transparent hover:border-white/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Creator Grid */}
            <div className="px-5 mt-4 grid grid-cols-2 gap-2.5 pb-6">
              {filteredCreators.map((c, i) => (
                <div
                  key={c.id}
                  className="rounded-2xl p-3.5 border border-white/5 relative animate-fade-slide-up"
                  style={{ background: "#111113", animationDelay: `${i * 60}ms` }}
                >
                  {/* Shortlist */}
                  <button
                    onClick={() => toggleShortlist(c.id)}
                    className="absolute top-3 right-3 transition-transform hover:scale-110"
                  >
                    <Bookmark
                      className={`w-4 h-4 transition-colors ${shortlisted.has(c.id) ? "text-amber-500 fill-amber-500" : "text-zinc-600"}`}
                    />
                  </button>

                  {/* Level badge */}
                  <div className="absolute top-3 left-3 text-sm">{LEVEL_EMOJIS[c.level]}</div>

                  <div className="flex flex-col items-center text-center pt-2">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-2`}>
                      <span className="text-white font-bold text-sm">{c.initials}</span>
                    </div>
                    <p className="font-bold text-sm text-[#FAFAFA]">{c.name}</p>
                    <p className="text-[10px] text-zinc-500">{c.handle}</p>

                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] rounded-full bg-white/5 text-zinc-300 px-2 py-0.5">{c.followers}</span>
                      <span className="text-[10px] rounded-full bg-white/5 text-zinc-400 px-2 py-0.5">{c.niche}</span>
                    </div>

                    <p className="text-teal-400 font-bold text-sm mt-1.5" style={{ fontVariantNumeric: "tabular-nums" }}>{c.er}% <span className="text-zinc-500 font-normal text-[10px]">ER</span></p>

                    <div className="flex items-center gap-1 mt-1">
                      {c.platforms.map((p, j) => <span key={j} className="text-xs">{p}</span>)}
                    </div>

                    <Button
                      size="sm"
                      className="w-full h-8 mt-3 text-[11px] rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold hover:scale-[1.02] transition-transform border-0"
                    >
                      Invite
                    </Button>
                    <Button
                      size="sm"
                      className="w-full h-7 mt-1 text-[10px] rounded-lg bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10"
                      onClick={() => navigate(`/creator/priya`)}
                    >
                      View
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
              <div
                key={r.id}
                className="rounded-2xl p-4 border border-white/5 animate-fade-slide-up"
                style={{ background: "#111113", animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-bold text-sm">{r.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#FAFAFA]">{r.name}</p>
                    <p className="text-[10px] text-zinc-500">{r.campaign}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-zinc-300 font-medium">{r.deliverables} deliverables</span>
                      <Badge className={`text-[8px] border-0 ${rosterStatusStyles[r.status]}`}>{r.status}</Badge>
                      <Badge className={`text-[8px] border-0 ${paymentStyles[r.paymentStatus]}`}>{r.paymentStatus}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1 h-8 rounded-xl text-[10px] font-medium bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10">
                    <MessageSquare className="w-3 h-3 mr-1" /> Message
                  </Button>
                  <Button size="sm" className="flex-1 h-8 rounded-xl text-[10px] font-semibold bg-gradient-to-r from-amber-500 to-amber-400 text-black hover:scale-[1.02] transition-transform border-0">
                    <RefreshCw className="w-3 h-3 mr-1" /> Re-invite
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <BrandBottomNav />
    </div>
  );
};

export default BrandCreators;
