import { useState } from "react";
import Layout from "@/components/Layout";
import { Bell, Search, MessageCircle } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  preview: string;
  date: string;
  unread: boolean;
}

const personalised: Notification[] = [
  { id: "p1", title: "Campaign Match Found", preview: "We found 3 new campaigns matching your profile and niche. Check them out before slots fill up!", date: "Just now", unread: true },
  { id: "p2", title: "Application Accepted!", preview: "Congratulations! You have been accepted for Lenskart SS'26 — Style Your Vision campaign.", date: "2h ago", unread: true },
  { id: "p3", title: "Campaign Reminder", preview: "Your upcoming collaboration with boAt starts in 2 days. Make sure your content is ready!", date: "5h ago", unread: false },
  { id: "p4", title: "Review Request", preview: "Thanks for completing the Mamaearth campaign. Please rate your experience working with them.", date: "1d ago", unread: false },
  { id: "p5", title: "Campaign Confirmation", preview: "Perfect! You have confirmed your participation in CRED's rewards campaign.", date: "2d ago", unread: false },
  { id: "p6", title: "Campaign Full", preview: "The Sugar Cosmetics campaign is now full. Check similar campaigns in Beauty & Skincare.", date: "2d ago", unread: true },
  { id: "p7", title: "Payment Released", preview: "Your payment of ₹15,000 for boAt Summer Audio has been released to your account.", date: "3d ago", unread: false },
];

const general: Notification[] = [
  { id: "g1", title: "New Feature: Map View", preview: "Discover campaigns near you with our new interactive map view on the home page!", date: "1d ago", unread: true },
  { id: "g2", title: "Platform Update", preview: "We have improved the application process. Check what is new in your campaign workflow.", date: "3d ago", unread: false },
  { id: "g3", title: "Tips for Creators", preview: "Boost your profile strength to get matched with premium brands. Complete your media kit today.", date: "5d ago", unread: false },
];

const Alerts = () => {
  const [tab, setTab] = useState<"personalised" | "general">("personalised");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = tab === "personalised" ? personalised : general;

  const filtered = searchQuery
    ? notifications.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.preview.toLowerCase().includes(searchQuery.toLowerCase()))
    : notifications;

  const isUnread = (n: Notification) => n.unread && !readIds.has(n.id);

  const markRead = (id: string) => {
    setReadIds(prev => new Set(prev).add(id));
  };

  return (
    <Layout>
      <div className="radial-gradient-bg min-h-screen">
        {/* Header */}
        <header className="px-5 pt-6 pb-1 flex items-center justify-between">
          <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">Alerts</h1>
          <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center">
            <span className="text-sm font-heading font-bold text-accent">TIL</span>
          </div>
        </header>

        {/* Search */}
        <div className="px-5 mt-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search in inbox"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/50"
            />
          </div>
        </div>

        {/* Tab Pills */}
        <div className="px-5 mt-4 flex gap-2">
          <button
            onClick={() => setTab("personalised")}
            className={`px-5 py-2 rounded-full text-xs font-heading font-semibold transition-all ${
              tab === "personalised"
                ? "bg-accent text-accent-foreground shadow-elev-3 shadow-accent/20"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            Personalised
          </button>
          <button
            onClick={() => setTab("general")}
            className={`px-5 py-2 rounded-full text-xs font-heading font-semibold transition-all ${
              tab === "general"
                ? "bg-accent text-accent-foreground shadow-elev-3 shadow-accent/20"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            General
          </button>
        </div>

        {/* Notification List */}
        <div className="px-5 mt-4 pb-8 space-y-2">
          {filtered.map((notif, i) => {
            const unread = isUnread(notif);
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] opacity-0 animate-fade-up ${
                  unread ? "bg-accent/5 border-accent/20" : "bg-card border-border"
                }`}
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: "forwards" }}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-heading font-bold text-accent">TIL</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-[13px] font-heading leading-tight ${unread ? "font-bold text-foreground" : "font-semibold text-foreground"}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[9px] text-muted-foreground shrink-0 mt-0.5">{notif.date}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{notif.preview}</p>
                </div>

                {/* Unread dot */}
                {unread && (
                  <span className="w-2.5 h-2.5 rounded-full bg-destructive shrink-0 mt-1.5 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        {/* Floating Chat FAB */}
        <button className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-elev-3 shadow-accent/30 active:scale-90 transition-transform">
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
    </Layout>
  );
};

export default Alerts;
