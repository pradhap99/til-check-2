import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { campaigns as mockCampaigns } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import CampaignCard from "@/components/CampaignCard";
import Layout from "@/components/Layout";
import { Search, SlidersHorizontal, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const campaignCategories = ["All", ...Array.from(new Set(mockCampaigns.map((c) => c.category)))];

const Campaigns = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [dbCampaigns, setDbCampaigns] = useState<any[]>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data } = await supabase.from("campaigns").select("*, brand_profiles(business_name)").eq("status", "active").order("created_at", { ascending: false });
      setDbCampaigns(data || []);
    };
    fetchCampaigns();
  }, []);

  const allCampaigns = [
    ...dbCampaigns.map(c => ({
      id: c.id, brand: (c as any).brand_profiles?.business_name || "Brand", logo: "",
      title: c.title, budget: c.total_budget ? `₹${(parseInt(c.total_budget) / 100000).toFixed(0)}L` : "—",
      category: c.niche_targeting?.[0] || "General",
      deadline: c.end_date ? new Date(c.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—",
      slots: c.slots_total || 5, filled: c.slots_filled || 0, description: c.description || "",
      platforms: c.required_platforms || [], isReal: true,
    })),
    ...mockCampaigns.map(c => ({ ...c, isReal: false })),
  ];

  const filtered = allCampaigns.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.brand.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "All" || c.category === selectedCategory;
    return matchSearch && matchCategory;
  });

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

      <div className="px-5 mt-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 rounded-lg bg-background text-foreground placeholder:text-muted-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring/20" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all ${showFilters ? "bg-foreground border-foreground" : "border-border"}`}>
          <SlidersHorizontal className={`w-4 h-4 ${showFilters ? "text-background" : "text-muted-foreground"}`} />
        </button>
      </div>

      {showFilters && (
        <div className="px-5 mt-3 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Category</p>
          <div className="flex gap-1.5 flex-wrap">
            {campaignCategories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${selectedCategory === cat ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
                {cat}
              </button>
            ))}
          </div>
          {selectedCategory !== "All" && (
            <button onClick={() => setSelectedCategory("All")} className="text-xs text-destructive font-medium flex items-center gap-1 mt-2">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      )}

      <div className="px-5 mt-3 space-y-2 mb-4">
        <p className="text-[10px] text-muted-foreground">{filtered.length} campaigns</p>
        {filtered.map((campaign, i) => (
          <div key={campaign.id}>
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
            <p className="text-xs mt-1">Try adjusting your search</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Campaigns;
