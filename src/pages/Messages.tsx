import { useState } from "react";
import Layout from "@/components/Layout";
import { Search, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MockConversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

const mockConversations: MockConversation[] = [
  { id: "1", name: "Priya Sharma", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya", lastMessage: "Hey! I'd love to collaborate on your campaign 🙌", time: "2m", unread: 3, online: true },
  { id: "2", name: "BoAt Official", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=BoAt", lastMessage: "We've reviewed your application and...", time: "1h", unread: 1, online: false },
  { id: "3", name: "Arjun Reddy", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Arjun", lastMessage: "The deliverables have been uploaded!", time: "3h", unread: 0, online: true },
  { id: "4", name: "Mamaearth", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mama", lastMessage: "Can you send the rate card?", time: "1d", unread: 0, online: false },
  { id: "5", name: "Neha Kapoor", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Neha", lastMessage: "Thanks for the update! Will revert soon.", time: "2d", unread: 0, online: false },
];

const Messages = () => {
  const [search, setSearch] = useState("");

  const filtered = mockConversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <header className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-heading font-bold text-foreground">Messages</h1>
          <Badge className="bg-accent/10 text-accent border-0 font-heading">
            {mockConversations.reduce((a, c) => a + c.unread, 0)} new
          </Badge>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 mt-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-2xl bg-secondary/70 text-foreground placeholder:text-muted-foreground text-sm font-body border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="mt-3">
        {filtered.map((conv, i) => (
          <div
            key={conv.id}
            className="px-4 py-3 flex items-center gap-3 hover:bg-secondary/30 cursor-pointer transition-colors opacity-0 animate-fade-up"
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: "forwards" }}
          >
            <div className="relative shrink-0">
              <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-2xl object-cover" />
              {conv.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-sm text-foreground truncate">{conv.name}</h3>
                <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{conv.time}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
            </div>
            {conv.unread > 0 && (
              <span className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shrink-0">
                {conv.unread}
              </span>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 px-4">
            <MessageCircle className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-heading font-medium text-muted-foreground">No conversations found</p>
            <p className="text-xs text-muted-foreground mt-1">Start a conversation from a creator's profile</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Messages;
