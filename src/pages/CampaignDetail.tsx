import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { campaigns as mockCampaigns } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CampaignCard from "@/components/CampaignCard";
import { ArrowLeft, Calendar, Users, MapPin, Share2, Bookmark, CheckCircle2, Clock, IndianRupee, Send, Utensils, Camera, Gift, FileText, ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger, DrawerClose,
} from "@/components/ui/drawer";

interface CampaignData {
  id: string; title: string; brand: string; logo: string; budget: string;
  category: string; deadline: string; slots: number; filled: number;
  description: string; platforms: string[]; isReal: boolean;
}

const experienceTypeMap: Record<string, string> = {
  Food: "Dining Experience", Beauty: "Salon Visit", Fashion: "Styling Session",
  Travel: "Staycation", Tech: "Product Unboxing", Fitness: "Studio Visit",
  Gaming: "Gaming Event", Lifestyle: "Lifestyle Experience", Finance: "Financial Review",
  Comedy: "Entertainment", General: "Brand Experience",
};

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [pitch, setPitch] = useState("");
  const [proposedRate, setProposedRate] = useState("");
  const [contentConcept, setContentConcept] = useState("");
  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (isUuid) {
      const load = async () => {
        const { data: c } = await supabase.from("campaigns").select("*").eq("id", id).maybeSingle();
        if (c) {
          const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", c.brand_user_id).maybeSingle();
          const { data: brandProfile } = await supabase.from("brand_profiles").select("business_name").eq("user_id", c.brand_user_id).maybeSingle();
          setCampaign({
            id: c.id, title: c.title,
            brand: brandProfile?.business_name || profile?.full_name || "Brand", logo: "",
            budget: c.total_budget ? `₹${(parseInt(c.total_budget) / 100000).toFixed(1)}L` : c.budget_per_creator || "—",
            category: c.niche_targeting?.[0] || c.campaign_type || "General",
            deadline: c.end_date ? new Date(c.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—",
            slots: c.slots_total || 5, filled: c.slots_filled || 0,
            description: c.description || "", platforms: c.required_platforms || [], isReal: true,
          });
          if (user) {
            const { data: existingApp } = await supabase.from("campaign_applications").select("id").eq("campaign_id", c.id).eq("creator_user_id", user.id).maybeSingle();
            setAlreadyApplied(!!existingApp);
          }
        }
        setLoading(false);
      };
      load();
    } else {
      const mockCampaign = mockCampaigns.find(c => c.id === id);
      if (mockCampaign) setCampaign({ ...mockCampaign, isReal: false });
      setLoading(false);
    }
  }, [id, user]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 rounded-lg bg-primary/20 animate-pulse" /></div>;
  if (!campaign) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Campaign not found</p></div>;

  const progressPercent = campaign.slots > 0 ? (campaign.filled / campaign.slots) * 100 : 0;
  const slotsLeft = campaign.slots - campaign.filled;
  const experienceType = experienceTypeMap[campaign.category] || "Brand Experience";

  // Similar campaigns
  const similarCampaigns = mockCampaigns.filter(c => c.category === campaign.category && c.id !== campaign.id).slice(0, 3);

  const handleApply = async () => {
    if (!user || !id) return;
    setApplying(true);
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUuid) {
        const { error } = await supabase.from("campaign_applications").insert({ campaign_id: id, creator_user_id: user.id, pitch, proposed_rate: proposedRate, content_concept: contentConcept, status: "pending" });
        if (error) throw error;
        const { data: campaignData } = await supabase.from("campaigns").select("brand_user_id, title").eq("id", id).maybeSingle();
        if (campaignData) {
          await supabase.from("notifications").insert({ user_id: campaignData.brand_user_id, title: "New Application Received", message: `A creator applied to "${campaignData.title}"`, type: "application", reference_type: "campaign", reference_id: id });
        }
      }
      toast.success("Application submitted!");
      setApplyOpen(false); setAlreadyApplied(true);
      setPitch(""); setProposedRate(""); setContentConcept("");
    } catch (e: any) { toast.error(e.message || "Failed to apply"); }
    setApplying(false);
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto pb-4">
      {/* Header */}
      <div className="px-4 pt-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h1 className="font-heading font-semibold text-sm text-foreground">Campaign Details</h1>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center"><Share2 className="w-4 h-4 text-muted-foreground" /></button>
          <button className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center"><Bookmark className="w-4 h-4 text-muted-foreground" /></button>
        </div>
      </div>

      {/* Brand Info */}
      <div className="px-4 mt-5">
        <div className="flex items-center gap-3">
          {campaign.logo ? (
            <img src={campaign.logo} alt="" className="w-12 h-12 rounded-xl object-cover bg-secondary" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-heading font-bold text-primary">{campaign.brand.charAt(0)}</span>
            </div>
          )}
          <div>
            <h2 className="font-heading font-bold text-lg text-foreground">{campaign.title}</h2>
            <p className="text-sm text-muted-foreground">by {campaign.brand}</p>
          </div>
        </div>
      </div>

      {/* Experience Type + Status */}
      <div className="px-4 mt-4 flex gap-2">
        <Badge className="bg-accent/10 text-accent border-0 text-[10px]">{experienceType}</Badge>
        <Badge className="bg-secondary text-muted-foreground border-0 text-[10px]">{campaign.category}</Badge>
      </div>

      <div className="px-4 mt-3">
        <div className="bg-accent/10 rounded-xl p-3 flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-accent" />
          <div>
            <p className="text-xs font-heading font-semibold text-accent">{slotsLeft} slots remaining</p>
            <p className="text-[10px] text-muted-foreground">Deadline: {campaign.deadline}</p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="px-4 mt-4">
        <h3 className="font-heading font-semibold text-sm text-foreground mb-1.5">About this campaign</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{campaign.description}</p>
      </div>

      {/* What's Included (for barter-style) */}
      <div className="px-4 mt-4">
        <h3 className="font-heading font-semibold text-sm text-foreground mb-2">What's included</h3>
        <div className="space-y-2">
          {[
            { icon: Gift, text: campaign.category === "Food" ? "Dinner for 2 at the venue" : campaign.category === "Beauty" ? "Full service package" : "Product samples & access" },
            { icon: Camera, text: "Professional photography support" },
            { icon: Utensils, text: campaign.category === "Food" ? "Full menu tasting" : "Brand merchandise kit" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center">
                <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverables */}
      <div className="px-4 mt-4">
        <h3 className="font-heading font-semibold text-sm text-foreground mb-2">Deliverables required</h3>
        <div className="border border-border rounded-xl overflow-hidden">
          {[
            { type: "Instagram Reel", qty: "1", spec: "60-90 seconds, vertical" },
            { type: "Instagram Stories", qty: "3", spec: "Behind-the-scenes coverage" },
            { type: "Static Post", qty: "1", spec: "High-quality carousel" },
          ].map((d, i) => (
            <div key={i} className={`flex items-center justify-between px-3.5 py-2.5 ${i > 0 ? "border-t border-border" : ""}`}>
              <div>
                <p className="text-xs font-medium text-foreground">{d.type}</p>
                <p className="text-[10px] text-muted-foreground">{d.spec}</p>
              </div>
              <Badge variant="secondary" className="text-[10px]">x{d.qty}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Content Guidelines */}
      <div className="px-4 mt-4">
        <h3 className="font-heading font-semibold text-sm text-foreground mb-2">Content guidelines</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-medium text-primary uppercase tracking-wider mb-1.5 flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> Do's</p>
            <ul className="space-y-1">
              {["Authentic, personal tone", "Tag brand + use hashtags", "Show product in use"].map((d, i) => (
                <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-primary shrink-0 mt-0.5" /> {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-medium text-destructive uppercase tracking-wider mb-1.5 flex items-center gap-1"><ThumbsDown className="w-3 h-3" /> Don'ts</p>
            <ul className="space-y-1">
              {["No competitor mentions", "No edited/filtered logos", "No misleading claims"].map((d, i) => (
                <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                  <span className="text-destructive shrink-0 mt-0.5">-</span> {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-2.5">
        {[
          { icon: IndianRupee, label: "Budget", value: campaign.budget },
          { icon: Users, label: "Slots", value: `${campaign.filled}/${campaign.slots}` },
          { icon: Calendar, label: "Deadline", value: campaign.deadline },
          { icon: MapPin, label: "Category", value: campaign.category },
        ].map((item, i) => (
          <div key={i} className="border border-border rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <item.icon className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] text-muted-foreground">{item.label}</span>
            </div>
            <p className="font-heading font-semibold text-sm text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="px-4 mt-4">
        <div className="border border-border rounded-xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground text-xs">Application Progress</span>
            <span className="font-heading font-semibold text-foreground text-xs">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Platforms */}
      {campaign.platforms.length > 0 && (
        <div className="px-4 mt-4">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-2">Required Platforms</h3>
          <div className="flex gap-2">
            {campaign.platforms.map((p) => (
              <Badge key={p} variant="secondary" className="rounded-lg px-3 py-1.5 text-xs font-heading">{p}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Similar Campaigns */}
      {similarCampaigns.length > 0 && (
        <div className="px-4 mt-6">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-3">Similar campaigns</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {similarCampaigns.map((c, i) => (
              <div key={c.id} className="min-w-[280px] shrink-0" onClick={() => navigate(`/campaigns/${c.id}`)}>
                <CampaignCard campaign={c} index={i} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-4 py-5">
        {role === "creator" ? (
          alreadyApplied ? (
            <Button disabled className="w-full h-12 rounded-xl font-heading text-base">
              <CheckCircle2 className="w-4 h-4" /> Already Applied
            </Button>
          ) : (
            <Drawer open={applyOpen} onOpenChange={setApplyOpen}>
              <DrawerTrigger asChild>
                <Button variant="gradient" className="w-full h-12 rounded-xl font-heading text-base">Apply Now</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className="font-heading">Apply to {campaign.title}</DrawerTitle>
                  <DrawerDescription>Tell {campaign.brand} why you're the perfect fit</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 space-y-3">
                  <div>
                    <label className="text-xs font-heading font-medium text-foreground mb-1 block">Your Pitch *</label>
                    <textarea value={pitch} onChange={e => setPitch(e.target.value)} placeholder="Why should this brand choose you?" rows={4} className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-heading font-medium text-foreground mb-1 block">Content Concept</label>
                    <textarea value={contentConcept} onChange={e => setContentConcept(e.target.value)} placeholder="Describe your content idea..." rows={2} className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-heading font-medium text-foreground mb-1 block">Proposed Rate (₹)</label>
                    <input value={proposedRate} onChange={e => setProposedRate(e.target.value)} placeholder="e.g. 25000" type="number" className="w-full h-11 px-3 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <DrawerFooter>
                  <Button variant="gradient" className="w-full h-12 rounded-xl font-heading" disabled={!pitch || applying} onClick={handleApply}>
                    <Send className="w-4 h-4" /> Submit Application
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full rounded-xl">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )
        ) : role === "brand" ? (
          <Button variant="gradient" className="w-full h-12 rounded-xl font-heading text-base" onClick={() => navigate(`/campaigns/${id}/manage`)}>
            Manage Applications
          </Button>
        ) : (
          <Button variant="outline" className="w-full h-12 rounded-xl font-heading text-base" onClick={() => navigate("/campaigns")}>
            Browse Campaigns
          </Button>
        )}
        <p className="text-[10px] text-muted-foreground text-center mt-2">By applying, you agree to the campaign terms & conditions</p>
      </div>
    </div>
  );
};

export default CampaignDetail;
