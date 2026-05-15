import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
        sans: ["var(--font-body)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
        numeric: ["var(--font-mono)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        /* Brand palette — til. Black + Gold. Read via Tailwind classes
           like `bg-gold`, `text-gold-soft`, `border-gold-deep/40`, etc.
           All values consume CSS variables from src/styles/tokens.css —
           no hex literals in the Tailwind config. */
        gold: {
          DEFAULT: "hsl(var(--gold-primary))",
          soft:    "hsl(var(--gold-soft))",
          deep:    "hsl(var(--gold-deep))",
          line:    "hsl(var(--gold-line))",
          gradient: {
            top: "hsl(45 80% 80%)",
            mid: "hsl(var(--gold-primary))",
            bot: "hsl(var(--gold-deep))",
          },
        },

        /* Legacy aliases preserved so old utility classes / primitives
           keep resolving. Every "champagne" / "emerald" / "onyx" reference
           now resolves to a value in the new gold-on-black system. */
        champagne: {
          DEFAULT: "hsl(var(--champagne))",
          soft: "hsl(var(--champagne-soft))",
          deep: "hsl(var(--champagne-deep))",
        },
        emerald: {
          DEFAULT: "hsl(var(--emerald))",
          soft: "hsl(var(--emerald-soft))",
          deep: "hsl(var(--emerald-deep))",
        },
        onyx: {
          DEFAULT: "hsl(var(--onyx))",
          elev: "hsl(var(--onyx-elev))",
          "elev-2": "hsl(var(--onyx-elev-2))",
        },
        ivory: {
          DEFAULT: "hsl(var(--ivory))",
          elev: "hsl(var(--ivory-elev))",
          "elev-2": "hsl(var(--ivory-elev-2))",
        },
        parchment: {
          DEFAULT: "hsl(var(--parchment))",
          muted: "hsl(var(--parchment-muted))",
        },

        /* Status semantics — exposed for chips and pills. */
        status: {
          live: "hsl(var(--status-live))",
          pending: "hsl(var(--status-pending))",
          closed: "hsl(var(--status-closed))",
          hot: "hsl(var(--status-hot))",
          danger: "hsl(var(--status-danger))",
          info: "hsl(var(--status-info))",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        "elev-0": "var(--elev-0)",
        "elev-1": "var(--elev-1)",
        "elev-2": "var(--elev-2)",
        "elev-3": "var(--elev-3)",
      },
      backgroundImage: {
        "gradient-brand": "var(--gradient-brand)",
        "gradient-celebrate": "var(--gradient-celebrate)",
        "gradient-glass": "var(--gradient-glass)",
      },
      transitionTimingFunction: {
        "ease-out-soft": "var(--ease-out)",
        "ease-in-soft": "var(--ease-in)",
        "ease-in-out-soft": "var(--ease-in-out)",
      },
      transitionDuration: {
        instant: "var(--t-instant)",
        fast: "var(--t-fast)",
        base: "var(--t-base)",
        slow: "var(--t-slow)",
        cinematic: "var(--t-cinematic)",
      },
      spacing: {
        "section-y": "var(--space-section-y)",
        "section-y-lg": "var(--space-section-y-lg)",
        "section-x": "var(--space-section-x)",
        "section-x-lg": "var(--space-section-x-lg)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--champagne) / 0.15)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--champagne) / 0.40)" },
        },
        "heart-pop": {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(0.85)" },
          "60%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.35s var(--ease-out) forwards",
        "fade-in": "fade-in 0.3s var(--ease-out) forwards",
        "slide-up": "slide-up 0.4s var(--ease-out)",
        float: "float 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "heart-pop": "heart-pop 0.45s var(--ease-out)",
      },
    },
  },
  plugins: [tailwindAnimate],
} satisfies Config;
