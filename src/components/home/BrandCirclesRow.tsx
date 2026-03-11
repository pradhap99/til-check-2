import { campaigns } from "@/data/mockData";
import { Sparkles } from "lucide-react";

const brands = [
  { name: "Lenskart", color: "from-blue-500 to-blue-700", logo: campaigns.find(c => c.brand === "Lenskart")?.logo },
  { name: "Mamaearth", color: "from-green-500 to-green-700", logo: campaigns.find(c => c.brand === "Mamaearth")?.logo },
  { name: "boAt", color: "from-gray-700 to-gray-900", logo: campaigns.find(c => c.brand === "boAt")?.logo },
  { name: "CRED", color: "from-purple-500 to-purple-700" },
  { name: "Sugar", color: "from-pink-500 to-pink-700" },
  { name: "Nykaa", color: "from-red-500 to-red-700", logo: campaigns.find(c => c.brand === "Nykaa")?.logo },
  { name: "Zomato", color: "from-red-600 to-red-800", logo: campaigns.find(c => c.brand === "Zomato")?.logo },
  { name: "Bewakoof", color: "from-orange-500 to-orange-700" },
];

interface BrandCirclesRowProps {
  selectedBrand: string | null;
  onSelectBrand: (brand: string | null) => void;
  activeBrand?: string | null;
}

const BrandCirclesRow = ({ selectedBrand, onSelectBrand, activeBrand }: BrandCirclesRowProps) => {
  return (
    <section className="mt-4 px-5">
      <p className="text-[11px] font-heading font-semibold text-accent mb-2.5 flex items-center gap-1">
        <Sparkles className="w-3 h-3" /> Top Brands
      </p>
      {/* overflow-hidden prevents scale from pushing layout */}
      <div className="overflow-hidden">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
          {brands.map((brand, i) => {
            const isSelected = selectedBrand === brand.name;
            const isCarouselActive = activeBrand === brand.name && !selectedBrand;
            const isHighlighted = isSelected || isCarouselActive;
            return (
              <button
                key={brand.name}
                onClick={() => onSelectBrand(isSelected ? null : brand.name)}
                className="flex flex-col items-center gap-1.5 shrink-0 opacity-0 animate-fade-up"
                style={{
                  animationDelay: `${i * 40}ms`,
                  animationFillMode: "forwards",
                  willChange: "transform",
                }}
              >
                <div
                  className={`w-14 h-14 rounded-full transition-transform duration-300 ease-out ${isHighlighted ? "animate-pulse-glow-gold" : ""}`}
                  style={{
                    padding: 2.5,
                    background: isHighlighted
                      ? "linear-gradient(135deg, hsl(45,93%,58%), hsl(262,83%,58%))"
                      : "linear-gradient(135deg, hsl(45,93%,47%), hsl(45,93%,62%))",
                    transform: isHighlighted ? "scale(1.2)" : "scale(1)",
                    transformOrigin: "center",
                  }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-card flex items-center justify-center">
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${brand.color} flex items-center justify-center`}>
                        <span className="text-white font-heading font-bold text-sm">{brand.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <span
                  className={`text-[10px] max-w-[60px] truncate text-center transition-all duration-300 ${
                    isHighlighted ? "font-bold text-accent" : "font-medium text-muted-foreground"
                  }`}
                >
                  {brand.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrandCirclesRow;
