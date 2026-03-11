import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { ArrowLeft, Search, CheckCircle, Star, ChevronRight } from "lucide-react";

const allStories = [
  { id: "1", name: "Priya Sharma", niche: "Fashion", campaigns: 12, quote: "TIL got me my first brand deal in just 3 days!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face", featured: true },
  { id: "2", name: "Vikram Singh", niche: "Food", campaigns: 8, quote: "Best platform for serious creators.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face", featured: false },
  { id: "3", name: "Kavya Nair", niche: "Beauty", campaigns: 6, quote: "I earned more than my salary through TIL.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face", featured: false },
  { id: "4", name: "Arjun Tandon", niche: "Tech", campaigns: 15, quote: "The escrow system gives me full trust.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face", featured: false },
  { id: "5", name: "Sneha Kapoor", niche: "Fashion", campaigns: 20, quote: "Went from 10K to 300K followers thanks to brand collabs on TIL.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face", featured: false },
  { id: "6", name: "Rahul Verma", niche: "Food", campaigns: 9, quote: "Every payment lands on time. No chasing brands.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face", featured: false },
];

const niches = ["All", "Fashion", "Food", "Beauty", "Tech"];

const SuccessStories = () => {
  const navigate = useNavigate();
  const [activeNiche, setActiveNiche] = useState("All");

  const featured = allStories[0];
  const filtered = activeNiche === "All" ? allStories.slice(1) : allStories.filter(s => s.niche === activeNiche && s.id !== "1");

  return (
    <Layout>
      <div className="page-transition">
        <header className="px-5 pt-6 pb-2 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-heading font-bold text-foreground">Creator Stories</h1>
            <p className="text-[10px] text-muted-foreground">Real creators. Real earnings. Real impact.</p>
          </div>
        </header>

        {/* Filter pills */}
        <div className="px-5 mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {niches.map(n => (
            <button
              key={n}
              onClick={() => setActiveNiche(n)}
              className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium whitespace-nowrap transition-all ${
                activeNiche === n ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Featured story */}
        <div className="px-5 mt-4">
          <div className="rounded-2xl overflow-hidden border border-accent/20 animate-fade-slide-up">
            <div className="relative h-[200px]">
              <img src={featured.avatar} alt={featured.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4">
                <p className="text-white text-sm italic leading-snug mb-2">"{featured.quote}"</p>
                <div className="flex items-center gap-2">
                  <span className="text-white font-heading font-bold text-sm">{featured.name}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent/20 text-accent">{featured.niche}</span>
                  <span className="text-[10px] text-white/60">{featured.campaigns} campaigns</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-0.5"><Star className="w-2.5 h-2.5" /> Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story list */}
        <div className="px-5 mt-4 space-y-3 pb-6">
          {filtered.map((story, i) => (
            <div
              key={story.id}
              className="border border-border rounded-2xl p-4 flex gap-3 animate-fade-slide-up cursor-pointer active:scale-[0.98] transition-transform"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <img src={story.avatar} alt={story.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-semibold text-sm text-foreground">{story.name}</span>
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                </div>
                <p className="text-[11px] text-muted-foreground italic mt-0.5 line-clamp-2">"{story.quote}"</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent">{story.niche}</span>
                  <span className="text-[9px] text-muted-foreground">{story.campaigns} campaigns</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground self-center shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SuccessStories;
