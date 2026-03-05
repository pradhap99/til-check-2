import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Search, MessageCircle, Briefcase, Tag, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  last_message_at: string | null;
  campaign_id: string | null;
  otherName: string;
  otherAvatar: string;
  lastMessage: string;
  unread: number;
}

const mockConversations = [
  {
    id: "example-1",
    otherName: "boAt Audio",
    otherAvatar: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
    lastMessage: "About Summer Audio Launch...",
    timeAgo: "2h",
    campaignTag: "Summer Audio Launch",
    isExample: true,
  },
  {
    id: "example-2",
    otherName: "Priya Sharma",
    otherAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
    lastMessage: "Revised version uploaded! Check deliverables section.",
    timeAgo: "Yesterday",
    campaignTag: "Skincare Review",
    isExample: true,
  },
  {
    id: "example-3",
    otherName: "Mamaearth",
    otherAvatar: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=80&h=80&fit=crop",
    lastMessage: "We'd love to collaborate! Check your inbox.",
    timeAgo: "3d",
    campaignTag: "Beauty Week",
    isExample: true,
  },
];

const Messages = () => {
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const fetchConversations = async () => {
    if (!user) return;
    const { data: convs } = await supabase
      .from("conversations").select("*")
      .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
      .order("last_message_at", { ascending: false });

    if (!convs || convs.length === 0) { setConversations([]); setLoading(false); return; }

    const otherIds = convs.map(c => c.participant_1 === user.id ? c.participant_2 : c.participant_1);
    const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, avatar_url").in("user_id", otherIds);
    const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));

    const enriched: Conversation[] = await Promise.all(
      convs.map(async (c) => {
        const otherId = c.participant_1 === user.id ? c.participant_2 : c.participant_1;
        const otherProfile = profileMap.get(otherId);
        const { data: msgs } = await supabase.from("messages").select("content, read_at, sender_id").eq("conversation_id", c.id).order("created_at", { ascending: false }).limit(1);
        const { count } = await supabase.from("messages").select("*", { count: "exact", head: true }).eq("conversation_id", c.id).neq("sender_id", user.id).is("read_at", null);
        return {
          ...c,
          otherName: otherProfile?.full_name || "Unknown",
          otherAvatar: otherProfile?.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${otherId.slice(0, 8)}`,
          lastMessage: msgs?.[0]?.content || "No messages yet",
          unread: count || 0,
        };
      })
    );
    setConversations(enriched);
    setLoading(false);
  };

  useEffect(() => { fetchConversations(); }, [user]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel("messages-list").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => { fetchConversations(); }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const filtered = conversations.filter(c => c.otherName.toLowerCase().includes(search.toLowerCase()));
  const totalUnread = conversations.reduce((a, c) => a + c.unread, 0);
  const hasRealConversations = conversations.length > 0;

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const diffMs = Date.now() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h`;
    return `${Math.floor(diffHrs / 24)}d`;
  };

  return (
    <Layout>
      <header className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-heading font-bold text-foreground">Messages</h1>
          {totalUnread > 0 && <Badge className="bg-accent/10 text-accent border-0 font-heading">{totalUnread} new</Badge>}
        </div>
      </header>

      <div className="px-4 mt-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search conversations..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 rounded-2xl bg-secondary/70 text-foreground placeholder:text-muted-foreground text-sm font-body border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
      </div>

      <div className="mt-3">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 rounded-xl bg-primary/20 animate-pulse mx-auto" />
          </div>
        ) : (
          <>
            {/* Real conversations */}
            {filtered.map((conv, i) => (
              <div
                key={conv.id}
                onClick={() => navigate(`/messages/${conv.id}`)}
                className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors opacity-0 animate-fade-up active:scale-[0.98] active:bg-secondary/50 ${
                  conv.unread > 0 ? "bg-primary/5" : "hover:bg-secondary/30"
                }`}
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: "forwards" }}
              >
                <div className="relative shrink-0">
                  <img src={conv.otherAvatar} alt={conv.otherName} className="w-12 h-12 rounded-2xl object-cover bg-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-heading truncate ${conv.unread > 0 ? "font-bold text-foreground" : "font-semibold text-foreground"}`}>{conv.otherName}</h3>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{formatTime(conv.last_message_at)}</span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${conv.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shrink-0">
                    {conv.unread}
                  </span>
                )}
              </div>
            ))}

            {/* Example conversations when no real ones */}
            {!hasRealConversations && (
              <>
                <div className="px-4 py-2 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] text-muted-foreground">Example conversations — real chats appear when you connect with {role === "brand" ? "creators" : "brands"}</p>
                </div>
                {mockConversations.map((conv, i) => (
                  <div
                    key={conv.id}
                    className="px-4 py-3 flex items-center gap-3 cursor-default opacity-0 animate-fade-up hover:bg-secondary/20 transition-colors"
                    style={{ animationDelay: `${i * 50}ms`, animationFillMode: "forwards" }}
                  >
                    <div className="relative shrink-0">
                      <img src={conv.otherAvatar} alt={conv.otherName} className="w-12 h-12 rounded-2xl object-cover bg-secondary" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-heading font-semibold text-foreground truncate">{conv.otherName}</h3>
                          <Badge className="bg-accent/10 text-accent border-0 text-[8px] px-1.5 py-0"><Tag className="w-2.5 h-2.5 mr-0.5" />Example</Badge>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{conv.timeAgo}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                      {conv.campaignTag && (
                        <span className="text-[9px] text-primary font-medium mt-0.5 block">Re: {conv.campaignTag}</span>
                      )}
                    </div>
                  </div>
                ))}
                <div className="text-center px-6 pt-4 pb-2">
                  <Button size="sm" className="h-9 text-xs" onClick={() => navigate(role === "brand" ? "/creators" : "/campaigns")}>
                    <Briefcase className="w-3.5 h-3.5 mr-1" /> {role === "brand" ? "Find Creators" : "Explore Campaigns"}
                  </Button>
                </div>
              </>
            )}

            {hasRealConversations && filtered.length === 0 && (
              <div className="text-center py-16 px-6">
                <MessageCircle className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="font-heading font-medium text-foreground text-sm">No matching conversations</p>
                <p className="text-xs text-muted-foreground mt-1.5">Try a different search term</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Messages;
