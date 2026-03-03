import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Plus, X } from "lucide-react";
import { toast } from "sonner";

const campaignTypes = ["Sponsored Post", "Product Review", "Brand Ambassador", "Affiliate", "UGC", "Event", "Barter"];
const platformOptions = ["Instagram", "YouTube", "Twitter", "TikTok"];
const nicheOptions = ["Fashion", "Tech", "Beauty", "Food", "Fitness", "Travel", "Gaming", "Lifestyle", "Finance", "Comedy"];

const CreateCampaign = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [campaignType, setCampaignType] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [niches, setNiches] = useState<string[]>([]);
  const [totalBudget, setTotalBudget] = useState("");
  const [budgetPerCreator, setBudgetPerCreator] = useState("");
  const [slotsTotal, setSlotsTotal] = useState("5");
  const [endDate, setEndDate] = useState("");
  const [barterProductName, setBarterProductName] = useState("");
  const [barterProductValue, setBarterProductValue] = useState("");
  const [barterProductDescription, setBarterProductDescription] = useState("");

  const isBarter = campaignType === "Barter";
  const togglePlatform = (p: string) => setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  const toggleNiche = (n: string) => setNiches(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]);

  const steps = [
    {
      title: "Campaign basics",
      subtitle: "What's this campaign about?",
      content: (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Campaign Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Summer Product Launch" className="w-full h-11 px-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell creators what you're looking for..." rows={4} className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
          <div>
            <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {campaignTypes.map(t => (
                <button key={t} onClick={() => setCampaignType(t)} className={`p-2.5 rounded-xl text-xs font-heading font-medium transition-all ${campaignType === t ? "gradient-primary text-primary-foreground shadow-md" : "bg-secondary text-secondary-foreground"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
      valid: !!title && !!description && !!campaignType,
    },
    {
      title: "Targeting",
      subtitle: "Who should apply?",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Required Platforms</label>
            <div className="flex gap-2 flex-wrap">
              {platformOptions.map(p => (
                <button key={p} onClick={() => togglePlatform(p)} className={`px-3 py-2 rounded-xl text-xs font-heading font-medium transition-all ${platforms.includes(p) ? "gradient-primary text-primary-foreground shadow-md" : "bg-secondary text-secondary-foreground"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Target Niches</label>
            <div className="flex gap-2 flex-wrap">
              {nicheOptions.map(n => (
                <button key={n} onClick={() => toggleNiche(n)} className={`px-3 py-2 rounded-xl text-xs font-heading font-medium transition-all ${niches.includes(n) ? "border-2 border-primary bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
      valid: platforms.length > 0,
    },
    {
      title: "Budget & timeline",
      subtitle: isBarter ? "Product details & deadline" : "Set your budget and deadline",
      content: (
        <div className="space-y-3">
          {isBarter ? (
            <>
              <div>
                <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Product Name *</label>
                <input value={barterProductName} onChange={e => setBarterProductName(e.target.value)} placeholder="e.g. Skincare Kit, Sneakers" className="w-full h-11 px-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Product Value (₹)</label>
                <input value={barterProductValue} onChange={e => setBarterProductValue(e.target.value)} placeholder="e.g. 5000" type="number" className="w-full h-11 px-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Product Description</label>
                <textarea value={barterProductDescription} onChange={e => setBarterProductDescription(e.target.value)} placeholder="Describe the product being gifted..." rows={3} className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Total Budget (₹)</label>
                <input value={totalBudget} onChange={e => setTotalBudget(e.target.value)} placeholder="e.g. 500000" type="number" className="w-full h-11 px-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Budget per Creator (₹)</label>
                <input value={budgetPerCreator} onChange={e => setBudgetPerCreator(e.target.value)} placeholder="e.g. 50000" type="number" className="w-full h-11 px-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Creator Slots</label>
              <input value={slotsTotal} onChange={e => setSlotsTotal(e.target.value)} type="number" min="1" className="w-full h-11 px-3 rounded-xl bg-secondary text-foreground text-sm border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Deadline</label>
              <input value={endDate} onChange={e => setEndDate(e.target.value)} type="date" className="w-full h-11 px-3 rounded-xl bg-secondary text-foreground text-sm border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          {isBarter && (
            <div className="bg-accent/5 border border-accent/10 rounded-xl p-3 mt-2">
              <p className="text-[10px] font-heading font-medium text-accent">🎁 Barter Campaign</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Creators receive your product instead of cash. Product will be shipped to accepted creators.</p>
            </div>
          )}
        </div>
      ),
      valid: isBarter ? (!!barterProductName && !!endDate) : (!!totalBudget && !!endDate),
    },
  ];

  const handlePublish = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("campaigns").insert({
        brand_user_id: user.id,
        title,
        description,
        campaign_type: campaignType.toLowerCase().replace(/ /g, "_"),
        required_platforms: platforms,
        niche_targeting: niches,
        total_budget: isBarter ? barterProductValue || "0" : totalBudget,
        budget_per_creator: isBarter ? barterProductValue || "0" : budgetPerCreator,
        slots_total: parseInt(slotsTotal) || 5,
        end_date: endDate,
        status: "active",
        is_barter: isBarter,
        barter_product_name: isBarter ? barterProductName : null,
        barter_product_value: isBarter ? barterProductValue : null,
        barter_product_description: isBarter ? barterProductDescription : null,
      } as any);
      if (error) throw error;
      toast.success("Campaign published! 🚀");
      navigate("/campaigns");
    } catch (e: any) {
      toast.error(e.message || "Failed to create campaign");
    }
    setLoading(false);
  };

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto flex flex-col">
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "gradient-primary" : "bg-secondary"}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pt-6">
        <h1 className="text-xl font-heading font-bold text-foreground">{currentStep.title}</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-5">{currentStep.subtitle}</p>
        {currentStep.content}
      </div>

      <div className="px-4 pb-8 pt-4">
        <Button variant="gradient" className="w-full h-12 rounded-2xl font-heading" disabled={!currentStep.valid || loading} onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : handlePublish()}>
          {step < steps.length - 1 ? <>Continue <ArrowRight className="w-4 h-4" /></> : <>Publish Campaign <CheckCircle className="w-4 h-4" /></>}
        </Button>
      </div>
    </div>
  );
};

export default CreateCampaign;
