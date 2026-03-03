import { Creator } from "@/data/mockData";
import { CheckCircle, MapPin } from "lucide-react";

interface CreatorCardProps {
  creator: Creator;
  index?: number;
}

const CreatorCard = ({ creator, index = 0 }: CreatorCardProps) => {
  return (
    <div
      className="border border-border rounded-xl p-3.5 flex items-center gap-3.5 cursor-pointer hover-lift opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
    >
      <img
        src={creator.avatar}
        alt={creator.name}
        className="w-12 h-12 rounded-full object-cover bg-secondary shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <h3 className="font-heading font-semibold text-sm text-foreground truncate">{creator.name}</h3>
          {creator.verified && <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0" />}
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
