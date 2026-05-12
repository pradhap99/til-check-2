import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, Sparkles, TrendingUp, Shield } from "lucide-react";
import CountUp from "@/components/CountUp";
import MagneticButton from "@/components/motion/MagneticButton";
import { useSceneProgress, mapRange, clamp } from "@/components/motion/SceneProgressContext";

interface HeroStat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

interface HeroSceneContentProps {
  audience: "creator" | "brand";
  setAudience: (a: "creator" | "brand") => void;
  title: ReactNode;
  subtitle: string;
  cta: string;
  ctaSecondary: string;
  stats: HeroStat[];
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const HeroSceneContent = ({
  audience,
  setAudience,
  title,
  subtitle,
  cta,
  ctaSecondary,
  stats,
}: HeroSceneContentProps) => {
  const { progress: p } = useSceneProgress();

  // Hero copy + chip + CTAs recede
  const copyOpacity = 1 - mapRange(p, 0.18, 0.5, 0, 1);
  const copyTranslate = -mapRange(p, 0, 0.7, 0, 60);
  const copyScale = 1 - mapRange(p, 0, 0.7, 0, 0.18);
  const ctaOpacity = 1 - mapRange(p, 0.08, 0.32, 0, 1);
  const ctaTranslate = mapRange(p, 0, 0.5, 0, 28);

  const cardPhase = (delay: number, zFar: number, zNear: number) => {
    const local = clamp(mapRange(p, delay, 0.75 + delay, 0, 1));
    const eased = easeOut(local);
    return {
      z: zFar + (zNear - zFar) * eased,
      scale: 0.55 + eased * 0.7,
      opacity: local < 0.04 ? 0 : 1 - clamp(mapRange(local, 0.78, 1, 0, 1)),
      fan: eased,
    };
  };

  const center = cardPhase(0.0, -380, 360);
  const left = cardPhase(0.05, -300, 340);
  const right = cardPhase(0.1, -340, 360);

  // Stats bar slides up & locks
  const statsP = clamp(mapRange(p, 0.45, 0.9, 0, 1));
  const statsTranslateY = (1 - statsP) * 70;
  const statsOpacity = clamp(mapRange(p, 0.45, 0.7, 0, 1));
  const statsScale = 0.92 + statsP * 0.08;

  const interactable = p < 0.4;

  return (
    <>
      {/* Background */}
      <div aria-hidden className="absolute inset-0 aurora-bg dot-grid-bg" />
      <div aria-hidden className="hero-orb velocity-orb w-72 h-72 -top-10 -left-16" style={{ background: "radial-gradient(circle, hsl(38 92% 55%), transparent 70%)" }} />
      <div aria-hidden className="hero-orb hero-orb-2 velocity-orb w-80 h-80 -top-20 -right-20" style={{ background: "radial-gradient(circle, hsl(280 80% 60%), transparent 70%)" }} />
      <div aria-hidden className="hero-orb hero-orb-3 velocity-orb w-64 h-64 bottom-0 left-1/3" style={{ background: "radial-gradient(circle, hsl(180 70% 50%), transparent 70%)" }} />

      {/* Audience toggle */}
      <div
        className="absolute top-6 left-0 right-0 flex justify-center z-30"
        style={{ opacity: copyOpacity, pointerEvents: interactable ? "auto" : "none" }}
      >
        <div className="inline-flex bg-secondary/70 backdrop-blur rounded-full p-1 gap-1 shadow-sm border border-border/50">
          <button onClick={() => setAudience("creator")} className={`px-4 py-1.5 rounded-full text-xs font-heading font-semibold transition-all duration-300 ${audience === "creator" ? "bg-foreground text-background shadow-md scale-105" : "text-muted-foreground hover:text-foreground"}`}>For Creators</button>
          <button onClick={() => setAudience("brand")} className={`px-4 py-1.5 rounded-full text-xs font-heading font-semibold transition-all duration-300 ${audience === "brand" ? "bg-foreground text-background shadow-md scale-105" : "text-muted-foreground hover:text-foreground"}`}>For Brands</button>
        </div>
      </div>

      {/* Centered copy */}
      <div
        className="absolute inset-0 flex items-center justify-center px-5 z-20"
        style={{ pointerEvents: interactable ? "auto" : "none" }}
      >
        <div
          className="text-center max-w-3xl mx-auto"
          style={{
            opacity: copyOpacity,
            transform: `translateY(${copyTranslate}px) scale(${copyScale})`,
            willChange: "opacity, transform",
          }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 backdrop-blur text-muted-foreground text-xs font-medium mb-6 chip-float border border-border/60">
            <Sparkles className="w-3 h-3 text-accent" /> India's #1 Creator-Brand Marketplace
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold leading-[1.05] tracking-tight">
            {title}
          </h1>
          <p
            className="text-muted-foreground text-base md:text-lg mt-5 max-w-xl mx-auto leading-relaxed"
            style={{ opacity: ctaOpacity, transform: `translateY(${ctaTranslate * 0.5}px)` }}
          >
            {subtitle}
          </p>
          <div
            className="flex flex-col sm:flex-row gap-3 justify-center mt-8"
            style={{ opacity: ctaOpacity, transform: `translateY(${ctaTranslate}px)` }}
          >
            <MagneticButton>
              <Link to="/auth">
                <Button size="lg" className="cta-glow font-medium w-full sm:w-auto h-12 px-8 text-sm btn-micro rounded-full">
                  {cta} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.25}>
              <Link to="/auth">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-medium w-full sm:w-auto h-12 px-8 text-sm btn-micro rounded-full gap-1.5"
                  onClick={() => setAudience(audience === "creator" ? "brand" : "creator")}
                >
                  <PlayCircle className="w-4 h-4" /> {ctaSecondary}
                </Button>
              </Link>
            </MagneticButton>
          </div>
          <p className="text-xs text-muted-foreground mt-4" style={{ opacity: ctaOpacity }}>
            Free to join · No credit card required
          </p>
        </div>
      </div>

      {/* 3D preview cards (desktop) */}
      <div className="absolute inset-0 hidden md:block z-10 pointer-events-none">
        <div className="relative h-full w-full depth-stack">
          {/* Center card */}
          <div
            className="absolute left-1/2 top-1/2 w-80"
            style={{
              transform: `translate3d(-50%, -50%, ${center.z}px) scale(${center.scale})`,
              opacity: center.opacity,
              willChange: "transform, opacity",
            }}
          >
            <div className="rounded-2xl bg-card border border-border shadow-2xl p-5 text-left">
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
            </div>
          </div>

          {/* Left card */}
          <div
            className="absolute left-[8%] top-1/2 w-56"
            style={{
              transform: `translate3d(0, -50%, ${left.z}px) translateX(${-left.fan * 80}px) rotate(${-6 - left.fan * 4}deg) scale(${left.scale})`,
              opacity: left.opacity,
              willChange: "transform, opacity",
            }}
          >
            <div className="rounded-2xl bg-card border border-border shadow-xl p-4 text-left">
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
          </div>

          {/* Right card */}
          <div
            className="absolute right-[8%] top-1/2 w-56"
            style={{
              transform: `translate3d(0, -50%, ${right.z}px) translateX(${right.fan * 80}px) rotate(${5 + right.fan * 4}deg) scale(${right.scale})`,
              opacity: right.opacity,
              willChange: "transform, opacity",
            }}
          >
            <div className="rounded-2xl bg-foreground text-background border border-border shadow-2xl p-4 text-left">
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

      {/* Stats bar */}
      <div className="absolute inset-0 flex items-center justify-center px-5 z-30 pointer-events-none">
        <div
          className="w-full max-w-4xl pointer-events-auto"
          style={{
            transform: `translateY(${statsTranslateY}vh) scale(${statsScale})`,
            opacity: statsOpacity,
            willChange: "transform, opacity",
          }}
        >
          <div className="bg-foreground rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 relative overflow-hidden shadow-2xl">
            <div aria-hidden className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-accent/15 blur-3xl" />
            {stats.map((stat, i) => (
              <div key={i} className="text-center relative" style={{ transform: `translateZ(${20 + i * 4}px)` }}>
                <p className="font-heading font-bold text-2xl md:text-3xl text-primary-foreground">
                  <CountUp end={stat.value} duration={2000} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-primary-foreground/50 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
        style={{ opacity: 1 - mapRange(p, 0, 0.08, 0, 1) }}
      >
        <div className="flex flex-col items-center gap-1 text-muted-foreground/60">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <span className="w-px h-6 bg-current animate-pulse" />
        </div>
      </div>
    </>
  );
};

// Mobile fallback for the hero (no pinning)
export const HeroSceneFallback = ({
  audience,
  setAudience,
  title,
  subtitle,
  cta,
  ctaSecondary,
  stats,
}: HeroSceneContentProps) => (
  <div className="relative px-5 pt-10 pb-12 text-center overflow-hidden">
    <div aria-hidden className="absolute inset-0 aurora-bg dot-grid-bg" />
    <div aria-hidden className="hero-orb w-56 h-56 -top-10 -left-10" style={{ background: "radial-gradient(circle, hsl(38 92% 55%), transparent 70%)" }} />
    <div aria-hidden className="hero-orb hero-orb-2 w-60 h-60 -top-10 -right-10" style={{ background: "radial-gradient(circle, hsl(280 80% 60%), transparent 70%)" }} />

    <div className="relative">
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-secondary rounded-full p-1 gap-1 shadow-sm">
          <button onClick={() => setAudience("creator")} className={`px-4 py-1.5 rounded-full text-xs font-heading font-semibold ${audience === "creator" ? "bg-foreground text-background" : "text-muted-foreground"}`}>For Creators</button>
          <button onClick={() => setAudience("brand")} className={`px-4 py-1.5 rounded-full text-xs font-heading font-semibold ${audience === "brand" ? "bg-foreground text-background" : "text-muted-foreground"}`}>For Brands</button>
        </div>
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-medium mb-5">
        <Sparkles className="w-3 h-3 text-accent" /> India's #1 Creator-Brand Marketplace
      </div>
      <h1 className="text-4xl font-heading font-extrabold leading-[1.05] tracking-tight">{title}</h1>
      <p className="text-muted-foreground text-base mt-4 max-w-md mx-auto leading-relaxed">{subtitle}</p>
      <div className="flex flex-col gap-3 justify-center mt-6">
        <Link to="/auth"><Button size="lg" className="w-full h-12 rounded-full">{cta} <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
        <Link to="/auth">
          <Button
            size="lg"
            variant="outline"
            className="w-full h-12 rounded-full gap-1.5"
            onClick={() => setAudience(audience === "creator" ? "brand" : "creator")}
          >
            <PlayCircle className="w-4 h-4" /> {ctaSecondary}
          </Button>
        </Link>
      </div>
      <p className="text-xs text-muted-foreground mt-3">Free to join · No credit card required</p>

      <div className="mt-10 bg-foreground rounded-2xl p-6 grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <p className="font-heading font-bold text-xl text-primary-foreground">
              <CountUp end={stat.value} duration={2000} prefix={stat.prefix} suffix={stat.suffix} />
            </p>
            <p className="text-[11px] text-primary-foreground/50">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default HeroSceneContent;
