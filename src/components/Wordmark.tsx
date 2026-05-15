import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Wordmark — inline SVG til. wordmark with the two-ring dot.
 *
 * Why inline (instead of <img src="/logo.svg">):
 * Browsers don't apply document fonts to SVGs loaded via <img>. The
 * wordmark relies on Cormorant Garamond italic, which `@fontsource-
 * variable/cormorant-garamond` loads at the document level. Rendering
 * inline lets the SVG inherit the document font and read as Cormorant
 * instead of Georgia fallback.
 *
 * Use this for visible UI surfaces. Keep public/logo.svg for OG cards,
 * favicons and external collateral.
 */
interface WordmarkProps extends React.SVGAttributes<SVGSVGElement> {
  /** Force a single colour (e.g. for footers). Default: gold gradient. */
  variant?: "gradient" | "solid";
  /** Override the solid fill colour token. Only used when variant="solid". */
  solidColor?: string;
}

let idCounter = 0;
const nextId = () => `til-wm-${++idCounter}`;

export const Wordmark: React.FC<WordmarkProps> = ({
  variant = "gradient",
  solidColor = "currentColor",
  className,
  ...props
}) => {
  // Stable unique IDs per render so multiple Wordmarks on one page don't collide.
  const ids = React.useMemo(
    () => ({ word: nextId(), ring: nextId(), core: nextId() }),
    [],
  );
  return (
    <svg
      viewBox="0 0 280 110"
      role="img"
      aria-label="til."
      className={cn("inline-block", className)}
      {...props}
    >
      {variant === "gradient" && (
        <defs>
          <linearGradient id={ids.word} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="hsl(45 80% 80%)" />
            <stop offset="45%" stopColor="hsl(43 75% 52%)" />
            <stop offset="100%" stopColor="hsl(38 75% 30%)" />
          </linearGradient>
          <linearGradient id={ids.ring} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="hsl(45 80% 80%)" />
            <stop offset="45%" stopColor="hsl(43 75% 52%)" />
            <stop offset="100%" stopColor="hsl(38 75% 30%)" />
          </linearGradient>
          <linearGradient id={ids.core} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"  stopColor="hsl(43 67% 77%)" />
            <stop offset="100%" stopColor="hsl(39 50% 58%)" />
          </linearGradient>
        </defs>
      )}

      <text
        x="0"
        y="86"
        fill={variant === "gradient" ? `url(#${ids.word})` : solidColor}
        fontFamily="var(--font-display)"
        fontStyle="italic"
        fontWeight="500"
        fontSize="110"
        letterSpacing="-2"
      >
        til
      </text>

      {/* "." is the two-ring mark. */}
      <g transform="translate(192, 64)">
        <circle
          cx="0"
          cy="0"
          r="20"
          fill="none"
          stroke={variant === "gradient" ? `url(#${ids.ring})` : solidColor}
          strokeWidth="4.2"
        />
        <circle
          cx="6"
          cy="0"
          r="13"
          fill={variant === "gradient" ? `url(#${ids.core})` : solidColor}
        />
      </g>
    </svg>
  );
};

export default Wordmark;
