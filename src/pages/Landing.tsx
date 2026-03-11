import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, TrendingUp, Users, Shield, CreditCard,
  ChevronDown, Star, CheckCircle, BarChart3, Zap, Lock, Globe,
  IndianRupee, Clock, Award, Target, Search, Handshake, Eye
} from "lucide-react";
import { useState } from "react";
import CountUp from "@/components/CountUp";

const faqs = [
  { q: "How quickly do creators get paid?", a: "Instant UPI transfers with zero platform fee. Bank transfers process within 1–2 business days. Standard payment split: 50% on acceptance, 50% on deliverable approval." },
  { q: "How does GST & TDS compliance work?", a: "GST registration is optional but recommended for ₹40L+ earners. All invoices auto-generate with GSTIN fields. TDS is computed automatically for payments exceeding ₹30,000." },
  { q: "What does TIL charge?", a: "A transparent 10% service fee on successful collaborations. No subscription fees, no hidden charges. Creators keep 90%+ of every rupee." },
  { q: "How are disputes resolved?", a: "Payments are held in escrow with a 7-day dispute window post-publication. Our mediation team reviews all evidence within 3–5 business days." },
  { q: "Which platforms are supported?", a: "Instagram (Reels, Stories, Feed), YouTube (Shorts, Videos), TikTok, and Twitter/X. Full cross-platform analytics included." },
];

const testimonials = [
  { name: "Priya Sharma", role: "Fashion · 1.2M followers", quote: "Delivered 5 Reels for Lenskart with 2.3M total impressions. Brand partnership renewed for next season!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" },
  { name: "boAt Audio", role: "D2C Electronics", quote: "8.2% average engagement across 15 creators. 3X better ROI than traditional advertising.", avatar: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop" },
  { name: "Vikram Singh", role: "Food · 2.1M followers", quote: "Created 12 restaurant review videos reaching 4.5M viewers. Got 3 long-term brand partnerships.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
  { name: "Neha Kapoor", role: "Fitness · 650K followers", quote: "Completed 8 campaigns in 3 months. 1.8M impressions across platforms. Renewed 3 brand deals.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" },
  { name: "Lenskart", role: "Eyewear Brand", quote: "Managed 15 creator campaigns simultaneously. Content quality exceeded expectations. 5M+ reach.", avatar: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=80&h=80&fit=crop" },
  { name: "Kavya Nair", role: "Beauty · 780K followers", quote: "10 Reels, 25 Stories, 3 brand deals renewed. Escrow protection gives complete peace of mind.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face" },
];

import { TOP_CATEGORIES } from "@/data/experienceCategories";

const experienceCategories = TOP_CATEGORIES.map(c => ({
  label: c.label,
  img: c.img || "",
}));

const brandLogos = [
  { name: "boAt", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop" },
  { name: "Mamaearth", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=60&h=60&fit=crop" },
  { name: "Lenskart", img: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=60&h=60&fit=crop" },
  { name: "Sugar", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=60&h=60&fit=crop" },
  { name: "CRED", img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=60&h=60&fit=crop" },
];

const Landing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [audience, setAudience] = useState<"creator" | "brand">("creator");

  const creatorHero = {
    title: <>Where brands meet<br /><span className="gradient-text">India's best creators</span></>,
    subtitle: "Performance-based collaborations with instant UPI payments, built-in content approval, and GST-compliant invoicing.",
    cta: "Join as Creator",
    ctaSecondary: "I'm a Brand",
    stats: [
      { label: "Verified Creators", value: 12400, suffix: "+" },
      { label: "Campaigns Delivered", value: 8200, suffix: "+" },
      { label: "Avg Engagement Rate", value: 58, suffix: "%" },
      { label: "Paid to Creators", value: 25, prefix: "₹", suffix: "Cr+" },
    ],
  };
  const brandHero = {
    title: <>Find India's top creators<br /><span className="gradient-text">for your brand</span></>,
    subtitle: "AI-powered creator matching, secure escrow payments, real-time analytics, and end-to-end campaign management.",
    cta: "Get Started as Brand",
    ctaSecondary: "I'm a Creator",
    stats: [
      { label: "Verified Creators", value: 26000, suffix: "+" },
      { label: "Industries Covered", value: 12, suffix: "" },
      { label: "Paid to Creators", value: 25, prefix: "₹", suffix: "Cr+" },
      { label: "Verified Brands", value: 800, suffix: "+" },
    ],
  };
  const hero = audience === "creator" ? creatorHero : brandHero;

  const brandFeatures = [
    { icon: Target, title: "AI-Powered Matching", desc: "Algorithm matches your brand with ideal creators by niche, audience, and engagement." },
    { icon: Lock, title: "Secure Escrow", desc: "Payments held safely until deliverables approved. 7-day dispute window." },
    { icon: BarChart3, title: "Real-Time Analytics", desc: "Track reach, engagement, CPE, and ROI across all campaigns." },
    { icon: Handshake, title: "End-to-End Management", desc: "From brief to payment. Content approval, revisions, invoicing — all in one place." },
  ];

  return (
    <div className="min-h-screen bg-background noise-overlay">
      {/* Navbar */}
      <nav className="px-5 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
            <span className="text-background font-heading font-bold text-xs">T</span>
          </div>
          <span className="font-heading font-bold text-foreground text-lg tracking-tight">TIL</span>
        </div>
        <div className="flex gap-2">
          <Link to="/auth"><Button size="sm" variant="ghost" className="text-xs font-medium h-8 btn-micro">Log in</Button></Link>
          <Link to="/auth"><Button size="sm" className="text-xs font-medium h-8 btn-micro">Get Started</Button></Link>
        </div>
      </nav>

      {/* Audience Toggle */}
      <div className="flex justify-center mt-4">
        <div className="inline-flex bg-secondary rounded-full p-1 gap-1">
          <button onClick={() => setAudience("creator")} className={`px-4 py-1.5 rounded-full text-xs font-heading font-semibold transition-all ${audience === "creator" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground"}`}>For Creators</button>
          <button onClick={() => setAudience("brand")} className={`px-4 py-1.5 rounded-full text-xs font-heading font-semibold transition-all ${audience === "brand" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground"}`}>For Brands</button>
        </div>
      </div>

      {/* Hero */}
      <section className="px-5 pt-10 pb-16 max-w-3xl mx-auto text-center relative dot-grid-bg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-medium mb-6 animate-fade-up">
          <Zap className="w-3 h-3" /> India's #1 Creator-Brand Marketplace
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

      {/* Brand Social Proof */}
      {audience === "brand" && (
        <section className="px-5 max-w-4xl mx-auto mb-8">
          <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest mb-4">Trusted by leading brands</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {brandLogos.map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary border border-border">
                  <img src={b.img} alt={b.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[9px] text-muted-foreground font-medium">{b.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dark stats bar */}
      <section className="px-5 max-w-4xl mx-auto">
        <div className="bg-foreground rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {hero.stats.map((stat, i) => (
            <div key={i} className="text-center opacity-0 animate-count-up" style={{ animationDelay: `${i * 150}ms`, animationFillMode: "forwards" }}>
              <p className="font-heading font-bold text-2xl text-primary-foreground">
                <CountUp end={stat.value} duration={2000} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-primary-foreground/50 mt-0.5">{stat.label}</p>
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

      {/* By the Numbers */}
      <section className="px-5 mt-20 max-w-4xl mx-auto">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">Impact</p>
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-center text-foreground tracking-tight mb-10">By the numbers</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-border rounded-xl p-6">
            <p className="text-xs font-heading font-semibold text-accent uppercase tracking-widest mb-4">For Creators</p>
            <div className="space-y-3.5">
              {[
                { icon: IndianRupee, label: "Avg ₹45,000/campaign" },
                { icon: Clock, label: "3-day payment turnaround" },
                { icon: Award, label: "58% acceptance rate" },
                { icon: Target, label: "1,200+ active campaigns" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center"><item.icon className="w-4 h-4 text-accent" /></div>
                  <span className="text-sm text-foreground font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-border rounded-xl p-6">
            <p className="text-xs font-heading font-semibold text-accent uppercase tracking-widest mb-4">For Brands</p>
            <div className="space-y-3.5">
              {[
                { icon: TrendingUp, label: "8.2% avg engagement" },
                { icon: BarChart3, label: "3X better ROI" },
                { icon: CheckCircle, label: "800+ verified brands" },
                { icon: Users, label: "12,400+ creators" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center"><item.icon className="w-4 h-4 text-accent" /></div>
                  <span className="text-sm text-foreground font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* As Featured In */}
      <section className="px-5 mt-16 max-w-4xl mx-auto text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-4">As featured in</p>
        <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
          {["YourStory", "Inc42", "Economic Times", "The Ken", "Entrackr"].map((name, i) => (
            <span key={i} className="text-sm font-heading font-semibold text-muted-foreground/40">{name}</span>
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
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">How it works</p>
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

      {/* Testimonials */}
      <section className="mt-20 max-w-full overflow-hidden">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2 px-5">Testimonials</p>
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-center text-foreground tracking-tight px-5">Trusted by 12,000+ creators & 800+ brands</h2>
        <div className="mt-10 overflow-hidden">
          <div className="flex gap-4 animate-scroll-x" style={{ width: "max-content" }}>
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="w-[300px] shrink-0 border border-border rounded-xl p-5 hover-lift">
                <div className="flex items-center gap-3 mb-4">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover bg-secondary" />
                  <div>
                    <p className="font-heading font-semibold text-sm text-foreground">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{t.quote}"</p>
                <div className="flex gap-0.5 mt-3">
                  {[...Array(5)].map((_, s) => <Star key={s} className="w-3 h-3 text-foreground fill-foreground" />)}
                </div>
              </div>
            ))}
          </div>
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
            Join 12,000+ creators and 800+ brands already using TIL to power their influencer marketing.
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
