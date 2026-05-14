import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, TrendingUp, Users, Shield, CreditCard,
  ChevronDown, Star, CheckCircle, BarChart3, Zap, Lock,
  IndianRupee, Clock, Award, Target, Handshake,
} from "lucide-react";
import { useState } from "react";
import CountUp from "@/components/CountUp";
import ScrollReveal from "@/components/motion/ScrollReveal";
import Tilt3D from "@/components/motion/Tilt3D";
import ScrollProgress from "@/components/motion/ScrollProgress";
import MagneticButton from "@/components/motion/MagneticButton";
import Pinned3DScene from "@/components/motion/Pinned3DScene";
import ParallaxLayer from "@/components/motion/ParallaxLayer";
import VelocityField from "@/components/motion/VelocityField";
import { useSceneProgress, mapRange, clamp } from "@/components/motion/SceneProgressContext";
import HeroSceneContent, { HeroSceneFallback } from "@/components/landing/HeroScene";
import HowItWorksSceneContent, { HowItWorksFallback } from "@/components/landing/HowItWorksScene";
import { TOP_CATEGORIES } from "@/data/experienceCategories";

const faqs = [
  { q: "How quickly do creators get paid?", a: "Instant UPI transfers with zero platform fee. Bank transfers process within 1–2 business days. Standard payment split: 50% on acceptance, 50% on deliverable approval." },
  { q: "How does GST & TDS compliance work?", a: "GST registration is optional but recommended for ₹40L+ earners. All invoices auto-generate with GSTIN fields. TDS is computed automatically for payments exceeding ₹30,000." },
  { q: "What does til. charge?", a: "A transparent 10% service fee on successful collaborations. No subscription fees, no hidden charges. Creators keep 90%+ of every rupee." },
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

const experienceCategories = TOP_CATEGORIES.map(c => ({ label: c.label, img: c.img || "" }));

const brandLogos = [
  { name: "boAt", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop" },
  { name: "Mamaearth", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=60&h=60&fit=crop" },
  { name: "Lenskart", img: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=60&h=60&fit=crop" },
  { name: "Sugar", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=60&h=60&fit=crop" },
  { name: "CRED", img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=60&h=60&fit=crop" },
];

const howItWorksCols = [
  { label: "For Creators", steps: [
    { step: "01", title: "Build your profile", desc: "Connect social accounts, set your niche and rate card. Verified metrics, instant credibility." },
    { step: "02", title: "Discover campaigns", desc: "AI-matched brand deals filtered by niche, budget and location. No more cold pitching." },
    { step: "03", title: "Deliver content", desc: "Submit work for brand review through built-in tools. Version tracking and revision history baked in." },
    { step: "04", title: "Get paid via UPI", desc: "Instant payments on approval, zero fee, GST-ready invoices generated automatically." },
  ]},
  { label: "For Brands", steps: [
    { step: "01", title: "Post a campaign", desc: "Define budget, deliverables, and target audience in under 5 minutes." },
    { step: "02", title: "Review applications", desc: "Sort by AI match score, engagement rate, and reach. See verified portfolios." },
    { step: "03", title: "Approve content", desc: "Review submissions with version tracking. Comment, request revisions, approve in one click." },
    { step: "04", title: "Track ROI", desc: "Real-time analytics on reach, engagement, CPE, and sales attribution across platforms." },
  ]},
];

// Inner content of the CTA pinned outro
const CTAOutroContent = () => {
  const { progress: p } = useSceneProgress();
  const cardZ = mapRange(p, 0, 1, -120, 80);
  const cardScale = 0.92 + clamp(mapRange(p, 0, 0.6, 0, 1)) * 0.1;
  const cardOpacity = clamp(mapRange(p, 0, 0.4, 0, 1));
  const orbScale = 1 + p * 0.6;

  return (
    <div className="absolute inset-0 flex items-center justify-center px-5">
      <div aria-hidden className="absolute -top-10 -right-10 w-96 h-96 rounded-full bg-accent/20 blur-3xl" style={{ transform: `scale(${orbScale})` }} />
      <div aria-hidden className="absolute -bottom-10 -left-10 w-96 h-96 rounded-full bg-info/15 blur-3xl" style={{ transform: `scale(${orbScale})` }} />
      <div
        className="w-full max-w-4xl"
        style={{ transform: `translateZ(${cardZ}px) scale(${cardScale})`, opacity: cardOpacity, willChange: "transform, opacity" }}
      >
        <div className="bg-foreground rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-elev-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/10 backdrop-blur text-background/80 text-xs font-medium mb-6 border border-background/15">
            <Zap className="w-3 h-3 text-accent" /> Limited beta · Early access
          </div>
          <h2 className="text-2xl md:text-4xl font-heading font-bold text-background tracking-tight">Start growing today</h2>
          <p className="text-background/60 text-sm mt-3 max-w-md mx-auto">
            A Chennai-first marketplace where brands meet creators. Apply for early access.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <MagneticButton>
              <Link to="/auth">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90 font-medium h-12 px-8 btn-micro rounded-full">
                  Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const Landing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [audience, setAudience] = useState<"creator" | "brand">("creator");

  const creatorHero = {
    title: <>Where brands meet<br /><span className="text-shimmer">Chennai's people</span></>,
    subtitle: "Programmable escrow, KPI-verified payouts, and curated briefs — built for Chennai's creator economy.",
    cta: "Apply as Creator",
    ctaSecondary: "I'm a Brand",
    stats: [
      { label: "City", value: "Chennai" },
      { label: "Model", value: "Invite-only" },
      { label: "Escrow", value: "Programmable" },
      { label: "Payout", value: "KPI-verified" },
    ],
  };
  const brandHero = {
    title: <>Find Chennai's top creators<br /><span className="text-shimmer">for your brand</span></>,
    subtitle: "Verified Chennai creators, pre-built campaign templates, and escrow that releases on KPI.",
    cta: "Apply as Brand",
    ctaSecondary: "I'm a Creator",
    stats: [
      { label: "City", value: "Chennai" },
      { label: "Tiers", value: "Single / 5-pack / 20-cast" },
      { label: "Escrow", value: "Razorpay Route" },
      { label: "Verification", value: "IG Graph API" },
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
      <VelocityField selector=".velocity-orb" />

      {/* Sticky nav */}
      <nav className="sticky top-0 z-40 px-5 py-3 backdrop-blur-xl bg-background/70 border-b border-border/40">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center transition-transform group-hover:rotate-[8deg] group-hover:scale-110">
              <span className="text-background font-heading font-bold text-xs">T</span>
            </div>
            <img src="/logo.svg" alt="til." className="h-7" />
          </Link>
          <div className="flex gap-2">
            <Link to="/auth"><Button size="sm" variant="ghost" className="text-xs font-medium h-8 btn-micro">Log in</Button></Link>
            <Link to="/auth"><Button size="sm" className="text-xs font-medium h-8 btn-micro">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO PINNED SCENE (desktop) + flat fallback (mobile) ===== */}
      <HeroSceneFallback
        audience={audience}
        setAudience={setAudience}
        title={hero.title}
        subtitle={hero.subtitle}
        cta={hero.cta}
        ctaSecondary={hero.ctaSecondary}
        stats={hero.stats}
      />
      <div className="hidden md:block">
        <Pinned3DScene height="260vh">
          <HeroSceneContent
            audience={audience}
            setAudience={setAudience}
            title={hero.title}
            subtitle={hero.subtitle}
            cta={hero.cta}
            ctaSecondary={hero.ctaSecondary}
            stats={hero.stats}
          />
        </Pinned3DScene>
      </div>

      {/* Brand Social Proof */}
      {audience === "brand" && (
        <ScrollReveal className="px-5 max-w-4xl mx-auto mt-12 md:mt-4 mb-8" variant="up">
          <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest mb-4">Trusted by leading brands</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {brandLogos.map((b, i) => (
              <ParallaxLayer key={i} depth={-0.3 + (i % 3) * 0.2}>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary border border-border hover:scale-110 transition-transform duration-300">
                    <img src={b.img} alt={b.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[9px] text-muted-foreground font-medium">{b.name}</span>
                </div>
              </ParallaxLayer>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Brand features */}
      {audience === "brand" && (
        <section className="px-5 mt-16 max-w-4xl mx-auto">
          <ScrollReveal>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">Why til.</p>
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

      {/* Browse categories — z-staggered parallax tiles */}
      <section className="px-5 mt-20 md:mt-24 max-w-4xl mx-auto">
        <ScrollReveal>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">Browse</p>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-center text-foreground tracking-tight">
            Browse by what you love {audience === "brand" ? "promoting" : "creating"}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 perspective-1200">
          {experienceCategories.map((cat, i) => (
            <ParallaxLayer key={i} depth={-0.3 + (i % 4) * 0.15}>
              <ScrollReveal delay={i * 50} variant="up">
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
            </ParallaxLayer>
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
              { icon: IndianRupee, label: "Transparent rate cards" },
              { icon: Clock, label: "Auto-release on KPI" },
              { icon: Award, label: "Verified Chennai badge" },
              { icon: Target, label: "Pre-vetted brand briefs" },
            ]},
            { label: "For Brands", items: [
              { icon: TrendingUp, label: "Verified Chennai creators" },
              { icon: BarChart3, label: "Programmable escrow" },
              { icon: CheckCircle, label: "Pre-vetted briefs" },
              { icon: Users, label: "Curated, not crowded" },
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

      {/* Featured in */}
      <ScrollReveal className="px-5 mt-20 max-w-4xl mx-auto text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-4">As featured in</p>
        <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
          {["YourStory", "Inc42", "Economic Times", "The Ken", "Entrackr"].map((name, i) => (
            <span key={i} className="text-sm font-heading font-semibold text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-default">{name}</span>
          ))}
        </div>
      </ScrollReveal>

      {/* Bento features */}
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

      {/* ===== HOW IT WORKS PINNED SCENE (desktop) + flat fallback (mobile) ===== */}
      <div className="mt-24">
        <div className="md:hidden">
          <HowItWorksFallback cols={howItWorksCols} />
        </div>
        <div className="hidden md:block">
          <Pinned3DScene height="480vh">
            <HowItWorksSceneContent cols={howItWorksCols} />
          </Pinned3DScene>
        </div>
      </div>

      {/* Testimonials — depth-layered 3D marquee */}
      <section className="mt-24 max-w-full overflow-hidden">
        <ScrollReveal>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2 px-5">Testimonials</p>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-center text-foreground tracking-tight px-5">What Chennai creators say</h2>
        </ScrollReveal>
        <div className="mt-10 marquee-3d relative">
          {/* Back row — receded depth, slower, reverse */}
          <div
            className="flex gap-4 animate-scroll-x absolute left-0 right-0 top-1/2 -translate-y-1/2"
            style={{
              width: "max-content",
              animationDuration: "55s",
              animationDirection: "reverse",
              transform: "translateY(-50%) translateZ(-180px) scale(0.85)",
              opacity: 0.55,
            }}
            aria-hidden
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={`back-${i}`} className="w-[300px] shrink-0 border border-border rounded-xl p-5 bg-card card-3d">
                <div className="flex items-center gap-3 mb-4">
                  <img src={t.avatar} alt="" className="w-10 h-10 rounded-full object-cover bg-secondary" />
                  <div>
                    <p className="font-heading font-semibold text-sm text-foreground">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">"{t.quote}"</p>
              </div>
            ))}
          </div>

          {/* Front row */}
          <div className="marquee-3d-track flex gap-4 animate-scroll-x relative" style={{ width: "max-content" }}>
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
              <div className={`border border-border rounded-xl overflow-hidden bg-card transition-all duration-300 ${openFaq === i ? "shadow-elev-2" : ""}`}>
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

      {/* ===== CTA PINNED OUTRO ===== */}
      <div className="mt-24">
        <div className="md:hidden">
          <section className="px-5 max-w-4xl mx-auto">
            <div className="bg-foreground rounded-3xl p-10 text-center relative overflow-hidden">
              <h2 className="text-2xl font-heading font-bold text-background tracking-tight">Start growing today</h2>
              <p className="text-background/60 text-sm mt-3">
                A curated Chennai marketplace — early access.
              </p>
              <div className="mt-6">
                <Link to="/auth">
                  <Button size="lg" className="bg-background text-foreground hover:bg-background/90 h-12 px-8 rounded-full">
                    Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
        <div className="hidden md:block">
          <Pinned3DScene height="180vh">
            <CTAOutroContent />
          </Pinned3DScene>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-5 mt-12 pb-10 max-w-4xl mx-auto border-t border-border pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center">
              <span className="text-background font-heading font-bold text-[10px]">T</span>
            </div>
            <img src="/logo.svg" alt="til." className="h-5" />
            <span className="text-xs text-muted-foreground ml-1">Chennai · invite-only</span>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
        <p className="text-center text-[11px] text-muted-foreground mt-6">© 2026 til. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
