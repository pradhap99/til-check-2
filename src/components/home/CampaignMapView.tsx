import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const brandLocations = [
  { brand: "Lenskart", city: "Delhi", top: "18%", left: "42%" },
  { brand: "Mamaearth", city: "Mumbai", top: "52%", left: "28%" },
  { brand: "boAt", city: "Bangalore", top: "72%", left: "38%" },
  { brand: "CRED", city: "Hyderabad", top: "62%", left: "42%" },
  { brand: "Sugar", city: "Kolkata", top: "38%", left: "68%" },
  { brand: "Nykaa", city: "Mumbai", top: "54%", left: "26%" },
  { brand: "Myntra", city: "Bangalore", top: "74%", left: "40%" },
  { brand: "Swiggy", city: "Chennai", top: "76%", left: "44%" },
  { brand: "Noise", city: "Delhi", top: "20%", left: "44%" },
  { brand: "Zomato", city: "Delhi", top: "16%", left: "40%" },
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

  const pins = campaigns.map((c) => {
    const loc = brandLocations.find((l) => l.brand === c.brand) || { top: "50%", left: "50%", city: "India" };
    return { ...c, ...loc };
  });

  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-[#1a1a2e] relative" style={{ height: 300 }}>
      {/* Grid lines for map feel */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(8)].map((_, i) => (
          <div key={`h${i}`} className="absolute w-full border-t border-muted-foreground/30" style={{ top: `${(i + 1) * 12}%` }} />
        ))}
        {[...Array(6)].map((_, i) => (
          <div key={`v${i}`} className="absolute h-full border-l border-muted-foreground/30" style={{ left: `${(i + 1) * 15}%` }} />
        ))}
      </div>

      {/* India outline hint */}
      <div className="absolute top-2 left-3 text-[10px] text-muted-foreground/50 font-mono">MAP VIEW</div>

      {/* Pins */}
      {pins.map((pin) => (
        <div
          key={pin.id}
          className="absolute group cursor-pointer z-10"
          style={{ top: pin.top, left: pin.left, transform: "translate(-50%, -50%)" }}
        >
          <div className="w-9 h-9 rounded-full bg-[#1a1a2e] border-2 border-amber-500 flex items-center justify-center text-amber-500 font-bold text-xs shadow-[0_0_10px_rgba(245,158,11,0.4)] hover:scale-125 transition-transform">
            {pin.brand[0]}
          </div>
          {/* Tooltip on hover */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col bg-card border border-border rounded-xl p-2.5 min-w-[160px] shadow-xl z-20">
            <p className="font-bold text-xs text-foreground">{pin.brand}</p>
            <p className="text-[10px] text-muted-foreground truncate">{pin.title}</p>
            <span className="text-[10px] font-semibold text-amber-500 mt-0.5">{pin.budget}</span>
            <Button
              size="sm"
              className="h-6 text-[10px] rounded-lg mt-1.5"
              onClick={(e) => { e.stopPropagation(); navigate(`/campaigns/${pin.id}`); }}
            >
              Apply Now
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampaignMapView;
