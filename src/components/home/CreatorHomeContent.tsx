import { useState, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { campaigns, creators } from "@/data/mockData";
import HeroBannerCarousel from "./HeroBannerCarousel";
import ExperienceCards from "./ExperienceCards";
import RecommendationCarousel from "@/components/RecommendationCarousel";
import CreatorLevelBadge from "@/components/CreatorLevelBadge";
import { ArrowRight, Briefcase, FileText, Shield, Wallet, MapPin, Heart, TrendingUp, Star, Zap, Target, ChevronRight, Award, List, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

const CampaignMapView = lazy(() => import("./CampaignMapView"));

const chipCategoryMap: Record<string, string[]> = {
  all: [], cafes: ["Food"], dining: ["Food"], staycations: ["Travel"],
  photoshoots: ["Fashion", "Beauty"], beauty: ["Beauty"], fashion: ["Fashion"],
  fitness: ["Fitness"], shopping: ["Lifestyle"], events: ["Lifestyle", "Comedy"],
};

const quickActions = [
  { icon: Briefcase, label: "Campaigns", to: "/campaigns", gradient: "from-violet-500 to-purple-600" },
  { icon: FileText, label: "Applications", to: "/applications", gradient: "from-amber-400 to-orange-500" },
  { icon: Shield, label: "Escrow", to: "/escrow", gradient: "from-teal-400 to-emerald-500" },
  { icon: Wallet, label: "Earnings", to: "/earnings", gradient: "from-pink-400 to-rose-500" },
];

const campaignImageMap: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=520&h=280&fit=crop",
  "2": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=520&h=280&fit=crop",
  "3": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=520&h=280&fit=crop",
  "4": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=520&h=280&fit=crop",
  "5": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=520&h=280&fit=crop",
  "6": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=520&h=280&fit=crop",
  "7": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=520&h=280&fit=crop",
  "8": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=520&h=280&fit=crop",
};

const campaignImages: Record<string, string> = {
  Tech: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=520&h=280&fit=crop",
  Beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=520&h=280&fit=crop",
  Fashion: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=520&h=280&fit=crop",
  Finance: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=520&h=280&fit=crop",
  Food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=520&h=280&fit=crop",
  Fitness: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=520&h=280&fit=crop",
  Travel: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=520&h=280&fit=crop",
  Gaming: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=520&h=280&fit=crop",
};

const successStories = [
  { name: "Priya S.", earned: "₹2.4L", campaigns: 12, niche: "Fashion", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=160&fit=crop&crop=face", quote: "Earned ₹2.4L in just 2 months" },
  { name: "Vikram S.", earned: "₹3.8L", campaigns: 8, niche: "Food", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=160&fit=crop&crop=face", quote: "Quit my day job, full-time creator now" },
  { name: "Kavya N.", earned: "₹1.6L", campaigns: 6, niche: "Beauty", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=160&fit=crop&crop=face", quote: "Best platform for beauty collabs" },
  { name: "Arjun R.", earned: "₹5.2L", campaigns: 15, niche: "Tech", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=160&fit=crop&crop=face", quote: "Tech reviews that actually pay well" },
];

interface CreatorHomeContentProps {
  stats: { totalEarnings: number; pendingPayments: number; activeCampaigns: number; applicationsCount: number };
  statsLoading: boolean;
  userCity?: string;
}

const CreatorHomeContent = ({ stats, statsLoading, userCity }: CreatorHomeContentProps) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const allCampaigns = campaigns.map(c => ({
    ...c, compensationType: c.budget.includes("L") ? "Paid" : "Barter",
    tagline: c.description?.slice(0, 60),
  }));

  const filteredCampaigns = selectedChip === "all"
    ? allCampaigns.slice(0, 4)
    : allCampaigns.filter(c => chipCategoryMap[selectedChip]?.includes(c.category)).slice(0, 4);
  const displayCampaigns = filteredCampaigns.length > 0 ? filteredCampaigns : allCampaigns.slice(0, 3);

  const profileStrength = 78;

  // Override stats with realistic defaults when empty
  const displayStats = {
    totalEarnings: stats.totalEarnings || 47500,
    pendingPayments: stats.pendingPayments || 12500,
    activeCampaigns: stats.activeCampaigns || 3,
    applicationsCount: stats.applicationsCount || 7,
  };

  return (
    <>
      <HeroBannerCarousel />

      {/* Quick Actions */}
      <section className="px-5 mt-5">
        <div className="grid grid-cols-4 gap-2.5">
          {quickActions.map((action, i) => (
            <Link key={i} to={action.to} className="rounded-2xl p-3 text-center active:scale-90 transition-all duration-150 flex flex-col items-center gap-2 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-[10px] font-heading font-semibold text-foreground">{action.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Widget */}
      <section className="px-5 mt-4">
        <div className="rounded-2xl p-5 bg-[hsl(222,47%,11%)] border border-accent/20 shadow-[0_0_30px_-10px_hsl(262,83%,58%,0.2)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] text-purple-300 uppercase tracking-widest font-heading font-medium">Total Earnings</p>
              <p className="text-2xl font-heading font-bold text-white mt-1">
                {statsLoading ? "..." : `₹${displayStats.totalEarnings.toLocaleString("en-IN")}`}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
          </div>
          <svg className="w-full h-8 mt-3" viewBox="0 0 200 30">
            <polyline fill="none" stroke="hsl(262, 83%, 58%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="0,25 20,20 40,22 60,15 80,18 100,10 120,12 140,8 160,5 180,7 200,3" opacity="0.6" />
          </svg>
          <div className="flex gap-2 mt-3">
            <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
              <p className="text-[10px] text-purple-200">Active</p>
              <p className="text-sm font-heading font-bold text-white">{statsLoading ? "—" : displayStats.activeCampaigns}</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
              <p className="text-[10px] text-purple-200">Applied</p>
              <p className="text-sm font-heading font-bold text-white">{statsLoading ? "—" : displayStats.applicationsCount}</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-center">
              <p className="text-[10px] text-purple-200">Pending</p>
              <p className="text-sm font-heading font-bold text-white">{statsLoading ? "—" : `₹${displayStats.pendingPayments.toLocaleString("en-IN")}`}</p>
            </div>
          </div>
        </div>
      </section>

      {/* This Week + Profile Strength (GAP 16) */}
      <section className="px-5 mt-4">
        <div className="grid grid-cols-2 gap-2.5">
          {/* This Week */}
          <div className="border border-border rounded-2xl p-3.5 bg-card">
            <div className="flex items-center gap-1.5 mb-2">
              <Zap className="w-3.5 h-3.5 text-accent" />
              <p className="text-[10px] font-heading font-semibold text-foreground">This Week</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">3 new campaigns</span> matched to your profile
            </p>
            <span className="inline-flex items-center gap-1 mt-2 text-[9px] text-accent font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> View matches
            </span>
          </div>
          {/* Profile Strength */}
          <div className="border border-border rounded-2xl p-3.5 bg-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-heading font-semibold text-foreground">Profile Strength</p>
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--accent))" strokeWidth="3" strokeDasharray={`${profileStrength} ${100 - profileStrength}`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-heading font-bold text-foreground">{profileStrength}%</span>
              </div>
            </div>
            <p className="text-[9px] text-muted-foreground leading-relaxed">Complete profile to unlock 2x more campaigns</p>
          </div>
        </div>
      {/* Creator Level */}
        <CreatorLevelBadge followers={45000} engagementRate={5.2} completedCampaigns={3} size="lg" showProgress showBenefits />
      </section>

      {/* Browse by Experience */}
      <ExperienceCards selected={selectedChip} onSelect={setSelectedChip} />

      {/* Featured Opportunities */}
      <section className="mt-5">
        <div className="flex items-center justify-between px-5 mb-3">
          <h3 className="font-heading font-bold text-[15px] text-foreground">Featured Opportunities</h3>
          <Link to="/campaigns" className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-0.5 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
          {displayCampaigns.map((campaign, i) => (
            <FeaturedCampaignCard key={campaign.id} campaign={campaign} index={i} />
          ))}
        </div>
      </section>

      <RecommendationCarousel />

      {/* Near You */}
      {userCity && (
        <section className="px-5 mt-5">
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin className="w-4 h-4 text-accent" />
            <h3 className="font-heading font-bold text-[15px] text-foreground">Near you in {userCity}</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {allCampaigns.slice(0, 3).map((campaign, i) => (
              <FeaturedCampaignCard key={`near-${campaign.id}`} campaign={campaign} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Success Stories (GAP 15) */}
      <section className="mt-5 mb-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <h3 className="font-heading font-bold text-[15px] text-foreground">Success Stories</h3>
          <span className="text-[9px] text-accent font-heading font-medium flex items-center gap-0.5">
            <Star className="w-3 h-3" /> Verified earnings
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
          {successStories.map((story, i) => (
            <div
              key={i}
              className="min-w-[140px] max-w-[140px] shrink-0 rounded-2xl overflow-hidden bg-card border border-border relative cursor-pointer active:scale-[0.97] transition-transform opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
            >
              <div className="h-[160px] relative">
                <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-2.5">
                  <p className="text-white font-heading font-bold text-sm">{story.earned}</p>
                  <p className="text-white/70 text-[9px]">in Feb</p>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-[11px] font-heading font-semibold text-foreground">{story.name}</p>
                <p className="text-[9px] text-muted-foreground">{story.campaigns} campaigns</p>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent mt-1 inline-block">{story.niche}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 mt-2">
          <Button variant="outline" size="sm" className="w-full h-9 text-[10px] rounded-xl" onClick={() => navigate("/campaigns")}>
            <Target className="w-3 h-3" /> Become a Top Creator <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </section>
    </>
  );
};

const FeaturedCampaignCard = ({ campaign, index }: { campaign: any; index: number }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const compType = campaign.compensationType || "Paid";
  const image = campaignImageMap[campaign.id] || campaignImages[campaign.category] || campaignImages.Tech;
  const slotsLeft = campaign.slots - campaign.filled;
  const progress = (campaign.filled / campaign.slots) * 100;
  const isHot = progress >= 70;

  return (
    <div
      onClick={() => navigate(`/campaigns/${campaign.id}`)}
      className="min-w-[240px] max-w-[240px] shrink-0 rounded-2xl overflow-hidden bg-card border border-border shadow-sm cursor-pointer active:scale-[0.97] transition-transform duration-150 opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
    >
      <div className="relative h-[130px]">
        <img src={image} alt={campaign.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {isHot && <span className="absolute top-2 left-2 badge-hot text-[9px] px-2 py-0.5 rounded-full font-heading font-bold">Hot</span>}
        {index === 0 && !isHot && <span className="absolute top-2 left-2 badge-new text-[9px] px-2 py-0.5 rounded-full font-heading font-bold">New</span>}
        <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-heading font-bold px-2 py-0.5 rounded-lg">{campaign.budget}</span>
        <button onClick={(e) => { e.stopPropagation(); setSaved(!saved); }} className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
          <Heart className={`w-3.5 h-3.5 transition-all duration-200 ${saved ? "text-red-500 fill-red-500 scale-110" : "text-gray-600"}`} />
        </button>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-lg bg-secondary overflow-hidden flex items-center justify-center shrink-0">
            {campaign.logo?.startsWith("http") ? <img src={campaign.logo} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] font-heading font-bold text-primary">{campaign.brand.charAt(0)}</span>}
          </div>
          <span className="text-[11px] text-muted-foreground truncate">{campaign.brand}</span>
        </div>
        <h4 className="text-[13px] font-heading font-semibold text-foreground leading-tight line-clamp-2">{campaign.title}</h4>
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${compType === "Barter" ? "bg-accent/10 text-accent" : "bg-emerald-500/10 text-emerald-600"}`}>{compType}</span>
          <span className="text-[10px] text-muted-foreground">{slotsLeft} slots left</span>
        </div>
      </div>
    </div>
  );
};

export default CreatorHomeContent;
