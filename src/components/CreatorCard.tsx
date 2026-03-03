import { Creator } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TrendingUp, CheckCircle } from "lucide-react";

interface CreatorCardProps {
  creator: Creator;
  index: number;
}

const platformColor: Record<string, string> = {
  Instagram: "bg-accent/10 text-accent",
  YouTube: "bg-destructive/10 text-destructive",
  Twitter: "bg-primary/10 text-primary",
};

const CreatorCard = ({ creator, index }: CreatorCardProps) => {
  return (
    <div
      className="glass-card rounded-xl p-3.5 hover-lift cursor-pointer opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <img src={creator.avatar} alt={creator.name} className="w-12 h-12 rounded-lg object-cover bg-muted" />
          {creator.verified && (
            <CheckCircle className="absolute -bottom-0.5 -right-0.5 w-4 h-4 text-primary fill-background" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-sm text-card-foreground truncate">{creator.name}</h3>
            <Badge className={`${platformColor[creator.platform]} text-[10px] px-1.5 py-0 border-0`} variant="secondary">
              {creator.platform}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">{creator.handle}</p>
          <div className="flex items-center gap-3 mt-1.5 text-[10px]">
            <span className="flex items-center gap-0.5 text-muted-foreground">
              <Users className="w-3 h-3" /> <span className="font-medium text-card-foreground">{creator.followers}</span>
            </span>
            <span className="flex items-center gap-0.5 text-muted-foreground">
              <TrendingUp className="w-3 h-3" /> <span className="font-medium text-card-foreground">{creator.engagement}</span>
            </span>
            <span className="flex items-center gap-0.5 text-muted-foreground">
              <MapPin className="w-3 h-3" /> {creator.location}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-border/50">
        <Badge variant="secondary" className="text-[10px] px-2 py-0">{creator.category}</Badge>
        <span className="text-xs font-heading font-semibold text-primary">{creator.rate}</span>
      </div>
    </div>
  );
};

export default CreatorCard;
