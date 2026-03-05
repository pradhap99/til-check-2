import { Coffee, UtensilsCrossed, Hotel, Camera, Sparkles, Shirt, Dumbbell, ShoppingBag } from "lucide-react";

const lifestyleCategories = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "cafes", label: "Breakfast & Cafés", icon: Coffee },
  { id: "dining", label: "Dining & Rooftops", icon: UtensilsCrossed },
  { id: "staycations", label: "Staycations", icon: Hotel },
  { id: "photoshoots", label: "Photoshoots", icon: Camera },
  { id: "beauty", label: "Beauty & Salons", icon: Sparkles },
  { id: "fashion", label: "Fashion", icon: Shirt },
  { id: "fitness", label: "Fitness", icon: Dumbbell },
  { id: "shopping", label: "Shopping", icon: ShoppingBag },
];

interface LifestyleChipsProps {
  selected: string;
  onSelect: (id: string) => void;
}

const LifestyleChips = ({ selected, onSelect }: LifestyleChipsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-1">
      {lifestyleCategories.map((cat) => {
        const isActive = selected === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all btn-micro border ${
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-secondary/50 text-muted-foreground border-border hover:bg-secondary"
            }`}
          >
            <cat.icon className="w-3.5 h-3.5" />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};

export { lifestyleCategories };
export default LifestyleChips;
