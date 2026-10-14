import { useState, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { campaigns, creators } from "@/data/mockData";
import HeroBannerCarousel from "./HeroBannerCarousel";
import BrandCirclesRow from "./BrandCirclesRow";
import ExperienceCards from "./ExperienceCards";
import RecommendationCarousel from "@/components/RecommendationCarousel";
import SampleBadge from "@/components/SampleBadge";
import { ArrowRight, MapPin, Heart, TrendingUp, Star, Target, ChevronRight, List, Map, Flame, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const CampaignMapView = lazy(() => import("./CampaignMapView"));

const chipCategoryMap: Record<string, string[]> = {
  all: [], cafes: ["Food", "Cafe"], dining: ["Food", "Dining"], staycations: ["Travel", "Staycation"],
  photoshoots: ["Fashion", "Beauty"], beauty: ["Beauty"], fashion: ["Fashion"],
  fitness: ["Fitness"], shopping: ["Lifestyle"], events: ["Lifestyle", "Comedy"],
};

const campaignImageMap: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=520&h=280&fit=crop",
  "2": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=520&h=280&fit=crop",
  "3": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=520&h=280&fit=crop",
  "4": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=520&h=280&fit=crop",
  "5": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=520&h=280&fit=crop",
  "6": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=520&h=280&fit=crop",
  "7": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=520&h=280&fit=crop",
  "8": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=520&h=280&fit=crop",
  "cafe-001": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=520&h=280&fit=crop",
  "cafe-002": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=520&h=280&fit=crop",
  "dining-001": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=520&h=280&fit=crop",
  "staycation-001": "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=520&h=280&fit=crop",
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
  Cafe: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=520&h=280&fit=crop",
  Dining: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=520&h=280&fit=crop",
  Staycation: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=520&h=280&fit=crop",
};

const carouselBrandMap: Record<number, string> = { 0: "Sample Eyewear", 1: "Example Skincare Co.", 2: "Demo Audio" };

interface CreatorHomeContentProps {
  stats: { totalEarnings: number; pendingPayments: number; activeCampaigns: number; applicationsCount: number };
  statsLoading: boolean;
  userCity?: string;
}

const CreatorHomeContent = ({ stats, statsLoading, userCity }: CreatorHomeContentProps) => {
  const navigate = useNavigate();
  const [selectedChip, setSelectedChip] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const activeBrand = carouselBrandMap[carouselIndex] || null;

  const allCampaigns = campaigns.map(c => ({
    ...c, compensationType: c.budget.includes("L") ? "Paid" : "Barter",
    tagline: c.description?.slice(0, 60),
  }));

  const brandFiltered = selectedBrand ? allCampaigns.filter(c => c.brand === selectedBrand) : allCampaigns;
  const filteredCampaigns = selectedChip === "all"
    ? brandFiltered.slice(0, 4)
    : brandFiltered.filter(c => chipCategoryMap[selectedChip]?.includes(c.category)).slice(0, 4);
  const displayCampaigns = filteredCampaigns.length > 0 ? filteredCampaigns : brandFiltered.slice(0, 3);

  return (
    <>
      <BrandCirclesRow selectedBrand={selectedBrand} onSelectBrand={setSelectedBrand} activeBrand={activeBrand} />
      <HeroBannerCarousel onSlideChange={setCarouselIndex} />

      {/* Offers Banner */}
      <div className="px-5 mt-4">
        <button
          onClick={() => navigate("/offers")}
          className="w-full rounded-xl p-3 flex items-center gap-2.5 border border-accent/20 btn-micro animate-fade-slide-up"
          style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))" }}
        >
          <Flame className="w-4 h-4 text-accent shrink-0" />
          <span className="text-xs font-heading font-medium text-foreground flex-1 text-left">New Affiliate Offers Available → Earn commissions</span>
          <ChevronRight className="w-3.5 h-3.5 text-accent" />
        </button>
      </div>

      {/* Browse by Experience */}
      <ExperienceCards selected={selectedChip} onSelect={setSelectedChip} />

      {/* Featured Opportunities */}
      <section className="mt-5">
        <div className="flex items-center justify-between px-5 mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-[15px] text-foreground">Featured Opportunities</h3>
            <SampleBadge />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-secondary rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("list")}
                className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${viewMode === "list" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${viewMode === "map" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                <Map className="w-3.5 h-3.5" />
              </button>
            </div>
            <Link to="/campaigns" className="text-xs text-accent hover:text-accent/80 font-medium flex items-center gap-0.5 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
        {viewMode === "list" ? (
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
            {displayCampaigns.map((campaign, i) => (
              <FeaturedCampaignCard key={campaign.id} campaign={campaign} index={i} />
            ))}
          </div>
        ) : (
          <div className="px-5">
            <Suspense fallback={<div className="h-[320px] rounded-2xl bg-secondary animate-pulse" />}>
              <CampaignMapView key="campaign-map" campaigns={allCampaigns} />
            </Suspense>
            <p className="text-[11px] text-accent font-heading font-medium mt-2 px-1">
              {allCampaigns.length} campaigns near you
            </p>
          </div>
        )}
      </section>

      <RecommendationCarousel />

      {/* Near You */}
      {userCity && (
        <section className="px-5 mt-5">
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin className="w-4 h-4 text-accent" />
            <h3 className="font-heading font-bold text-[15px] text-foreground">Near you in {userCity}</h3>
            <SampleBadge />
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {allCampaigns.slice(0, 3).map((campaign, i) => (
              <FeaturedCampaignCard key={`near-${campaign.id}`} campaign={campaign} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Success Stories */}
      <section className="mt-5 mb-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <h3 className="font-heading font-bold text-[15px] text-foreground">Success Stories</h3>
          <button onClick={() => navigate("/stories")} className="text-[10px] text-accent font-heading font-medium flex items-center gap-0.5">
            View all stories <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="px-5">
          <div className="rounded-2xl border border-dashed border-border bg-card p-5 text-center">
            <p className="text-xs text-muted-foreground">No stories yet. Finish a campaign and yours could be the first.</p>
          </div>
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
      className="min-w-[240px] max-w-[240px] shrink-0 rounded-2xl overflow-hidden bg-card border border-border shadow-sm cursor-pointer active:scale-[0.97] transition-transform duration-150 animate-scale-in"
      style={{ animationDelay: `${index * 80}ms` }}
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
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg bg-secondary overflow-hidden flex items-center justify-center shrink-0">
            {campaign.logo?.startsWith("http") ? <img src={campaign.logo} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] font-heading font-bold text-foreground">{campaign.brand.charAt(0)}</span>}
          </div>
          <span className="text-[11px] text-foreground font-medium truncate">{campaign.brand}</span>
        </div>
        <h4 className="text-[13px] font-heading font-bold text-foreground leading-tight line-clamp-2">{campaign.title}</h4>
        {/* Location */}
        {campaign.location && (
          <div className="flex items-center gap-1 mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="text-[11px] text-muted-foreground truncate">{campaign.location}</span>
          </div>
        )}
        {/* Date */}
        {campaign.date && (
          <div className="flex items-center gap-1 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="text-[11px] text-muted-foreground truncate">{campaign.date}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${compType === "Barter" ? "bg-accent/10 text-accent" : "bg-emerald-500/10 text-emerald-600"}`}>{compType}</span>
          <span className="text-[10px] text-muted-foreground">{slotsLeft} slots left</span>
        </div>
      </div>
    </div>
  );
};

export default CreatorHomeContent;
