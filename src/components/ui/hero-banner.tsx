import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/ui/smart-image";

export interface HeroBannerSlide {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  blurhash?: string;
  cta?: { label: string; href: string };
  tone?: "champagne" | "emerald" | "onyx";
}

interface HeroBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  slides: HeroBannerSlide[];
  /** Autoplay interval in ms. 0 disables. */
  autoplayMs?: number;
  /** Aspect ratio for the banner (default 21/9 desktop, 16/9 mobile via responsive). */
  aspect?: string;
}

const toneToOverlay: Record<NonNullable<HeroBannerSlide["tone"]>, string> = {
  champagne: "from-onyx/85 via-onyx/55 to-champagne-deep/40",
  emerald:   "from-onyx/85 via-onyx/55 to-emerald-deep/40",
  onyx:      "from-onyx/90 via-onyx/60 to-onyx/30",
};

const HeroBanner = React.forwardRef<HTMLDivElement, HeroBannerProps>(
  ({ slides, autoplayMs = 5000, aspect, className, ...props }, ref) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
      if (!emblaApi) return;
      const onSelect = () => setIndex(emblaApi.selectedScrollSnap());
      emblaApi.on("select", onSelect);
      onSelect();
      return () => {
        emblaApi.off("select", onSelect);
      };
    }, [emblaApi]);

    React.useEffect(() => {
      if (!emblaApi || autoplayMs === 0) return;
      const id = window.setInterval(() => emblaApi.scrollNext(), autoplayMs);
      return () => window.clearInterval(id);
    }, [emblaApi, autoplayMs]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-2xl border border-border bg-card shadow-elev-2",
          className,
        )}
        style={aspect ? { aspectRatio: aspect } : undefined}
        {...props}
      >
        <div ref={emblaRef} className="h-full overflow-hidden">
          <div className="flex h-full">
            {slides.map((s) => (
              <div
                key={s.id}
                className="relative h-full min-w-0 flex-[0_0_100%]"
              >
                {s.imageUrl ? (
                  <SmartImage
                    src={s.imageUrl}
                    blurhash={s.blurhash}
                    alt=""
                    aspect={aspect ?? "21/9"}
                    wrapperClassName="absolute inset-0"
                    transform={{ width: 1600, quality: 80 }}
                  />
                ) : (
                  <div aria-hidden className="absolute inset-0 bg-gradient-brand" />
                )}
                <div
                  aria-hidden
                  className={cn(
                    "absolute inset-0 bg-gradient-to-tr",
                    toneToOverlay[s.tone ?? "champagne"],
                  )}
                />
                <div className="relative z-10 flex h-full flex-col justify-end gap-2 p-5 sm:p-8 md:p-12 text-parchment">
                  {s.eyebrow && (
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-champagne">
                      {s.eyebrow}
                    </span>
                  )}
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight max-w-2xl">
                    {s.title}
                  </h2>
                  {s.description && (
                    <p className="max-w-xl text-sm sm:text-base text-parchment/85">
                      {s.description}
                    </p>
                  )}
                  {s.cta && (
                    <a
                      href={s.cta.href}
                      className="mt-3 inline-flex h-10 w-fit items-center rounded-md bg-gradient-brand px-4 text-sm font-medium text-primary-foreground shadow-elev-2 transition-transform duration-base ease-out-soft hover:-translate-y-px"
                    >
                      {s.cta.label}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <div className="absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-base ease-out-soft",
                  i === index
                    ? "w-7 bg-champagne"
                    : "w-2 bg-parchment/40 hover:bg-parchment/60",
                )}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);
HeroBanner.displayName = "HeroBanner";

export { HeroBanner };
