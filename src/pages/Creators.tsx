import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { creators as mockCreators, categories, platforms } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import CreatorCard from "@/components/CreatorCard";
import Layout from "@/components/Layout";
import { Search, SlidersHorizontal, X, Users, MapPin, TrendingUp, CheckCircle, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const followerRanges = ["All", "5K-50K", "50K-500K", "500K+"];
const cityTiers = ["All", "Tier 1", "Tier 2", "Tier 3"];

const Creators = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedFollowerRange, setSelectedFollowerRange] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [dbCreators, setDbCreators] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Fetch real creators from DB
  useEffect(() => {
    const fetchCreators = async () => {
      const { data: cps } = await supabase
        .from("creator_profiles")
        .select("*")
        .eq("onboarding_completed", true);

      if (cps && cps.length > 0) {
        const userIds = cps.map(c => c.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, avatar_url, location_city")
          .in("user_id", userIds);
        const pMap = new Map((profiles || []).map(p => [p.user_id, p]));

        setDbCreators(cps.map(cp => {
          const profile = pMap.get(cp.user_id);
          return {
            id: `db-${cp.user_id}`,
            realUserId: cp.user_id,
            name: profile?.full_name || "Creator",
            handle: cp.instagram_handle || "@creator",
            avatar: profile?.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${cp.user_id.slice(0, 8)}`,
            category: cp.primary_niche || "Lifestyle",
            followers: cp.instagram_followers ? `${(cp.instagram_followers / 1000).toFixed(0)}K` : "—",
            followersNum: cp.instagram_followers || 0,
            engagement: cp.engagement_rate ? `${cp.engagement_rate}%` : "—",
            platform: "Instagram" as const,
            location: profile?.location_city || "India",
            rate: cp.rate_reel ? `₹${parseInt(cp.rate_reel).toLocaleString()}` : "Contact",
            verified: cp.verified || false,
            bio: profile?.full_name ? `Creator specializing in ${cp.primary_niche || "content"}` : "",
            isReal: true,
          };
        }));
      }
    };
    fetchCreators();

    // Fetch saved creators for brand
    if (user && role === "brand") {
      supabase.from("saved_creators").select("creator_user_id").eq("brand_user_id", user.id)
        .then(({ data }) => {
          setSavedIds(new Set((data || []).map(d => d.creator_user_id)));
        });
    }
  }, [user, role]);

  const allCreators = [
    ...dbCreators,
    ...mockCreators.map(c => ({ ...c, isReal: false, realUserId: null, followersNum: 0 })),
  ];

  const filtered = allCreators.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.handle.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchPlatform = selectedPlatform === "All" || c.platform === selectedPlatform;
    return matchSearch && matchCategory && matchPlatform;
  });

  const activeFilters = (selectedCategory !== "All" ? 1 : 0) + (selectedPlatform !== "All" ? 1 : 0);

  const handleSaveCreator = async (creatorUserId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    if (savedIds.has(creatorUserId)) {
      await supabase.from("saved_creators").delete().eq("brand_user_id", user.id).eq("creator_user_id", creatorUserId);
      setSavedIds(prev => { const s = new Set(prev); s.delete(creatorUserId); return s; });
      toast.success("Creator removed from saved");
    } else {
      await supabase.from("saved_creators").insert({ brand_user_id: user.id, creator_user_id: creatorUserId });
      setSavedIds(prev => new Set(prev).add(creatorUserId));
      toast.success("Creator saved! ❤️");
    }
  };

  return (
    <Layout>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-heading font-bold text-foreground">Discover Creators</h1>
        <p className="text-xs text-muted-foreground">
          {dbCreators.length > 0 ? `${allCreators.length} creators available` : "Find the perfect creator for your brand"}
        </p>
      </header>

      {/* Search */}
      <div className="px-4 mt-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search creators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-2xl bg-secondary/70 text-foreground placeholder:text-muted-foreground text-sm font-body border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all relative ${showFilters ? "gradient-primary" : "bg-secondary"}`}
        >
          <SlidersHorizontal className={`w-4 h-4 ${showFilters ? "text-primary-foreground" : "text-muted-foreground"}`} />
          {activeFilters > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[9px] font-bold text-accent-foreground flex items-center justify-center">{activeFilters}</span>
          )}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-4 mt-3 space-y-2.5 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
          <div>
            <p className="text-[10px] font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Niche</p>
            <div className="flex gap-1.5 flex-wrap">
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-2.5 py-1 rounded-full text-[10px] font-heading font-medium transition-all ${selectedCategory === cat ? "gradient-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Platform</p>
            <div className="flex gap-1.5 flex-wrap">
              {platforms.map(plat => (
                <button key={plat} onClick={() => setSelectedPlatform(plat)} className={`px-2.5 py-1 rounded-full text-[10px] font-heading font-medium transition-all border ${selectedPlatform === plat ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground"}`}>
                  {plat}
                </button>
              ))}
            </div>
          </div>
          {activeFilters > 0 && (
            <button onClick={() => { setSelectedCategory("All"); setSelectedPlatform("All"); }} className="text-xs text-accent font-heading font-medium flex items-center gap-1">
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* Results */}
      <div className="px-4 mt-3 space-y-2.5 mb-4">
        <p className="text-[10px] text-muted-foreground font-heading">{filtered.length} creators found</p>
        {filtered.map((creator, i) => (
          <div key={creator.id} className="relative">
            <div onClick={() => {
              if ((creator as any).isReal && (creator as any).realUserId) {
                navigate(`/creators/${(creator as any).realUserId}`);
              } else {
                navigate(`/creators/${creator.id}`);
              }
            }}>
              <CreatorCard creator={creator as any} index={i} />
            </div>
            {role === "brand" && (creator as any).isReal && (creator as any).realUserId && (
              <button
                onClick={(e) => handleSaveCreator((creator as any).realUserId, e)}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center z-10"
              >
                <Heart className={`w-4 h-4 ${savedIds.has((creator as any).realUserId) ? "text-accent fill-accent" : "text-muted-foreground"}`} />
              </button>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-heading font-medium">No creators found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Creators;
