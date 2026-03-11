import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, X, ExternalLink, MessageSquare, IndianRupee, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BrandBottomNav from "@/components/BrandBottomNav";

const LEVEL_EMOJIS: Record<number, string> = { 1: "✨", 2: "🌟", 3: "🔥", 4: "💫", 5: "👑", 6: "🥇" };

const filterTabs = ["All", "Pending", "Accepted", "Declined"];
const sortOptions = ["Best Match", "Most Followers", "Highest ER", "Newest"];

const mockApps = [
  { id: "1", name: "Priya Sharma", handle: "@priya_creates", followers: "245K", er: "4.9%", niche: ["Beauty", "Fashion"], level: 2, status: "Pending", initials: "PS", note: "I've worked with 5+ eyewear brands including Ray-Ban and Vincent Chase. My audience loves fashion content!", time: "2 hours ago", platform: "Instagram" },
  { id: "2", name: "Arjun Mehta", handle: "@arjunmehta", followers: "189K", er: "4.7%", niche: ["Tech", "Lifestyle"], level: 3, status: "Pending", initials: "AM", note: "Tech reviewer with 3 years experience. Consistent 200K+ views on Reels.", time: "5 hours ago", platform: "Instagram" },
  { id: "3", name: "Sneha Kapoor", handle: "@snehakapoor", followers: "312K", er: "4.8%", niche: ["Fashion", "Beauty"], level: 3, status: "Accepted", initials: "SK", note: "Fashion content creator specializing in ethnic wear and accessories.", time: "1 day ago", platform: "Instagram" },
  { id: "4", name: "Rahul Verma", handle: "@rahulverma", followers: "98K", er: "4.6%", niche: ["Food", "Lifestyle"], level: 1, status: "Pending", initials: "RV", note: "Food blogger covering Mumbai's best restaurants and street food.", time: "1 day ago", platform: "YouTube" },
  { id: "5", name: "Kavya Nair", handle: "@kavyanair", followers: "156K", er: "5.1%", niche: ["Fitness", "Beauty"], level: 2, status: "Declined", initials: "KN", note: "Fitness and wellness content with strong female audience.", time: "2 days ago", platform: "Instagram" },
  { id: "6", name: "Dev Anand", handle: "@devanand", followers: "425K", er: "4.9%", niche: ["Comedy", "Lifestyle"], level: 4, status: "Accepted", initials: "DA", note: "Comedy creator with viral reach. 10M+ total views last month.", time: "3 days ago", platform: "Instagram" },
];

const stats = { total: 47, pending: 31, accepted: 12, declined: 4 };

const BrandApplications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [activeSort, setActiveSort] = useState("Best Match");
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  const filtered = activeTab === "All" ? mockApps : mockApps.filter(a => a.status === activeTab);

  const toggleNote = (id: string) => {
    setExpandedNotes(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20 max-w-lg mx-auto">
        <div className="page-transition">
          <header className="px-5 pt-6 pb-2 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-lg font-heading font-bold text-foreground">Lenskart SS'26 — Applications</h1>
            </div>
          </header>

          {/* Stats Bar */}
          <div className="px-5 mt-3 flex gap-2 overflow-x-auto no-scrollbar">
            {[
              { label: "Total", value: stats.total },
              { label: "Pending", value: stats.pending },
              { label: "Accepted", value: stats.accepted },
              { label: "Declined", value: stats.declined },
            ].map((s, i) => (
              <div key={i} className="shrink-0 border border-border rounded-lg px-3 py-1.5 bg-card text-center">
                <p className="text-sm font-heading font-bold text-foreground">{s.value}</p>
                <p className="text-[8px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Sort */}
          <div className="px-5 mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {sortOptions.map(s => (
              <button key={s} onClick={() => setActiveSort(s)} className={`px-2.5 py-1 rounded-full text-[9px] font-heading whitespace-nowrap ${activeSort === s ? "bg-accent/20 text-accent" : "text-muted-foreground"}`}>
                {s}
              </button>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="px-5 mt-2 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {filterTabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)} className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium whitespace-nowrap transition-all ${activeTab === t ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Application Cards */}
          <div className="px-5 mt-4 space-y-2.5 pb-6">
            {filtered.map((app, i) => (
              <div key={app.id} className="border border-border rounded-2xl p-4 animate-fade-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-accent/10 text-accent font-heading font-bold text-sm">{app.initials}</AvatarFallback>
                    </Avatar>
                    {app.status === "Accepted" && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-semibold text-sm text-foreground">{app.name}</span>
                      <span className="animate-sparkle-emoji">{LEVEL_EMOJIS[app.level]}</span>
                      <Badge className={`text-[8px] border-0 ml-auto ${app.status === "Accepted" ? "bg-emerald-500/10 text-emerald-500" : app.status === "Declined" ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-500"}`}>
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{app.handle} · {app.platform}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] text-foreground font-medium">{app.followers}</span>
                      <span className="text-[10px] text-accent font-medium">{app.er} ER</span>
                      {app.niche.map(n => (
                        <span key={n} className="text-[8px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{n}</span>
                      ))}
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-1">Applied {app.time}</p>
                  </div>
                </div>

                {/* Application Note */}
                <button onClick={() => toggleNote(app.id)} className="mt-2 flex items-center gap-1 text-[10px] text-accent font-heading">
                  Why I'm a great fit {expandedNotes.has(app.id) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {expandedNotes.has(app.id) && (
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{app.note}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  {app.status === "Pending" && (
                    <>
                      <Button size="sm" className="flex-1 h-8 rounded-xl text-[11px] bg-emerald-500 hover:bg-emerald-600 text-white font-heading">
                        <CheckCircle className="w-3 h-3 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 h-8 rounded-xl text-[11px] font-heading text-muted-foreground border-border">
                        Decline
                      </Button>
                    </>
                  )}
                  {app.status === "Accepted" && (
                    <>
                      <Button size="sm" variant="outline" className="flex-1 h-8 rounded-xl text-[11px] font-heading">
                        <MessageSquare className="w-3 h-3 mr-1" /> Message
                      </Button>
                      <Button size="sm" className="flex-1 h-8 rounded-xl text-[11px] bg-accent hover:bg-accent/90 text-accent-foreground font-heading">
                        <IndianRupee className="w-3 h-3 mr-1" /> Release Payment
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="ghost" className="h-8 px-3 rounded-xl text-[11px] font-heading">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
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

export default BrandApplications;
