import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, Sparkles, TrendingUp, Users, Zap, Star, Shield, CreditCard,
  ChevronDown, Instagram, Youtube, MessageCircle
} from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "How quickly do I get paid?", a: "Creators get paid via UPI instantly (0% fee) or via bank transfer in 1-2 business days. 50% upfront on campaign acceptance, 50% after deliverables are approved." },
  { q: "Is GST applicable?", a: "GST registration is optional but encouraged for creators earning ₹40L+/year. TIL auto-generates compliant invoices with GSTIN fields. TDS is handled for payments ≥₹30K." },
  { q: "How does TIL make money?", a: "TIL charges a small platform fee on successful collaborations. Transparent pricing, no hidden charges. Creators keep 90%+ of every payment." },
  { q: "What if there's a dispute?", a: "TIL holds payments for 7 days (dispute window). Our mediation team reviews cases within 3-5 business days with evidence from both parties." },
  { q: "Which platforms are supported?", a: "Instagram, YouTube, TikTok, Twitter/X — all platforms supported. Post Reels, Stories, Shorts, Feed Posts, and more." },
];

const testimonials = [
  { name: "Priya S.", role: "Fashion Creator, 1.2M followers", quote: "Earned ₹3.5L in my first quarter on TIL. The UPI payments are instant!", avatar: "🎨" },
  { name: "BoAt Audio", role: "D2C Brand", quote: "8.2% avg engagement rate across 15 creators. 3X better ROI than traditional ads.", avatar: "🎧" },
  { name: "Vikram M.", role: "Food Creator, 2.1M followers", quote: "Love the campaign matching — I only see brands relevant to my niche.", avatar: "🍛" },
];

const Landing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="px-4 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <h1 className="text-2xl font-heading font-bold gradient-text">TIL</h1>
        <div className="flex gap-2">
          <Link to="/auth">
            <Button size="sm" variant="ghost" className="text-xs font-heading">Log In</Button>
          </Link>
          <Link to="/auth">
            <Button size="sm" variant="gradient" className="text-xs font-heading">Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 pt-8 pb-12 max-w-5xl mx-auto">
        <div className="gradient-primary rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary-foreground/10 rounded-full -translate-y-12 translate-x-12" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-foreground/5 rounded-full translate-y-8 -translate-x-8" />
          <div className="relative z-10 max-w-xl">
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 mb-4 text-xs">
              🚀 India's #1 Creator Marketplace
            </Badge>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground leading-tight">
              Connect Creators<br />with D2C Brands
            </h2>
            <p className="text-primary-foreground/80 text-base mt-4 max-w-md">
              Performance-based collabs, instant UPI payments, GST-compliant invoicing. Built for India's creator economy.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link to="/auth">
                <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-heading w-full sm:w-auto">
                  🎨 Join as Creator <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-heading w-full sm:w-auto">
                  🏢 Join as Brand <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Users, label: "Creators", value: "50K+" },
          { icon: TrendingUp, label: "Campaigns", value: "10K+" },
          { icon: Zap, label: "Matches", value: "100K+" },
          { icon: CreditCard, label: "Paid Out", value: "₹25Cr+" },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-4 text-center opacity-0 animate-fade-up" style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}>
            <stat.icon className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="font-heading font-bold text-xl text-card-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* How It Works - Creators */}
      <section className="px-4 mt-16 max-w-5xl mx-auto">
        <h3 className="font-heading font-bold text-2xl text-center text-foreground mb-2">How It Works</h3>
        <p className="text-muted-foreground text-center text-sm mb-8">Simple steps to start earning or hiring</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Creator flow */}
          <div className="glass-card rounded-2xl p-6">
            <h4 className="font-heading font-bold text-lg text-foreground mb-4">🎨 For Creators</h4>
            <div className="space-y-4">
              {[
                { step: "1", title: "Create your profile", desc: "Add your niche, social handles, and rate card" },
                { step: "2", title: "Browse campaigns", desc: "Discover brand deals matched to your niche" },
                { step: "3", title: "Deliver content", desc: "Upload content, get brand approval" },
                { step: "4", title: "Get paid via UPI", desc: "Instant payments, zero fee, GST-ready" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                    <span className="text-primary-foreground font-heading font-bold text-sm">{item.step}</span>
                  </div>
                  <div>
                    <p className="font-heading font-medium text-sm text-card-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand flow */}
          <div className="glass-card rounded-2xl p-6">
            <h4 className="font-heading font-bold text-lg text-foreground mb-4">🏢 For Brands</h4>
            <div className="space-y-4">
              {[
                { step: "1", title: "Post a campaign", desc: "Set budget, deliverables, and target creators" },
                { step: "2", title: "Review applications", desc: "Sort by match score, engagement, followers" },
                { step: "3", title: "Approve content", desc: "Review, request changes, and approve" },
                { step: "4", title: "Track ROI", desc: "Real-time engagement and sales analytics" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                    <span className="text-primary-foreground font-heading font-bold text-sm">{item.step}</span>
                  </div>
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
        <h3 className="font-heading font-bold text-2xl text-center text-foreground mb-8">Why TIL?</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { icon: Zap, title: "Smart Matching", desc: "AI-powered creator-brand matching based on niche, engagement & audience" },
            { icon: CreditCard, title: "Instant UPI Pay", desc: "Get paid instantly via UPI. Zero fees, GST-compliant invoicing" },
            { icon: Shield, title: "Escrow Protection", desc: "Payments held securely. 7-day dispute window for fair resolution" },
            { icon: Star, title: "Verified Profiles", desc: "API-verified follower counts and engagement rates. No fakes" },
            { icon: TrendingUp, title: "Real Analytics", desc: "Track campaign ROI, engagement, reach, and sales attribution" },
            { icon: MessageCircle, title: "Built-in Chat", desc: "Negotiate, share briefs, and collaborate — all inside TIL" },
          ].map((feature, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 hover-lift opacity-0 animate-fade-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}>
              <feature.icon className="w-6 h-6 text-primary mb-2" />
              <p className="font-heading font-semibold text-sm text-card-foreground">{feature.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 mt-16 max-w-5xl mx-auto">
        <h3 className="font-heading font-bold text-2xl text-center text-foreground mb-8">Creator & Brand Stories</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 120}ms`, animationFillMode: "forwards" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-lg">{t.avatar}</div>
                <div>
                  <p className="font-heading font-medium text-sm text-card-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">"{t.quote}"</p>
              <div className="flex gap-0.5 mt-3">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-3.5 h-3.5 text-accent fill-accent" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platforms */}
      <section className="px-4 mt-16 max-w-5xl mx-auto text-center">
        <h3 className="font-heading font-bold text-2xl text-foreground mb-2">All Platforms Supported</h3>
        <p className="text-muted-foreground text-sm mb-6">Post Reels, Shorts, Stories, Feed Posts, TikToks & more</p>
        <div className="flex justify-center gap-4">
          {[
            { icon: Instagram, label: "Instagram" },
            { icon: Youtube, label: "YouTube" },
            { icon: MessageCircle, label: "TikTok" },
          ].map((p, i) => (
            <div key={i} className="glass-card rounded-2xl px-6 py-4 flex flex-col items-center gap-2">
              <p.icon className="w-8 h-8 text-primary" />
              <span className="text-xs font-heading text-muted-foreground">{p.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 mt-16 max-w-2xl mx-auto">
        <h3 className="font-heading font-bold text-2xl text-center text-foreground mb-8">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-heading font-medium text-sm text-card-foreground">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 mt-16 max-w-5xl mx-auto">
        <div className="gradient-primary rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground">
              Ready to grow your brand?
            </h3>
            <p className="text-primary-foreground/80 text-sm mt-2">Join 50,000+ creators and 500+ brands on TIL</p>
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
            <h4 className="font-heading font-bold text-lg gradient-text">TIL</h4>
            <p className="text-xs text-muted-foreground">India's #1 Creator Marketplace</p>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">Terms & Conditions</a>
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">© 2026 TIL. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
