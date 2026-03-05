import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, CheckCircle, Upload, Eye, Sparkles, Ban, Lock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { EXPERIENCE_CATEGORIES, CATEGORY_GROUPS, CATEGORY_TEMPLATES } from "@/data/experienceCategories";
import { CREATOR_LEVELS } from "@/lib/creatorLevels";

const campaignTypes = [
  { label: "Product Launch", emoji: "🚀" },
  { label: "Event Promotion", emoji: "🎉" },
  { label: "Brand Awareness", emoji: "📢" },
  { label: "Content Creation", emoji: "🎬" },
  { label: "Affiliate", emoji: "🔗" },
  { label: "UGC", emoji: "📱" },
  { label: "Barter", emoji: "🎁" },
];
const platformOptions = ["Instagram", "YouTube", "Twitter", "TikTok"];
const cityOptions = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Pune", "Hyderabad", "Kolkata", "Jaipur"];
const compensationTypes = ["Paid", "Barter", "Hybrid"];
const followerRanges = ["1K-10K", "10K-50K", "50K-100K", "100K-500K", "500K+"];
const ageRanges = ["18-24", "25-34", "35-44", "45+"];
const genderOptions = ["All", "Male", "Female"];

const levelOptions = [
  { label: "Any Level", value: 0, desc: "All creators can apply" },
  { label: "Level 2+ (50K+)", value: 2, desc: "Emerging creators with growing audience" },
  { label: "Level 3+ (100K+)", value: 3, desc: "Established creators, min 3% engagement" },
  { label: "Level 4+ (250K+)", value: 4, desc: "Top creators with proven track records" },
  { label: "Level 5+ (500K+)", value: 5, desc: "Elite creators, premium partnerships" },
  { label: "Level 6 Only (1M+)", value: 6, desc: "Celebrity creators, exclusive" },
];

interface Deliverable {
  type: string;
  quantity: number;
  duration?: string;
  enabled: boolean;
}

const CreateCampaign = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [campaignType, setCampaignType] = useState("");
  const [category, setCategory] = useState("");

  // Step 2
  const [budgetRange, setBudgetRange] = useState([10000, 100000]);
  const [compensation, setCompensation] = useState("Paid");
  const [barterDesc, setBarterDesc] = useState("");
  const [slotsTotal, setSlotsTotal] = useState("5");
  const [endDate, setEndDate] = useState("");

  // Step 3
  const [followerRange, setFollowerRange] = useState("10K-50K");
  const [niches, setNiches] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [gender, setGender] = useState("All");
  const [ageRange, setAgeRange] = useState<string[]>([]);
  const [minCreatorLevel, setMinCreatorLevel] = useState(0);

  // Step 4
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { type: "Instagram Reel", quantity: 1, duration: "30s", enabled: false },
    { type: "Instagram Story", quantity: 1, enabled: false },
    { type: "Static Post", quantity: 1, enabled: false },
    { type: "YouTube Integration", quantity: 1, duration: "60s", enabled: false },
    { type: "Blog Post", quantity: 1, enabled: false },
  ]);

  // Step 5
  const [dos, setDos] = useState("Tag @brandhandle\nUse #campaignhashtag\nShow product in use");
  const [donts, setDonts] = useState("No competitor mentions\nNo edited logos");

  const toggleArray = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const toggleDeliverable = (idx: number) => {
    setDeliverables(prev => prev.map((d, i) => i === idx ? { ...d, enabled: !d.enabled } : d));
  };

  const updateDeliverableQty = (idx: number, qty: number) => {
    setDeliverables(prev => prev.map((d, i) => i === idx ? { ...d, quantity: qty } : d));
  };

  const isBarter = compensation === "Barter";

  const steps = [
    {
      title: "Campaign Basics",
      subtitle: "What's this campaign about?",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Campaign Name</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Summer Product Launch" className="h-11 rounded-xl" />
          </div>
           <div>
            <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Category</label>
            <select value={category} onChange={e => {
              setCategory(e.target.value);
              const tpl = CATEGORY_TEMPLATES[e.target.value];
              if (tpl) {
                setDos(tpl.dos);
                setDonts(tpl.donts);
                setDeliverables(prev => prev.map(d => {
                  const match = tpl.deliverables.find(td => d.type.toLowerCase().includes(td.type.toLowerCase().split(" ")[0]));
                  return match ? { ...d, enabled: true, quantity: match.quantity, duration: match.duration || d.duration } : d;
                }));
              }
            }} className="w-full h-11 px-3 rounded-xl bg-secondary text-foreground text-sm border border-border">
              <option value="">Select category</option>
              {CATEGORY_GROUPS.map(group => (
                <optgroup key={group} label={group}>
                  {EXPERIENCE_CATEGORIES.filter(c => c.group === group).map(c => (
                    <option key={c.id} value={c.label}>{c.emoji} {c.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Campaign Type</label>
            <div className="grid grid-cols-2 gap-2">
              {campaignTypes.map(t => (
                <button key={t.label} onClick={() => setCampaignType(t.label)} className={`p-3 rounded-xl text-xs font-heading font-medium transition-all flex items-center gap-2 ${campaignType === t.label ? "bg-accent text-accent-foreground shadow-md" : "bg-secondary text-secondary-foreground"}`}>
                  <span>{t.emoji}</span> {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell creators what you're looking for..." rows={3} className="w-full px-3 py-2 rounded-xl bg-background text-foreground text-sm placeholder:text-muted-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none" />
          </div>
        </div>
      ),
      valid: !!title && !!campaignType,
    },
    {
      title: "Budget & Timeline",
      subtitle: "Set compensation and deadline",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-heading font-medium text-foreground mb-2 block">Compensation Type</label>
            <div className="flex gap-2">
              {compensationTypes.map(c => (
                <button key={c} onClick={() => setCompensation(c)} className={`flex-1 py-2.5 rounded-xl text-xs font-heading font-semibold transition-all ${compensation === c ? (c === "Paid" ? "bg-emerald-500 text-white" : c === "Barter" ? "bg-accent text-accent-foreground" : "bg-blue-500 text-white") : "bg-secondary text-secondary-foreground"}`}>{c}</button>
              ))}
            </div>
          </div>
           {!isBarter && (
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-2 block">
                Budget Range: ₹{budgetRange[0].toLocaleString()} — ₹{budgetRange[1].toLocaleString()}
              </label>
              <Slider value={budgetRange} onValueChange={setBudgetRange} min={1000} max={1000000} step={1000} className="w-full" />
              <div className="flex justify-between text-[9px] text-muted-foreground mt-1"><span>₹1K</span><span>₹10L</span></div>
              {/* Budget warning for level */}
              {minCreatorLevel >= 3 && budgetRange[1] < (CREATOR_LEVELS[minCreatorLevel - 1]?.minFollowers ? parseInt(CREATOR_LEVELS[minCreatorLevel - 1].basePay.replace(/[^\d]/g, "")) * 1000 : 35000) && (
                <div className="mt-2 flex items-start gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-medium text-amber-700 dark:text-amber-400">Level {minCreatorLevel} creators expect minimum {CREATOR_LEVELS[minCreatorLevel - 1]?.basePay}</p>
                    <p className="text-[9px] text-amber-600/80">Your campaign may get fewer applications at this budget.</p>
                  </div>
                </div>
              )}
            </div>
          )}
          {isBarter && (
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">What you'll provide</label>
              <textarea value={barterDesc} onChange={e => setBarterDesc(e.target.value)} placeholder="e.g. Dinner for 2, Product hamper worth ₹5000..." rows={3} className="w-full px-3 py-2 rounded-xl bg-background text-foreground text-sm placeholder:text-muted-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Creator Slots</label>
              <Input value={slotsTotal} onChange={e => setSlotsTotal(e.target.value)} type="number" min="1" className="h-11 rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Deadline</label>
              <Input value={endDate} onChange={e => setEndDate(e.target.value)} type="date" className="h-11 rounded-xl" />
            </div>
          </div>
        </div>
      ),
      valid: !!endDate && (isBarter ? !!barterDesc : budgetRange[1] > 0),
    },
    {
      title: "Target Audience",
      subtitle: "Who should apply?",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-heading font-medium text-foreground mb-2 block">Minimum Creator Level</label>
            <div className="space-y-1.5">
              {levelOptions.map(opt => (
                <button key={opt.value} onClick={() => setMinCreatorLevel(opt.value)} className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all border ${minCreatorLevel === opt.value ? "border-accent bg-accent/5" : "border-border"}`}>
                  {opt.value > 0 ? <Lock className="w-3.5 h-3.5 text-accent shrink-0" /> : <Sparkles className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                  <div>
                    <p className="text-xs font-heading font-semibold text-foreground">{opt.label}</p>
                    <p className="text-[9px] text-muted-foreground">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            {minCreatorLevel >= 3 && (
              <p className="text-[9px] text-muted-foreground mt-2 px-2">💡 Level {minCreatorLevel}+ creators have min 3% engagement and {minCreatorLevel >= 5 ? "15+" : "5+"} completed campaigns.</p>
            )}
          </div>
          <div>
            <label className="text-xs font-heading font-medium text-foreground mb-2 block">Creator Follower Range</label>
            <div className="flex gap-1.5 flex-wrap">
              {followerRanges.map(r => (
                <button key={r} onClick={() => setFollowerRange(r)} className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${followerRange === r ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>{r}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-heading font-medium text-foreground mb-2 block">Preferred Niches</label>
            <div className="flex gap-1.5 flex-wrap">
              {EXPERIENCE_CATEGORIES.slice(0, 12).map(c => (
                <button key={c.id} onClick={() => toggleArray(niches, setNiches, c.label)} className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${niches.includes(c.label) ? "bg-accent/20 text-accent border border-accent" : "bg-secondary text-muted-foreground"}`}>{c.emoji} {c.label.split(" ")[0]}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-heading font-medium text-foreground mb-2 block">City Preference</label>
            <div className="flex gap-1.5 flex-wrap">
              {cityOptions.map(c => (
                <button key={c} onClick={() => toggleArray(cities, setCities, c)} className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${cities.includes(c) ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-2 block">Gender</label>
              <div className="flex gap-1.5">
                {genderOptions.map(g => (
                  <button key={g} onClick={() => setGender(g)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all ${gender === g ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-2 block">Age Range</label>
              <div className="flex gap-1 flex-wrap">
                {ageRanges.map(a => (
                  <button key={a} onClick={() => toggleArray(ageRange, setAgeRange, a)} className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${ageRange.includes(a) ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>{a}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
      valid: true,
    },
    {
      title: "Deliverables",
      subtitle: "What should creators deliver?",
      content: (
        <div className="space-y-3">
          {deliverables.map((d, idx) => (
            <div key={d.type} className={`border rounded-xl p-3 transition-all ${d.enabled ? "border-accent bg-accent/5" : "border-border"}`}>
              <div className="flex items-center gap-3">
                <Checkbox checked={d.enabled} onCheckedChange={() => toggleDeliverable(idx)} />
                <span className="text-sm font-heading font-medium text-foreground flex-1">{d.type}</span>
              </div>
              {d.enabled && (
                <div className="flex items-center gap-3 mt-2 pl-7">
                  <div className="flex items-center gap-1.5">
                    <label className="text-[10px] text-muted-foreground">Qty:</label>
                    <Input value={d.quantity} onChange={e => updateDeliverableQty(idx, parseInt(e.target.value) || 1)} type="number" min="1" className="w-16 h-8 rounded-lg text-xs" />
                  </div>
                  {d.duration !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <label className="text-[10px] text-muted-foreground">Duration:</label>
                      <select value={d.duration} onChange={e => setDeliverables(prev => prev.map((dd, i) => i === idx ? { ...dd, duration: e.target.value } : dd))} className="h-8 px-2 rounded-lg bg-secondary text-foreground text-xs border border-border">
                        <option>15s</option><option>30s</option><option>60s</option><option>90s</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ),
      valid: deliverables.some(d => d.enabled),
    },
    {
      title: "Content Guidelines",
      subtitle: "Set Do's and Don'ts for creators",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-heading font-medium text-emerald-600 mb-1.5 block flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Do's</label>
            <textarea value={dos} onChange={e => setDos(e.target.value)} rows={4} className="w-full px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-foreground text-sm border border-emerald-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none" placeholder="One guideline per line" />
          </div>
          <div>
            <label className="text-xs font-heading font-medium text-destructive mb-1.5 block flex items-center gap-1"><Ban className="w-3.5 h-3.5" /> Don'ts</label>
            <textarea value={donts} onChange={e => setDonts(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/20 text-foreground text-sm border border-red-200 dark:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 resize-none" placeholder="One guideline per line" />
          </div>
          <div className="border border-dashed border-border rounded-xl p-4 text-center">
            <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs font-heading font-medium text-foreground">Upload Brand Assets</p>
            <p className="text-[10px] text-muted-foreground">Product images, logos, videos for creators</p>
          </div>
        </div>
      ),
      valid: true,
    },
    {
      title: "Review & Preview",
      subtitle: "Here's how creators will see your campaign",
      content: (
        <div className="space-y-4">
          <div className="border border-border rounded-2xl overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center">
              <Eye className="w-8 h-8 text-accent/50" />
            </div>
            <div className="p-4">
              <h3 className="font-heading font-bold text-base text-foreground">{title || "Campaign Title"}</h3>
              <p className="text-xs text-muted-foreground mt-1">{category || "Category"} · {campaignType || "Type"}</p>
              <div className="flex gap-2 mt-3">
                {!isBarter && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-medium">₹{budgetRange[0].toLocaleString()} — ₹{budgetRange[1].toLocaleString()}</span>}
                {isBarter && <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-medium">Barter</span>}
                <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-medium">{slotsTotal} slots</span>
              </div>
              {description && <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{description}</p>}
              <div className="mt-3 flex gap-1 flex-wrap">
                {deliverables.filter(d => d.enabled).map(d => (
                  <span key={d.type} className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-foreground">{d.type} x{d.quantity}</span>
                ))}
              </div>
              {niches.length > 0 && (
                <div className="mt-2 flex gap-1 flex-wrap">
                  {niches.map(n => <span key={n} className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[9px]">{n}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      valid: true,
    },
  ];

  const handlePublish = async (draft = false) => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("campaigns").insert({
        brand_user_id: user.id,
        title,
        description,
        campaign_type: campaignType.toLowerCase().replace(/ /g, "_"),
        required_platforms: platformOptions.filter((_, i) => i < 2), // default
        niche_targeting: niches,
        total_budget: isBarter ? "0" : String(budgetRange[1]),
        budget_per_creator: isBarter ? "0" : String(Math.round(budgetRange[1] / (parseInt(slotsTotal) || 5))),
        slots_total: parseInt(slotsTotal) || 5,
        end_date: endDate || null,
        status: draft ? "draft" : "active",
        is_barter: isBarter,
        barter_product_name: isBarter ? barterDesc.split(",")[0] : null,
        barter_product_description: isBarter ? barterDesc : null,
        follower_range: followerRange,
        location_targeting: cities,
      } as any);
      if (error) throw error;
      toast.success(draft ? "Campaign saved as draft" : "Campaign published!");
      navigate("/campaigns");
    } catch (e: any) {
      toast.error(e.message || "Failed to create campaign");
    }
    setLoading(false);
  };

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto flex flex-col">
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-accent" : "bg-secondary"}`} />
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Step {step + 1} of {steps.length}</p>
        </div>
      </div>

      <div className="flex-1 px-4 pt-5 pb-4 overflow-y-auto">
        <h1 className="text-xl font-heading font-bold text-foreground">{currentStep.title}</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-5">{currentStep.subtitle}</p>
        {currentStep.content}
      </div>

      <div className="px-4 pb-8 pt-4 flex gap-2">
        {isLastStep && (
          <Button variant="outline" className="flex-1 h-12 rounded-2xl font-heading" disabled={loading} onClick={() => handlePublish(true)}>
            Save Draft
          </Button>
        )}
        <Button className="flex-1 h-12 rounded-2xl font-heading bg-accent text-accent-foreground hover:bg-accent/90" disabled={!currentStep.valid || loading} onClick={() => isLastStep ? handlePublish(false) : setStep(s => s + 1)}>
          {isLastStep ? <>Publish Campaign <Sparkles className="w-4 h-4" /></> : <>Continue <ArrowRight className="w-4 h-4" /></>}
        </Button>
      </div>
    </div>
  );
};

export default CreateCampaign;
