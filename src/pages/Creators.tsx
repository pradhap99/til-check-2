import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { creators as mockCreators, categories, platforms } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import CreatorCard from "@/components/CreatorCard";
import Layout from "@/components/Layout";
import SkeletonCard from "@/components/SkeletonCard";
import { Search, SlidersHorizontal, X, Users, Heart, MapPin, ArrowLeft, Flame, Sparkles, TrendingUp, ChevronRight, CheckCircle, Zap, Target } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const segments = ["Experiences", "Products", "Services", "Events", "Long-term"];
const locationOptions = ["All", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Jaipur", "Ahmedabad", "Goa", "Kochi", "Lucknow"];
const followerRangeOptions = ["All", "1K-10K", "10K-50K", "50K-100K", "100K+"];
const engagementOptions = ["All", "2%-5%", "5%-10%", "10%+"];
const quickSearchPills = [
  { label: "Trending", icon: Flame },
  { label: "New Creators", icon: Sparkles },
  { label: "Top Earners", icon: TrendingUp },
  { label: "Near You", icon: MapPin },
];

const categoryTiles = [
  { id: "cafes", label: "Breakfast & Cafés", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=320&fit=crop", categories: ["Food"] },
  { id: "dining", label: "Dinners & Rooftops", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=320&fit=crop", categories: ["Food"] },
  { id: "staycations", label: "Staycations", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=320&fit=crop", categories: ["Travel"] },
  { id: "studios", label: "Photo Studios", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=320&fit=crop", categories: ["Fashion", "Beauty"] },
  { id: "salons", label: "Salons & Spas", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=320&fit=crop", categories: ["Beauty"] },
  { id: "fitness", label: "Fitness Studios", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=320&fit=crop", categories: ["Fitness"] },
  { id: "events", label: "Events & Launches", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=320&fit=crop", categories: ["Lifestyle", "Comedy"] },
  { id: "retail", label: "Retail & Shopping", image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=320&fit=crop", categories: ["Fashion", "Lifestyle"] },
];

const trendingCreators = mockCreators.slice(0, 6);
const featuredBrands = [
  { name: "boAt", logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop", slots: 5 },
  { name: "Mamaearth", logo: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=80&h=80&fit=crop", slots: 4 },
  { name: "Lenskart", logo: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=80&h=80&fit=crop", slots: 10 },
  { name: "CRED", logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=80&h=80&fit=crop", slots: 2 },
  { name: "Sugar", logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&h=80&fit=crop", slots: 3 },
];

const recommendedCreators = mockCreators.slice(0, 8).map((c, i) => ({
  ...c,
  matchScore: Math.floor(Math.random() * 20) + 75,
  matchReason: ["Matches your Fashion niche", "High engagement in Beauty", "Top performer in Tech", "Popular in your city"][i % 4],
}));

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
  const [loading, setLoading] = useState(true);
  const [selectedFollowerRange, setSelectedFollowerRange] = useState("All");
  const [selectedEngagement, setSelectedEngagement] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
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
      setLoading(false);
      if (user && role === "brand") {
        supabase.from("saved_creators").select("creator_user_id").eq("brand_user_id", user.id)
          .then(({ data }) => setSavedIds(new Set((data || []).map(d => d.creator_user_id))));
      }
    };
    fetchCreators();
  }, [user, role]);

  const allCreators = [...dbCreators, ...mockCreators.map(c => ({ ...c, isReal: false, realUserId: null }))];

  const tileFilteredCategories = selectedTile
    ? (categoryTiles.find(t => t.id === selectedTile)?.categories || [])
    : [];

  const filtered = allCreators.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.handle.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "All"
      ? (tileFilteredCategories.length === 0 || tileFilteredCategories.includes(c.category))
      : c.category === selectedCategory;
    const matchPlatform = selectedPlatform === "All" || c.platform === selectedPlatform;
    const matchLocation = selectedLocation === "All" || c.location.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchSearch && matchCategory && matchPlatform && matchLocation;
  });

  const activeFilters = (selectedCategory !== "All" ? 1 : 0) + (selectedPlatform !== "All" ? 1 : 0) + (selectedLocation !== "All" ? 1 : 0) + (selectedFollowerRange !== "All" ? 1 : 0) + (selectedEngagement !== "All" ? 1 : 0) + (verifiedOnly ? 1 : 0);

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
  const isBrand = role === "brand";

  return (
    <Layout>
      <header className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-heading font-bold text-foreground">{isBrand ? "Find Creators" : "Discover"}</h1>
        <p className="text-xs text-muted-foreground">{isBrand ? "Search from 12,400+ verified creators across India" : "Find creators & opportunities"}</p>
      </header>

      {/* Segmented Nav - Creator only */}
      {!isBrand && (
        <div className="px-5 mt-2">
          <div className="flex gap-1 overflow-x-auto no-scrollbar bg-secondary/50 rounded-xl p-1">
            {segments.map(seg => (
              <button key={seg} onClick={() => { setSelectedSegment(seg); setSelectedTile(null); }} className={`px-3 py-2 rounded-lg text-xs font-heading font-semibold whitespace-nowrap transition-all ${selectedSegment === seg ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                {seg}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="px-5 mt-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder={isBrand ? "Search by name, niche, or location..." : "Search creators, brands, niches..."} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-[52px] pl-11 pr-4 rounded-full bg-card text-foreground placeholder:text-muted-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 shadow-sm transition-all" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 border transition-all relative shadow-sm ${showFilters ? "bg-foreground border-foreground" : "border-border bg-card"}`}>
          <SlidersHorizontal className={`w-4 h-4 ${showFilters ? "text-background" : "text-muted-foreground"}`} />
          {activeFilters > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[9px] font-bold text-accent-foreground flex items-center justify-center">{activeFilters}</span>}
        </button>
      </div>

      {/* Quick filter pills for brands */}
      {isBrand && !showList && (
        <div className="px-5 mt-2.5 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { label: "Verified Only", active: verifiedOnly, onClick: () => setVerifiedOnly(!verifiedOnly) },
            ...locationOptions.slice(1, 5).map(loc => ({ label: loc, active: selectedLocation === loc, onClick: () => setSelectedLocation(selectedLocation === loc ? "All" : loc) })),
            ...categories.slice(1, 4).map(cat => ({ label: cat, active: selectedCategory === cat, onClick: () => setSelectedCategory(selectedCategory === cat ? "All" : cat) })),
          ].map((pill, i) => (
            <button key={i} onClick={pill.onClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap shrink-0 active:scale-95 transition-all border ${pill.active ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-border"}`}>
              {pill.label === "Verified Only" && <CheckCircle className="w-3 h-3" />}
              {pill.label}
            </button>
          ))}
        </div>
      )}

      {/* Quick Search Pills - Creator only */}
      {!isBrand && !showList && (
        <div className="px-5 mt-2.5 flex gap-2 overflow-x-auto no-scrollbar">
          {quickSearchPills.map((pill) => (
            <button key={pill.label} onClick={() => setSearch(pill.label === "Near You" ? "" : "")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-[11px] font-medium whitespace-nowrap shrink-0 active:scale-95 transition-transform">
              <pill.icon className="w-3 h-3" />{pill.label}
            </button>
          ))}
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="px-5 mt-3 space-y-3 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Niche</p>
            <div className="flex gap-1.5 flex-wrap">
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${selectedCategory === cat ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>{cat}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Platform</p>
            <div className="flex gap-1.5 flex-wrap">
              {platforms.map(plat => (
                <button key={plat} onClick={() => setSelectedPlatform(plat)} className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all border ${selectedPlatform === plat ? "border-foreground text-foreground bg-foreground/5" : "border-border text-muted-foreground"}`}>{plat}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Follower Range</p>
            <div className="flex gap-1.5 flex-wrap">
              {followerRangeOptions.map(fr => (
                <button key={fr} onClick={() => setSelectedFollowerRange(fr)} className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all border ${selectedFollowerRange === fr ? "border-accent text-accent bg-accent/5" : "border-border text-muted-foreground"}`}>{fr}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Engagement Rate</p>
            <div className="flex gap-1.5 flex-wrap">
              {engagementOptions.map(er => (
                <button key={er} onClick={() => setSelectedEngagement(er)} className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all border ${selectedEngagement === er ? "border-accent text-accent bg-accent/5" : "border-border text-muted-foreground"}`}>{er}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> City</p>
            <div className="flex gap-1.5 flex-wrap">
              {locationOptions.map(loc => (
                <button key={loc} onClick={() => setSelectedLocation(loc)} className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all border ${selectedLocation === loc ? "border-foreground text-foreground bg-foreground/5" : "border-border text-muted-foreground"}`}>{loc}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setVerifiedOnly(!verifiedOnly)} className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all flex items-center gap-1 ${verifiedOnly ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
              <CheckCircle className="w-3 h-3" /> Verified Only
            </button>
          </div>
          {activeFilters > 0 && (
            <button onClick={() => { setSelectedCategory("All"); setSelectedPlatform("All"); setSelectedLocation("All"); setSelectedFollowerRange("All"); setSelectedEngagement("All"); setVerifiedOnly(false); }} className="text-xs text-destructive font-medium flex items-center gap-1">
              <X className="w-3 h-3" /> Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Content Area */}
      {!showList ? (
        <div className="mt-4 mb-4">
          {/* Brand: Recommended Creators */}
          {isBrand && (
            <section className="mb-5">
              <div className="flex items-center justify-between px-5 mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-[15px] text-foreground">Recommended For You</h3>
                  <Badge className="bg-accent/10 text-accent border-0 text-[8px]"><Zap className="w-2.5 h-2.5 mr-0.5" />AI Match</Badge>
                </div>
                <button className="text-xs text-muted-foreground flex items-center gap-0.5">See all <ChevronRight className="w-3 h-3" /></button>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-1">
                {recommendedCreators.map((creator, i) => (
                  <button
                    key={creator.id}
                    onClick={() => navigate(`/creators/${creator.id}`)}
                    className="min-w-[160px] max-w-[160px] shrink-0 rounded-2xl overflow-hidden bg-card border border-border active:scale-[0.97] transition-transform"
                  >
                    <div className="h-[120px] relative">
                      <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <Badge className={`absolute top-2 right-2 text-[8px] border-0 ${creator.matchScore >= 85 ? "bg-primary text-primary-foreground" : "bg-accent/80 text-accent-foreground"}`}>
                        {creator.matchScore}% match
                      </Badge>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-[12px] font-heading font-bold truncate">{creator.name}</p>
                        <p className="text-white/70 text-[9px]">{creator.followers} · {creator.engagement}</p>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{creator.category}</span>
                      <p className="text-[9px] text-muted-foreground mt-1">{creator.matchReason}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Brand: Trending This Week */}
          {isBrand && (
            <section className="mb-5">
              <div className="flex items-center justify-between px-5 mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-[15px] text-foreground">Trending This Week</h3>
                  <span className="text-sm">🔥</span>
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-1">
                {trendingCreators.map((creator, i) => (
                  <button key={creator.id} onClick={() => navigate(`/creators/${creator.id}`)} className="flex flex-col items-center shrink-0 w-[72px] active:scale-95 transition-transform">
                    <div className={`relative ${creator.verified ? "gradient-ring" : ""}`}>
                      <img src={creator.avatar} alt={creator.name} className="w-[64px] h-[64px] rounded-full object-cover border-2 border-background" />
                      {creator.verified && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center border-2 border-background">
                          <CheckCircle className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      {i < 3 && <Badge className="absolute -top-1 -left-1 w-4 h-4 p-0 bg-destructive text-[8px] text-destructive-foreground flex items-center justify-center border-0 rounded-full">🔥</Badge>}
                    </div>
                    <p className="text-[10px] font-medium text-foreground mt-1.5 truncate w-full text-center">{creator.name.split(" ")[0]}</p>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground mt-0.5">{creator.category}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Creator: Trending + Brands */}
          {!isBrand && (
            <>
              <section className="mb-5">
                <div className="flex items-center justify-between px-5 mb-3">
                  <h3 className="font-heading font-bold text-[15px] text-foreground">Trending Creators</h3>
                  <button onClick={() => setSearch("trending")} className="text-xs text-muted-foreground flex items-center gap-0.5">See all <ChevronRight className="w-3 h-3" /></button>
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-1">
                  {trendingCreators.map((creator, i) => (
                    <button key={creator.id} onClick={() => navigate(`/creators/${creator.id}`)} className="flex flex-col items-center shrink-0 w-[72px] active:scale-95 transition-transform">
                      <div className={`relative ${creator.verified ? "gradient-ring" : ""}`}>
                        <img src={creator.avatar} alt={creator.name} className="w-[64px] h-[64px] rounded-full object-cover border-2 border-background" />
                        {creator.verified && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center border-2 border-background">
                            <CheckCircle className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                        {i === 0 && <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[8px] font-bold text-white border-2 border-background">1</div>}
                      </div>
                      <p className="text-[10px] font-medium text-foreground mt-1.5 truncate w-full text-center">{creator.name.split(" ")[0]}</p>
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground mt-0.5">{creator.category}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="mb-5">
                <div className="flex items-center justify-between px-5 mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-[15px] text-foreground">Brands Hiring Now</h3>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-semibold">Urgent</span>
                  </div>
                </div>
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-5 pb-1">
                  {featuredBrands.map((brand) => (
                    <button key={brand.name} onClick={() => navigate("/campaigns")} className="flex flex-col items-center shrink-0 active:scale-95 transition-transform">
                      <div className="w-[72px] h-[72px] rounded-2xl bg-card border border-border overflow-hidden flex items-center justify-center shadow-sm">
                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[10px] font-heading font-semibold text-foreground mt-1.5">{brand.name}</p>
                      <p className="text-[9px] text-destructive font-medium">{brand.slots} slots left</p>
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* Category Grid — Creator only */}
          {!isBrand && (
            <section>
              <p className="px-5 text-[10px] text-muted-foreground uppercase tracking-widest mb-2 font-medium">Browse by category</p>
              <div className="grid grid-cols-2 gap-2.5 px-5">
                {categoryTiles.map((cat, i) => (
                  <button key={cat.id} onClick={() => setSelectedTile(cat.id)} className="relative h-[140px] rounded-2xl overflow-hidden active:scale-[0.97] transition-all duration-200 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 40}ms`, animationFillMode: "forwards" }}>
                    <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-white text-[13px] font-heading font-bold leading-tight">{cat.label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Brand: Show all creators directly */}
          {isBrand && (
            <section className="px-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-heading font-semibold text-foreground">{filtered.length} creators found</p>
                <Button size="sm" variant="outline" className="h-7 text-[10px] rounded-lg" onClick={() => navigate("/saved")}>
                  <Heart className="w-3 h-3" /> Saved
                </Button>
              </div>
              <div className="space-y-2.5">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} variant="creator" />)
                ) : (
                  <>
                    {filtered.map((creator, i) => (
                      <div key={creator.id} className="relative">
                        <div onClick={() => {
                          if ((creator as any).isReal && (creator as any).realUserId) navigate(`/creators/${(creator as any).realUserId}`);
                          else navigate(`/creators/${creator.id}`);
                        }}>
                          <CreatorCard creator={creator as any} index={i} />
                        </div>
                        {(creator as any).isReal && (creator as any).realUserId && (
                          <button onClick={(e) => handleSaveCreator((creator as any).realUserId, e)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center z-10 border border-border">
                            <Heart className={`w-4 h-4 transition-all duration-200 ${savedIds.has((creator as any).realUserId) ? "text-red-500 fill-red-500 scale-110" : "text-muted-foreground"}`} />
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
                  </>
                )}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* Creator List (when tile or search selected) */
        <div className="px-5 mt-3 space-y-2.5 mb-4">
          {selectedTile && (
            <button onClick={() => setSelectedTile(null)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-1 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to categories
            </button>
          )}
          <p className="text-xs font-heading font-semibold text-foreground">{filtered.length} creators found</p>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} variant="creator" />)
          ) : (
            <>
              {filtered.map((creator, i) => (
                <div key={creator.id} className="relative">
                  <div onClick={() => {
                    if ((creator as any).isReal && (creator as any).realUserId) navigate(`/creators/${(creator as any).realUserId}`);
                    else navigate(`/creators/${creator.id}`);
                  }}>
                    <CreatorCard creator={creator as any} index={i} />
                  </div>
                  {role === "brand" && (creator as any).isReal && (creator as any).realUserId && (
                    <button onClick={(e) => handleSaveCreator((creator as any).realUserId, e)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center z-10 border border-border">
                      <Heart className={`w-4 h-4 transition-all duration-200 ${savedIds.has((creator as any).realUserId) ? "text-red-500 fill-red-500 scale-110" : "text-muted-foreground"}`} />
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
            </>
          )}
        </div>
      )}

      {/* FAB for creators */}
      {role === "creator" && (
        <button onClick={() => navigate("/campaigns")} className="fixed bottom-20 right-5 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-xl flex items-center justify-center z-40 active:scale-90 transition-transform">
          <Search className="w-5 h-5" />
        </button>
      )}
    </Layout>
  );
};

export default Creators;
