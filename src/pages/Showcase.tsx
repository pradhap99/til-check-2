import * as React from "react";
import { Heart, Sparkles, MessageSquare, Filter, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { StatusPill } from "@/components/ui/status-pill";
import { CountdownPill } from "@/components/ui/countdown-pill";
import { RatingStars } from "@/components/ui/rating-stars";
import { PriceTag } from "@/components/ui/price-tag";
import { AvatarStack } from "@/components/ui/avatar-stack";
import { TimelineTrack } from "@/components/ui/timeline-track";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { SmartImage } from "@/components/ui/smart-image";
import { HeroBanner } from "@/components/ui/hero-banner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetBody,
  BottomSheetFooter,
} from "@/components/ui/bottom-sheet";

/**
 * Phase A showcase — single-route demo of every new primitive
 * against the Luxury Champagne tokens. Public route (no auth) so
 * a reviewer can verify the foundations without signing in.
 */
const Section: React.FC<React.PropsWithChildren<{ title: string; subtitle?: string }>> = ({
  title,
  subtitle,
  children,
}) => (
  <section className="space-y-3">
    <div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
    {children}
  </section>
);

const Swatch: React.FC<{ label: string; cssVar: string; foreground?: string }> = ({
  label,
  cssVar,
  foreground = "text-foreground",
}) => (
  <div className="space-y-1.5">
    <div
      className="h-16 rounded-lg ring-1 ring-inset ring-border"
      style={{ background: `hsl(var(${cssVar}))` }}
    />
    <div className="flex items-center justify-between text-xs">
      <span className={`font-medium ${foreground}`}>{label}</span>
      <code className="font-numeric text-muted-foreground" data-numeric="true">{cssVar}</code>
    </div>
  </div>
);

const sampleSteps = [
  { id: "posted",    label: "Posted",     helper: "May 10" },
  { id: "reviewing", label: "Reviewing",  helper: "May 11" },
  { id: "selected",  label: "Selected",   helper: "today" },
  { id: "progress",  label: "In progress" },
  { id: "delivered", label: "Delivered" },
  { id: "paid",      label: "Paid" },
  { id: "confirmed", label: "Confirmed" },
];

const samplePeople = [
  { fallback: "AS", alt: "Aisha S." },
  { fallback: "MK", alt: "Manish K." },
  { fallback: "RN", alt: "Riya N." },
  { fallback: "OS", alt: "Omar S." },
  { fallback: "JL", alt: "Jia L." },
  { fallback: "TP", alt: "Tomás P." },
];

const Showcase: React.FC = () => {
  const [rating, setRating] = React.useState(4);
  const tomorrow = React.useMemo(() => Date.now() + 36 * 60 * 60 * 1000, []);
  const soon = React.useMemo(() => Date.now() + 45 * 60 * 1000, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <span aria-hidden className="inline-block size-8 rounded-md bg-gradient-brand shadow-elev-2" />
            <div>
              <p className="text-sm font-semibold tracking-tight">Phase A — Foundations</p>
              <p className="text-xs text-muted-foreground">Luxury Champagne · dark-first</p>
            </div>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded-sm border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-numeric text-muted-foreground">
            ⌘K opens the palette
          </kbd>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-4 py-8 pb-24">
        <Section title="Tokens" subtitle="Single source of truth — every color downstream resolves through these.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            <Swatch label="Champagne"      cssVar="--champagne" />
            <Swatch label="Champagne soft" cssVar="--champagne-soft" />
            <Swatch label="Champagne deep" cssVar="--champagne-deep" />
            <Swatch label="Emerald"        cssVar="--emerald" />
            <Swatch label="Emerald soft"   cssVar="--emerald-soft" />
            <Swatch label="Emerald deep"   cssVar="--emerald-deep" />
            <Swatch label="Onyx"           cssVar="--onyx" />
            <Swatch label="Onyx elev"      cssVar="--onyx-elev" />
            <Swatch label="Onyx elev-2"    cssVar="--onyx-elev-2" />
            <Swatch label="Ivory"          cssVar="--ivory" />
            <Swatch label="Parchment"      cssVar="--parchment" />
            <Swatch label="Parchment muted" cssVar="--parchment-muted" />
          </div>
        </Section>

        <Section title="Elevation" subtitle="elev-0 → elev-3 shadow stack.">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(["elev-0", "elev-1", "elev-2", "elev-3"] as const).map((e) => (
              <div
                key={e}
                className={`flex h-24 items-center justify-center rounded-lg bg-card text-sm font-medium text-card-foreground shadow-${e}`}
              >
                {e}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Buttons" subtitle="default · gradient · ghost-lift · outline · secondary · destructive">
          <div className="flex flex-wrap items-center gap-2">
            <Button>Default</Button>
            <Button variant="gradient">
              <Sparkles aria-hidden /> Draft with AI
            </Button>
            <Button variant="ghost-lift">Ghost lift</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </Section>

        <Section title="Chips · Pills · Countdowns">
          <div className="flex flex-wrap items-center gap-2">
            <Chip variant="primary" leadingIcon={<Sparkles />}>AI Pick</Chip>
            <Chip variant="emerald">Premium</Chip>
            <Chip variant="neutral">Fashion</Chip>
            <Chip variant="outline">Beauty</Chip>
            <Chip variant="selected">Selected niche</Chip>
            <StatusPill tone="live">Live</StatusPill>
            <StatusPill tone="pending">Pending</StatusPill>
            <StatusPill tone="closed">Closed</StatusPill>
            <StatusPill tone="hot">Hot</StatusPill>
            <StatusPill tone="info">In review</StatusPill>
            <CountdownPill deadline={tomorrow} />
            <CountdownPill deadline={soon} />
            <CountdownPill deadline={Date.now() - 10_000} />
          </div>
        </Section>

        <Section title="Rating · Price · Avatar stack">
          <div className="flex flex-wrap items-center gap-6">
            <RatingStars value={rating} onChange={setRating} showValue />
            <PriceTag amount={2500} suffix="/post" />
            <PriceTag tone="emerald" amount={75_000} suffix="campaign" />
            <PriceTag tone="primary" range={[1500, 4000]} suffix="range" />
            <AvatarStack people={samplePeople} max={4} size="md" />
          </div>
        </Section>

        <Section title="Timeline — 7-stage campaign loop">
          <div className="rounded-lg border border-border bg-card p-4 shadow-elev-1">
            <TimelineTrack steps={sampleSteps} currentIndex={2} />
          </div>
        </Section>

        <Section title="Cards" subtitle="Skeleton · Empty · Error states">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Skeleton</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
            <Card>
              <EmptyState
                title="No applications yet"
                description="When creators apply, you'll see them here."
                action={{ label: "Create campaign" }}
                illustration={
                  <div className="inline-flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Megaphone aria-hidden />
                  </div>
                }
                size="sm"
              />
            </Card>
            <Card>
              <ErrorState
                inline
                onRetry={() => {/* showcase */}}
                description="We couldn't load this for a sec. Worth another try."
              />
            </Card>
          </div>
        </Section>

        <Section title="HeroBanner" subtitle="Embla carousel with autoplay, dotted nav, tone overlay.">
          <HeroBanner
            aspect="21/9"
            autoplayMs={4000}
            slides={[
              {
                id: "1",
                eyebrow: "Trending now",
                title: "Beauty creators in Mumbai",
                description: "37 brands shortlisting this week.",
                cta: { label: "Browse campaigns", href: "/campaigns" },
                tone: "champagne",
              },
              {
                id: "2",
                eyebrow: "AI pick",
                title: "Matched to your last 3 deliverables",
                description: "Open the recommendations for a tailored list.",
                cta: { label: "See picks", href: "/recommendations" },
                tone: "emerald",
              },
              {
                id: "3",
                eyebrow: "New brand",
                title: "Skincare house just launched a UGC brief",
                description: "12 slots, deadline in 6 days.",
                cta: { label: "Apply now", href: "/campaigns" },
                tone: "onyx",
              },
            ]}
          />
        </Section>

        <Section title="SmartImage" subtitle="Lazy + blurhash placeholder + Supabase render transform.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SmartImage
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80"
              alt="Sample"
              aspect="1/1"
              wrapperClassName="rounded-lg"
            />
            <SmartImage
              src="https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&q=80"
              alt="Sample"
              aspect="1/1"
              wrapperClassName="rounded-lg"
            />
            <SmartImage
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80"
              alt="Sample"
              aspect="1/1"
              wrapperClassName="rounded-lg"
            />
            <SmartImage
              src="https://images.unsplash.com/photo-1485518882345-15568b007407?w=400&q=80"
              alt="Sample"
              aspect="1/1"
              wrapperClassName="rounded-lg"
            />
          </div>
        </Section>

        <Section title="BottomSheet" subtitle="vaul-powered, grab handle, scroll-locked body.">
          <BottomSheet>
            <BottomSheetTrigger asChild>
              <Button variant="outline">
                <Filter aria-hidden /> Open filter sheet
              </Button>
            </BottomSheetTrigger>
            <BottomSheetContent>
              <BottomSheetHeader>
                <BottomSheetTitle>Filter campaigns</BottomSheetTitle>
                <BottomSheetDescription>Niche, budget, deadline, location.</BottomSheetDescription>
              </BottomSheetHeader>
              <BottomSheetBody>
                <div className="grid grid-cols-2 gap-2 py-2">
                  {["Beauty", "Fashion", "Food", "Fitness", "Tech", "Travel", "Comedy", "Lifestyle"].map((n) => (
                    <Chip key={n} variant="outline">{n}</Chip>
                  ))}
                </div>
              </BottomSheetBody>
              <BottomSheetFooter>
                <Button variant="ghost">Clear</Button>
                <Button variant="gradient">Apply</Button>
              </BottomSheetFooter>
            </BottomSheetContent>
          </BottomSheet>
        </Section>

        <Section title="Gradient + Typography">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-champagne">
                Luxury Champagne
              </p>
              <h1 className="mt-2 text-4xl sm:text-6xl font-semibold tracking-tight">
                <span className="gradient-text-hero">Quiet, premium, refined.</span>
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Inter Variable for UI. Geist Mono for{" "}
                <span data-numeric="true" className="font-numeric tabular-nums">128,495 numerics</span>.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Heart aria-hidden className="size-5 text-status-hot" />
                <MessageSquare aria-hidden className="size-5 text-emerald" />
                <Sparkles aria-hidden className="size-5 text-champagne" />
              </div>
            </CardContent>
          </Card>
        </Section>
      </main>
    </div>
  );
};

export default Showcase;
