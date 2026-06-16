import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Home, Compass, Inbox, MessageSquare, User, Megaphone, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

/**
 * BottomNav — mobile-first primary navigation.
 *
 * Fixed to the bottom of the viewport with safe-area-inset padding.
 * 5 items derived from `user.role`. Active item indicator slides via
 * framer-motion `layoutId`. Tap feedback: scale + 8ms haptic vibration.
 *
 * Hidden on: landing (/), /auth, /onboarding. Layout decides; this
 * component only renders when mounted.
 *
 * Per the Mobile-First Mandate §1:
 *  - fixed bottom (never top — iOS Safari moves the chrome and breaks fixed-top)
 *  - pb-[env(safe-area-inset-bottom)] for the iPhone notch / Android gesture bar
 *  - 16px row min height with 44×44 touch targets per item
 *  - 11–12px label, outlined icon stack
 */
type Role = "creator" | "brand" | "admin";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  match?: (pathname: string) => boolean;
}

const navByRole: Record<Role, NavItem[]> = {
  creator: [
    { label: "Home",     to: "/home",         icon: Home,          match: (p) => p === "/home" },
    { label: "Discover", to: "/campaigns",    icon: Compass,       match: (p) => p.startsWith("/campaigns") },
    { label: "Apps",     to: "/applications", icon: Inbox,         match: (p) => p.startsWith("/applications") || p.startsWith("/workspace") },
    { label: "Messages", to: "/messages",     icon: MessageSquare, match: (p) => p.startsWith("/messages") },
    { label: "Me",       to: "/profile",      icon: User,          match: (p) => p.startsWith("/profile") || p === "/settings" || p === "/earnings" },
  ],
  brand: [
    { label: "Home",         to: "/home",          icon: Home,          match: (p) => p === "/home" },
    { label: "Campaigns",    to: "/campaigns",     icon: Megaphone,     match: (p) => p.startsWith("/campaigns") },
    { label: "Applications", to: "/applications",  icon: Inbox,         match: (p) => p.startsWith("/applications") },
    { label: "Messages",     to: "/messages",      icon: MessageSquare, match: (p) => p.startsWith("/messages") },
    { label: "Me",           to: "/profile",       icon: User,          match: (p) => p.startsWith("/profile") || p === "/settings" || p === "/saved" },
  ],
  admin: [
    { label: "Home",     to: "/home",         icon: Home,          match: (p) => p === "/home" },
    { label: "Admin",    to: "/admin",        icon: ShieldCheck,   match: (p) => p.startsWith("/admin") },
    { label: "Apps",     to: "/applications", icon: Inbox,         match: (p) => p.startsWith("/applications") },
    { label: "Messages", to: "/messages",     icon: MessageSquare, match: (p) => p.startsWith("/messages") },
    { label: "Me",       to: "/profile",      icon: User,          match: (p) => p.startsWith("/profile") || p === "/settings" },
  ],
};

const tapHaptic = () => {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(8);
  }
};

const BottomNav: React.FC = () => {
  const { role } = useAuth();
  const location = useLocation();
  const reduced = useReducedMotion();
  const items = navByRole[(role ?? "creator") as Role];

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed bottom-0 inset-x-0 z-40",
        "border-t border-border bg-card/95 backdrop-blur",
        "pb-[max(env(safe-area-inset-bottom),0.25rem)] pt-1",
      )}
    >
      <ul className="flex items-stretch justify-around max-w-screen-sm mx-auto">
        {items.map((it) => {
          const active = it.match ? it.match(location.pathname) : location.pathname === it.to;
          const Icon = it.icon;
          return (
            <li key={it.to} className="flex-1">
              <NavLink
                to={it.to}
                aria-label={it.label}
                aria-current={active ? "page" : undefined}
                onClick={tapHaptic}
                className={({ isActive }) =>
                  cn(
                    "relative flex h-16 min-w-11 flex-col items-center justify-center gap-1 px-1",
                    "transition-colors duration-fast ease-out-soft",
                    "active:scale-[0.95]",
                    (isActive || active) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {active && (
                  <motion.span
                    layoutId={reduced ? undefined : "bottom-nav-active"}
                    className="absolute top-0 h-0.5 w-10 rounded-full bg-gold"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <Icon className={cn("size-6 shrink-0", active && "text-gold")} aria-hidden />
                <span className={cn("text-[11px] leading-none", active ? "font-medium" : "font-normal")}>
                  {it.label}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
