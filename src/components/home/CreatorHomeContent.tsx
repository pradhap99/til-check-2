import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { campaigns } from "@/data/mockData";
import CampaignMiniCard from "./CampaignMiniCard";
import LifestyleChips from "./LifestyleChips";
import RecommendationCarousel from "@/components/RecommendationCarousel";
import { ArrowRight, Briefcase, FileText, Shield, Wallet, MapPin } from "lucide-react";

const chipCategoryMap: Record<string, string[]> = {
  all: [],
  cafes: ["Food"],
  dining: ["Food"],
  staycations: ["Travel"],
  photoshoots: ["Fashion", "Beauty"],
  beauty: ["Beauty"],
  fashion: ["Fashion"],
  fitness: ["Fitness"],
  shopping: ["Lifestyle"],
};

interface CreatorHomeContentProps {
  stats: { totalEarnings: number; pendingPayments: number; activeCampaigns: number; applicationsCount: number };
  statsLoading: boolean;
  userCity?: string;
}

const CreatorHomeContent = ({ stats, statsLoading, userCity }: CreatorHomeContentProps) => {
  const navigate = useNavigate();
  const [selectedChip, setSelectedChip] = useState("all");

  const allCampaigns = campaigns.map(c => ({
    ...c,
    compensationType: c.budget.includes("L") ? "Paid" : "Barter",
    tagline: c.description?.slice(0, 60),
  }));

  const filteredCampaigns = selectedChip === "all"
    ? allCampaigns.slice(0, 3)
    : allCampaigns.filter(c => chipCategoryMap[selectedChip]?.includes(c.category)).slice(0, 3);

  const displayCampaigns = filteredCampaigns.length > 0 ? filteredCampaigns : allCampaigns.slice(0, 2);

  return (
    <>
      {/* Quick Actions */}
      <section className="px-5 mt-4">
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Briefcase, label: "Campaigns", to: "/campaigns" },
            { icon: FileText, label: "Applications", to: "/applications" },
            { icon: Shield, label: "Escrow", to: "/escrow" },
            { icon: Wallet, label: "Earnings", to: "/earnings" },
          ].map((action, i) => (
            <Link key={i} to={action.to} className="border border-border rounded-xl p-2.5 text-center hover:bg-secondary/50 transition-all btn-micro flex flex-col items-center gap-1.5 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
              <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center">
                <action.icon className="w-3.5 h-3.5 text-foreground" />
              </div>
              <p className="text-[9px] font-medium text-foreground">{action.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Earnings Mini Card */}
      <section className="px-5 mt-4">
        <div className="border border-border rounded-xl p-3 flex items-center justify-between bg-background">
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Total Earnings</p>
            <p className="text-base font-heading font-bold text-foreground">
              {statsLoading ? "..." : `₹${stats.totalEarnings.toLocaleString("en-IN")}`}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-[9px] text-muted-foreground">Active</p>
              <p className="text-sm font-heading font-bold text-foreground">{statsLoading ? "—" : stats.activeCampaigns}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-muted-foreground">Applied</p>
              <p className="text-sm font-heading font-bold text-foreground">{statsLoading ? "—" : stats.applicationsCount}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Chips */}
      <section className="mt-5">
        <LifestyleChips selected={selectedChip} onSelect={setSelectedChip} />
      </section>

      {/* Featured Opportunities */}
      <section className="px-5 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-semibold text-sm text-foreground">Featured Opportunities</h3>
          <Link to="/campaigns" className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-0.5 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {displayCampaigns.map((campaign, i) => (
            <CampaignMiniCard key={campaign.id} campaign={campaign} index={i} />
          ))}
        </div>
      </section>

      {/* Recommended for you */}
      <RecommendationCarousel />

      {/* Near You */}
      {userCity && (
        <section className="px-5 mt-5 mb-4">
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <h3 className="font-heading font-semibold text-sm text-foreground">Near you in {userCity}</h3>
          </div>
          <div className="space-y-2">
            {allCampaigns.slice(0, 2).map((campaign, i) => (
              <CampaignMiniCard key={`near-${campaign.id}`} campaign={campaign} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default CreatorHomeContent;
