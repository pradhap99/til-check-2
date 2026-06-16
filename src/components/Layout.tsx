import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Authenticated app shell.
 *
 * BottomNav sits at the bottom on authenticated routes that aren't
 * onboarding. Body padding reserves the bottom nav height + safe-area-inset
 * so the last row of content isn't covered.
 *
 * Routes that need a different shell (landing, auth, onboarding) don't
 * use <Layout>.
 *
 * AppHeader is NOT auto-mounted here — each page renders its own top
 * chrome today (greetings, custom search, etc.). When the mobile-first
 * home rewrite (§2.7) lands, the per-page headers collapse and AppHeader
 * moves here.
 */

const HIDE_NAV_ROUTES = ["/onboarding"];

const Layout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
  const showBottomNav = !!user && !HIDE_NAV_ROUTES.some((p) => location.pathname.startsWith(p));

  return (
    <div className="min-h-screen bg-background">
      <main
        className={
          showBottomNav
            ? "max-w-screen-sm mx-auto pb-[calc(4rem+env(safe-area-inset-bottom))]"
            : "max-w-screen-sm mx-auto pb-6"
        }
      >
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default Layout;
