import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { creators } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, MapPin, Users, TrendingUp, Heart, Share2, MessageCircle, Instagram, Youtube, Twitter, Star } from "lucide-react";
import { toast } from "sonner";

const platformIcon: Record<string, any> = {
  Instagram, YouTube: Youtube, Twitter,
};

const CreatorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [startingChat, setStartingChat] = useState(false);

  // Try mock data first
  const creator = creators.find((c) => c.id === id);

  if (!creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Creator not found</p>
      </div>
    );
  }

  const PlatformIcon = platformIcon[creator.platform] || Instagram;

  const handleMessage = async () => {
    if (!user) return;
    setStartingChat(true);

    // For mock creators, we can't create real conversations
    // But for real creators with user_ids, we can
    toast.info("Chat feature works with real users. Try signing up two accounts!");
    setStartingChat(false);
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <div className="relative">
        <div className="h-36 gradient-primary relative">
          <div className="absolute inset-0 bg-primary-foreground/5" />
          <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center z-10">
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </button>
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button className="w-9 h-9 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
              <Share2 className="w-4 h-4 text-primary-foreground" />
            </button>
            <button className="w-9 h-9 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </div>

        <div className="px-4 -mt-12 relative z-10">
          <div className="flex items-end gap-3">
            <div className="relative">
              <img src={creator.avatar} alt={creator.name} className="w-24 h-24 rounded-2xl border-4 border-background object-cover shadow-lg" />
              {creator.verified && (
                <CheckCircle className="absolute -bottom-1 -right-1 w-6 h-6 text-primary fill-background" />
              )}
            </div>
            <div className="pb-1">
              <h1 className="font-heading font-bold text-xl text-foreground">{creator.name}</h1>
              <p className="text-sm text-muted-foreground">{creator.handle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="px-4 mt-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{creator.bio}</p>
      </div>

      {/* Stats Row */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-2.5">
        {[
          { label: "Followers", value: creator.followers, icon: Users },
          { label: "Engagement", value: creator.engagement, icon: TrendingUp },
          { label: "Rating", value: "4.8⭐", icon: Star },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-3 text-center">
            <p className="font-heading font-bold text-base text-card-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="px-4 mt-4 space-y-2.5">
        <div className="glass-card rounded-2xl p-4">
          <h3 className="font-heading font-semibold text-sm text-card-foreground mb-2.5">Details</h3>
          <div className="space-y-2">
            {[
              { icon: MapPin, label: "Location", value: creator.location },
              { icon: PlatformIcon, label: "Platform", value: creator.platform },
              { icon: Star, label: "Category", value: creator.category },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-card-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <h3 className="font-heading font-semibold text-sm text-card-foreground mb-1">Rate Card</h3>
          <p className="font-heading font-bold text-lg gradient-text">{creator.rate}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Per campaign collaboration</p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 py-5 pb-24">
        <div className="flex gap-2.5">
          <Button variant="gradient-outline" className="flex-1 h-12 rounded-2xl font-heading" onClick={handleMessage} disabled={startingChat}>
            <MessageCircle className="w-4 h-4" /> Message
          </Button>
          <Button variant="gradient" className="flex-1 h-12 rounded-2xl font-heading">
            Collaborate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatorDetail;
