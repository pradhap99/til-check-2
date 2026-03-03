import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Bell, CheckCircle, Briefcase, MessageCircle, Star, TrendingUp, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string | null;
  read: boolean | null;
  created_at: string;
  reference_id: string | null;
  reference_type: string | null;
}

const typeIcons: Record<string, any> = {
  campaign: Briefcase,
  application: CheckCircle,
  message: MessageCircle,
  review: Star,
  general: Bell,
  profile: TrendingUp,
};

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setNotifications(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Realtime
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("notifications-realtime")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${user.id}`,
      }, () => fetchNotifications())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClick = (notif: Notification) => {
    markRead(notif.id);
    if (notif.reference_type === "campaign" && notif.reference_id) {
      navigate(`/campaigns/${notif.reference_id}`);
    } else if (notif.reference_type === "application") {
      navigate("/applications");
    } else if (notif.reference_type === "message" && notif.reference_id) {
      navigate(`/messages/${notif.reference_id}`);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout>
      <header className="px-4 pt-6 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs text-primary font-heading font-medium">
            Mark all read
          </button>
        )}
      </header>

      <div className="mt-2">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 rounded-xl gradient-primary animate-pulse-glow mx-auto" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Bell className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-heading font-medium text-muted-foreground">No notifications yet</p>
            <p className="text-xs text-muted-foreground mt-1">We'll notify you about campaigns, messages, and more</p>
          </div>
        ) : (
          notifications.map((notif, i) => {
            const Icon = typeIcons[notif.type || "general"] || Bell;
            return (
              <div
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`px-4 py-3.5 flex items-start gap-3 cursor-pointer transition-colors opacity-0 animate-fade-up ${
                  !notif.read ? "bg-primary/5" : "hover:bg-secondary/30"
                }`}
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: "forwards" }}
              >
                <div className={`w-9 h-9 rounded-xl ${!notif.read ? "gradient-primary" : "bg-secondary"} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${!notif.read ? "text-primary-foreground" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-heading ${!notif.read ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}>{notif.title}</h3>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{formatTime(notif.created_at)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                )}
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
