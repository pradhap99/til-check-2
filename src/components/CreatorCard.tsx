import { useState } from "react";
import { Creator } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TrendingUp, CheckCircle } from "lucide-react";

interface CreatorCardProps {
  creator: Creator;
  index: number;
}

const CreatorCard = ({ creator, index }: CreatorCardProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  const platformColor = {
    Instagram: "bg-accent/10 text-accent",
    YouTube: "bg-destructive/10 text-destructive",
    Twitter: "bg-primary/10 text-primary",
  };

  return (
    <div
      className="glass-card rounded-2xl p-4 hover-lift cursor-pointer opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-14 h-14 rounded-xl object-cover"
            onLoad={() => setImgLoaded(true)}
          />
          {creator.verified && (
            <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-primary fill-primary/20" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold text-card-foreground truncate">{creator.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{creator.handle}</p>
        </div>
        <Badge className={platformColor[creator.platform]} variant="secondary">
          {creator.platform}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{creator.bio}</p>

      <div className="flex items-center gap-4 mt-3 text-sm">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Users className="w-3.5 h-3.5" />
          <span className="font-medium text-card-foreground">{creator.followers}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="font-medium text-card-foreground">{creator.engagement}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          <span>{creator.location}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">{creator.category}</Badge>
        <span className="text-sm font-heading font-semibold gradient-text">{creator.rate}</span>
      </div>
    </div>
  );
};

export default CreatorCard;
