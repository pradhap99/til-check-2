import { Coffee, UtensilsCrossed, Hotel, Camera, Sparkles, Dumbbell, PartyPopper, ShoppingBag } from "lucide-react";

const experienceCategories = [
  { id: "cafes", label: "Breakfast & Cafés", icon: Coffee, color: "bg-chart-1/10 text-chart-1" },
  { id: "dining", label: "Dinners & Rooftops", icon: UtensilsCrossed, color: "bg-chart-2/10 text-chart-2" },
  { id: "staycations", label: "Staycations", icon: Hotel, color: "bg-primary/10 text-primary" },
  { id: "studios", label: "Photo Studios", icon: Camera, color: "bg-accent/10 text-accent" },
  { id: "salons", label: "Salons & Spas", icon: Sparkles, color: "bg-chart-4/10 text-chart-4" },
  { id: "fitness", label: "Fitness Studios", icon: Dumbbell, color: "bg-chart-5/10 text-chart-5" },
  { id: "events", label: "Events & Launches", icon: PartyPopper, color: "bg-chart-3/10 text-chart-3" },
  { id: "retail", label: "Retail & Shopping", icon: ShoppingBag, color: "bg-chart-1/10 text-chart-1" },
];

interface CategoryTilesProps {
  onSelect: (categoryId: string) => void;
}

const CategoryTiles = ({ onSelect }: CategoryTilesProps) => {
  return (
    <div className="grid grid-cols-2 gap-2 px-5">
      {experienceCategories.map((cat, i) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className="border border-border rounded-xl p-4 text-left hover:bg-secondary/50 transition-all btn-micro flex items-center gap-3 opacity-0 animate-fade-up"
          style={{ animationDelay: `${i * 40}ms`, animationFillMode: "forwards" }}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${cat.color}`}>
            <cat.icon className="w-5 h-5" />
          </div>
          <span className="text-xs font-heading font-semibold text-foreground leading-tight">{cat.label}</span>
        </button>
      ))}
    </div>
  );
};

export { experienceCategories };
export default CategoryTiles;
