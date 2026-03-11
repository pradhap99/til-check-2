import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ZoomIn, ZoomOut } from "lucide-react";

const mapPins = [
  { id: "1", city: "Delhi", left: "38%", top: "22%", campaigns: [
    { id: "1", brand: "Lenskart", title: "Style Your Vision", budget: "₹8L–15L" },
    { id: "dining-001", brand: "SOCIAL", title: "Urban Dining Experience", budget: "₹4L–8L" },
  ]},
  { id: "2", city: "Mumbai", left: "25%", top: "52%", campaigns: [
    { id: "2", brand: "Mamaearth", title: "Vitamin C Range", budget: "₹3L–7L" },
    { id: "cafe-002", brand: "Third Wave", title: "Morning Ritual Series", budget: "₹2L–4L" },
  ]},
  { id: "3", city: "Bangalore", left: "35%", top: "68%", campaigns: [
    { id: "3", brand: "boAt", title: "Summer Audio Launch", budget: "₹5L–10L" },
  ]},
  { id: "4", city: "Hyderabad", left: "40%", top: "60%", campaigns: [
    { id: "4", brand: "Zomato", title: "Food Stories", budget: "₹4L–8L" },
  ]},
  { id: "5", city: "Kolkata", left: "58%", top: "42%", campaigns: [
    { id: "5", brand: "Nykaa", title: "Festive Glow", budget: "₹2L–5L" },
  ]},
  { id: "6", city: "Manali", left: "36%", top: "12%", campaigns: [
    { id: "staycation-001", brand: "Zostel", title: "Backpacker Stories", budget: "₹5L–10L" },
  ]},
  { id: "7", city: "Koramangala", left: "36%", top: "70%", campaigns: [
    { id: "cafe-001", brand: "Blue Tokai", title: "Coffee Culture Campaign", budget: "₹3L–5L" },
  ]},
];

interface CampaignMapViewProps {
  campaigns: Array<{
    id: string;
    brand: string;
    title: string;
    budget: string;
    category: string;
  }>;
}

const CampaignMapView = ({ campaigns }: CampaignMapViewProps) => {
  const navigate = useNavigate();
  const [activePin, setActivePin] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  return (
    <div className="rounded-2xl overflow-hidden border border-border relative" style={{ height: 300, background: "#0d0d1a" }}>
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-32 h-32 rounded-full" style={{ left: "20%", top: "30%", background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)" }} />
        <div className="absolute w-40 h-40 rounded-full" style={{ left: "50%", top: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)" }} />
        <div className="absolute w-24 h-24 rounded-full" style={{ left: "35%", top: "15%", background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)" }} />
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={`h${i}`} className="absolute w-full border-t border-white" style={{ top: `${(i + 1) * 11}%` }} />
        ))}
        {[...Array(6)].map((_, i) => (
          <div key={`v${i}`} className="absolute h-full border-l border-white" style={{ left: `${(i + 1) * 14}%` }} />
        ))}
      </div>

      {/* India silhouette hint (simple SVG outline) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <path d="M35 8 L42 10 L48 8 L52 12 L50 18 L55 22 L58 18 L62 20 L60 28 L65 35 L62 40 L58 42 L55 48 L50 52 L48 58 L45 62 L42 68 L38 72 L35 78 L32 75 L28 70 L25 62 L22 55 L20 48 L22 42 L25 35 L28 28 L30 22 L33 15 Z" fill="white" stroke="none" />
      </svg>

      {/* Zoom controls */}
      <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
        <button onClick={() => setZoom(z => Math.min(z + 0.2, 1.6))} className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors">
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.8))} className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors">
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Map label */}
      <div className="absolute top-2.5 left-3 text-[10px] text-white/30 font-mono z-10">MAP VIEW</div>

      {/* Pins container */}
      <div className="absolute inset-0 transition-transform duration-300" style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}>
        {mapPins.map((pin) => (
          <div
            key={pin.id}
            className="absolute z-10 cursor-pointer group"
            style={{ left: pin.left, top: pin.top, transform: "translate(-50%, -50%)" }}
            onClick={() => setActivePin(activePin === pin.id ? null : pin.id)}
          >
            {/* Pulse ring */}
            <div className="absolute inset-0 w-6 h-6 -m-[3px] rounded-full border border-amber-500/40 map-pin-pulse" />
            {/* Dot */}
            <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            {/* City label */}
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[8px] text-white/50 font-medium whitespace-nowrap">{pin.city}</span>

            {/* Popup */}
            {activePin === pin.id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-30 min-w-[180px]" onClick={(e) => e.stopPropagation()}>
                <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl p-3 shadow-xl">
                  <button onClick={() => setActivePin(null)} className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                  {pin.campaigns.map((c, ci) => (
                    <div key={c.id} className={ci > 0 ? "mt-2 pt-2 border-t border-border" : ""}>
                      <p className="font-heading font-bold text-[11px] text-foreground">{c.brand}</p>
                      <p className="text-[9px] text-muted-foreground truncate">{c.title}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] font-heading font-bold text-amber-500">{c.budget}</span>
                        <button
                          onClick={() => navigate(`/campaigns/${c.id}`)}
                          className="text-[9px] font-heading font-semibold px-2.5 py-1 rounded-lg text-white btn-shimmer-hover"
                          style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Arrow */}
                <div className="w-2.5 h-2.5 bg-card/95 border-r border-b border-border rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-[5px]" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center z-10">
        <span className="text-[10px] font-heading font-medium text-amber-500/80 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
          7 active campaigns across India
        </span>
      </div>
    </div>
  );
};

export default CampaignMapView;
