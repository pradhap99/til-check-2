/**
 * Motion tokens for the til-check-2 visual language.
 *
 * Synchronized with the CSS variables in src/styles/tokens.css so that
 * JS-driven motion (framer-motion, gsap) and CSS-driven motion share
 * the same vocabulary.
 *
 * Always pair motion with `useReducedMotionPreference()` or
 * `framer-motion`'s `useReducedMotion`, and degrade to opacity-only.
 */

import type { Transition, Variants } from "framer-motion";

/** Durations in seconds (framer-motion uses seconds; CSS uses ms). */
export const duration = {
  instant: 0.1,
  fast: 0.18,
  base: 0.24,
  slow: 0.36,
  cinematic: 0.8,
} as const;

/** Easing curves keyed to the CSS variables. */
export const ease = {
  out: [0.22, 1, 0.36, 1],
  in: [0.55, 0, 0.68, 0.06],
  inOut: [0.65, 0, 0.35, 1],
} as const;

/** Common transitions. */
export const transition: Record<
  "fast" | "base" | "slow" | "cinematic",
  Transition
> = {
  fast: { duration: duration.fast, ease: ease.out },
  base: { duration: duration.base, ease: ease.out },
  slow: { duration: duration.slow, ease: ease.out },
  cinematic: { duration: duration.cinematic, ease: ease.inOut },
};

/** Page-transition variants — crossfade with a 6px y-shift. */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 6 },
  enter: { opacity: 1, y: 0, transition: transition.slow },
  exit: { opacity: 0, y: -6, transition: transition.fast },
};

/** Generic fade-up variant for lists/items. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: transition.base },
};

/** Stagger container — pair with `fadeUp` children. */
export const stagger = (gap = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: gap, delayChildren: 0.04 },
  },
});

/** Heart pop spring (for save toggles). */
export const heartPop: Transition = {
  type: "spring",
  stiffness: 480,
  damping: 18,
  mass: 0.7,
};

/** Reduced-motion fallback: opacity-only, instant. */
export const reducedFade: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: duration.fast } },
  exit: { opacity: 0, transition: { duration: duration.instant } },
};
