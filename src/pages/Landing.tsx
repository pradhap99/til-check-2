import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, TrendingUp, Users, Shield, CreditCard,
  ChevronDown, Star, CheckCircle, BarChart3
} from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "How quickly do creators get paid?", a: "Instant UPI transfers with 0% platform fee. Bank transfers process within 1–2 business days. 50% upfront on campaign acceptance, balance on deliverable approval." },
  { q: "How does GST & TDS compliance work?", a: "GST registration is optional but recommended for creators earning ₹40L+/year. Invoices auto-generate with GSTIN fields. TDS is handled automatically for payments exceeding ₹30,000." },
  { q: "What's the platform pricing?", a: "TIL charges a transparent 10% service fee on successful collaborations. No subscription, no hidden charges. Creators retain 90%+ of every payment." },
  { q: "How are disputes resolved?", a: "All payments are held in escrow with a 7-day dispute window. Our mediation team reviews cases within 3–5 business days with evidence from both parties." },
  { q: "Which platforms are supported?", a: "Instagram Reels & Stories, YouTube Shorts & Videos, TikTok, Twitter/X — full multi-platform support. Track engagement across all channels." },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Fashion Creator · 1.2M followers",
    quote: "Earned ₹3.5L in my first quarter. The campaign matching is incredibly accurate — I only see relevant brand deals.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "boAt Audio",
    role: "D2C Electronics Brand",
    quote: "8.2% average engagement rate across 15 creators. 3X better ROI compared to traditional advertising channels.",
    avatar: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
  },
  {
    name: "Vikram Singh",
    role: "Food Creator · 2.1M followers",
    quote: "The built-in chat and content approval workflow saves hours of back-and-forth. UPI payments hit instantly.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
  },
];

const Landing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="px-4 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">TIL</h1>
        <div className="flex gap-2">
          <Link to="/auth">
            <Button size="sm" variant="ghost" className="text-xs font-heading">Log in</Button>
          </Link>
          <Link to="/auth">
            <Button size="sm" variant="default" className="text-xs font-heading">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 pt-8 pb-12 max-w-5xl mx-auto">
        <div className="gradient-primary rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full -translate-y-20 translate-x-20" />
          <div className="relative z-10 max-w-xl">
            <Badge className="bg-primary-foreground/15 text-primary-foreground border-0 mb-4 text-xs font-heading">
              India's Creator Marketplace
            </Badge>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground leading-[1.1] tracking-tight">
              Connect creators<br />with brands that<br />matter
            </h2>
            <p className="text-primary-foreground/75 text-sm md:text-base mt-4 max-w-md leading-relaxed">
              Performance-based collaborations, instant UPI payments, and GST-compliant invoicing. Built specifically for India's creator economy.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link to="/auth">
                <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-heading w-full sm:w-auto">
                  Join as Creator <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 font-heading w-full sm:w-auto">
                  I'm a Brand <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {[
          { icon: Users, label: "Verified Creators", value: "12,400+" },
          { icon: TrendingUp, label: "Campaigns Delivered", value: "8,200+" },
          { icon: BarChart3, label: "Avg. Engagement", value: "5.8%" },
          { icon: CreditCard, label: "Paid to Creators", value: "₹25Cr+" },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-xl p-4 text-center opacity-0 animate-fade-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}>
            <stat.icon className="w-4.5 h-4.5 mx-auto text-primary mb-1.5" />
            <p className="font-heading font-bold text-lg text-card-foreground">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section className="px-4 mt-16 max-w-5xl mx-auto">
        <h3 className="font-heading font-bold text-2xl text-center text-foreground mb-1 tracking-tight">How it works</h3>
        <p className="text-muted-foreground text-center text-sm mb-8">From signup to payout in four simple steps</p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass-card rounded-xl p-6">
            <h4 className="font-heading font-bold text-base text-foreground mb-4">For Creators</h4>
            <div className="space-y-3.5">
              {[
                { step: "01", title: "Build your profile", desc: "Connect social accounts, set your niche and rate card" },
                { step: "02", title: "Discover campaigns", desc: "Browse matched brand deals by niche, budget, and platform" },
                { step: "03", title: "Deliver content", desc: "Submit content for brand review and approval" },
                { step: "04", title: "Get paid via UPI", desc: "Instant payments, zero platform fee, GST-ready invoices" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className="text-xs font-heading font-bold text-primary mt-0.5 w-6">{item.step}</span>
                  <div>
                    <p className="font-heading font-medium text-sm text-card-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h4 className="font-heading font-bold text-base text-foreground mb-4">For Brands</h4>
            <div className="space-y-3.5">
              {[
                { step: "01", title: "Post a campaign", desc: "Define budget, deliverables, and target creator profile" },
                { step: "02", title: "Review applications", desc: "Sort by match score, engagement rate, and follower count" },
                { step: "03", title: "Approve content", desc: "Review submissions, request changes, approve final content" },
                { step: "04", title: "Track ROI", desc: "Real-time analytics on reach, engagement, and sales" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className="text-xs font-heading font-bold text-primary mt-0.5 w-6">{item.step}</span>
                  <div>
                    <p className="font-heading font-medium text-sm text-card-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 mt-16 max-w-5xl mx-auto">
        <h3 className="font-heading font-bold text-2xl text-center text-foreground mb-8 tracking-tight">Why brands & creators choose TIL</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {[
            { icon: BarChart3, title: "Smart Matching", desc: "Algorithm-driven creator-brand matching based on niche, engagement & audience demographics" },
            { icon: CreditCard, title: "Instant UPI Payments", desc: "Zero-fee UPI payments with automatic GST-compliant invoice generation" },
            { icon: Shield, title: "Escrow Protection", desc: "All payments held securely. 7-day dispute window ensures fair resolution for both parties" },
            { icon: CheckCircle, title: "Verified Profiles", desc: "API-verified follower counts and engagement rates. Zero tolerance for inflated metrics" },
            { icon: TrendingUp, title: "Performance Analytics", desc: "Track campaign ROI, engagement rates, reach, impressions, and sales attribution" },
            { icon: Star, title: "Ratings & Reviews", desc: "Transparent ratings system helps creators build reputation and brands make informed decisions" },
          ].map((feature, i) => (
            <div key={i} className="glass-card rounded-xl p-4 hover-lift opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
              <feature.icon className="w-5 h-5 text-primary mb-2" />
              <p className="font-heading font-semibold text-sm text-card-foreground">{feature.title}</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 mt-16 max-w-5xl mx-auto">
        <h3 className="font-heading font-bold text-2xl text-center text-foreground mb-8 tracking-tight">Trusted by creators & brands</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card rounded-xl p-5 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}>
              <div className="flex items-center gap-3 mb-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-lg object-cover bg-muted" />
                <div>
                  <p className="font-heading font-medium text-sm text-card-foreground">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">"{t.quote}"</p>
              <div className="flex gap-0.5 mt-3">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-3 h-3 text-accent fill-accent" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 mt-16 max-w-2xl mx-auto">
        <h3 className="font-heading font-bold text-2xl text-center text-foreground mb-8 tracking-tight">Frequently asked questions</h3>
        <div className="space-y-1.5">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-heading font-medium text-sm text-card-foreground">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 mt-16 max-w-5xl mx-auto">
        <div className="gradient-primary rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground tracking-tight">
              Ready to grow your brand?
            </h3>
            <p className="text-primary-foreground/70 text-sm mt-2">Join 12,000+ creators and 800+ brands on TIL</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link to="/auth">
                <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-heading">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 mt-16 pb-8 max-w-5xl mx-auto border-t border-border pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="font-heading font-bold text-base text-foreground">TIL</h4>
            <p className="text-xs text-muted-foreground">India's Creator Marketplace</p>
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
