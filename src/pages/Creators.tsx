import { useState } from "react";
import { creators, categories, platforms } from "@/data/mockData";
import CreatorCard from "@/components/CreatorCard";
import Layout from "@/components/Layout";
import { Search } from "lucide-react";

const Creators = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");

  const filtered = creators.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.handle.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchPlatform = selectedPlatform === "All" || c.platform === selectedPlatform;
    return matchSearch && matchCategory && matchPlatform;
  });

  return (
    <Layout>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-heading font-bold text-foreground">Discover Creators</h1>
        <p className="text-sm text-muted-foreground">Find the perfect creator for your brand</p>
      </header>

      {/* Search */}
      <div className="px-4 mt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search creators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm font-body border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="px-4 mt-3 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {categories.filter(c => creators.some(cr => c === "All" || cr.category === c)).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-heading font-medium transition-all ${
                selectedCategory === cat
                  ? "gradient-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Platform Filters */}
      <div className="px-4 mt-1 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {platforms.map((plat) => (
            <button
              key={plat}
              onClick={() => setSelectedPlatform(plat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-heading font-medium transition-all border ${
                selectedPlatform === plat
                  ? "border-primary text-primary bg-primary/5"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 mt-2 space-y-3 mb-4">
        <p className="text-xs text-muted-foreground">{filtered.length} creators found</p>
        {filtered.map((creator, i) => (
          <CreatorCard key={creator.id} creator={creator} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="font-heading font-medium">No creators found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Creators;
