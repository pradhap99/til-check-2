import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { creators as mockCreators, categories, platforms } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import CreatorCard from "@/components/CreatorCard";
import Layout from "@/components/Layout";
import CategoryTiles from "@/components/discover/CategoryTiles";
import { Search, SlidersHorizontal, X, Users, Heart, MapPin, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const segments = ["Experiences", "Products", "Services", "Events", "Long-term"];
const locationOptions = ["All", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Jaipur", "Ahmedabad", "Goa", "Kochi", "Lucknow"];

const tileCategoryMap: Record<string, string[]> = {
  cafes: ["Food"], dining: ["Food"], staycations: ["Travel"],
  studios: ["Fashion", "Beauty"], salons: ["Beauty"],
  fitness: ["Fitness"], events: ["Lifestyle", "Comedy"], retail: ["Fashion", "Lifestyle"],
};

const Creators = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("Experiences");
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [dbCreators, setDbCreators] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCreators = async () => {
      const { data: cps } = await supabase.from("creator_profiles").select("*").eq("onboarding_completed", true);
      if (cps && cps.length > 0) {
        const userIds = cps.map(c => c.user_id);
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, avatar_url, location_city").in("user_id", userIds);
        const pMap = new Map((profiles || []).map(p => [p.user_id, p]));
        setDbCreators(cps.map(cp => {
          const profile = pMap.get(cp.user_id);
          return {
            id: `db-${cp.user_id}`, realUserId: cp.user_id,
            name: profile?.full_name || "Creator", handle: cp.instagram_handle ? `@${cp.instagram_handle}` : "@creator",
            avatar: profile?.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${(profile?.full_name || 'C').charAt(0)}`,
            category: cp.primary_niche || "Lifestyle",
            followers: cp.instagram_followers ? `${(cp.instagram_followers / 1000).toFixed(0)}K` : "—",
            engagement: cp.engagement_rate ? `${cp.engagement_rate}%` : "—",
            platform: "Instagram" as const,
            location: profile?.location_city || "India",
            rate: cp.rate_reel ? `₹${parseInt(cp.rate_reel).toLocaleString()}` : "Contact",
            verified: cp.verified || false, bio: "", isReal: true,
          };
        }));
      }
    };
    fetchCreators();
    if (user && role === "brand") {
      supabase.from("saved_creators").select("creator_user_id").eq("brand_user_id", user.id)
        .then(({ data }) => setSavedIds(new Set((data || []).map(d => d.creator_user_id))));
    }
  }, [user, role]);

  const allCreators = [...dbCreators, ...mockCreators.map(c => ({ ...c, isReal: false, realUserId: null }))];

  // When a tile is selected, filter by mapped categories
  const tileFilteredCategories = selectedTile ? (tileCategoryMap[selectedTile] || []) : [];

  const filtered = allCreators.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.handle.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "All"
      ? (tileFilteredCategories.length === 0 || tileFilteredCategories.includes(c.category))
      : c.category === selectedCategory;
    const matchPlatform = selectedPlatform === "All" || c.platform === selectedPlatform;
    const matchLocation = selectedLocation === "All" || c.location.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchSearch && matchCategory && matchPlatform && matchLocation;
  });

  const activeFilters = (selectedCategory !== "All" ? 1 : 0) + (selectedPlatform !== "All" ? 1 : 0) + (selectedLocation !== "All" ? 1 : 0);

  const handleSaveCreator = async (creatorUserId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    if (savedIds.has(creatorUserId)) {
      await supabase.from("saved_creators").delete().eq("brand_user_id", user.id).eq("creator_user_id", creatorUserId);
      setSavedIds(prev => { const s = new Set(prev); s.delete(creatorUserId); return s; });
      toast.success("Creator removed");
    } else {
      await supabase.from("saved_creators").insert({ brand_user_id: user.id, creator_user_id: creatorUserId });
      setSavedIds(prev => new Set(prev).add(creatorUserId));
      toast.success("Creator saved");
    }
  };

  const showList = selectedTile !== null || search.length > 0;

  return (
    <Layout>
      <header className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-heading font-bold text-foreground">Discover</h1>
        <p className="text-xs text-muted-foreground">Find creators & opportunities</p>
      </header>

      {/* Segmented Nav */}
      <div className="px-5 mt-2">
        <div className="flex gap-1 overflow-x-auto no-scrollbar bg-secondary/50 rounded-lg p-1">
          {segments.map(seg => (
            <button
              key={seg}
              onClick={() => { setSelectedSegment(seg); setSelectedTile(null); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                selectedSegment === seg ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Filter */}
      <div className="px-5 mt-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by name, handle, or city..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 rounded-lg bg-background text-foreground placeholder:text-muted-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring/20" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all relative ${showFilters ? "bg-foreground border-foreground" : "border-border"}`}>
          <SlidersHorizontal className={`w-4 h-4 ${showFilters ? "text-background" : "text-muted-foreground"}`} />
          {activeFilters > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[9px] font-bold text-accent-foreground flex items-center justify-center">{activeFilters}</span>}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="px-5 mt-3 space-y-3 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Niche</p>
            <div className="flex gap-1.5 flex-wrap">
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${selectedCategory === cat ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>{cat}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Platform</p>
            <div className="flex gap-1.5 flex-wrap">
              {platforms.map(plat => (
                <button key={plat} onClick={() => setSelectedPlatform(plat)} className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all border ${selectedPlatform === plat ? "border-foreground text-foreground bg-foreground/5" : "border-border text-muted-foreground"}`}>{plat}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {locationOptions.map(loc => (
                <button key={loc} onClick={() => setSelectedLocation(loc)} className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all border ${selectedLocation === loc ? "border-foreground text-foreground bg-foreground/5" : "border-border text-muted-foreground"}`}>{loc}</button>
              ))}
            </div>
          </div>
          {activeFilters > 0 && (
            <button onClick={() => { setSelectedCategory("All"); setSelectedPlatform("All"); setSelectedLocation("All"); }} className="text-xs text-destructive font-medium flex items-center gap-1">
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* Content Area */}
      {!showList ? (
        /* Category Tiles */
        <div className="mt-4 mb-4">
          <p className="px-5 text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Browse by category</p>
          <CategoryTiles onSelect={(id) => setSelectedTile(id)} />
        </div>
      ) : (
        /* Creator List */
        <div className="px-5 mt-3 space-y-2 mb-4">
          {selectedTile && (
            <button onClick={() => setSelectedTile(null)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-1 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to categories
            </button>
          )}
          <p className="text-[10px] text-muted-foreground">{filtered.length} creators found</p>
          {filtered.map((creator, i) => (
            <div key={creator.id} className="relative">
              <div onClick={() => {
                if ((creator as any).isReal && (creator as any).realUserId) navigate(`/creators/${(creator as any).realUserId}`);
                else navigate(`/creators/${creator.id}`);
              }}>
                <CreatorCard creator={creator as any} index={i} />
              </div>
              {role === "brand" && (creator as any).isReal && (creator as any).realUserId && (
                <button onClick={(e) => handleSaveCreator((creator as any).realUserId, e)} className="absolute top-3 right-3 w-8 h-8 rounded-md bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 border border-border">
                  <Heart className={`w-4 h-4 ${savedIds.has((creator as any).realUserId) ? "text-destructive fill-destructive" : "text-muted-foreground"}`} />
                </button>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="font-medium text-sm">No creators found</p>
              <p className="text-xs mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Creators;
