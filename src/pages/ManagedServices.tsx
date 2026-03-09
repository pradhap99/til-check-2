import { useState } from "react";
import { ArrowLeft, CheckCircle, Sparkles, Send, Star, Shield, Users, Calendar, Banknote, MapPin, Mic, Camera, Building2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Layout from "@/components/Layout";

const tiers = [
  {
    name: "Essentials",
    price: "₹49,999/mo",
    popular: false,
    color: "border-border",
    timeline: "2-3 weeks",
    description: "Campaign strategy + creator matching + content review.",
    features: [
      "Campaign strategy & brief creation",
      "Creator shortlisting (5-10 best matches)",
      "Contract management",
      "Payment & escrow handling",
      "Basic performance report",
    ],
    youDo: "Approve creators, Review content",
  },
  {
    name: "Full Management",
    price: "₹99,999/mo",
    popular: true,
    color: "border-accent",
    timeline: "3-4 weeks",
    description: "Everything in Essentials + campaign execution + reporting dashboard + dedicated account manager.",
    features: [
      "Everything in Essentials",
      "We select & approve creators (final veto)",
      "Content review & approval",
      "Revision management",
      "Crisis management & brand safety",
      "Detailed performance analytics",
      "Monthly reporting call",
      "Dedicated account manager",
    ],
    youDo: "Brief us → Approve final content → Results",
  },
  {
    name: "Complete Digital Marketing",
    price: "₹1,99,999/mo",
    popular: false,
    color: "border-border",
    timeline: "Ongoing",
    description: "Everything + paid media boost + brand social management + monthly analytics call + PR support.",
    features: [
      "Everything in Full Management",
      "3-5 monthly multi-creator campaigns",
      "Social media management",
      "Paid ads management (IG/FB/Google)",
      "Content calendar planning",
      "Competitor analysis",
      "ROI tracking & attribution",
      "Quarterly strategy sessions",
      "PR support",
    ],
    youDo: "Sit back and watch your brand grow",
  },
];

const upcomingEvents = [
  { name: "Chennai Creator Summit", date: "Apr 15, 2026", spots: 120, price: "₹999", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop", type: "Creator Meet-up" },
  { name: "Mumbai Brand Activation Day", date: "Apr 28, 2026", spots: 50, price: "Free", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=200&fit=crop", type: "Brand Activation" },
  { name: "Bangalore Content Day with boAt", date: "May 3, 2026", spots: 30, price: "₹1,499", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=200&fit=crop", type: "Content Creation" },
];

const ManagedServices = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedTier, setSelectedTier] = useState("");
  const [activeSection, setActiveSection] = useState<"services" | "events" | "advance">("services");
  const [formData, setFormData] = useState({ objective: "", audience: "", budget: "", timeline: "", requirements: "", brandName: "", contact: "" });
  const [eligFollowers, setEligFollowers] = useState("");
  const [eligCampaigns, setEligCampaigns] = useState("");
  const [eligProfile, setEligProfile] = useState("");

  const handleSubmit = () => {
    toast.success("Request submitted! Our team will reach out within 24 hours.");
    setShowForm(false);
  };

  const checkEligibility = () => {
    const f = parseInt(eligFollowers) || 0;
    const c = parseInt(eligCampaigns) || 0;
    const p = parseInt(eligProfile) || 0;
    if (f >= 50000 && c >= 3 && p >= 70) {
      toast.success("🎉 You're eligible! Apply for a cash advance on your next accepted campaign.");
    } else {
      const reasons: string[] = [];
      if (f < 50000) reasons.push("50K+ followers needed");
      if (c < 3) reasons.push("3+ completed campaigns needed");
      if (p < 70) reasons.push("70%+ profile strength needed");
      toast.error(`Not eligible yet: ${reasons.join(", ")}`);
    }
  };

  return (
    <Layout>
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-heading font-bold text-foreground">TIL Managed</h1>
      </div>

      {/* Section Tabs */}
      <div className="px-4 mt-4 flex gap-1.5">
        {([
          { id: "services" as const, label: "Services", icon: Sparkles },
          { id: "events" as const, label: "Events", icon: Calendar },
          { id: "advance" as const, label: "Cash Advance", icon: Banknote },
        ]).map(t => (
          <button key={t.id} onClick={() => setActiveSection(t.id)} className={`flex-1 py-2 rounded-xl text-[10px] font-heading font-semibold flex items-center justify-center gap-1 transition-all ${activeSection === t.id ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
            <t.icon className="w-3 h-3" /> {t.label}
          </button>
        ))}
      </div>

      {/* SERVICES SECTION */}
      {activeSection === "services" && (
        <>
          <div className="px-5 pt-5 pb-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-xl font-heading font-extrabold text-foreground">We Run It For You</h2>
            <p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto">From strategy to execution. Perfect for brands without in-house marketing teams.</p>
          </div>

          <div className="px-4 flex gap-2 justify-center mb-4">
            {[
              { icon: Users, label: "500+ Campaigns" },
              { icon: Star, label: "4.8★ Rating" },
              { icon: Shield, label: "Brand Safe" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-[9px] font-medium text-muted-foreground">
                <b.icon className="w-2.5 h-2.5" /> {b.label}
              </div>
            ))}
          </div>

          <div className="px-4 space-y-3 pb-4">
            {tiers.map((tier, i) => (
              <div key={i} className={`border ${tier.color} rounded-2xl p-4 relative ${tier.popular ? "bg-accent/5" : ""}`}>
                {tier.popular && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-accent text-accent-foreground text-[9px] font-heading font-bold">Most Popular</span>}
                <h3 className="font-heading font-bold text-sm text-foreground">{tier.name}</h3>
                <p className="text-sm font-heading font-semibold text-accent mt-0.5">{tier.price}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{tier.description}</p>
                <div className="mt-3 space-y-1.5">
                  {tier.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-[11px] text-foreground">{f}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 px-3 py-2 rounded-lg bg-secondary">
                  <p className="text-[9px] text-muted-foreground">You just:</p>
                  <p className="text-[11px] font-medium text-foreground">{tier.youDo}</p>
                </div>
                <Button size="sm" className="mt-3 w-full h-9 text-xs" variant={tier.popular ? "default" : "outline"} onClick={() => { setSelectedTier(tier.name); setShowForm(true); }}>
                  Talk to our team →
                </Button>
              </div>
            ))}
          </div>

          {/* Comparison highlights */}
          <div className="px-4 pb-6">
            <h3 className="font-heading font-bold text-sm text-foreground mb-3">How It Works</h3>
            <div className="space-y-2.5">
              {[
                { step: "1", title: "Brief Us", desc: "Share your campaign goals, budget, and target audience" },
                { step: "2", title: "We Plan", desc: "Our team creates strategy and selects ideal creators" },
                { step: "3", title: "You Approve", desc: "Review recommendations and give the green light" },
                { step: "4", title: "We Execute", desc: "Campaign runs, content created and published" },
                { step: "5", title: "Get Results", desc: "Detailed analytics report with ROI breakdown" },
              ].map((s, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-heading font-bold text-accent">{s.step}</span>
                  </div>
                  <div>
                    <p className="text-xs font-heading font-semibold text-foreground">{s.title}</p>
                    <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* EVENTS SECTION */}
      {activeSection === "events" && (
        <div className="px-4 pt-5 pb-6 space-y-4">
          <div className="text-center mb-4">
            <h2 className="text-xl font-heading font-extrabold text-foreground">Creator Events & Activations</h2>
            <p className="text-xs text-muted-foreground mt-1">Networking, content creation days, and brand experiences</p>
          </div>

          {/* Event Types */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { emoji: "🎤", label: "Meet-ups" },
              { emoji: "🏢", label: "Activations" },
              { emoji: "📸", label: "Content Days" },
            ].map((t, i) => (
              <div key={i} className="border border-border rounded-xl p-3 text-center">
                <span className="text-xl">{t.emoji}</span>
                <p className="text-[10px] font-heading font-semibold text-foreground mt-1">{t.label}</p>
              </div>
            ))}
          </div>

          <p className="text-xs font-heading font-semibold text-foreground">Upcoming Events</p>
          {upcomingEvents.map((event, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden">
              <img src={event.image} alt={event.name} className="w-full h-32 object-cover" />
              <div className="p-4">
                <Badge className="text-[9px] border-0 bg-accent/10 text-accent mb-2">{event.type}</Badge>
                <p className="font-heading font-bold text-sm text-foreground">{event.name}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.spots} spots</span>
                  <span className="font-heading font-semibold text-accent">{event.price}</span>
                </div>
                <Button size="sm" className="mt-3 w-full h-9 text-xs rounded-xl">Register →</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATOR ADVANCE SECTION */}
      {activeSection === "advance" && (
        <div className="px-4 pt-5 pb-6 space-y-4">
          <div className="text-center mb-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
              <Banknote className="w-6 h-6 text-emerald-500" />
            </div>
            <h2 className="text-xl font-heading font-extrabold text-foreground">Creator Cash Advance</h2>
            <p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto">Get paid upfront for accepted campaigns before deliverables are complete.</p>
          </div>

          {/* How it works */}
          <div className="border border-border rounded-xl p-4 space-y-3">
            <p className="text-xs font-heading font-semibold text-foreground">How it works</p>
            {[
              { step: "1", icon: "✅", title: "Get accepted to a campaign" },
              { step: "2", icon: "📝", title: "Apply for advance (up to 50% of value)" },
              { step: "3", icon: "⏱️", title: "Approval in 24 hours (profile score based)" },
              { step: "4", icon: "💰", title: "Funds in your account, repaid from escrow" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg">{s.icon}</span>
                <p className="text-xs text-foreground">{s.title}</p>
              </div>
            ))}
          </div>

          {/* Eligibility */}
          <div className="border border-border rounded-xl p-4">
            <p className="text-xs font-heading font-semibold text-foreground mb-2">Eligibility Requirements</p>
            <div className="space-y-1.5">
              {[
                "Level 2+ creator",
                "3+ completed campaigns",
                "Profile strength 70%+",
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span className="text-xs text-foreground">{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility Checker */}
          <div className="border border-accent rounded-xl p-4">
            <p className="text-xs font-heading font-semibold text-foreground mb-3">Check My Eligibility</p>
            <div className="space-y-2.5">
              <div>
                <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Total Followers</label>
                <Input value={eligFollowers} onChange={e => setEligFollowers(e.target.value)} placeholder="e.g. 75000" type="number" className="h-9 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Completed Campaigns</label>
                <Input value={eligCampaigns} onChange={e => setEligCampaigns(e.target.value)} placeholder="e.g. 5" type="number" className="h-9 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Profile Strength (%)</label>
                <Input value={eligProfile} onChange={e => setEligProfile(e.target.value)} placeholder="e.g. 78" type="number" className="h-9 rounded-lg text-sm" />
              </div>
              <Button className="w-full h-10 rounded-xl text-xs font-heading" onClick={checkEligibility}>Check Eligibility</Button>
            </div>
          </div>

          <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-[10px] text-amber-700 dark:text-amber-400">This is a platform cash advance service, not a bank loan. Terms & conditions apply.</p>
          </div>
        </div>
      )}

      {/* Request Form Sheet */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-background w-full max-w-lg rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4" />
            <h3 className="font-heading font-bold text-base text-foreground">Request: {selectedTier}</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Brand Name</label>
                <Input value={formData.brandName} onChange={e => setFormData({ ...formData, brandName: e.target.value })} placeholder="Your brand name" className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Campaign Objective</label>
                <select value={formData.objective} onChange={e => setFormData({ ...formData, objective: e.target.value })} className="w-full h-10 px-3 rounded-xl bg-secondary text-foreground text-sm border border-border">
                  <option value="">Select objective</option>
                  <option>Brand Awareness</option>
                  <option>Sales & Conversions</option>
                  <option>Event Promotion</option>
                  <option>Product Launch</option>
                  <option>Content Creation</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Budget Range</label>
                <select value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} className="w-full h-10 px-3 rounded-xl bg-secondary text-foreground text-sm border border-border">
                  <option value="">Select range</option>
                  <option>₹25K - ₹50K</option>
                  <option>₹50K - ₹1L</option>
                  <option>₹1L - ₹3L</option>
                  <option>₹3L - ₹5L</option>
                  <option>₹5L+</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Contact Details</label>
                <Input value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} placeholder="Email or phone" className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Additional Requirements</label>
                <textarea value={formData.requirements} onChange={e => setFormData({ ...formData, requirements: e.target.value })} rows={3} placeholder="Campaign goals, preferred timeline..." className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm border border-border resize-none" />
              </div>
              <Button className="w-full h-12 rounded-2xl font-heading" onClick={handleSubmit}>
                <Send className="w-4 h-4 mr-2" /> Submit Request
              </Button>
              <p className="text-[10px] text-muted-foreground text-center">Our team will reach out within 24 hours.</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManagedServices;
