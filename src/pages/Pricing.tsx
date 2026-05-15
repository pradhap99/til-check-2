import { ArrowLeft, CheckCircle, X, Sparkles, ArrowRight, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Pay-per-campaign. Perfect for getting started.",
    badge: null,
    features: [
      { label: "5% platform fee per campaign", included: true },
      { label: "3 active campaigns max", included: true },
      { label: "Basic analytics", included: true },
      { label: "Standard support (24-48hr)", included: true },
      { label: "Manual creator search", included: true },
      { label: "AI creator matching", included: false },
      { label: "Campaign templates", included: false },
      { label: "Priority support", included: false },
      { label: "Dedicated account manager", included: false },
    ],
    cta: "Current Plan",
    ctaVariant: "outline" as const,
    highlight: false,
  },
  {
    name: "Starter",
    price: "₹9,999",
    period: "/month",
    annualPrice: "₹99,990/year (save 2 months)",
    description: "For small brands & D2C startups scaling their creator marketing.",
    badge: null,
    features: [
      { label: "3% platform fee (save 2%)", included: true },
      { label: "10 active campaigns", included: true },
      { label: "Advanced analytics & ROI tracking", included: true },
      { label: "Priority support (12hr response)", included: true },
      { label: "AI-powered creator recommendations", included: true },
      { label: "Campaign templates library", included: true },
      { label: "Basic escrow (7-day window)", included: true },
      { label: "Bulk messaging (up to 50)", included: true },
      { label: "Dedicated account manager", included: false },
    ],
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
    highlight: false,
  },
  {
    name: "Growth",
    price: "₹29,999",
    period: "/month",
    annualPrice: "₹2,99,990/year (save 2 months)",
    description: "For growing brands running multiple campaigns simultaneously.",
    badge: "Most Popular",
    features: [
      { label: "2% platform fee (save 3%)", included: true },
      { label: "Unlimited active campaigns", included: true },
      { label: "Real-time analytics dashboard", included: true },
      { label: "Priority support (4hr response)", included: true },
      { label: "Advanced AI matching + recommendations", included: true },
      { label: "Custom campaign templates", included: true },
      { label: "Express escrow (3-day window)", included: true },
      { label: "Unlimited bulk messaging", included: true },
      { label: "Team seats (up to 5)", included: true },
      { label: "Competitor campaign insights", included: true },
      { label: "API access", included: true },
    ],
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large brands & agencies with custom requirements.",
    badge: null,
    features: [
      { label: "Custom platform fee", included: true },
      { label: "Everything in Growth", included: true },
      { label: "Dedicated account manager", included: true },
      { label: "Custom integrations (API, webhooks)", included: true },
      { label: "White-label reports", included: true },
      { label: "SLA guarantees", included: true },
      { label: "Onboarding & training", included: true },
      { label: "Invoice-based billing", included: true },
      { label: "Multi-brand management", included: true },
    ],
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
    highlight: false,
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto pb-8">
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} aria-label="Back" className="size-11 -ml-1 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-heading font-bold text-foreground">Plans & Pricing</h1>
      </div>

      {/* Hero */}
      <div className="px-5 pt-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
          <Crown className="w-6 h-6 text-accent" />
        </div>
        <h2 className="text-xl font-heading font-extrabold text-foreground">Scale Your Creator Marketing</h2>
        <p className="text-sm text-muted-foreground mt-2">Choose the plan that fits your brand's growth stage.</p>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center mt-5">
        <div className="inline-flex bg-secondary rounded-full p-1 gap-1">
          <button onClick={() => setBilling("monthly")} className={`min-h-11 px-5 py-2 rounded-full text-xs font-heading font-semibold transition-all ${billing === "monthly" ? "bg-foreground text-background" : "text-muted-foreground"}`}>Monthly</button>
          <button onClick={() => setBilling("annual")} className={`min-h-11 px-5 py-2 rounded-full text-xs font-heading font-semibold transition-all ${billing === "annual" ? "bg-foreground text-background" : "text-muted-foreground"}`}>
            Annual <span className="text-emerald-500 text-[9px]">Save 17%</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="px-5 mt-6 space-y-4">
        {plans.map((plan, i) => (
          <div key={i} className={`border rounded-2xl p-5 relative ${plan.highlight ? "border-accent bg-accent/5" : "border-border"}`}>
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-heading font-bold">
                {plan.badge}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-heading font-extrabold text-foreground">{plan.price}</span>
              <span className="text-xs text-muted-foreground">{plan.period}</span>
            </div>
            <h3 className="font-heading font-bold text-base text-foreground mt-1">{plan.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
            {plan.annualPrice && billing === "annual" && (
              <p className="text-[10px] text-emerald-600 font-medium mt-1">{plan.annualPrice}</p>
            )}

            <div className="mt-4 space-y-2">
              {plan.features.map((f, j) => (
                <div key={j} className="flex items-start gap-2">
                  {f.included ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-muted-foreground/30 mt-0.5 shrink-0" />
                  )}
                  <span className={`text-xs ${f.included ? "text-foreground" : "text-muted-foreground/50"}`}>{f.label}</span>
                </div>
              ))}
            </div>

            <Button
              className="w-full mt-4 h-11 rounded-xl font-heading text-sm"
              variant={plan.ctaVariant}
              onClick={() => {
                if (plan.name === "Enterprise") navigate("/support");
              }}
            >
              {plan.cta} {plan.ctaVariant === "default" && <ArrowRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="px-5 mt-8">
        <h3 className="font-heading font-bold text-sm text-foreground mb-3">Common Questions</h3>
        <div className="space-y-2">
          {[
            { q: "Can I switch plans anytime?", a: "Yes, upgrade or downgrade anytime. Changes take effect in the next billing cycle." },
            { q: "Is there a free trial?", a: "Yes, Starter and Growth plans include a 14-day free trial. No credit card required." },
            { q: "What happens if I exceed campaign limits?", a: "You'll be prompted to upgrade. Existing campaigns continue to run." },
          ].map((faq, i) => (
            <div key={i} className="border border-border rounded-xl p-3">
              <p className="text-xs font-heading font-semibold text-foreground">{faq.q}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
