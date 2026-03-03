import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Image, Smile } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

// Mock names for demo
const mockNames: Record<string, { name: string; avatar: string }> = {
  "1": { name: "Priya Sharma", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya" },
  "2": { name: "BoAt Official", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=BoAt" },
  "3": { name: "Arjun Reddy", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Arjun" },
  "4": { name: "Mamaearth", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mama" },
  "5": { name: "Neha Kapoor", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Neha" },
};

const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: "m1", content: "Hey! I saw your campaign for summer audio launch 🎧", sender_id: "other", created_at: "2026-03-03T10:00:00Z" },
    { id: "m2", content: "I'd love to collaborate on it! My audience is super into tech reviews", sender_id: "other", created_at: "2026-03-03T10:01:00Z" },
    { id: "m3", content: "That sounds great! Can you share your media kit?", sender_id: "me", created_at: "2026-03-03T10:05:00Z" },
    { id: "m4", content: "Sure! Here's my latest engagement report 📊", sender_id: "other", created_at: "2026-03-03T10:06:00Z" },
    { id: "m5", content: "Hey! I'd love to collaborate on your campaign 🙌", sender_id: "other", created_at: "2026-03-03T10:10:00Z" },
  ],
  "2": [
    { id: "m1", content: "Hi! Thanks for applying to our Summer Audio Launch campaign", sender_id: "other", created_at: "2026-03-03T09:00:00Z" },
    { id: "m2", content: "We've reviewed your application and we're impressed with your content!", sender_id: "other", created_at: "2026-03-03T09:01:00Z" },
    { id: "m3", content: "Thank you so much! I'm really excited about this opportunity", sender_id: "me", created_at: "2026-03-03T09:05:00Z" },
  ],
  "3": [
    { id: "m1", content: "Hey Arjun! How's the video coming along?", sender_id: "me", created_at: "2026-03-03T08:00:00Z" },
    { id: "m2", content: "Almost done! Just finishing the final edit", sender_id: "other", created_at: "2026-03-03T08:05:00Z" },
    { id: "m3", content: "The deliverables have been uploaded!", sender_id: "other", created_at: "2026-03-03T08:10:00Z" },
  ],
};

const ChatConversation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const contact = mockNames[id || "1"] || { name: "Unknown", avatar: "" };

  useEffect(() => {
    setMessages(mockMessages[id || "1"] || []);
  }, [id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: `new-${Date.now()}`,
      content: newMessage.trim(),
      sender_id: "me",
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage("");
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 glass-card border-b border-border/50 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate("/messages")} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <h1 className="font-heading font-semibold text-sm text-foreground truncate">{contact.name}</h1>
          <p className="text-[10px] text-primary font-heading">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.map((msg) => {
          const isMe = msg.sender_id === "me";
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl ${
                isMe
                  ? "gradient-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary text-secondary-foreground rounded-bl-md"
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className={`text-[9px] mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {formatTime(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}
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
            disabled={!newMessage.trim()}
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
