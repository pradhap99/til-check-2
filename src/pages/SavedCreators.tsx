import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Users, TrendingUp, MapPin, MessageCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SavedCreator {
  id: string;
  creator_user_id: string;
  created_at: string;
  name: string;
  avatar: string;
  niche: string;
  followers: number;
  engagement: number;
  city: string;
}

const SavedCreators = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState<SavedCreator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("saved_creators")
        .select("*")
        .eq("brand_user_id", user.id)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        const creatorIds = data.map(d => d.creator_user_id);
        const [{ data: profiles }, { data: cps }] = await Promise.all([
          supabase.from("profiles").select("user_id, full_name, avatar_url, location_city").in("user_id", creatorIds),
          supabase.from("creator_profiles").select("user_id, primary_niche, instagram_followers, engagement_rate").in("user_id", creatorIds),
        ]);
        const pMap = new Map((profiles || []).map(p => [p.user_id, p]));
        const cMap = new Map((cps || []).map(c => [c.user_id, c]));

        setSaved(data.map(d => ({
          ...d,
          name: pMap.get(d.creator_user_id)?.full_name || "Creator",
          avatar: pMap.get(d.creator_user_id)?.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${d.creator_user_id.slice(0,8)}`,
          niche: cMap.get(d.creator_user_id)?.primary_niche || "—",
          followers: cMap.get(d.creator_user_id)?.instagram_followers || 0,
          engagement: cMap.get(d.creator_user_id)?.engagement_rate || 0,
          city: pMap.get(d.creator_user_id)?.location_city || "—",
        })));
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleRemove = async (id: string) => {
    await supabase.from("saved_creators").delete().eq("id", id);
    setSaved(prev => prev.filter(s => s.id !== id));
    toast.success("Creator removed from saved");
  };

  return (
    <Layout>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-heading font-bold text-foreground">Saved Creators</h1>
        <p className="text-xs text-muted-foreground">{saved.length} creators saved</p>
      </header>

      <div className="px-4 mt-3 space-y-2.5 mb-4">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 rounded-xl gradient-primary animate-pulse-glow mx-auto" />
          </div>
        ) : saved.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-heading font-medium text-muted-foreground">No saved creators</p>
            <p className="text-xs text-muted-foreground mt-1">Browse creators and save your favorites</p>
            <Button size="sm" variant="gradient" className="mt-4 rounded-xl" onClick={() => navigate("/creators")}>
              Discover Creators
            </Button>
          </div>
        ) : (
          saved.map((c, i) => (
            <div key={c.id} className="glass-card rounded-2xl p-4 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
              <div className="flex items-center gap-3">
                <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-xl object-cover bg-secondary" />
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-sm text-card-foreground">{c.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0">{c.niche}</Badge>
                    <span className="flex items-center gap-0.5"><Users className="w-3 h-3" /> {c.followers ? `${(c.followers/1000).toFixed(0)}K` : "—"}</span>
                    {c.city !== "—" && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {c.city}</span>}
                  </div>
                </div>
                <button onClick={() => handleRemove(c.id)} className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1 h-8 text-xs rounded-xl" onClick={() => navigate(`/messages`)}>
                  <MessageCircle className="w-3 h-3" /> Message
                </Button>
                <Button size="sm" variant="gradient" className="flex-1 h-8 text-xs rounded-xl">
                  Invite to Campaign
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default SavedCreators;
