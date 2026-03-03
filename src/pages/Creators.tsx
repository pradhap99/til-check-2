import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { creators, categories, platforms } from "@/data/mockData";
import CreatorCard from "@/components/CreatorCard";
import Layout from "@/components/Layout";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Creators = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = creators.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.handle.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchPlatform = selectedPlatform === "All" || c.platform === selectedPlatform;
    return matchSearch && matchCategory && matchPlatform;
  });

  const activeFilters = (selectedCategory !== "All" ? 1 : 0) + (selectedPlatform !== "All" ? 1 : 0);

  return (
    <Layout>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-heading font-bold text-foreground">Discover Creators</h1>
        <p className="text-xs text-muted-foreground">Find the perfect creator for your brand</p>
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
              {categories.filter(c => creators.some(cr => c === "All" || cr.category === c)).map(cat => (
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
          <div key={creator.id} onClick={() => navigate(`/creators/${creator.id}`)}>
            <CreatorCard creator={creator} index={i} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-heading font-medium">No creators found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Creators;
