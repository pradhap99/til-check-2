import { Link } from "react-router-dom";
import {
  ArrowRight, TrendingUp, Users,
  ChevronDown, Star, CheckCircle, BarChart3, Zap, Lock,
  IndianRupee, Clock, Award, Target, Handshake, CreditCard, Shield
} from "lucide-react";
import { useState, useEffect } from "react";
import CountUp from "@/components/CountUp";
import { TOP_CATEGORIES } from "@/data/experienceCategories";

/* ─────────────────────────────────────────────
   Static Data
───────────────────────────────────────────── */
const faqs = [
  { q: "How quickly do creators get paid?", a: "Instant UPI transfers with zero platform fee. Bank transfers process within 1–2 business days. Standard payment split: 50% on acceptance, 50% on deliverable approval." },
  { q: "How does GST & TDS compliance work?", a: "GST registration is optional but recommended for ₹40L+ earners. All invoices auto-generate with GSTIN fields. TDS is computed automatically for payments exceeding ₹30,000." },
  { q: "What does TIL charge?", a: "A transparent 10% service fee on successful collaborations. No subscription fees, no hidden charges. Creators keep 90%+ of every rupee." },
  { q: "How are disputes resolved?", a: "Payments are held in escrow with a 7-day dispute window post-publication. Our mediation team reviews all evidence within 3–5 business days." },
  { q: "Which platforms are supported?", a: "Instagram (Reels, Stories, Feed), YouTube (Shorts, Videos), TikTok, and Twitter/X. Full cross-platform analytics included." },
];

const testimonials = [
  { name: "Priya Sharma", role: "Fashion", followers: "1.2M", quote: "Delivered 5 Reels for Lenskart with 2.3M total impressions. Brand partnership renewed for next season!", initials: "PS", color: "from-violet-500 to-pink-500" },
  { name: "boAt Audio", role: "D2C Electronics", followers: "Brand", quote: "8.2% average engagement across 15 creators. 3X better ROI than traditional advertising.", initials: "BA", color: "from-blue-500 to-cyan-500" },
  { name: "Vikram Singh", role: "Food", followers: "2.1M", quote: "Created 12 restaurant review videos reaching 4.5M viewers. Got 3 long-term brand partnerships.", initials: "VS", color: "from-orange-500 to-amber-400" },
  { name: "Neha Kapoor", role: "Fitness", followers: "650K", quote: "Completed 8 campaigns in 3 months. 1.8M impressions across platforms. Renewed 3 brand deals.", initials: "NK", color: "from-emerald-500 to-teal-500" },
  { name: "Lenskart", role: "Eyewear Brand", followers: "Brand", quote: "Managed 15 creator campaigns simultaneously. Content quality exceeded expectations. 5M+ reach.", initials: "LK", color: "from-indigo-500 to-blue-500" },
  { name: "Kavya Nair", role: "Beauty", followers: "780K", quote: "10 Reels, 25 Stories, 3 brand deals renewed. Escrow protection gives complete peace of mind.", initials: "KN", color: "from-pink-500 to-rose-500" },
];

const creatorGrowthZones = [
  { zone: "Beginner", level: "01", followers: "0 – 10K", pay: "₹2K – ₹8K", color: "from-emerald-500 to-teal-400", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", desc: "First campaigns, build your portfolio" },
  { zone: "Rising", level: "02", followers: "10K – 100K", pay: "₹8K – ₹25K", color: "from-blue-500 to-cyan-400", badge: "bg-blue-500/20 text-blue-300 border-blue-500/30", desc: "Consistent growth, niche authority" },
  { zone: "Established", level: "03", followers: "100K – 500K", pay: "₹25K – ₹75K", color: "from-violet-500 to-purple-400", badge: "bg-violet-500/20 text-violet-300 border-violet-500/30", desc: "Premium deals, long-term partnerships" },
  { zone: "Star", level: "04", followers: "500K+", pay: "₹75K – ₹3L+", color: "from-amber-500 to-orange-400", badge: "bg-amber-500/20 text-amber-300 border-amber-500/30", desc: "Exclusive brand ambassadorships" },
];

const brandFeatures = [
  { icon: Target, title: "AI-Powered Matching", desc: "Algorithm matches your brand with ideal creators by niche, audience demographics, and engagement patterns." },
  { icon: Lock, title: "Secure Escrow", desc: "Payments held safely until deliverables approved. 7-day dispute window with mediation support." },
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Track reach, engagement, CPE, and ROI across all active campaigns in a unified dashboard." },
  { icon: Handshake, title: "End-to-End Management", desc: "From brief to payment — content approval, revisions, invoicing all in one seamless platform." },
];

const platformFeatures = [
  { icon: BarChart3, title: "Smart Matching", desc: "Algorithm-driven creator-brand pairing based on niche, engagement, and audience fit.", span: "md:col-span-2" },
  { icon: CreditCard, title: "Instant UPI", desc: "Zero-fee UPI transfers with GST-compliant invoices.", span: "" },
  { icon: Shield, title: "Escrow Protection", desc: "Secure payments with 7-day dispute window.", span: "" },
  { icon: CheckCircle, title: "Verified Profiles", desc: "API-verified metrics. No inflated numbers.", span: "" },
  { icon: TrendingUp, title: "Performance Analytics", desc: "Track ROI, CPE, reach, and sales attribution in real time.", span: "" },
  { icon: Lock, title: "Content Approval", desc: "Built-in review workflow with version history and revision tracking.", span: "md:col-span-2" },
];

const experienceCategories = TOP_CATEGORIES.map(c => ({ label: c.label, img: c.img || "", emoji: c.emoji }));

/* ─────────────────────────────────────────────
   Scroll-reveal hook (IntersectionObserver)
───────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────
   3D Phone Mockup
───────────────────────────────────────────── */
const PhoneMockup = () => (
  <div className="phone-mockup-3d mx-auto" style={{ width: 220 }}>
    {/* Outer shell */}
    <div
      style={{
        width: 220,
        height: 440,
        borderRadius: 36,
        background: "linear-gradient(160deg, #1e1035 0%, #0d0a1a 100%)",
        border: "2px solid rgba(167,139,250,0.25)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 0 1px rgba(0,0,0,0.5)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Screen glare overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "-30%",
          width: "65%",
          height: "100%",
          background: "linear-gradient(108deg, transparent 38%, rgba(255,255,255,0.07) 50%, transparent 62%)",
          pointerEvents: "none",
          zIndex: 20,
          borderRadius: 36,
        }}
      />
      {/* Notch */}
      <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 60, height: 8, borderRadius: 8, background: "#0a0816", zIndex: 15 }} />
      {/* Screen content */}
      <div style={{ padding: "38px 14px 14px", position: "relative", zIndex: 5, height: "100%" }}>
        {/* Status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "Inter, sans-serif" }}>9:41</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "Inter, sans-serif" }}>●●●</span>
        </div>
        {/* Creator profile card */}
        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "14px 12px", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #EC4899)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, color: "white", fontWeight: 700 }}>A</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "white", lineHeight: 1.2 }}>Anika Sharma</div>
              <div style={{ fontSize: 9, color: "rgba(167,139,250,0.9)" }}>Lifestyle Creator</div>
            </div>
            <div style={{ marginLeft: "auto", background: "rgba(124,58,237,0.3)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: 6, padding: "2px 6px", fontSize: 8, color: "#a78bfa" }}>⭐ Star</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, textAlign: "center" }}>
            {[{ v: "1.2M", l: "Followers" }, { v: "8.4%", l: "Engage" }, { v: "₹2.4L", l: "Earnings" }].map(s => (
              <div key={s.l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "6px 4px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "white" }}>{s.v}</div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Active campaign card */}
        <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.15))", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 12, padding: "10px 12px", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.6)" }}>Active Campaign</span>
            <span style={{ fontSize: 8, background: "rgba(16,185,129,0.2)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 4, padding: "1px 5px" }}>Live</span>
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "white", marginBottom: 4 }}>Nykaa Glow Collection</div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
            <div style={{ height: 3, width: "65%", background: "linear-gradient(90deg, #7C3AED, #EC4899)", borderRadius: 3 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>65% complete</span>
            <span style={{ fontSize: 8, color: "#a78bfa" }}>₹45,000</span>
          </div>
        </div>
        {/* Platform badges */}
        <div style={{ display: "flex", gap: 6 }}>
          {[{ icon: "📸", label: "Instagram" }, { icon: "▶", label: "YouTube" }].map(p => (
            <div key={p.label} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "5px 0", fontSize: 9, color: "rgba(255,255,255,0.6)" }}>
              <span style={{ fontSize: 10 }}>{p.icon}</span>{p.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Main Landing Component
───────────────────────────────────────────── */
const Landing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [audience, setAudience] = useState<"creator" | "brand">("creator");
  const [howTab, setHowTab] = useState<"creator" | "brand">("creator");

  useScrollReveal();

  const creatorHero = {
    badge: "India's #1 Creator-Brand Marketplace",
    title: <>Where brands meet<br /><span className="gradient-text-landing">India's top creators</span></>,
    subtitle: "Performance-based collaborations with instant UPI payments, built-in content approval, and GST-compliant invoicing.",
    cta: "Join as Creator",
    ctaSecondary: "I'm a Brand →",
    stats: [
      { label: "Verified Creators", value: 12400, suffix: "+" },
      { label: "Campaigns Delivered", value: 8200, suffix: "+" },
      { label: "Avg Engagement Rate", value: 58, suffix: "%" },
      { label: "Paid to Creators", value: 25, prefix: "₹", suffix: "Cr+" },
    ],
  };
  const brandHero = {
    badge: "Trusted by 800+ Leading Brands",
    title: <>Find India's top creators<br /><span className="gradient-text-landing">for your brand</span></>,
    subtitle: "AI-powered creator matching, secure escrow payments, real-time analytics, and end-to-end campaign management.",
    cta: "Get Started as Brand",
    ctaSecondary: "I'm a Creator →",
    stats: [
      { label: "Verified Creators", value: 26000, suffix: "+" },
      { label: "Industries Covered", value: 12, suffix: "" },
      { label: "Paid to Creators", value: 25, prefix: "₹", suffix: "Cr+" },
      { label: "Verified Brands", value: 800, suffix: "+" },
    ],
  };
  const hero = audience === "creator" ? creatorHero : brandHero;

  const creatorSteps = [
    { step: "01", title: "Build your profile", desc: "Connect social accounts, set niche & rate card", stat: "2 min setup" },
    { step: "02", title: "Discover campaigns", desc: "AI-matched brand deals by niche, budget, location", stat: "1,200+ active" },
    { step: "03", title: "Deliver content", desc: "Submit work for brand review through built-in tools", stat: "Built-in review" },
    { step: "04", title: "Get paid via UPI", desc: "Instant payments, zero fee, GST-ready invoices", stat: "Instant payout" },
  ];
  const brandSteps = [
    { step: "01", title: "Post a campaign", desc: "Define budget, deliverables, and target audience", stat: "5 min setup" },
    { step: "02", title: "Review applications", desc: "Sort by match score, engagement rate, reach", stat: "AI-ranked" },
    { step: "03", title: "Approve content", desc: "Review submissions with version tracking", stat: "1-click approval" },
    { step: "04", title: "Track ROI", desc: "Real-time analytics on reach, engagement, sales", stat: "Live dashboard" },
  ];

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: "#050510", color: "white", fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Navbar ─────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 px-5 py-4 flex items-center justify-between max-w-5xl mx-auto"
        style={{ background: "rgba(5,5,16,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)" }}>
            <span className="font-bold text-xs text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>T</span>
          </div>
          <span className="font-bold text-white text-lg tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>TIL</span>
        </div>
        <div className="flex gap-2">
          <Link to="/auth">
            <button className="btn-landing-ghost px-4 py-2 rounded-full text-xs font-medium">Log in</button>
          </Link>
          <Link to="/auth">
            <button className="btn-landing-primary px-4 py-2 rounded-full text-xs font-medium">Get Started</button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────── */}
      <section className="relative px-5 pt-16 pb-20 max-w-5xl mx-auto overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div className="absolute" style={{ top: "5%", left: "10%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)", animation: "orb-drift-1 14s ease-in-out infinite", willChange: "transform" }} />
          <div className="absolute" style={{ top: "20%", right: "5%", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)", animation: "orb-drift-2 18s ease-in-out infinite", willChange: "transform" }} />
          <div className="absolute" style={{ bottom: "0%", left: "30%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)", animation: "orb-drift-3 12s ease-in-out infinite", willChange: "transform" }} />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Text content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Audience toggle */}
            <div className="flex justify-center lg:justify-start mb-6 animate-fade-up">
              <div className="inline-flex p-1 rounded-full" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {(["creator", "brand"] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => setAudience(a)}
                    className="px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      background: audience === a ? "linear-gradient(135deg, #7C3AED, #EC4899)" : "transparent",
                      color: audience === a ? "white" : "rgba(255,255,255,0.5)",
                      boxShadow: audience === a ? "0 4px 16px rgba(124,58,237,0.4)" : "none",
                    }}
                  >
                    {a === "creator" ? "For Creators" : "For Brands"}
                  </button>
                ))}
              </div>
            </div>

            {/* Badge */}
            <div className="flex justify-center lg:justify-start mb-5 animate-fade-up" style={{ animationDelay: "80ms" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#c4b5fd" }}>
                <Zap className="w-3 h-3" /> {hero.badge}
              </div>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight mb-5 animate-fade-up"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animationDelay: "160ms" }}
            >
              {hero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 animate-fade-up" style={{ color: "rgba(255,255,255,0.55)", animationDelay: "240ms" }}>
              {hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: "320ms" }}>
              <Link to="/auth">
                <button className="btn-landing-primary h-12 px-8 rounded-full text-sm font-semibold w-full sm:w-auto flex items-center justify-center gap-2">
                  {hero.cta} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/auth">
                <button
                  className="btn-landing-ghost h-12 px-8 rounded-full text-sm font-semibold w-full sm:w-auto"
                  onClick={() => setAudience(audience === "creator" ? "brand" : "creator")}
                >
                  {hero.ctaSecondary}
                </button>
              </Link>
            </div>
            <p className="text-xs mt-4 text-center lg:text-left" style={{ color: "rgba(255,255,255,0.3)" }}>Free to join · No credit card required</p>
          </div>

          {/* Right: 3D Phone mockup */}
          <div className="flex-shrink-0 hidden md:block">
            <PhoneMockup />
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {hero.stats.map((stat, i) => (
            <div
              key={i}
              className="landing-glass-card scroll-reveal rounded-2xl p-5 text-center"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <p className="font-extrabold text-2xl text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <CountUp end={stat.value} duration={2200} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Creator Growth Framework ─────────────── */}
      <section className="px-5 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12 scroll-reveal">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a78bfa" }}>Creator Journey</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your growth framework</h2>
          <p className="text-sm mt-3 max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>From your first collab to brand ambassador — TIL grows with you</p>
        </div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-[52px] left-[12.5%] right-[12.5%] h-0.5 zone-connector rounded-full" style={{ zIndex: 0 }} />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {creatorGrowthZones.map((zone, i) => (
              <div
                key={i}
                className={`landing-glass-card scroll-reveal rounded-2xl p-5 relative delay-${(i + 1) * 100}`}
                style={{ zIndex: 1 }}
              >
                {/* Zone number circle */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${zone.color} flex items-center justify-center text-white font-extrabold text-sm mb-4 mx-auto md:mx-0`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: "0 0 0 4px rgba(255,255,255,0.05), 0 0 20px rgba(124,58,237,0.2)" }}>
                  {zone.level}
                </div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold mb-2 border ${zone.badge}`}>{zone.zone}</div>
                <p className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{zone.followers}</p>
                <p className="text-base font-extrabold mb-2" style={{ background: `linear-gradient(135deg, ${zone.color.includes("emerald") ? "#6ee7b7" : zone.color.includes("blue") ? "#67e8f9" : zone.color.includes("violet") ? "#c4b5fd" : "#fcd34d"})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{zone.pay}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{zone.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────── */}
      <section className="px-5 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-10 scroll-reveal">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a78bfa" }}>Process</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>From signup to payout</h2>
        </div>

        {/* Pill toggle */}
        <div className="flex justify-center mb-10 scroll-reveal delay-100">
          <div className="inline-flex p-1 rounded-full relative" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {(["creator", "brand"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setHowTab(tab)}
                className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative z-10"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  background: howTab === tab ? "linear-gradient(135deg, #7C3AED, #EC4899)" : "transparent",
                  color: howTab === tab ? "white" : "rgba(255,255,255,0.5)",
                  boxShadow: howTab === tab ? "0 4px 16px rgba(124,58,237,0.4)" : "none",
                }}
              >
                {tab === "creator" ? "For Creators" : "For Brands"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(howTab === "creator" ? creatorSteps : brandSteps).map((item, i) => (
            <div key={`${howTab}-${i}`} className={`landing-glass-card scroll-reveal rounded-2xl p-5 delay-${(i + 1) * 100}`}>
              {/* Glowing step circle */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold text-white mb-4 step-glow-circle" style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {item.step}
              </div>
              <p className="font-semibold text-white text-sm mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.title}</p>
              <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>{item.desc}</p>
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", color: "#c4b5fd" }}>{item.stat}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Platform Features ────────────────────── */}
      {audience === "brand" && (
        <section className="px-5 py-20 max-w-5xl mx-auto">
          <div className="text-center mb-12 scroll-reveal">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a78bfa" }}>Why TIL</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Everything your brand needs</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {brandFeatures.map((f, i) => (
              <div key={i} className={`landing-glass-card scroll-reveal rounded-2xl p-6 delay-${(i + 1) * 100}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.2)" }}>
                  <f.icon className="w-5 h-5" style={{ color: "#a78bfa" }} />
                </div>
                <p className="font-semibold text-white text-sm mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Platform Features (bento) ────────────── */}
      <section className="px-5 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12 scroll-reveal">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a78bfa" }}>Platform</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Everything you need</h2>
          <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.45)" }}>Nothing you don't</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {platformFeatures.map((f, i) => (
            <div key={i} className={`landing-glass-card scroll-reveal rounded-2xl p-6 ${f.span} delay-${Math.min(i * 100, 400)}`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <f.icon className="w-5 h-5" style={{ color: "#a78bfa" }} />
              </div>
              <p className="font-semibold text-white text-sm mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Browse Categories ────────────────────── */}
      <section className="py-20 overflow-hidden">
        <div className="px-5 max-w-5xl mx-auto text-center mb-10 scroll-reveal">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a78bfa" }}>Browse</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Browse by what you love {audience === "brand" ? "promoting" : "creating"}
          </h2>
        </div>
        <div className="flex gap-4 px-5 overflow-x-auto landing-scroll-strip pb-2">
          {experienceCategories.map((cat, i) => (
            <Link to="/auth" key={i} className="category-tile flex-shrink-0 rounded-2xl overflow-hidden" style={{ width: 180, height: 220, position: "relative" }}>
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover" loading="lazy" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }} />
              <div style={{ position: "absolute", bottom: 14, left: 14, right: 14 }}>
                <div className="text-xl mb-1">{cat.emoji}</div>
                <p className="text-xs font-semibold text-white leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{cat.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────── */}
      <section className="py-20 overflow-hidden">
        <div className="px-5 max-w-5xl mx-auto text-center mb-10 scroll-reveal">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a78bfa" }}>Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Trusted by 12,000+ creators & 800+ brands</h2>
        </div>
        <div className="overflow-hidden">
          <div className="flex gap-4 animate-scroll-x" style={{ width: "max-content", paddingLeft: 20, paddingRight: 20 }}>
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="landing-glass-card rounded-2xl p-5 flex-shrink-0" style={{ width: 300 }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.initials}</div>
                  <div>
                    <p className="font-semibold text-sm text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{t.role}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.2)", color: "#c4b5fd", border: "1px solid rgba(124,58,237,0.25)" }}>{t.followers}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>"{t.quote}"</p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, s) => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── By The Numbers ───────────────────────── */}
      <section className="px-5 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12 scroll-reveal">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a78bfa" }}>Impact</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>By the numbers</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: "For Creators", color: "#6ee7b7", items: [
              { icon: IndianRupee, text: "Avg ₹45,000/campaign" },
              { icon: Clock, text: "3-day payment turnaround" },
              { icon: Award, text: "58% acceptance rate" },
              { icon: Target, text: "1,200+ active campaigns" },
            ]},
            { label: "For Brands", color: "#a78bfa", items: [
              { icon: TrendingUp, text: "8.2% avg engagement" },
              { icon: BarChart3, text: "3X better ROI" },
              { icon: CheckCircle, text: "800+ verified brands" },
              { icon: Users, text: "12,400+ creators" },
            ]},
          ].map((col, ci) => (
            <div key={ci} className={`landing-glass-card scroll-reveal rounded-2xl p-6 delay-${(ci + 1) * 150}`}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: col.color }}>{col.label}</p>
              <div className="space-y-4">
                {col.items.map((item, ii) => (
                  <div key={ii} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <item.icon className="w-4 h-4" style={{ color: col.color }} />
                    </div>
                    <span className="text-sm font-medium text-white">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────── */}
      <section className="px-5 py-20 max-w-2xl mx-auto">
        <div className="text-center mb-10 scroll-reveal">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a78bfa" }}>FAQ</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Common questions</h2>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className={`landing-glass-card scroll-reveal rounded-2xl overflow-hidden delay-${i * 100}`} style={{ transitionDelay: `${i * 80}ms` }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                style={{ background: "transparent", border: "none", cursor: "pointer" }}
              >
                <span className="font-medium text-sm text-white pr-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{faq.q}</span>
                <ChevronDown
                  className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                  style={{ color: "rgba(255,255,255,0.4)", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              <div className={`faq-body ${openFaq === i ? "open" : ""}`}>
                <div className="px-5 pb-4">
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────── */}
      <section className="px-5 py-20 max-w-5xl mx-auto">
        <div
          className="scroll-reveal rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(236,72,153,0.2) 50%, rgba(6,182,212,0.15) 100%)", border: "1px solid rgba(167,139,250,0.2)" }}
        >
          {/* Blur orbs inside CTA */}
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 10 }}>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Start growing today</h2>
            <p className="text-sm max-w-md mx-auto mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Join 12,000+ creators and 800+ brands already using TIL to power their influencer marketing.
            </p>
            <Link to="/auth">
              <button className="btn-landing-primary h-12 px-10 rounded-full text-sm font-semibold inline-flex items-center gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer
        className="px-5 py-8 max-w-5xl mx-auto"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)" }}>
              <span className="font-bold text-xs text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>T</span>
            </div>
            <span className="font-bold text-white text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>TIL</span>
            <span className="text-xs ml-1" style={{ color: "rgba(255,255,255,0.35)" }}>India's Creator Marketplace</span>
          </div>
          <div className="flex gap-6 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            {["Terms", "Privacy", "Contact"].map(l => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
        <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>© 2026 TIL. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
