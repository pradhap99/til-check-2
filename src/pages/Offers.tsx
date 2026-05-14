import { useState } from "react";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Tag, TrendingUp, Info } from "lucide-react";
import { toast } from "sonner";

const categories = ["All", "Fashion", "Beauty", "Food", "Tech", "Lifestyle"];

const offers = [
  { id: 1, brand: "Lenskart", title: "20% off eyewear", commission: "8%", perSale: "~₹240", category: "Fashion", color: "from-blue-500 to-blue-700" },
  { id: 2, brand: "Mamaearth", title: "Buy 2 Get 1", commission: "10%", perSale: "~₹180", category: "Beauty", color: "from-green-500 to-green-700" },
  { id: 3, brand: "Nykaa", title: "Beauty Essentials Kit", commission: "12%", perSale: "~₹320", category: "Beauty", color: "from-red-500 to-red-700" },
  { id: 4, brand: "boAt", title: "Airdopes 500 ANC", commission: "6%", perSale: "~₹180", category: "Tech", color: "from-gray-700 to-gray-900" },
  { id: 5, brand: "Bewakoof", title: "Summer Collection", commission: "9%", perSale: "~₹135", category: "Fashion", color: "from-orange-500 to-orange-700" },
  { id: 6, brand: "Zomato", title: "Gold — 1 month free", commission: "₹150 flat", perSale: "₹150/signup", category: "Food", color: "from-red-600 to-red-800" },
];

const Offers = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? offers : offers.filter(o => o.category === activeCategory);

  const handleCopyLink = (brand: string) => {
    navigator.clipboard.writeText(`https://til.app/ref/${brand.toLowerCase()}-${Date.now()}`);
    toast.success("Link copied!");
  };

  const handleShare = async (brand: string, title: string) => {
    const url = `https://til.app/ref/${brand.toLowerCase()}-${Date.now()}`;
    if (navigator.share) {
      await navigator.share({ title: `${brand} — ${title}`, text: `Check out this deal from ${brand}!`, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  return (
    <Layout>
      <div className="page-transition">
        <header className="px-5 pt-6 pb-2">
          <h1 className="text-xl font-heading font-bold text-foreground">Offers & Affiliate Deals</h1>
          <p className="text-xs text-muted-foreground">Promote. Earn. Repeat.</p>
        </header>

        {/* Explainer */}
        <div className="px-5 mt-3">
          <div className="rounded-xl border border-border bg-accent/5 p-3 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Share these links with your audience. Every sale earns you a commission — tracked automatically through til.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium whitespace-nowrap transition-all ${
                activeCategory === cat ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Offers */}
        <div className="px-5 mt-4 space-y-3 pb-6">
          {filtered.map((offer, i) => (
            <div
              key={offer.id}
              className="border border-border rounded-2xl p-4 animate-scale-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${offer.color} flex items-center justify-center shrink-0`}>
                  <span className="text-white font-heading font-bold text-sm">{offer.brand[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-sm text-foreground">{offer.brand}</p>
                  <p className="text-xs text-muted-foreground truncate">{offer.title}</p>
                </div>
                <Badge className="bg-amber-500/10 text-amber-600 border-0 font-heading text-[10px]">
                  <Tag className="w-2.5 h-2.5 mr-0.5" /> {offer.commission}
                </Badge>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-accent" />
                  <span className="text-[11px] text-foreground font-heading font-medium">Your earnings per sale: <span className="text-accent font-bold">{offer.perSale}</span></span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-heading text-xs btn-hover-lift btn-shimmer-hover"
                  onClick={() => handleCopyLink(offer.brand)}
                >
                  <Copy className="w-3 h-3" /> Copy Link
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 rounded-xl font-heading text-xs"
                  onClick={() => handleShare(offer.brand, offer.title)}
                >
                  <Share2 className="w-3 h-3" />
                </Button>
              </div>

              <p className="text-[8px] text-muted-foreground mt-2 text-center">Powered by til. Affiliate Network · 2% platform fee applies</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Offers;
