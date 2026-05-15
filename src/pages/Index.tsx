import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MessageCircle, Search } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Chip } from "@/components/ui/chip";
import CampaignCard from "@/components/CampaignCard";

/**
 * /home — mobile-first authenticated home.
 *
 * Per Mobile-First Mandate §2.7:
 *   1. Greeting hero  (auto-shrinks on scroll; compact header on small)
 *   2. Niche chips strip (horizontally scrolling, snap-x)
 *   3. Feed of full-width campaign cards (1 column, image-dominant)
 *
 * No "Top creators carousel" / "Recent applications" / "Saved campaigns"
 * pile-up on the same screen. Each gets its own tab in the bottom nav.
 */

interface Campaign {
  id: string;
  title: string;
  category: string;
  budget?: string | number | null;
  deadline?: string | null;
  cover_image_url?: string | null;
  brand_user_id?: string | null;
  niche_targeting?: string[] | null;
  location_targeting?: string[] | null;
  status?: string | null;
}

const NICHE_OPTIONS = ["All", "Beauty", "Fashion", "Food", "Fitness", "Tech", "Travel", "Lifestyle"];

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Good evening";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const Index = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const firstName = (user?.user_metadata as { full_name?: string } | undefined)?.full_name?.split(" ")[0] || "there";
  const avatarUrl = (user?.user_metadata as { avatar_url?: string } | undefined)?.avatar_url;
  const initials = firstName.charAt(0).toUpperCase();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNiche, setActiveNiche] = useState("All");
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [unreadMsgs, setUnreadMsgs] = useState(0);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const { data } = await supabase
        .from("campaigns")
        .select("id, title, category, budget, deadline, cover_image_url, brand_user_id, niche_targeting, location_targeting, status")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(24);
      setCampaigns((data as Campaign[] | null) ?? []);
      setLoading(false);
    })();

    void supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false)
      .then(({ count }) => setUnreadNotifs(count ?? 0));

    void supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("recipient_user_id", user.id)
      .eq("read", false)
      .then(({ count }) => setUnreadMsgs(count ?? 0));
  }, [user]);

  const filtered = useMemo(() => {
    if (activeNiche === "All") return campaigns;
    return campaigns.filter(
      (c) =>
        c.category === activeNiche ||
        (c.niche_targeting && c.niche_targeting.includes(activeNiche)),
    );
  }, [campaigns, activeNiche]);

  return (
    <Layout>
      <div className="pt-[env(safe-area-inset-top)]">
        {/* Section 1 — Greeting */}
        <header className="px-5 pt-4 pb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="size-11 ring-1 ring-border">
              <AvatarImage src={avatarUrl} alt={firstName} />
              <AvatarFallback className="bg-secondary text-secondary-foreground font-medium text-sm">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground leading-none">{greeting()},</p>
              <h1 className="text-xl font-medium text-foreground tracking-tight leading-tight truncate">{firstName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => navigate("/messages")}
              aria-label="Messages"
              className="relative inline-flex items-center justify-center size-11 rounded-full text-foreground hover:bg-secondary active:scale-95"
            >
              <MessageCircle className="size-5" aria-hidden />
              {unreadMsgs > 0 && (
                <span aria-hidden className="absolute right-2 top-2 size-2 rounded-full bg-status-hot ring-2 ring-background" />
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/notifications")}
              aria-label="Notifications"
              className="relative inline-flex items-center justify-center size-11 rounded-full text-foreground hover:bg-secondary active:scale-95"
            >
              <Bell className="size-5" aria-hidden />
              {unreadNotifs > 0 && (
                <span aria-hidden className="absolute right-2 top-2 size-2 rounded-full bg-status-hot ring-2 ring-background" />
              )}
            </button>
          </div>
        </header>

        <p className="px-5 -mt-1 pb-3 text-sm text-muted-foreground">
          {loading ? "Loading Chennai campaigns…" : `${filtered.length} ${filtered.length === 1 ? "campaign" : "campaigns"} near you`}
        </p>

        {/* Search trigger — opens /campaigns search */}
        <div className="px-5 pb-3">
          <button
            type="button"
            onClick={() => navigate(role === "brand" ? "/creators" : "/campaigns")}
            className="flex h-12 w-full items-center gap-2 rounded-full bg-card border border-border px-4 text-left active:scale-[0.98]"
            aria-label="Search campaigns and creators"
          >
            <Search className="size-4 text-muted-foreground" aria-hidden />
            <span className="text-sm text-muted-foreground">
              {role === "brand" ? "Find a Chennai creator" : "Find a campaign"}
            </span>
          </button>
        </div>

        {/* Section 2 — Niche chips */}
        <nav
          aria-label="Filter by niche"
          className="px-5 pb-3 flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          {NICHE_OPTIONS.map((niche) => (
            <button
              key={niche}
              type="button"
              onClick={() => setActiveNiche(niche)}
              className="snap-start shrink-0 min-h-11"
            >
              <Chip
                variant={activeNiche === niche ? "selected" : "outline"}
                size="md"
              >
                {niche}
              </Chip>
            </button>
          ))}
        </nav>

        {/* Section 3 — Feed */}
        <section className="px-5 pb-6 space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-44 w-full rounded-2xl" />
            ))
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No campaigns match this niche"
              description="Try a different niche, or browse everything."
              action={{ label: "Browse all", onClick: () => setActiveNiche("All") }}
            />
          ) : (
            filtered.map((c, i) => (
              <CampaignCard
                key={c.id}
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                campaign={c as any}
                index={i}
              />
            ))
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Index;
