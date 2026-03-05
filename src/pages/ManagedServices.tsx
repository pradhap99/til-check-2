import { useState } from "react";
import { ArrowLeft, CheckCircle, Sparkles, Send, Star, Shield, BarChart3, Users, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const tiers = [
  {
    name: "Campaign Essentials",
    price: "₹25,000 setup + 15% of budget",
    popular: false,
    color: "border-border",
    timeline: "2-3 weeks",
    description: "Perfect for brands who want help with creator selection and management.",
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
    name: "Full Campaign Management",
    price: "₹50,000 setup + 20% of budget",
    popular: true,
    color: "border-accent",
    timeline: "3-4 weeks",
    description: "We handle everything end-to-end. You just approve the final content.",
    features: [
      "Everything in Essentials",
      "We select & approve creators (you get final veto)",
      "Content review & approval",
      "Revision management",
      "Crisis management & brand safety",
      "Detailed performance analytics",
      "Monthly reporting call",
    ],
    youDo: "Brief us → Approve final content → Results",
  },
  {
    name: "Complete Digital Marketing",
    price: "₹1,50,000/month (3-month min)",
    popular: false,
    color: "border-border",
    timeline: "Ongoing",
    description: "Complete hands-off marketing solution with dedicated account manager.",
    features: [
      "Everything in Full Management",
      "3-5 monthly multi-creator campaigns",
      "Social media management",
      "Paid ads management (IG/FB/Google)",
      "Content calendar planning",
      "Competitor analysis",
      "ROI tracking & attribution",
      "Quarterly strategy sessions",
      "Dedicated account manager",
    ],
    youDo: "Sit back and watch your brand grow",
  },
];

const ManagedServices = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedTier, setSelectedTier] = useState("");
  const [formData, setFormData] = useState({ objective: "", audience: "", budget: "", timeline: "", requirements: "" });

  const handleSubmit = () => {
    toast.success("Request submitted! Our team will reach out within 24 hours.");
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-heading font-bold text-foreground">TIL Managed</h1>
      </div>

      {/* Hero */}
      <div className="px-5 pt-6 pb-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7 text-accent" />
        </div>
        <h2 className="text-2xl font-heading font-extrabold text-foreground leading-tight">Let Us Handle<br />Everything</h2>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-sm mx-auto">
          From strategy to execution, we'll manage your entire influencer campaign. Perfect for brands without in-house marketing teams.
        </p>
      </div>

      {/* Trust badges */}
      <div className="px-5 flex gap-3 justify-center mb-6">
        {[
          { icon: Users, label: "500+ Campaigns" },
          { icon: Star, label: "4.8★ Rating" },
          { icon: Shield, label: "Brand Safe" },
        ].map((b, i) => (
          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-[10px] font-medium text-muted-foreground">
            <b.icon className="w-3 h-3" /> {b.label}
          </div>
        ))}
      </div>

      {/* Tiers */}
      <div className="px-5 space-y-4 pb-6">
        {tiers.map((tier, i) => (
          <div key={i} className={`border ${tier.color} rounded-2xl p-5 relative ${tier.popular ? "bg-accent/5" : ""}`}>
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-heading font-bold">
                Most Popular
              </span>
            )}
            <h3 className="font-heading font-bold text-base text-foreground">{tier.name}</h3>
            <p className="text-sm font-heading font-semibold text-accent mt-1">{tier.price}</p>
            <p className="text-xs text-muted-foreground mt-2">{tier.description}</p>

            <div className="mt-4 space-y-2">
              {tier.features.map((f, j) => (
                <div key={j} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-foreground">{f}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 px-3 py-2 rounded-lg bg-secondary">
              <p className="text-[10px] text-muted-foreground">You just:</p>
              <p className="text-xs font-medium text-foreground">{tier.youDo}</p>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-muted-foreground">Timeline: {tier.timeline}</span>
              <Button
                size="sm"
                className="h-8 text-xs"
                variant={tier.popular ? "default" : "outline"}
                onClick={() => { setSelectedTier(tier.name); setShowForm(true); }}
              >
                {tier.name === "Complete Digital Marketing" ? "Schedule Consultation" : "Get Started"} →
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="px-5 pb-6">
        <h3 className="font-heading font-bold text-sm text-foreground mb-3">How It Works</h3>
        <div className="space-y-3">
          {[
            { step: "1", title: "Brief Us", desc: "Tell us your campaign goals, budget, and target audience" },
            { step: "2", title: "We Plan", desc: "Our team creates strategy and selects ideal creators" },
            { step: "3", title: "You Approve", desc: "Review our recommendations and give the green light" },
            { step: "4", title: "We Execute", desc: "Campaign runs, content gets created and published" },
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

      {/* Request Form Sheet */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-background w-full max-w-lg rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4" />
            <h3 className="font-heading font-bold text-base text-foreground">Request: {selectedTier}</h3>
            <div className="mt-4 space-y-3">
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
                <label className="text-xs font-medium text-foreground mb-1 block">Target Audience</label>
                <Input value={formData.audience} onChange={e => setFormData({ ...formData, audience: e.target.value })} placeholder="e.g. Women 18-34, Mumbai, interested in fashion" className="rounded-xl" />
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
                <label className="text-xs font-medium text-foreground mb-1 block">Timeline</label>
                <select value={formData.timeline} onChange={e => setFormData({ ...formData, timeline: e.target.value })} className="w-full h-10 px-3 rounded-xl bg-secondary text-foreground text-sm border border-border">
                  <option value="">Select timeline</option>
                  <option>ASAP (1-2 weeks)</option>
                  <option>2-4 weeks</option>
                  <option>1-2 months</option>
                  <option>Ongoing</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Additional Requirements</label>
                <textarea value={formData.requirements} onChange={e => setFormData({ ...formData, requirements: e.target.value })} rows={3} placeholder="Any specific requirements, brand guidelines, etc." className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm border border-border resize-none" />
              </div>
              <Button className="w-full h-12 rounded-2xl font-heading" onClick={handleSubmit}>
                <Send className="w-4 h-4 mr-2" /> Submit Request
              </Button>
              <p className="text-[10px] text-muted-foreground text-center">Our team will reach out within 24 hours with a customized proposal.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagedServices;
