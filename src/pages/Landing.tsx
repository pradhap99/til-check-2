import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, TrendingUp, Shield, CreditCard,
  ChevronDown, CheckCircle, BarChart3, Zap, Lock,
  IndianRupee, Target, Handshake, MessageCircle, Megaphone, UserPlus
} from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "How quickly do creators get paid?", a: "Instant UPI transfers with zero platform fee. Bank transfers process within 1–2 business days. Standard payment split: 50% on acceptance, 50% on deliverable approval." },
  { q: "How does GST & TDS compliance work?", a: "GST registration is optional but recommended for ₹40L+ earners. All invoices auto-generate with GSTIN fields. TDS is computed automatically for payments exceeding ₹30,000." },
  { q: "What does TIL charge?", a: "A transparent 10% service fee on successful collaborations. No subscription fees, no hidden charges. Creators keep 90%+ of every rupee." },
  { q: "How are disputes resolved?", a: "Payments are held in escrow with a 7-day dispute window post-publication. Our mediation team reviews all evidence within 3–5 business days." },
  { q: "Which platforms are supported?", a: "Instagram (Reels, Stories, Feed), YouTube (Shorts, Videos), TikTok, and Twitter/X. Full cross-platform analytics included." },
];

import { TOP_CATEGORIES } from "@/data/experienceCategories";

const experienceCategories = TOP_CATEGORIES.map(c => ({
  label: c.label,
  img: c.img || "",
}));

// Plain feature lines shown where the stats band used to be. No numbers, no claims about scale.
const highlights = [
  { icon: IndianRupee, label: "Campaigns with a stated budget" },
  { icon: CheckCircle, label: "Content approval built in" },
  { icon: MessageCircle, label: "One inbox for every collaboration" },
];

// "How it works" copy for the section that replaced "By the numbers".
const howItWorks = [
  { label: "For Creators", items: [
    { icon: IndianRupee, label: "Set up a profile with your own rates" },
    { icon: Target, label: "Apply to campaigns that fit you" },
    { icon: MessageCircle, label: "Talk to brands in one inbox" },
  ]},
  { label: "For Brands", items: [
    { icon: Megaphone, label: "Post a campaign with a budget" },
    { icon: UserPlus, label: "Invite creators who fit" },
    { icon: CheckCircle, label: "Approve content before it goes live" },
  ]},
];

const Landing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [audience, setAudience] = useState<"creator" | "brand">("creator");

  const creatorHero = {
    title: <>Where brands<br /><span className="gradient-text">meet creators</span></>,
    subtitle: "Performance-based collaborations with instant UPI payments, built-in content approval, and GST-compliant invoicing.",
    cta: "Join as Creator",
    ctaSecondary: "I'm a Brand",
  };
  const brandHero = {
    title: <>Find creators<br /><span className="gradient-text">for your brand</span></>,
    subtitle: "AI-powered creator matching, secure escrow payments, real-time analytics, and end-to-end campaign management.",
    cta: "Get Started as Brand",
    ctaSecondary: "I'm a Creator",
  };
  const hero = audience === "creator" ? creatorHero : brandHero;

  const brandFeatures = [
    { icon: Target, title: "AI-Powered Matching", desc: "Algorithm matches your brand with ideal creators by niche, audience, and engagement." },
    { icon: Lock, title: "Secure Escrow", desc: "Payments held safely until deliverables approved. 7-day dispute window." },
    { icon: BarChart3, title: "Real-Time Analytics", desc: "Track reach, engagement, CPE, and ROI across all campaigns." },
    { icon: Handshake, title: "End-to-End Management", desc: "From brief to payment. Content approval, revisions, invoicing — all in one place." },
  ];

  return (
    <div className="min-h-screen bg-background noise-overlay relative overflow-x-hidden">
      {/* Glowing background ambient orbs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-accent/15 blur-[120px] rounded-full pointer-events-none -z-10 animate-drift-orb" />
      <div className="absolute top-80 right-10 w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-5 py-3.5 flex items-center justify-between max-w-5xl mx-auto glass-nav transition-all">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center shadow-md">
            <span className="text-background font-heading font-bold text-sm">T</span>
          </div>
          <span className="font-heading font-bold text-foreground text-xl tracking-tight">TIL</span>
        </div>
        <div className="flex gap-2.5 items-center">
          <Link to="/auth"><Button size="sm" variant="ghost" className="text-xs font-medium h-9 px-4 btn-micro hover:bg-secondary">Log in</Button></Link>
          <Link to="/auth"><Button size="sm" className="text-xs font-medium h-9 px-4 btn-micro btn-shimmer-hover bg-foreground text-background hover:bg-foreground/90 shadow-md">Get Started</Button></Link>
        </div>
      </nav>

      {/* Audience Toggle */}
      <div className="flex justify-center mt-6">
        <div className="inline-flex bg-secondary/80 backdrop-blur-md border border-border/60 rounded-full p-1.5 gap-1.5 shadow-inner">
          <button onClick={() => setAudience("creator")} className={`px-5 py-1.5 rounded-full text-xs font-heading font-bold transition-all duration-300 ${audience === "creator" ? "bg-foreground text-background shadow-md scale-105" : "text-muted-foreground hover:text-foreground"}`}>For Creators</button>
          <button onClick={() => setAudience("brand")} className={`px-5 py-1.5 rounded-full text-xs font-heading font-bold transition-all duration-300 ${audience === "brand" ? "bg-foreground text-background shadow-md scale-105" : "text-muted-foreground hover:text-foreground"}`}>For Brands</button>
        </div>
      </div>

      {/* Hero */}
      <section className="px-5 pt-12 pb-16 max-w-3xl mx-auto text-center relative dot-grid-bg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-medium mb-6 animate-fade-up">
          <Zap className="w-3 h-3" /> Built for Indian creators and brands
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-extrabold leading-[1.08] tracking-tight animate-fade-up" style={{ animationDelay: "100ms" }}>
          {hero.title}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg mt-5 max-w-xl mx-auto leading-relaxed opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
          {hero.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <Link to="/auth"><Button size="lg" className="font-medium w-full sm:w-auto h-12 px-8 text-sm btn-micro">{hero.cta} <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
          <Link to="/auth"><Button size="lg" variant="outline" className="font-medium w-full sm:w-auto h-12 px-8 text-sm btn-micro" onClick={() => setAudience(audience === "creator" ? "brand" : "creator")}>{hero.ctaSecondary}</Button></Link>
        </div>
        <p className="text-xs text-muted-foreground mt-4">Free to join · No credit card required</p>
      </section>

      {/* Dark highlights bar (plain feature lines, no numbers) */}
      <section className="px-5 max-w-4xl mx-auto">
        <div className="bg-foreground rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((h, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2 opacity-0 animate-count-up" style={{ animationDelay: `${i * 150}ms`, animationFillMode: "forwards" }}>
              <h.icon className="w-5 h-5 text-primary-foreground/60" />
              <p className="font-heading font-semibold text-sm text-primary-foreground">{h.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand-specific features */}
      {audience === "brand" && (
        <section className="px-5 mt-16 max-w-4xl mx-auto">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">Why TIL</p>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-center text-foreground tracking-tight mb-10">Everything your brand needs</h2>
          <div className="grid grid-cols-2 gap-3">
            {brandFeatures.map((f, i) => (
              <div key={i} className="border border-border rounded-xl p-5 hover-lift-lg transition-all group">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                  <f.icon className="w-4 h-4 text-accent" />
                </div>
                <p className="font-heading font-semibold text-sm text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Explore by Experience */}
      <section className="px-5 mt-20 max-w-4xl mx-auto">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">Browse</p>
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-center text-foreground tracking-tight">
          Browse by what you love {audience === "brand" ? "promoting" : "creating"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
          {experienceCategories.map((cat, i) => (
            <Link to="/auth" key={i} className="relative rounded-xl overflow-hidden aspect-[4/3] group hover-lift">
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <p className="absolute bottom-3 left-3 text-xs font-heading font-semibold text-white">{cat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works (two columns) */}
      <section className="px-5 mt-20 max-w-4xl mx-auto">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">Get started</p>
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-center text-foreground tracking-tight mb-10">How it works</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {howItWorks.map((col) => (
            <div key={col.label} className="border border-border rounded-xl p-6">
              <p className="text-xs font-heading font-semibold text-accent uppercase tracking-widest mb-4">{col.label}</p>
              <div className="space-y-3.5">
                {col.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center"><item.icon className="w-4 h-4 text-accent" /></div>
                    <span className="text-sm text-foreground font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento grid features */}
      <section className="px-5 mt-20 max-w-4xl mx-auto">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">Platform</p>
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-center text-foreground tracking-tight">Everything you need, nothing you don't</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-10">
          {[
            { icon: BarChart3, title: "Smart Matching", desc: "Algorithm-driven creator-brand matching based on niche, engagement, and audience.", span: "md:col-span-2" },
            { icon: CreditCard, title: "Instant UPI", desc: "Zero-fee UPI transfers with GST-compliant invoices.", span: "" },
            { icon: Shield, title: "Escrow Protection", desc: "Secure payments with 7-day dispute window.", span: "" },
            { icon: CheckCircle, title: "Verified Profiles", desc: "API-verified metrics. No inflated numbers.", span: "" },
            { icon: TrendingUp, title: "Performance Analytics", desc: "Track ROI, CPE, reach, and sales attribution in real time.", span: "" },
            { icon: Lock, title: "Content Approval", desc: "Built-in review workflow with version history and revision tracking.", span: "md:col-span-2" },
          ].map((feature, i) => (
            <div key={i} className={`border border-border rounded-xl p-5 hover-lift-lg transition-all group ${feature.span}`}>
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center mb-3 group-hover:bg-accent/10 transition-colors">
                <feature.icon className="w-4 h-4 text-foreground group-hover:text-accent transition-colors" />
              </div>
              <p className="font-heading font-semibold text-sm text-foreground">{feature.title}</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 mt-20 max-w-4xl mx-auto">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">Step by step</p>
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-center text-foreground tracking-tight">From signup to payout in four steps</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-10">
          {[
            { label: "For Creators", steps: [
              { step: "01", title: "Build your profile", desc: "Connect social accounts, set niche & rate card" },
              { step: "02", title: "Discover campaigns", desc: "AI-matched brand deals by niche, budget, location" },
              { step: "03", title: "Deliver content", desc: "Submit work for brand review through built-in tools" },
              { step: "04", title: "Get paid via UPI", desc: "Instant payments, zero fee, GST-ready invoices" },
            ]},
            { label: "For Brands", steps: [
              { step: "01", title: "Post a campaign", desc: "Define budget, deliverables, and target audience" },
              { step: "02", title: "Review applications", desc: "Sort by match score, engagement rate, reach" },
              { step: "03", title: "Approve content", desc: "Review submissions with version tracking" },
              { step: "04", title: "Track ROI", desc: "Real-time analytics on reach, engagement, sales" },
            ]},
          ].map((section, si) => (
            <div key={si} className="border border-border rounded-xl p-6 hover-lift">
              <p className="text-xs font-medium text-accent uppercase tracking-widest mb-4">{section.label}</p>
              <div className="space-y-5">
                {section.steps.map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <span className="text-[10px] font-heading font-bold text-muted-foreground mt-1 w-5 shrink-0">{item.step}</span>
                    <div>
                      <p className="font-heading font-semibold text-sm text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 mt-20 max-w-2xl mx-auto">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">FAQ</p>
        <h2 className="font-heading font-bold text-2xl text-center text-foreground tracking-tight mb-8">Common questions</h2>
        <div className="space-y-1">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-lg overflow-hidden hover-lift">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                <span className="font-medium text-sm text-foreground pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 animate-fade-up">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 mt-20 max-w-4xl mx-auto">
        <div className="bg-foreground rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-2xl md:text-4xl font-heading font-bold text-background tracking-tight relative z-10">Start growing today</h2>
          <p className="text-background/60 text-sm mt-3 max-w-md mx-auto relative z-10">
            Set up your profile or post your first campaign, and keep every collaboration in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 relative z-10">
            <Link to="/auth">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90 font-medium h-12 px-8 btn-micro">
                Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 mt-16 pb-10 max-w-4xl mx-auto border-t border-border pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center">
              <span className="text-background font-heading font-bold text-[10px]">T</span>
            </div>
            <span className="font-heading font-semibold text-sm text-foreground">TIL</span>
            <span className="text-xs text-muted-foreground ml-1">India's Creator Marketplace</span>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
        <p className="text-center text-[11px] text-muted-foreground mt-6">© 2026 TIL. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
