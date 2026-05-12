import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, TrendingUp, Users, Shield, CreditCard,
  ChevronDown, Star, CheckCircle, BarChart3, Zap, Lock,
  IndianRupee, Clock, Award, Target, Handshake, Sparkles, PlayCircle
} from "lucide-react";
import { useState } from "react";
import CountUp from "@/components/CountUp";
import ScrollReveal from "@/components/motion/ScrollReveal";
import Tilt3D from "@/components/motion/Tilt3D";
import ScrollProgress from "@/components/motion/ScrollProgress";
import MagneticButton from "@/components/motion/MagneticButton";
import { TOP_CATEGORIES } from "@/data/experienceCategories";

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
    title: <>Where brands meet<br /><span className="text-shimmer">India's best creators</span></>,
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
    title: <>Find India's top creators<br /><span className="text-shimmer">for your brand</span></>,
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
    <div className="min-h-screen bg-background noise-overlay scroll-smooth">
      <ScrollProgress />

      {/* Navbar */}
      <nav className="sticky top-0 z-40 px-5 py-3 backdrop-blur-xl bg-background/70 border-b border-border/40">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center transition-transform group-hover:rotate-[8deg] group-hover:scale-110">
              <span className="text-background font-heading font-bold text-xs">T</span>
            </div>
            <span className="font-heading font-bold text-foreground text-lg tracking-tight">TIL</span>
          </Link>
          <div className="flex gap-2">
            <Link to="/auth"><Button size="sm" variant="ghost" className="text-xs font-medium h-8 btn-micro">Log in</Button></Link>
            <Link to="/auth"><Button size="sm" className="text-xs font-medium h-8 btn-micro">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Audience Toggle */}
      <div className="flex justify-center mt-6">
        <div className="inline-flex bg-secondary rounded-full p-1 gap-1 shadow-sm">
          <button onClick={() => setAudience("creator")} className={`px-4 py-1.5 rounded-full text-xs font-heading font-semibold transition-all duration-300 ${audience === "creator" ? "bg-foreground text-background shadow-md scale-105" : "text-muted-foreground hover:text-foreground"}`}>For Creators</button>
          <button onClick={() => setAudience("brand")} className={`px-4 py-1.5 rounded-full text-xs font-heading font-semibold transition-all duration-300 ${audience === "brand" ? "bg-foreground text-background shadow-md scale-105" : "text-muted-foreground hover:text-foreground"}`}>For Brands</button>
        </div>
      </div>

      {/* Hero — cinematic 3D layered */}
      <section className="relative px-5 pt-10 pb-20 max-w-5xl mx-auto text-center overflow-hidden">
        {/* Aurora + orbs */}
        <div aria-hidden className="absolute inset-0 aurora-bg dot-grid-bg" />
        <div aria-hidden className="hero-orb w-72 h-72 -top-10 -left-16" style={{ background: "radial-gradient(circle, hsl(38 92% 55%), transparent 70%)" }} />
        <div aria-hidden className="hero-orb hero-orb-2 w-80 h-80 -top-20 -right-20" style={{ background: "radial-gradient(circle, hsl(280 80% 60%), transparent 70%)" }} />
        <div aria-hidden className="hero-orb hero-orb-3 w-64 h-64 bottom-0 left-1/3" style={{ background: "radial-gradient(circle, hsl(180 70% 50%), transparent 70%)" }} />

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 backdrop-blur text-muted-foreground text-xs font-medium mb-6 animate-fade-up chip-float border border-border/60">
            <Sparkles className="w-3 h-3 text-accent" /> India's #1 Creator-Brand Marketplace
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold leading-[1.05] tracking-tight animate-fade-up" style={{ animationDelay: "100ms" }}>
            {hero.title}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mt-5 max-w-xl mx-auto leading-relaxed opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
            {hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
            <MagneticButton>
              <Link to="/auth">
                <Button size="lg" className="cta-glow font-medium w-full sm:w-auto h-12 px-8 text-sm btn-micro rounded-full">
                  {hero.cta} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.25}>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="font-medium w-full sm:w-auto h-12 px-8 text-sm btn-micro rounded-full gap-1.5" onClick={() => setAudience(audience === "creator" ? "brand" : "creator")}>
                  <PlayCircle className="w-4 h-4" /> {hero.ctaSecondary}
                </Button>
              </Link>
            </MagneticButton>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Free to join · No credit card required</p>

          {/* Floating 3D preview cards */}
          <div className="relative mt-14 hidden md:block perspective-1200">
            <div className="relative h-72 w-full">
              {/* Center hero card */}
              <Tilt3D max={12} scale={1.03} className="absolute left-1/2 top-0 -translate-x-1/2 w-80 rounded-2xl bg-card border border-border shadow-2xl p-5 text-left">
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-heading font-semibold text-sm">Priya Sharma</p>
                    <p className="text-[11px] text-muted-foreground">Fashion · 1.2M</p>
                  </div>
                  <span className="ml-auto text-[10px] font-heading px-2 py-0.5 rounded-full bg-success/15 text-success">Accepted</span>
                </div>
                <div className="mt-4 rounded-lg overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=200&fit=crop" alt="" className="w-full h-32 object-cover" />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] text-muted-foreground">Lenskart · Reel × 5</span>
                  <span className="font-heading font-bold text-sm">₹85,000</span>
                </div>
              </Tilt3D>

              {/* Left floating card */}
              <div className="absolute left-0 top-8 w-56 rounded-2xl bg-card border border-border shadow-xl p-4 text-left animate-float-up" style={{ transform: "rotate(-6deg)" }}>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Live earnings</p>
                <p className="font-heading font-bold text-2xl mt-1">
                  ₹<CountUp end={12450} duration={2400} />
                </p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-success font-medium">
                  <TrendingUp className="w-3 h-3" /> +24% this week
                </div>
                <div className="mt-3 flex gap-1">
                  {[8, 14, 11, 18, 22, 16, 26].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-accent/30" style={{ height: `${h * 1.2}px` }} />
                  ))}
                </div>
              </div>

              {/* Right floating card */}
              <div className="absolute right-0 top-16 w-56 rounded-2xl bg-foreground text-background border border-border shadow-2xl p-4 text-left animate-float-up" style={{ animationDelay: "1.5s", transform: "rotate(5deg)" }}>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent" />
                  <p className="font-heading font-semibold text-sm">Payment Secured</p>
                </div>
                <p className="text-[11px] text-background/60 mt-1">Held in escrow until approval</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-background/60">boAt Campaign</span>
                  <span className="font-heading font-bold text-base">₹1.2L</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-background/15 overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: "70%" }} />
                </div>
                <p className="text-[10px] text-background/50 mt-1.5">2 of 3 deliverables approved</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Social Proof */}
      {audience === "brand" && (
        <ScrollReveal className="px-5 max-w-4xl mx-auto mb-8" variant="up">
          <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest mb-4">Trusted by leading brands</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {brandLogos.map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary border border-border hover:scale-110 transition-transform duration-300">
                  <img src={b.img} alt={b.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[9px] text-muted-foreground font-medium">{b.name}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Dark stats bar with 3D tilt */}
      <section className="px-5 max-w-4xl mx-auto">
        <ScrollReveal variant="scale" duration={900}>
          <Tilt3D max={5} scale={1.01} className="rounded-2xl">
            <div className="bg-foreground rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 relative overflow-hidden">
              <div aria-hidden className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-accent/15 blur-3xl" />
              {hero.stats.map((stat, i) => (
                <div key={i} className="text-center relative" style={{ transform: `translateZ(${20 + i * 4}px)` }}>
                  <p className="font-heading font-bold text-2xl md:text-3xl text-primary-foreground">
                    <CountUp end={stat.value} duration={2000} prefix={stat.prefix} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-primary-foreground/50 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </Tilt3D>
        </ScrollReveal>
      </section>

      {/* Brand-specific features */}
      {audience === "brand" && (
        <section className="px-5 mt-20 max-w-4xl mx-auto">
          <ScrollReveal>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">Why TIL</p>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-center text-foreground tracking-tight mb-10">Everything your brand needs</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 gap-3 perspective-1200">
            {brandFeatures.map((f, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <Tilt3D max={8} className="h-full">
                  <div className="card-3d border border-border rounded-xl p-5 bg-card h-full">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                      <f.icon className="w-4 h-4 text-accent" />
                    </div>
                    <p className="font-heading font-semibold text-sm text-foreground">{f.title}</p>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{f.desc}</p>
                  </div>
                </Tilt3D>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* Explore by Experience */}
      <section className="px-5 mt-24 max-w-4xl mx-auto">
        <ScrollReveal>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">Browse</p>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-center text-foreground tracking-tight">
            Browse by what you love {audience === "brand" ? "promoting" : "creating"}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 perspective-1200">
          {experienceCategories.map((cat, i) => (
            <ScrollReveal key={i} delay={i * 60} variant="up">
              <Tilt3D max={10} scale={1.04}>
                <Link to="/auth" className="relative rounded-xl overflow-hidden aspect-[4/3] group block">
                  <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
                    <p className="text-xs font-heading font-semibold text-white">{cat.label}</p>
                    <ArrowRight className="w-3.5 h-3.5 text-white translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </Tilt3D>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* By the Numbers */}
      <section className="px-5 mt-24 max-w-4xl mx-auto">
        <ScrollReveal>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">Impact</p>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-center text-foreground tracking-tight mb-10">By the numbers</h2>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: "For Creators", items: [
              { icon: IndianRupee, label: "Avg ₹45,000/campaign" },
              { icon: Clock, label: "3-day payment turnaround" },
              { icon: Award, label: "58% acceptance rate" },
              { icon: Target, label: "1,200+ active campaigns" },
            ]},
            { label: "For Brands", items: [
              { icon: TrendingUp, label: "8.2% avg engagement" },
              { icon: BarChart3, label: "3X better ROI" },
              { icon: CheckCircle, label: "800+ verified brands" },
              { icon: Users, label: "12,400+ creators" },
            ]},
          ].map((col, ci) => (
            <ScrollReveal key={ci} delay={ci * 120} variant={ci === 0 ? "left" : "right"}>
              <Tilt3D max={6}>
                <div className="card-3d border border-border rounded-xl p-6 bg-card">
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
              </Tilt3D>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* As Featured In */}
      <ScrollReveal className="px-5 mt-20 max-w-4xl mx-auto text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-4">As featured in</p>
        <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
          {["YourStory", "Inc42", "Economic Times", "The Ken", "Entrackr"].map((name, i) => (
            <span key={i} className="text-sm font-heading font-semibold text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-default">{name}</span>
          ))}
        </div>
      </ScrollReveal>

      {/* Bento grid features */}
      <section className="px-5 mt-24 max-w-4xl mx-auto">
        <ScrollReveal>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">Platform</p>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-center text-foreground tracking-tight">Everything you need, nothing you don't</h2>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-10 perspective-1200">
          {[
            { icon: BarChart3, title: "Smart Matching", desc: "Algorithm-driven creator-brand matching based on niche, engagement, and audience.", span: "md:col-span-2" },
            { icon: CreditCard, title: "Instant UPI", desc: "Zero-fee UPI transfers with GST-compliant invoices.", span: "" },
            { icon: Shield, title: "Escrow Protection", desc: "Secure payments with 7-day dispute window.", span: "" },
            { icon: CheckCircle, title: "Verified Profiles", desc: "API-verified metrics. No inflated numbers.", span: "" },
            { icon: TrendingUp, title: "Performance Analytics", desc: "Track ROI, CPE, reach, and sales attribution in real time.", span: "" },
            { icon: Lock, title: "Content Approval", desc: "Built-in review workflow with version history and revision tracking.", span: "md:col-span-2" },
          ].map((feature, i) => (
            <ScrollReveal key={i} delay={i * 60} variant="up" className={feature.span}>
              <Tilt3D max={9} scale={1.02}>
                <div className="card-3d border border-border rounded-xl p-5 bg-card h-full group">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center mb-3 group-hover:bg-accent/10 transition-colors">
                    <feature.icon className="w-4 h-4 text-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <p className="font-heading font-semibold text-sm text-foreground">{feature.title}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{feature.desc}</p>
                </div>
              </Tilt3D>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 mt-24 max-w-4xl mx-auto">
        <ScrollReveal>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">How it works</p>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-center text-foreground tracking-tight">From signup to payout in four steps</h2>
        </ScrollReveal>
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
            <ScrollReveal key={si} delay={si * 120} variant={si === 0 ? "left" : "right"}>
              <div className="card-3d border border-border rounded-xl p-6 bg-card hover-lift">
                <p className="text-xs font-medium text-accent uppercase tracking-widest mb-4">{section.label}</p>
                <div className="space-y-5">
                  {section.steps.map((item) => (
                    <div key={item.step} className="flex items-start gap-4 group">
                      <span className="text-[10px] font-heading font-bold text-muted-foreground mt-1 w-5 shrink-0 group-hover:text-accent transition-colors">{item.step}</span>
                      <div>
                        <p className="font-heading font-semibold text-sm text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Testimonials — 3D marquee */}
      <section className="mt-24 max-w-full overflow-hidden">
        <ScrollReveal>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2 px-5">Testimonials</p>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-center text-foreground tracking-tight px-5">Trusted by 12,000+ creators & 800+ brands</h2>
        </ScrollReveal>
        <div className="mt-10 marquee-3d">
          <div className="marquee-3d-track flex gap-4 animate-scroll-x" style={{ width: "max-content" }}>
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="w-[300px] shrink-0 border border-border rounded-xl p-5 bg-card card-3d hover-lift">
                <div className="flex items-center gap-3 mb-4">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover bg-secondary" />
                  <div>
                    <p className="font-heading font-semibold text-sm text-foreground">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{t.quote}"</p>
                <div className="flex gap-0.5 mt-3">
                  {[...Array(5)].map((_, s) => <Star key={s} className="w-3 h-3 text-accent fill-accent" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 mt-24 max-w-2xl mx-auto">
        <ScrollReveal>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">FAQ</p>
          <h2 className="font-heading font-bold text-2xl text-center text-foreground tracking-tight mb-8">Common questions</h2>
        </ScrollReveal>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 60}>
              <div className={`border border-border rounded-xl overflow-hidden bg-card transition-all duration-300 ${openFaq === i ? "shadow-md" : ""}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left group">
                  <span className="font-medium text-sm text-foreground pr-4 group-hover:text-accent transition-colors">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-accent" : ""}`} />
                </button>
                <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: openFaq === i ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <p className="text-sm text-muted-foreground leading-relaxed px-4 pb-4">{faq.a}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 mt-24 max-w-4xl mx-auto">
        <ScrollReveal variant="scale">
          <Tilt3D max={4} scale={1.005}>
            <div className="bg-foreground rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
              <div aria-hidden className="absolute top-0 right-0 w-72 h-72 rounded-full bg-accent/20 blur-3xl -translate-y-1/2 translate-x-1/2 animate-drift-orb" />
              <div aria-hidden className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-info/15 blur-3xl translate-y-1/2 -translate-x-1/2 animate-drift-orb" style={{ animationDelay: "-4s" }} />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/10 backdrop-blur text-background/80 text-xs font-medium mb-6 border border-background/15">
                <Zap className="w-3 h-3 text-accent" /> Limited beta · Early access
              </div>
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-background tracking-tight relative z-10">Start growing today</h2>
              <p className="text-background/60 text-sm mt-3 max-w-md mx-auto relative z-10">
                Join 12,000+ creators and 800+ brands already using TIL to power their influencer marketing.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 relative z-10">
                <MagneticButton>
                  <Link to="/auth">
                    <Button size="lg" className="bg-background text-foreground hover:bg-background/90 font-medium h-12 px-8 btn-micro rounded-full">
                      Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </Tilt3D>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="px-5 mt-20 pb-10 max-w-4xl mx-auto border-t border-border pt-8">
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
