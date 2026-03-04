import { Creator } from "@/data/mockData";
import { CheckCircle, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CreatorCardProps {
  creator: Creator;
  index?: number;
}

const CreatorCard = ({ creator, index = 0 }: CreatorCardProps) => {
  return (
    <div
      className="border border-border rounded-xl p-3.5 flex items-center gap-3.5 cursor-pointer hover-lift btn-micro opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
    >
      {/* Gradient ring avatar */}
      <div className={creator.verified ? "gradient-ring shrink-0" : "shrink-0"}>
        <img
          src={creator.avatar}
          alt={creator.name}
          className="w-12 h-12 rounded-full object-cover bg-secondary border-2 border-background"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <h3 className="font-heading font-semibold text-sm text-foreground truncate">{creator.name}</h3>
          {creator.verified && (
            <div className="shrink-0 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
              <CheckCircle className="w-2.5 h-2.5 text-accent-foreground" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{creator.followers} followers</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{creator.engagement} eng.</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-medium">{creator.category}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-medium flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5" /> {creator.location}
          </span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="font-heading font-semibold text-xs text-foreground">{creator.rate}</p>
        <p className="text-[10px] text-muted-foreground">{creator.platform}</p>
      </div>
    </div>
  );
};

export default CreatorCard;
