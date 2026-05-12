import { EXPERIENCE_CATEGORIES, CATEGORY_GROUPS } from "@/data/experienceCategories";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface LifestyleChipsProps {
  selected: string;
  onSelect: (id: string) => void;
}

const LifestyleChips = ({ selected, onSelect }: LifestyleChipsProps) => {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  
  // Show top categories as chips + expandable groups
  const topChips = [
    { id: "all", label: "All", emoji: "✨" },
    ...EXPERIENCE_CATEGORIES.slice(0, 10).map(c => ({ id: c.id, label: c.label.split(" ")[0], emoji: c.emoji })),
  ];

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-1">
        {topChips.map((cat) => {
          const isActive = selected === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all btn-micro border ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-elev-1"
                  : "bg-secondary/50 text-muted-foreground border-border hover:bg-secondary"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          );
        })}
        <button
          onClick={() => setExpandedGroup(expandedGroup ? null : CATEGORY_GROUPS[0])}
          className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap shrink-0 border border-border bg-secondary/50 text-muted-foreground"
        >
          More <ChevronDown className="w-3 h-3" />
        </button>
      </div>
      
      {expandedGroup !== null && (
        <div className="px-5 mt-2 space-y-3 animate-fade-up" style={{ animationFillMode: "forwards" }}>
          {CATEGORY_GROUPS.map(group => (
            <div key={group}>
              <p className="text-[10px] font-heading font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">{group}</p>
              <div className="flex gap-1.5 flex-wrap">
                {EXPERIENCE_CATEGORIES.filter(c => c.group === group).map(c => (
                  <button
                    key={c.id}
                    onClick={() => { onSelect(c.id); setExpandedGroup(null); }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all border ${
                      selected === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"
                    }`}
                  >
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { EXPERIENCE_CATEGORIES as lifestyleCategories };
export default LifestyleChips;
