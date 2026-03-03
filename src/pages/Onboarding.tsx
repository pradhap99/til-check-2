import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ArrowLeft, CheckCircle, Instagram, Youtube } from "lucide-react";
import { toast } from "sonner";

const niches = ["Fashion", "Tech", "Fitness", "Food", "Travel", "Gaming", "Beauty", "Lifestyle", "Finance", "Comedy", "Education", "Health"];
const contentFormats = ["Reels", "Stories", "YouTube Videos", "Shorts", "Tweets", "Blog Posts", "Podcasts", "Live Streams"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune", "Chennai", "Kolkata", "Jaipur", "Goa", "Kochi", "Lucknow", "Ahmedabad"];

const CreatorOnboarding = () => {
  const { user } = useAuth();
  const { refresh } = useOnboarding();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [primaryNiche, setPrimaryNiche] = useState("");
  const [secondaryNiches, setSecondaryNiches] = useState<string[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [instagramHandle, setInstagramHandle] = useState("");
  const [youtubeChannel, setYoutubeChannel] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");

  const toggleSecondary = (n: string) => setSecondaryNiches(prev => prev.includes(n) ? prev.filter(x => x !== n) : prev.length < 3 ? [...prev, n] : prev);
  const toggleFormat = (f: string) => setFormats(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const steps = [
    {
      title: "What's your niche?",
      subtitle: "Pick your primary content category",
      content: (
        <div className="grid grid-cols-3 gap-2">
          {niches.map(n => (
            <button key={n} onClick={() => setPrimaryNiche(n)} className={`p-3 rounded-2xl text-xs font-heading font-medium transition-all ${primaryNiche === n ? "gradient-primary text-primary-foreground shadow-md scale-105" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
              {n}
            </button>
          ))}
        </div>
      ),
      valid: !!primaryNiche,
    },
    {
      title: "Secondary niches",
      subtitle: "Pick up to 3 more (optional)",
      content: (
        <div className="grid grid-cols-3 gap-2">
          {niches.filter(n => n !== primaryNiche).map(n => (
            <button key={n} onClick={() => toggleSecondary(n)} className={`p-3 rounded-2xl text-xs font-heading font-medium transition-all ${secondaryNiches.includes(n) ? "border-2 border-primary bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
              {n}
            </button>
          ))}
        </div>
      ),
      valid: true,
    },
    {
      title: "Content formats",
      subtitle: "What kind of content do you create?",
      content: (
        <div className="grid grid-cols-2 gap-2">
          {contentFormats.map(f => (
            <button key={f} onClick={() => toggleFormat(f)} className={`p-3 rounded-2xl text-xs font-heading font-medium transition-all ${formats.includes(f) ? "gradient-primary text-primary-foreground shadow-md" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
              {f}
            </button>
          ))}
        </div>
      ),
      valid: formats.length > 0,
    },
    {
      title: "Social handles",
      subtitle: "Connect your platforms",
      content: (
        <div className="space-y-3">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Instagram className="w-4 h-4 text-accent" />
              <span className="text-xs font-heading font-medium text-card-foreground">Instagram</span>
            </div>
            <input placeholder="@yourhandle" value={instagramHandle} onChange={e => setInstagramHandle(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Youtube className="w-4 h-4 text-destructive" />
              <span className="text-xs font-heading font-medium text-card-foreground">YouTube (optional)</span>
            </div>
            <input placeholder="Channel URL" value={youtubeChannel} onChange={e => setYoutubeChannel(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
      ),
      valid: !!instagramHandle,
    },
    {
      title: "Almost done!",
      subtitle: "Tell us where you're based & a short bio",
      content: (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">City</label>
            <div className="grid grid-cols-3 gap-2">
              {cities.map(c => (
                <button key={c} onClick={() => setCity(c)} className={`p-2.5 rounded-xl text-xs font-heading font-medium transition-all ${city === c ? "gradient-primary text-primary-foreground shadow-md" : "bg-secondary text-secondary-foreground"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Bio</label>
            <textarea placeholder="A short intro about yourself..." value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
        </div>
      ),
      valid: !!city,
    },
  ];

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await supabase.from("creator_profiles").upsert({
        user_id: user.id,
        primary_niche: primaryNiche,
        secondary_niches: secondaryNiches,
        content_formats: formats,
        instagram_handle: instagramHandle,
        youtube_channel: youtubeChannel,
        onboarding_completed: true,
        onboarding_step: 5,
      });
      await supabase.from("profiles").update({
        location_city: city,
        bio,
      }).eq("user_id", user.id);
      toast.success("Welcome aboard! 🎉");
      refresh();
      navigate("/home");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto flex flex-col">
      <div className="px-4 pt-5">
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "gradient-primary" : "bg-secondary"}`} />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 font-heading">Step {step + 1} of {steps.length}</p>
      </div>

      <div className="flex-1 px-4 pt-6">
        <h1 className="text-xl font-heading font-bold text-foreground">{currentStep.title}</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-5">{currentStep.subtitle}</p>
        {currentStep.content}
      </div>

      <div className="px-4 pb-8 pt-4 flex gap-2.5">
        {step > 0 && (
          <Button variant="outline" className="h-12 rounded-2xl px-5" onClick={() => setStep(s => s - 1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <Button variant="gradient" className="flex-1 h-12 rounded-2xl font-heading" disabled={!currentStep.valid || loading} onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : handleComplete()}>
          {step < steps.length - 1 ? <>Continue <ArrowRight className="w-4 h-4" /></> : <>Complete Setup <CheckCircle className="w-4 h-4" /></>}
        </Button>
      </div>
    </div>
  );
};

const BrandOnboarding = () => {
  const { user } = useAuth();
  const { refresh } = useOnboarding();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [campaignTypes, setCampaignTypes] = useState<string[]>([]);

  const industries = ["Fashion", "Tech", "Beauty", "Food & Beverage", "Finance", "Health", "Gaming", "Education", "Travel", "E-commerce"];
  const budgets = ["Under ₹1L/mo", "₹1-5L/mo", "₹5-15L/mo", "₹15L+/mo"];
  const types = ["Sponsored Posts", "Product Reviews", "Brand Ambassador", "Affiliate", "Event Coverage", "UGC"];

  const toggleType = (t: string) => setCampaignTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const steps = [
    {
      title: "About your brand",
      subtitle: "Tell us about your business",
      content: (
        <div className="space-y-3">
          <input placeholder="Business name" value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input placeholder="Website URL" value={website} onChange={e => setWebsite(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <textarea placeholder="Brief description of your brand..." value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
        </div>
      ),
      valid: !!businessName,
    },
    {
      title: "Your industry",
      subtitle: "Select your primary industry",
      content: (
        <div className="grid grid-cols-2 gap-2">
          {industries.map(ind => (
            <button key={ind} onClick={() => setIndustry(ind)} className={`p-3 rounded-2xl text-xs font-heading font-medium transition-all ${industry === ind ? "gradient-primary text-primary-foreground shadow-md" : "bg-secondary text-secondary-foreground"}`}>
              {ind}
            </button>
          ))}
        </div>
      ),
      valid: !!industry,
    },
    {
      title: "Campaign preferences",
      subtitle: "What types of campaigns do you run?",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {types.map(t => (
              <button key={t} onClick={() => toggleType(t)} className={`p-3 rounded-2xl text-xs font-heading font-medium transition-all ${campaignTypes.includes(t) ? "gradient-primary text-primary-foreground shadow-md" : "bg-secondary text-secondary-foreground"}`}>
                {t}
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Monthly Budget</label>
            <div className="grid grid-cols-2 gap-2">
              {budgets.map(b => (
                <button key={b} onClick={() => setBudget(b)} className={`p-3 rounded-2xl text-xs font-heading font-medium transition-all ${budget === b ? "border-2 border-primary bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
      valid: campaignTypes.length > 0,
    },
  ];

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await supabase.from("brand_profiles").upsert({
        user_id: user.id,
        business_name: businessName,
        industry,
        website_url: website,
        brand_description: description,
        monthly_budget: budget,
        preferred_campaign_types: campaignTypes,
        onboarding_completed: true,
        onboarding_step: 3,
      });
      toast.success("Your brand profile is set! 🚀");
      refresh();
      navigate("/home");
    } catch {
      toast.error("Something went wrong.");
    }
    setLoading(false);
  };

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto flex flex-col">
      <div className="px-4 pt-5">
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "gradient-primary" : "bg-secondary"}`} />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 font-heading">Step {step + 1} of {steps.length}</p>
      </div>

      <div className="flex-1 px-4 pt-6">
        <h1 className="text-xl font-heading font-bold text-foreground">{currentStep.title}</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-5">{currentStep.subtitle}</p>
        {currentStep.content}
      </div>

      <div className="px-4 pb-8 pt-4 flex gap-2.5">
        {step > 0 && (
          <Button variant="outline" className="h-12 rounded-2xl px-5" onClick={() => setStep(s => s - 1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <Button variant="gradient" className="flex-1 h-12 rounded-2xl font-heading" disabled={!currentStep.valid || loading} onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : handleComplete()}>
          {step < steps.length - 1 ? <>Continue <ArrowRight className="w-4 h-4" /></> : <>Launch Profile <CheckCircle className="w-4 h-4" /></>}
        </Button>
      </div>
    </div>
  );
};

const Onboarding = () => {
  const { role } = useAuth();
  return role === "brand" ? <BrandOnboarding /> : <CreatorOnboarding />;
};

export default Onboarding;
