import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Send, Smile, Phone, MoreVertical } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  message_type: string | null;
  read_at: string | null;
}

const ChatConversation = () => {
  const { id: conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [contactName, setContactName] = useState("...");
  const [contactAvatar, setContactAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load conversation and contact info
  useEffect(() => {
    if (!user || !conversationId) return;
    
    const loadConversation = async () => {
      // Get conversation
      const { data: conv } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .maybeSingle();

      if (!conv) {
        navigate("/messages");
        return;
      }

      // Get other participant profile
      const otherId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("user_id", otherId)
        .maybeSingle();

      setContactName(profile?.full_name || "Unknown");
      setContactAvatar(profile?.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${otherId.slice(0, 8)}`);

      // Load messages
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      setMessages(msgs || []);
      setLoading(false);

      // Mark messages as read
      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .neq("sender_id", user.id)
        .is("read_at", null);
    };

    loadConversation();
  }, [user, conversationId]);

  // Realtime messages
  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        const newMsg = payload.new as Message;
        setMessages(prev => [...prev, newMsg]);
        // Mark as read if from other user
        if (user && newMsg.sender_id !== user.id) {
          supabase.from("messages").update({ read_at: new Date().toISOString() }).eq("id", newMsg.id);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, user]);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !conversationId || sending) return;
    setSending(true);
    const content = newMessage.trim();
    setNewMessage("");

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
      message_type: "text",
    });

    if (!error) {
      // Update conversation last_message_at
      await supabase.from("conversations").update({
        last_message_at: new Date().toISOString(),
      }).eq("id", conversationId);
    }

    setSending(false);
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDateSeparator = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  // Group messages by date
  const groupedMessages: { date: string; msgs: Message[] }[] = [];
  messages.forEach(msg => {
    const dateKey = new Date(msg.created_at).toDateString();
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    if (lastGroup && lastGroup.date === dateKey) {
      lastGroup.msgs.push(msg);
    } else {
      groupedMessages.push({ date: dateKey, msgs: [msg] });
    }
  });

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 glass-card border-b border-border/50 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate("/messages")} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <img src={contactAvatar} alt={contactName} className="w-10 h-10 rounded-xl object-cover shrink-0 bg-secondary" />
        <div className="flex-1 min-w-0">
          <h1 className="font-heading font-semibold text-sm text-foreground truncate">{contactName}</h1>
          <p className="text-[10px] text-primary font-heading">Online</p>
        </div>
        <button className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <Phone className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 rounded-xl gradient-primary animate-pulse-glow mx-auto" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-muted-foreground font-heading">Say hello! 👋</p>
            <p className="text-xs text-muted-foreground mt-1">Start the conversation</p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.date}>
              <div className="flex justify-center my-3">
                <span className="px-3 py-1 rounded-full bg-secondary text-[10px] font-heading text-muted-foreground">
                  {formatDateSeparator(group.msgs[0].created_at)}
                </span>
              </div>
              {group.msgs.map((msg) => {
                const isMe = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1.5`}>
                    <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl ${
                      isMe
                        ? "gradient-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <div className={`flex items-center justify-end gap-1 mt-0.5`}>
                        <p className={`text-[9px] ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                          {formatTime(msg.created_at)}
                        </p>
                        {isMe && msg.read_at && (
                          <span className="text-[9px] text-primary-foreground/60">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-5 pt-2 glass-card border-t border-border/50">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Type a message..."
              className="w-full h-11 pl-4 pr-10 rounded-2xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <Smile className="w-4.5 h-4.5 text-muted-foreground" />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shrink-0 disabled:opacity-50 shadow-md"
          >
            <Send className="w-4.5 h-4.5 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatConversation;
