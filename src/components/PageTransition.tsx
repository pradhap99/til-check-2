import * as React from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { pageVariants, reducedFade } from "@/lib/motion";

interface PageTransitionProps {
  children: React.ReactNode;
  /** Disable for routes that need full-bleed scroll-pinned scenes (Landing). */
  disabled?: boolean;
}

/**
 * PageTransition — crossfade + 6px y-shift between routes.
 *
 * Wrap <Routes /> so each route key is the pathname; AnimatePresence
 * picks up unmount/mount and animates between them. Honors
 * prefers-reduced-motion by falling back to opacity-only.
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children, disabled }) => {
  const location = useLocation();
  const reduced = useReducedMotion();
  const variants = reduced ? reducedFade : pageVariants;

  if (disabled) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
