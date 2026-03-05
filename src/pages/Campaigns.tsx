import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { campaigns as mockCampaigns } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import CampaignCard from "@/components/CampaignCard";
import Layout from "@/components/Layout";
import { Search, SlidersHorizontal, Plus, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const campaignCategories = ["All", "F&B", "Beauty", "Fashion", "Tech", "Fitness", "Travel", "D2C", "Events", "Finance", "Gaming", "Comedy"];
const compensationTypes = ["All", "Paid", "Barter", "Hybrid"];
const locationOptions = ["All", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Jaipur", "Ahmedabad", "Goa", "Kochi", "Lucknow"];

// Map old category names to new chips
const categoryAliasMap: Record<string, string> = {
  Food: "F&B", Tech: "Tech", Beauty: "Beauty", Fashion: "Fashion",
  Finance: "Finance", Fitness: "Fitness", Travel: "Travel", Gaming: "Gaming",
  Lifestyle: "D2C", Comedy: "Comedy",
};

const Campaigns = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCompensation, setSelectedCompensation] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [dbCampaigns, setDbCampaigns] = useState<any[]>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data } = await supabase
        .from("campaigns")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        const brandIds = [...new Set(data.map(c => c.brand_user_id))];
        const { data: brandProfiles } = await supabase.from("brand_profiles").select("user_id, business_name").in("user_id", brandIds);
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", brandIds);
        const brandMap = new Map((brandProfiles || []).map(b => [b.user_id, b.business_name]));
        const profileMap = new Map((profiles || []).map(p => [p.user_id, p.full_name]));

        setDbCampaigns(data.map(c => ({
          id: c.id,
          brand: brandMap.get(c.brand_user_id) || profileMap.get(c.brand_user_id) || "Brand",
          logo: "",
          title: c.title,
          budget: c.total_budget ? `₹${(parseInt(c.total_budget) / 100000).toFixed(0)}L` : c.budget_per_creator || "—",
          category: c.niche_targeting?.[0] || "General",
          deadline: c.end_date ? new Date(c.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—",
          slots: c.slots_total || 5,
          filled: c.slots_filled || 0,
          description: c.description || "",
          platforms: c.required_platforms || [],
          locations: c.location_targeting || [],
          compensationType: c.is_barter ? "Barter" : "Paid",
          isReal: true,
        })));
      }
    };
    fetchCampaigns();
  }, []);

  const allCampaigns = [
    ...dbCampaigns,
    ...mockCampaigns.map(c => ({ ...c, isReal: false, locations: [] as string[], compensationType: "Paid" })),
  ];

  const filtered = allCampaigns.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.brand.toLowerCase().includes(search.toLowerCase());
    const mappedCat = categoryAliasMap[c.category] || c.category;
    const matchCategory = selectedCategory === "All" || mappedCat === selectedCategory || c.category === selectedCategory;
    const matchLocation = selectedLocation === "All" || (c as any).locations?.some((l: string) => l.toLowerCase().includes(selectedLocation.toLowerCase()));
    const matchComp = selectedCompensation === "All" || (c as any).compensationType === selectedCompensation;
    return matchSearch && matchCategory && matchLocation && matchComp;
  });

  const activeFilters = (selectedCategory !== "All" ? 1 : 0) + (selectedLocation !== "All" ? 1 : 0) + (selectedCompensation !== "All" ? 1 : 0);

  return (
    <Layout>
      <header className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Campaigns</h1>
          <p className="text-xs text-muted-foreground">{role === "brand" ? "Manage your campaigns" : "Apply to brand campaigns"}</p>
        </div>
        {role === "brand" && (
          <Button size="sm" className="h-8 text-xs font-medium" onClick={() => navigate("/campaigns/create")}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Create
          </Button>
        )}
      </header>

      {/* Category Chips */}
      <div className="px-5 mt-2 flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {campaignCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap shrink-0 transition-all border ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-secondary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Compensation Type Pills */}
      <div className="px-5 mt-2 flex gap-1.5">
        {compensationTypes.map(comp => (
          <button
            key={comp}
            onClick={() => setSelectedCompensation(comp)}
            className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${
              selectedCompensation === comp
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {comp}
          </button>
        ))}
      </div>

      <div className="px-5 mt-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 rounded-lg bg-background text-foreground placeholder:text-muted-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring/20" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all relative ${showFilters ? "bg-foreground border-foreground" : "border-border"}`}>
          <SlidersHorizontal className={`w-4 h-4 ${showFilters ? "text-background" : "text-muted-foreground"}`} />
          {activeFilters > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[9px] font-bold text-accent-foreground flex items-center justify-center">{activeFilters}</span>}
        </button>
      </div>

      {showFilters && (
        <div className="px-5 mt-3 space-y-3 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {locationOptions.map(loc => (
                <button key={loc} onClick={() => setSelectedLocation(loc)} className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all border ${selectedLocation === loc ? "border-foreground text-foreground bg-foreground/5" : "border-border text-muted-foreground"}`}>
                  {loc}
                </button>
              ))}
            </div>
          </div>
          {activeFilters > 0 && (
            <button onClick={() => { setSelectedCategory("All"); setSelectedLocation("All"); setSelectedCompensation("All"); }} className="text-xs text-destructive font-medium flex items-center gap-1">
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
      )}

      <div className="px-5 mt-3 space-y-2 mb-4">
        <p className="text-[10px] text-muted-foreground">{filtered.length} campaigns</p>
        {filtered.map((campaign, i) => (
          <div key={`${campaign.id}-${i}`}>
            <div onClick={() => navigate(`/campaigns/${campaign.id}`)}>
              <CampaignCard campaign={campaign} index={i} />
            </div>
            {role === "brand" && (campaign as any).isReal && (
              <div className="mt-1">
                <Button size="sm" variant="outline" className="w-full h-7 text-[10px]" onClick={() => navigate(`/campaigns/${campaign.id}/manage`)}>
                  Manage Applications
                </Button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-medium text-sm">No campaigns found</p>
            <p className="text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Campaigns;
