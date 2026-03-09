import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, MessageSquare, Users, Plus, Search, Eye, Heart,
  Clock, ChevronRight, Lock, Globe
} from "lucide-react";

const forumCategories = [
  { id: "tips", emoji: "🎯", name: "Campaign Tips", posts: 234, lastActive: "2h ago", preview: "How to negotiate better rates with D2C brands" },
  { id: "pricing", emoji: "💰", name: "Pricing & Negotiations", posts: 189, lastActive: "4h ago", preview: "What's the going rate for a 30s Instagram Reel in 2026?" },
  { id: "growth", emoji: "📱", name: "Social Media Growth", posts: 456, lastActive: "1h ago", preview: "Algorithm changes: what's working on Instagram in March" },
  { id: "collabs", emoji: "🤝", name: "Brand Collaborations", posts: 312, lastActive: "3h ago", preview: "My experience working with Mamaearth — honest review" },
  { id: "content", emoji: "🎬", name: "Content Creation", posts: 278, lastActive: "30m ago", preview: "Best budget-friendly lighting setup for home studio" },
  { id: "analytics", emoji: "📊", name: "Analytics & Insights", posts: 143, lastActive: "6h ago", preview: "Understanding CPE and how brands evaluate your content" },
];

const mockThreads: Record<string, { title: string; author: string; avatar: string; replies: number; views: number; time: string; tags: string[] }[]> = {
  tips: [
    { title: "How to negotiate better rates with D2C brands", author: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face", replies: 34, views: 1200, time: "2h ago", tags: ["Negotiation", "D2C"] },
    { title: "5 things I wish I knew before my first brand collab", author: "Arjun Mehta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", replies: 56, views: 2300, time: "5h ago", tags: ["Beginner", "Tips"] },
    { title: "How to create a killer media kit that brands love", author: "Sneha Kapoor", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", replies: 23, views: 890, time: "1d ago", tags: ["Media Kit"] },
    { title: "Understanding brand briefs: a creator's guide", author: "Kavya Nair", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face", replies: 18, views: 670, time: "2d ago", tags: ["Briefs", "Guide"] },
    { title: "Top mistakes creators make in campaign pitches", author: "Dev Anand", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", replies: 41, views: 1500, time: "3d ago", tags: ["Pitching"] },
  ],
  pricing: [
    { title: "What's the going rate for a 30s Instagram Reel?", author: "Rahul Verma", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", replies: 67, views: 3400, time: "4h ago", tags: ["Rates", "Reels"] },
    { title: "Should you do barter deals? Pros and cons", author: "Meera Pillai", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", replies: 45, views: 2100, time: "8h ago", tags: ["Barter"] },
    { title: "Rate card template for micro-influencers", author: "Zara Patel", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face", replies: 29, views: 1800, time: "1d ago", tags: ["Template", "Micro"] },
    { title: "How much should brands pay for UGC content?", author: "Arjun Mehta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", replies: 38, views: 1400, time: "2d ago", tags: ["UGC", "Pricing"] },
    { title: "Negotiating long-term brand ambassador deals", author: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face", replies: 22, views: 980, time: "4d ago", tags: ["Ambassador"] },
  ],
};

const mockGroups = [
  { name: "Lenskart SS'26 Creator Group", members: 27, desc: "Campaign coordination for Lenskart Summer/Spring 2026", cover: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=200&fit=crop", isPrivate: true, joined: true, tag: "Campaign" },
  { name: "Chennai Creators Network", members: 342, desc: "Connect with fellow creators from Chennai and Tamil Nadu", cover: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=200&fit=crop", isPrivate: false, joined: false, tag: "City" },
  { name: "Beauty Influencers India", members: 1230, desc: "India's largest beauty creator community. Share tips, reviews, and opportunities.", cover: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=200&fit=crop", isPrivate: false, joined: true, tag: "Niche" },
  { name: "Tech Reviewers Club", members: 567, desc: "For tech enthusiasts and gadget reviewers. Discuss latest launches and review strategies.", cover: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop", isPrivate: false, joined: false, tag: "Niche" },
  { name: "Food Bloggers Mumbai", members: 890, desc: "Mumbai's food creator community. Restaurant reviews, food photography tips.", cover: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop", isPrivate: false, joined: false, tag: "City" },
  { name: "Fitness & Wellness Creators", members: 445, desc: "Share workout routines, nutrition tips, and wellness brand collabs.", cover: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=200&fit=crop", isPrivate: true, joined: false, tag: "Niche" },
];

const Community = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"forums" | "groups">("forums");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const threads = selectedCategory ? (mockThreads[selectedCategory] || mockThreads.tips) : [];

  return (
    <Layout>
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => selectedCategory ? setSelectedCategory(null) : navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-heading font-bold text-lg text-foreground">Community</h1>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4 flex gap-2">
        {(["forums", "groups"] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setSelectedCategory(null); }} className={`flex-1 py-2.5 rounded-xl text-xs font-heading font-semibold flex items-center justify-center gap-1.5 transition-all ${tab === t ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
            {t === "forums" ? <MessageSquare className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
            {t === "forums" ? "Forums" : "Groups"}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="px-4 mt-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={tab === "forums" ? "Search forums..." : "Search groups..."} className="w-full h-10 pl-9 pr-3 rounded-xl bg-secondary text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-accent/20" />
        </div>
      </div>

      {/* Forums Tab */}
      {tab === "forums" && !selectedCategory && (
        <div className="px-4 mt-4 space-y-2 pb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Categories</p>
            <Button size="sm" className="h-7 text-[10px] rounded-lg"><Plus className="w-3 h-3 mr-1" /> New Post</Button>
          </div>
          {forumCategories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="w-full border border-border rounded-xl p-4 flex items-start gap-3 hover:bg-secondary/50 transition-all text-left">
              <span className="text-2xl mt-0.5">{cat.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-heading font-semibold text-sm text-foreground">{cat.name}</p>
                  <span className="text-[10px] text-muted-foreground">{cat.posts} posts</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{cat.preview}</p>
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {cat.lastActive}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground mt-2 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Thread List */}
      {tab === "forums" && selectedCategory && (
        <div className="px-4 mt-4 space-y-2 pb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              {forumCategories.find(c => c.id === selectedCategory)?.name}
            </p>
            <Button size="sm" className="h-7 text-[10px] rounded-lg"><Plus className="w-3 h-3 mr-1" /> New Post</Button>
          </div>
          {threads.map((t, i) => (
            <div key={i} className="border border-border rounded-xl p-4 hover:bg-secondary/30 transition-all">
              <div className="flex items-start gap-3">
                <img src={t.avatar} alt={t.author} className="w-8 h-8 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-sm text-foreground leading-tight">{t.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{t.author} · {t.time}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1"><MessageSquare className="w-2.5 h-2.5" /> {t.replies}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Eye className="w-2.5 h-2.5" /> {t.views}</span>
                  </div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {t.tags.map(tag => <span key={tag} className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[9px] font-medium">{tag}</span>)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Groups Tab */}
      {tab === "groups" && (
        <div className="px-4 mt-4 space-y-3 pb-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Groups</p>
            <Button size="sm" className="h-7 text-[10px] rounded-lg"><Plus className="w-3 h-3 mr-1" /> Create Group</Button>
          </div>
          {mockGroups.map((g, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden hover:shadow-md transition-all">
              <img src={g.cover} alt={g.name} className="w-full h-28 object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-heading font-semibold text-sm text-foreground truncate">{g.name}</p>
                      {g.isPrivate ? <Lock className="w-3 h-3 text-muted-foreground shrink-0" /> : <Globe className="w-3 h-3 text-muted-foreground shrink-0" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{g.members} members · {g.tag}</p>
                  </div>
                  <Badge className={`text-[9px] border-0 shrink-0 ${g.isPrivate ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"}`}>
                    {g.isPrivate ? "Private" : "Public"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{g.desc}</p>
                <Button size="sm" variant={g.joined ? "outline" : "default"} className="mt-3 h-8 text-xs w-full rounded-lg">
                  {g.joined ? "Joined ✓" : "Join Group"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Community;
