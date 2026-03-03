import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { campaigns as mockCampaigns } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Users, MapPin, Share2, Bookmark, CheckCircle2, Clock, IndianRupee, Send } from "lucide-react";
import { toast } from "sonner";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger, DrawerClose,
} from "@/components/ui/drawer";

interface CampaignData {
  id: string;
  title: string;
  brand: string;
  logo: string;
  budget: string;
  category: string;
  deadline: string;
  slots: number;
  filled: number;
  description: string;
  platforms: string[];
  isReal: boolean;
}

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

    // Check if it's a UUID (real DB campaign) or mock ID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (isUuid) {
      // Fetch from database
      const load = async () => {
        const { data: c } = await supabase.from("campaigns").select("*").eq("id", id).maybeSingle();
        if (c) {
          // Get brand name
          const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", c.brand_user_id).maybeSingle();
          const { data: brandProfile } = await supabase.from("brand_profiles").select("business_name").eq("user_id", c.brand_user_id).maybeSingle();

          setCampaign({
            id: c.id,
            title: c.title,
            brand: brandProfile?.business_name || profile?.full_name || "Brand",
            logo: "",
            budget: c.total_budget ? `₹${(parseInt(c.total_budget) / 100000).toFixed(1)}L` : c.budget_per_creator || "—",
            category: c.niche_targeting?.[0] || c.campaign_type || "General",
            deadline: c.end_date ? new Date(c.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—",
            slots: c.slots_total || 5,
            filled: c.slots_filled || 0,
            description: c.description || "",
            platforms: c.required_platforms || [],
            isReal: true,
          });

          // Check if already applied
          if (user) {
            const { data: existingApp } = await supabase
              .from("campaign_applications")
              .select("id")
              .eq("campaign_id", c.id)
              .eq("creator_user_id", user.id)
              .maybeSingle();
            setAlreadyApplied(!!existingApp);
          }
        }
        setLoading(false);
      };
      load();
    } else {
      // Use mock data
      const mockCampaign = mockCampaigns.find(c => c.id === id);
      if (mockCampaign) {
        setCampaign({ ...mockCampaign, isReal: false });
      }
      setLoading(false);
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-primary/20 animate-pulse" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Campaign not found</p>
      </div>
    );
  }

  const progressPercent = campaign.slots > 0 ? (campaign.filled / campaign.slots) * 100 : 0;
  const slotsLeft = campaign.slots - campaign.filled;

  const handleApply = async () => {
    if (!user || !id) return;

    if (!campaign.isReal) {
      toast.error("This is a sample campaign. Apply to real campaigns created by brands.");
      return;
    }

    setApplying(true);
    try {
      const { error } = await supabase.from("campaign_applications").insert({
        campaign_id: id,
        creator_user_id: user.id,
        pitch,
        proposed_rate: proposedRate,
        content_concept: contentConcept,
        status: "pending",
      });
      if (error) throw error;

      // Notify brand
      const { data: campaignData } = await supabase.from("campaigns").select("brand_user_id, title").eq("id", id).maybeSingle();
      if (campaignData) {
        await supabase.from("notifications").insert({
          user_id: campaignData.brand_user_id,
          title: "New Application Received",
          message: `A creator applied to "${campaignData.title}"`,
          type: "application",
          reference_type: "campaign",
          reference_id: id,
        });
      }

      toast.success("Application submitted!");
      setApplyOpen(false);
      setAlreadyApplied(true);
      setPitch("");
      setProposedRate("");
      setContentConcept("");
    } catch (e: any) {
      toast.error(e.message || "Failed to apply");
    }
    setApplying(false);
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-heading font-semibold text-sm text-foreground">Campaign Details</h1>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
            <Share2 className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
            <Bookmark className="w-4 h-4 text-muted-foreground" />
          </button>
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

      {/* Status Banner */}
      <div className="px-4 mt-4">
        <div className="bg-accent/10 rounded-xl p-3 flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-accent" />
          <div>
            <p className="text-xs font-heading font-semibold text-accent">{slotsLeft} slots remaining</p>
            <p className="text-[10px] text-muted-foreground">Deadline: {campaign.deadline}</p>
          </div>
        </div>
      </div>

      {/* Sample Campaign Warning */}
      {!campaign.isReal && (
        <div className="px-4 mt-3">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
            <p className="text-xs text-yellow-700 font-heading font-medium">Sample Campaign</p>
            <p className="text-[10px] text-yellow-600 mt-0.5">This is example data. Apply to real campaigns created by brands.</p>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="px-4 mt-4">
        <h3 className="font-heading font-semibold text-sm text-foreground mb-1.5">About this campaign</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{campaign.description}</p>
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

      {/* Requirements */}
      <div className="px-4 mt-4">
        <h3 className="font-heading font-semibold text-sm text-foreground mb-2">Requirements</h3>
        <div className="space-y-2">
          {[
            "Minimum 10K followers on required platform",
            "Content must align with brand guidelines",
            "Deliver within 7 days of acceptance",
            "Original content only — no reposts",
          ].map((req, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">{req}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 py-5 pb-8">
        {role === "creator" ? (
          campaign.isReal ? (
            alreadyApplied ? (
              <Button disabled className="w-full h-12 rounded-xl font-heading text-base">
                <CheckCircle2 className="w-4 h-4" /> Already Applied
              </Button>
            ) : (
              <Drawer open={applyOpen} onOpenChange={setApplyOpen}>
                <DrawerTrigger asChild>
                  <Button variant="gradient" className="w-full h-12 rounded-xl font-heading text-base">
                    Apply Now
                  </Button>
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
          ) : (
            <Button disabled className="w-full h-12 rounded-xl font-heading text-base opacity-50">
              Sample Campaign — Cannot Apply
            </Button>
          )
        ) : role === "brand" && campaign.isReal ? (
          <Button variant="gradient" className="w-full h-12 rounded-xl font-heading text-base" onClick={() => navigate(`/campaigns/${id}/manage`)}>
            Manage Applications
          </Button>
        ) : (
          <Button variant="outline" className="w-full h-12 rounded-xl font-heading text-base" onClick={() => navigate("/campaigns")}>
            Browse Campaigns
          </Button>
        )}
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          By applying, you agree to the campaign terms & conditions
        </p>
      </div>
    </div>
  );
};

export default CampaignDetail;
