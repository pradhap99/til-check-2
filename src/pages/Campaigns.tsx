import { useState } from "react";
import { campaigns } from "@/data/mockData";
import CampaignCard from "@/components/CampaignCard";
import Layout from "@/components/Layout";

const campaignCategories = ["All", ...Array.from(new Set(campaigns.map((c) => c.category)))];

const Campaigns = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = selectedCategory === "All" ? campaigns : campaigns.filter((c) => c.category === selectedCategory);

  return (
    <Layout>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-heading font-bold text-foreground">Live Campaigns</h1>
        <p className="text-sm text-muted-foreground">Apply to brand campaigns that match your niche</p>
      </header>

      {/* Category Filters */}
      <div className="px-4 mt-3 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {campaignCategories.map((cat) => (
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

      <div className="px-4 mt-2 space-y-3 mb-4">
        <p className="text-xs text-muted-foreground">{filtered.length} campaigns live</p>
        {filtered.map((campaign, i) => (
          <CampaignCard key={campaign.id} campaign={campaign} index={i} />
        ))}
      </div>
    </Layout>
  );
};

export default Campaigns;
