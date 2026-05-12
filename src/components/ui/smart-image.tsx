import * as React from "react";
import { decode } from "blurhash";
import { cn } from "@/lib/utils";

interface SmartImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "loading" | "decoding"> {
  /**
   * Image source URL. If it's a Supabase public storage URL, you can pass
   * `transform` to request resized variants via the render endpoint.
   */
  src: string;
  /** Optional Blurhash string to render a low-detail placeholder. */
  blurhash?: string;
  /** Decoded blurhash size (px). Don't go above 32. */
  blurhashResolution?: number;
  /** Aspect ratio CSS value (e.g. "16/9", "1/1"). Wraps in a sized box. */
  aspect?: string;
  /** Container className (applies to the outer wrapper). */
  wrapperClassName?: string;
  /** Skip the fade-in when the image finishes loading. */
  noFade?: boolean;
  /** Supabase render transform — width/height/quality. Ignored for non-Supabase URLs. */
  transform?: { width?: number; height?: number; quality?: number; resize?: "cover" | "contain" | "fill" };
}

function applySupabaseTransform(src: string, t?: SmartImageProps["transform"]) {
  if (!t) return src;
  try {
    const url = new URL(src, window.location.origin);
    if (!url.pathname.includes("/storage/v1/object/public/")) return src;
    url.pathname = url.pathname.replace(
      "/storage/v1/object/public/",
      "/storage/v1/render/image/public/",
    );
    if (t.width) url.searchParams.set("width", String(t.width));
    if (t.height) url.searchParams.set("height", String(t.height));
    if (t.quality) url.searchParams.set("quality", String(t.quality));
    if (t.resize) url.searchParams.set("resize", t.resize);
    return url.toString();
  } catch {
    return src;
  }
}

function blurhashToDataUri(hash: string, w: number, h: number) {
  try {
    const pixels = decode(hash, w, h);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const image = ctx.createImageData(w, h);
    image.data.set(pixels);
    ctx.putImageData(image, 0, 0);
    return canvas.toDataURL();
  } catch {
    return null;
  }
}

const SmartImage = React.forwardRef<HTMLImageElement, SmartImageProps>(
  (
    {
      src,
      blurhash,
      blurhashResolution = 24,
      aspect,
      className,
      wrapperClassName,
      noFade,
      transform,
      alt = "",
      ...props
    },
    ref,
  ) => {
    const [loaded, setLoaded] = React.useState(false);
    const [bg, setBg] = React.useState<string | null>(null);
    const finalSrc = React.useMemo(() => applySupabaseTransform(src, transform), [src, transform]);

    React.useEffect(() => {
      if (!blurhash) return;
      const data = blurhashToDataUri(blurhash, blurhashResolution, blurhashResolution);
      if (data) setBg(data);
    }, [blurhash, blurhashResolution]);

    return (
      <div
        className={cn(
          "relative isolate overflow-hidden bg-secondary",
          wrapperClassName,
        )}
        style={aspect ? { aspectRatio: aspect } : undefined}
      >
        {bg && (
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity duration-slow ease-out-soft",
              loaded ? "opacity-0" : "opacity-100",
            )}
            style={{ backgroundImage: `url(${bg})` }}
          />
        )}
        {!bg && !loaded && (
          <div aria-hidden className="absolute inset-0 animate-pulse bg-muted" />
        )}
        <img
          ref={ref}
          src={finalSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-slow ease-out-soft",
            !noFade && (loaded ? "opacity-100" : "opacity-0"),
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
SmartImage.displayName = "SmartImage";

export { SmartImage };
