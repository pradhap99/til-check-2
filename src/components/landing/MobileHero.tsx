import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * MobileHero — image-dominant landing hero for ≤md viewports.
 *
 * Per Mobile-First Mandate §2.6:
 *   - Full-bleed Chennai creator image, 60vh top half
 *   - Gradient overlay fading to #0A0A0A at the bottom
 *   - til. logo top-left (32px)
 *   - Headline above the fold on the dark overlay:
 *       "where brands meet" (Cormorant italic 500, ≈40px)
 *       "Chennai's people"   (gold gradient, Cormorant italic 600, ≈56px)
 *   - One CTA above the fold: "Get started" → /auth
 *   - Secondary "I'm a brand" CTA lives in the second screen, not the first.
 *
 * Sized to render entirely in the first viewport on a 375×812 device:
 *   - Image band: 60vh
 *   - Headline + CTA: remaining 40vh
 *
 * Hero image: stock Unsplash placeholder until a real Chennai creator
 * shoot exists. Swap by changing the src below.
 */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1605147736020-3acdd0f37e9a?w=900&q=80&auto=format&fit=crop";

const MobileHero = () => {
  return (
    <section
      aria-label="til. — where brands meet Chennai's people"
      className="relative isolate w-full overflow-hidden"
    >
      {/* Image band */}
      <div className="absolute inset-0 -z-10">
        <img
          src={HERO_IMAGE}
          alt=""
          aria-hidden
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
        {/* Bottom-fade gradient overlay so the headline sits on dark */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background"
        />
        {/* Side vignette */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background))_100%)]"
        />
      </div>

      {/* Top chrome: logo */}
      <div className="flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),1rem)]">
        <Link to="/" aria-label="til. home" className="inline-flex items-center min-h-11 min-w-11 -ml-2 px-2">
          <img src="/logo.svg" alt="til" className="h-8 w-auto" />
        </Link>
        <Link
          to="/auth?mode=login"
          className="inline-flex items-center justify-center min-h-11 px-4 text-sm font-medium text-foreground/80 hover:text-foreground"
        >
          Sign in
        </Link>
      </div>

      {/* Headline + CTA */}
      <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col justify-end px-5 pb-[max(env(safe-area-inset-bottom),2rem)]">
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-line">
            Chennai · invite-only
          </p>
          <h1 className="font-heading italic font-medium leading-[1.0] tracking-tight text-foreground">
            <span className="block text-[40px]">where brands meet</span>
            <span className="block text-[56px] gradient-text-hero">Chennai's people.</span>
          </h1>
          <p className="max-w-xs pt-2 text-[15px] leading-snug text-muted-foreground">
            Programmable escrow, KPI-verified payouts and curated briefs — built for the Chennai creator economy.
          </p>
        </div>

        <div className="mt-8">
          <Link to="/auth" className="block">
            <Button
              variant="gradient"
              size="lg"
              className="w-full h-14 text-base font-medium rounded-full active:scale-[0.97]"
            >
              Get started
            </Button>
          </Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            <span aria-hidden>↓</span> swipe up to see how it works
          </p>
        </div>
      </div>
    </section>
  );
};

export default MobileHero;
