import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ZoomIn, ZoomOut, MapPin, Calendar, Navigation } from "lucide-react";

const categoryColors: Record<string, { ring: string; dot: string; label: string }> = {
  Fashion: { ring: "border-amber-500/40", dot: "bg-amber-500", label: "Fashion" },
  Beauty: { ring: "border-pink-500/40", dot: "bg-pink-500", label: "Beauty" },
  Tech: { ring: "border-blue-500/40", dot: "bg-blue-500", label: "Tech" },
  Food: { ring: "border-orange-500/40", dot: "bg-orange-500", label: "Food" },
  Cafe: { ring: "border-emerald-500/40", dot: "bg-emerald-500", label: "Café" },
  Dining: { ring: "border-emerald-500/40", dot: "bg-emerald-500", label: "Dining" },
  Staycation: { ring: "border-cyan-500/40", dot: "bg-cyan-500", label: "Travel" },
};

const mapPins = [
  { id: "1", city: "Delhi", left: "38%", top: "22%", category: "Fashion", campaigns: [
    { id: "1", brand: "Lenskart", title: "Style Your Vision", budget: "₹8L–15L", date: "Apr 1 — Apr 20", applied: 18 },
    { id: "dining-001", brand: "SOCIAL", title: "Urban Dining Experience", budget: "₹4L–8L", date: "Mar 25 — Apr 10", applied: 10 },
  ]},
  { id: "2", city: "Mumbai", left: "25%", top: "52%", category: "Beauty", campaigns: [
    { id: "2", brand: "Mamaearth", title: "Vitamin C Range", budget: "₹3L–7L", date: "Mar 28 — Apr 12", applied: 32 },
    { id: "cafe-002", brand: "Third Wave", title: "Morning Ritual Series", budget: "₹2L–4L", date: "Apr 1 — Apr 15", applied: 8 },
  ]},
  { id: "3", city: "Bangalore", left: "35%", top: "68%", category: "Tech", campaigns: [
    { id: "3", brand: "boAt", title: "Summer Audio Launch", budget: "₹5L–10L", date: "Apr 5 — Apr 25", applied: 12 },
  ]},
  { id: "4", city: "Hyderabad", left: "40%", top: "60%", category: "Food", campaigns: [
    { id: "4", brand: "Zomato", title: "Food Stories", budget: "₹4L–8L", date: "Apr 8 — Apr 22", applied: 25 },
  ]},
  { id: "5", city: "Kolkata", left: "58%", top: "42%", category: "Beauty", campaigns: [
    { id: "5", brand: "Nykaa", title: "Festive Glow", budget: "₹2L–5L", date: "Apr 3 — Apr 18", applied: 45 },
  ]},
  { id: "6", city: "Manali", left: "36%", top: "12%", category: "Staycation", campaigns: [
    { id: "staycation-001", brand: "Zostel", title: "Backpacker Stories", budget: "₹5L–10L", date: "Apr 10 — Apr 30", applied: 6 },
  ]},
  { id: "7", city: "Koramangala", left: "36%", top: "72%", category: "Cafe", campaigns: [
    { id: "cafe-001", brand: "Blue Tokai", title: "Coffee Culture Campaign", budget: "₹3L–5L", date: "Mar 20 — Apr 5", applied: 8 },
  ]},
];

const filterCategories = [
  { label: "All", key: "All" },
  { label: "☕ Cafés", key: "Cafés" },
  { label: "🍽 Dining", key: "Dining" },
  { label: "🌄 Staycations", key: "Staycations" },
  { label: "👗 Fashion", key: "Fashion" },
  { label: "✨ Beauty", key: "Beauty" },
  { label: "📱 Tech", key: "Tech" },
];
const filterToCategory: Record<string, string[]> = {
  "All": [], "Cafés": ["Cafe"], "Dining": ["Dining", "Food"], "Staycations": ["Staycation"],
  "Fashion": ["Fashion"], "Beauty": ["Beauty"], "Tech": ["Tech"],
};

interface CampaignMapViewProps {
  campaigns: Array<{ id: string; brand: string; title: string; budget: string; category: string }>;
}

const CampaignMapView = ({ campaigns }: CampaignMapViewProps) => {
  const navigate = useNavigate();
  const [activePin, setActivePin] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredPins = activeFilter === "All"
    ? mapPins
    : mapPins.filter(p => filterToCategory[activeFilter]?.includes(p.category));

  const bottomCampaigns = filteredPins.flatMap(p => p.campaigns.map(c => ({ ...c, city: p.city, category: p.category })));

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-heading font-semibold text-foreground">Discover Campaigns Near You</h4>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-heading font-bold">{filteredPins.length} active</span>
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {filterCategories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveFilter(cat.key)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-heading font-medium whitespace-nowrap transition-all ${
              activeFilter === cat.key ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-border relative" style={{ height: 300, background: "#0d0d1a" }}>
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-32 h-32 rounded-full" style={{ left: "20%", top: "30%", background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)" }} />
          <div className="absolute w-40 h-40 rounded-full" style={{ left: "50%", top: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)" }} />
          <div className="absolute w-28 h-28 rounded-full" style={{ left: "35%", top: "65%", background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)" }} />
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          {[...Array(8)].map((_, i) => <div key={`h${i}`} className="absolute w-full border-t border-white" style={{ top: `${(i + 1) * 11}%` }} />)}
          {[...Array(6)].map((_, i) => <div key={`v${i}`} className="absolute h-full border-l border-white" style={{ left: `${(i + 1) * 14}%` }} />)}
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <path d="M35 8 L42 10 L48 8 L52 12 L50 18 L55 22 L58 18 L62 20 L60 28 L65 35 L62 40 L58 42 L55 48 L50 52 L48 58 L45 62 L42 68 L38 72 L35 78 L32 75 L28 70 L25 62 L22 55 L20 48 L22 42 L25 35 L28 28 L30 22 L33 15 Z" fill="white" />
        </svg>

        {/* Zoom + Near You controls */}
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 1.6))} className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.8))} className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setZoom(1.2)} className="w-7 h-7 rounded-lg bg-accent/20 backdrop-blur-sm flex items-center justify-center text-accent hover:bg-accent/30 transition-colors">
            <Navigation className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="absolute top-2.5 left-3 text-[10px] text-white/30 font-mono z-10">MAP VIEW</div>

        {/* Pins container */}
        <div className="absolute inset-0 transition-transform duration-300" style={{ transform: `scale(${zoom})`, transformOrigin: "35% 68%" }}>
          {filteredPins.map((pin) => {
            const colors = categoryColors[pin.category] || categoryColors.Fashion;
            return (
              <div key={pin.id} className="absolute z-10 cursor-pointer" style={{ left: pin.left, top: pin.top, transform: "translate(-50%, -50%)" }} onClick={() => setActivePin(activePin === pin.id ? null : pin.id)}>
                {/* Pulse rings */}
                <div className={`absolute inset-0 w-6 h-6 -m-[3px] rounded-full border ${colors.ring} map-pin-pulse`} />
                <div className={`absolute inset-0 w-8 h-8 -m-[6px] rounded-full border ${colors.ring} map-pin-pulse opacity-30`} style={{ animationDelay: "0.5s" }} />
                <div className={`absolute inset-0 w-10 h-10 -m-[9px] rounded-full border ${colors.ring} map-pin-pulse opacity-15`} style={{ animationDelay: "1s" }} />
                <div className={`w-5 h-5 rounded-full ${colors.dot} border-2 border-white/30 shadow-[0_0_10px_rgba(245,158,11,0.5)] flex items-center justify-center`}>
                  <span className="text-white text-[7px] font-bold">{pin.campaigns[0]?.brand?.[0]}</span>
                </div>
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[8px] text-white/50 font-medium whitespace-nowrap">{pin.city}</span>

                {/* Popup */}
                {activePin === pin.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-30 min-w-[200px]" onClick={e => e.stopPropagation()}>
                    <div className="rounded-xl p-3 shadow-xl" style={{ background: "rgba(15,15,30,0.95)", border: "1px solid rgba(245,158,11,0.3)" }}>
                      <button onClick={() => setActivePin(null)} className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                        <X className="w-3 h-3 text-white/60" />
                      </button>
                      {pin.campaigns.map((c, ci) => (
                        <div key={c.id} className={ci > 0 ? "mt-2 pt-2 border-t border-white/10" : ""}>
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-5 h-5 rounded-full ${colors.dot} flex items-center justify-center`}>
                              <span className="text-white text-[7px] font-bold">{c.brand[0]}</span>
                            </div>
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-heading">{colors.label}</span>
                          </div>
                          <p className="font-heading font-bold text-[11px] text-white">{c.brand}</p>
                          <p className="text-[9px] text-white/50 truncate">{c.title}</p>
                          <div className="flex items-center gap-2 mt-1 text-[8px] text-white/40">
                            <Calendar className="w-2.5 h-2.5 text-accent" /> {c.date}
                          </div>
                          <p className="text-[8px] text-white/40 mt-0.5">{c.applied} creators applied</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-[10px] font-heading font-bold text-accent">{c.budget}</span>
                            <button onClick={() => navigate(`/campaigns/${c.id}`)} className="text-[9px] font-heading font-semibold px-2.5 py-1 rounded-lg text-white btn-shimmer-hover" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                              Apply Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="w-2.5 h-2.5 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-[5px]" style={{ background: "rgba(15,15,30,0.95)", borderRight: "1px solid rgba(245,158,11,0.3)", borderBottom: "1px solid rgba(245,158,11,0.3)" }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 right-2 z-10">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {[{ label: "Fashion", color: "bg-amber-500" }, { label: "Café", color: "bg-emerald-500" }, { label: "Tech", color: "bg-blue-500" }, { label: "Beauty", color: "bg-pink-500" }, { label: "Travel", color: "bg-cyan-500" }].map(l => (
                <span key={l.label} className="flex items-center gap-0.5 text-[7px] text-white/40">
                  <span className={`w-1.5 h-1.5 rounded-full ${l.color}`} /> {l.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom sheet - horizontal campaign cards */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {bottomCampaigns.slice(0, 5).map((c) => {
          const colors = categoryColors[c.category] || categoryColors.Fashion;
          return (
            <div key={c.id} className="min-w-[140px] shrink-0 border border-border rounded-xl p-2.5 cursor-pointer active:scale-95 transition-transform" onClick={() => navigate(`/campaigns/${c.id}`)}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                <p className="text-[10px] font-heading font-bold text-foreground truncate">{c.brand}</p>
              </div>
              <p className="text-[8px] text-muted-foreground truncate">{c.city}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[9px] font-heading font-bold text-accent">{c.budget}</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-accent text-accent-foreground font-heading">Apply</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Use case hints */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {["📍 Plan your shoots by location", "📅 See campaign dates on map", "☕ Discover cafe collabs near you", "💰 Find highest-paying campaigns"].map((hint, i) => (
          <span key={i} className="text-[10px] text-accent/60 whitespace-nowrap shrink-0 font-heading">{hint}</span>
        ))}
      </div>
    </div>
  );
};

export default CampaignMapView;
