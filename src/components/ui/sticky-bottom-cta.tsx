import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * StickyBottomCTA — fixed-bottom action bar for action-driven mobile pages.
 *
 * Sits above the BottomNav (which is at z-40); this is z-50 so it
 * always stacks above. Adds `pb-[env(safe-area-inset-bottom)]` so
 * iPhone notch / Android gesture bar don't eat the CTA.
 *
 * Layout:
 *   [ left meta (price, countdown, helper) | right action(s) ]
 *
 * Pages that mount this should add `pb-32` (or `pb-[7rem]`) to their
 * main scroll container so the last content row isn't covered.
 *
 * Used on /campaigns/:id, /campaigns/create (last step), /profile/:userId,
 * /campaigns/:id/manage. Per Mobile-First Mandate §2.4.
 */
interface StickyBottomCTAProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left-aligned meta (price, countdown, helper text). Optional. */
  meta?: React.ReactNode;
  /** Action node(s) — usually a primary <Button variant="gradient">. */
  children: React.ReactNode;
  /** Sit above the BottomNav (default true). Set false on routes
      where BottomNav isn't mounted (e.g. detail pages opened from a
      modal or full-bleed routes). */
  aboveBottomNav?: boolean;
}

export const StickyBottomCTA: React.FC<StickyBottomCTAProps> = ({
  meta,
  children,
  aboveBottomNav = true,
  className,
  ...props
}) => (
  <div
    role="region"
    aria-label="Page actions"
    className={cn(
      "fixed inset-x-0 z-50 border-t border-border bg-card/95 backdrop-blur",
      "pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 px-4",
      aboveBottomNav ? "bottom-16" : "bottom-0",
      className,
    )}
    {...props}
  >
    <div className="mx-auto flex max-w-screen-sm items-center justify-between gap-3">
      {meta && <div className="min-w-0 flex-1 text-sm text-foreground">{meta}</div>}
      <div className={cn("flex shrink-0 items-center gap-2", !meta && "w-full justify-stretch [&>*]:flex-1")}>
        {children}
      </div>
    </div>
  </div>
);

export default StickyBottomCTA;
