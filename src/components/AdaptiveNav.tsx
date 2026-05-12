import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Megaphone,
  Inbox,
  MessageSquare,
  User,
  Compass,
  Sparkles,
  Bookmark,
  LineChart,
  ShieldCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

type Role = "creator" | "brand" | "admin";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  /** If set, only show on desktop rail. */
  desktopOnly?: boolean;
}

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  creator: [
    { label: "Home",         to: "/home",          icon: Home },
    { label: "Discover",     to: "/campaigns",     icon: Compass },
    { label: "Applications", to: "/applications",  icon: Inbox },
    { label: "Messages",     to: "/messages",      icon: MessageSquare },
    { label: "Earnings",     to: "/earnings",      icon: LineChart, desktopOnly: true },
    { label: "Me",           to: "/profile",       icon: User },
  ],
  brand: [
    { label: "Home",         to: "/home",          icon: Home },
    { label: "Campaigns",    to: "/campaigns",     icon: Megaphone },
    { label: "Applications", to: "/applications",  icon: Inbox },
    { label: "Messages",     to: "/messages",      icon: MessageSquare },
    { label: "Discover",     to: "/recommendations", icon: Sparkles, desktopOnly: true },
    { label: "Saved",        to: "/saved",         icon: Bookmark, desktopOnly: true },
    { label: "Me",           to: "/profile",       icon: User },
  ],
  admin: [
    { label: "Home",      to: "/home",   icon: Home },
    { label: "Admin",     to: "/admin",  icon: ShieldCheck },
    { label: "Campaigns", to: "/campaigns", icon: Megaphone },
    { label: "Users",     to: "/admin?tab=users", icon: Users },
    { label: "Messages",  to: "/messages", icon: MessageSquare },
    { label: "Me",        to: "/profile", icon: User },
  ],
};

interface AdaptiveNavProps {
  /** Force a variant; otherwise responsive. */
  variant?: "bottom" | "rail";
  className?: string;
}

const AdaptiveNav: React.FC<AdaptiveNavProps> = ({ variant, className }) => {
  const { role } = useAuth();
  const location = useLocation();
  const items = NAV_BY_ROLE[(role ?? "creator") as Role];

  const renderActiveIndicator = () => (
    <motion.span
      layoutId="adaptive-nav-active"
      className="absolute inset-0 -z-10 rounded-md bg-secondary"
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    />
  );

  // Bottom tabs (mobile / forced).
  const bottom = (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-border bg-card/95 backdrop-blur",
        "pb-[max(env(safe-area-inset-bottom),0.25rem)] pt-1",
        variant === "rail" ? "" : "lg:hidden",
        className,
      )}
    >
      {items
        .filter((it) => !it.desktopOnly)
        .map((it) => {
          const active = location.pathname.startsWith(it.to);
          const Icon = it.icon;
          return (
            <NavLink
              key={it.to}
              to={it.to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-medium",
                "transition-colors duration-fast ease-out-soft",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="adaptive-nav-bottom"
                  className="absolute -top-px h-0.5 w-8 rounded-full bg-champagne"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={cn("size-5 nav-icon-active", active && "text-champagne")} aria-hidden />
              {it.label}
            </NavLink>
          );
        })}
    </nav>
  );

  // Desktop rail.
  const rail = (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden w-16 flex-col items-center gap-1 border-r border-border bg-card/95 py-4 backdrop-blur xl:w-60 xl:items-stretch xl:px-3",
        variant === "bottom" ? "" : "lg:flex",
        className,
      )}
    >
      <div className="px-2 pb-4 xl:px-3">
        <span className="inline-flex items-center gap-2 font-semibold tracking-tight text-foreground">
          <span className="inline-block size-7 rounded-md bg-gradient-brand shadow-elev-1" aria-hidden />
          <span className="hidden xl:inline">til-check</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        {items.map((it) => {
          const active = location.pathname.startsWith(it.to);
          const Icon = it.icon;
          return (
            <NavLink
              key={it.to}
              to={it.to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center justify-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium xl:justify-start",
                "transition-colors duration-fast ease-out-soft",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && renderActiveIndicator()}
              <Icon className={cn("size-5 shrink-0", active && "text-champagne")} aria-hidden />
              <span className="hidden xl:inline">{it.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );

  if (variant === "bottom") return bottom;
  if (variant === "rail") return rail;
  return (
    <>
      {rail}
      {bottom}
    </>
  );
};

export default AdaptiveNav;
