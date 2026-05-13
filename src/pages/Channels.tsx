import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Heart, MessageCircle, Share2, Bookmark, Send,
  Shield, Plus, Image as ImageIcon, Filter
} from "lucide-react";

const showcasePosts = [
  { creator: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face", category: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop", caption: "My latest collaboration with Lenskart! Shot this campaign at sunrise for that golden glow ✨ #sponsored #lenskart", campaign: "Lenskart SS'26", likes: 1243, comments: 89, time: "2h ago" },
  { creator: "Arjun Mehta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face", category: "Tech", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop", caption: "Unboxing the new boAt Airdopes 🎧 Full review coming this weekend! Sound quality is insane. #boAthead #techreview", campaign: "boAt Summer", likes: 892, comments: 45, time: "5h ago" },
  { creator: "Sneha Kapoor", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face", category: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=600&fit=crop", caption: "Behind the scenes from the Myntra style drop shoot 🔥 Can't wait for you all to see the full collection!", campaign: "Myntra Style Drop", likes: 2100, comments: 156, time: "1d ago" },
  { creator: "Rahul Verma", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face", category: "Food", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop", caption: "This Zomato campaign was so fun! Got to try 10 restaurants in one day 🍕 Street food never looked so good.", campaign: "Zomato Food Stories", likes: 567, comments: 34, time: "1d ago" },
  { creator: "Kavya Nair", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face", category: "Fitness", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=600&fit=crop", caption: "Morning yoga routine collab with a wellness brand 🧘‍♀️ Real content, real results. Link in bio!", campaign: "Wellness Campaign", likes: 1890, comments: 112, time: "2d ago" },
  { creator: "Zara Patel", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face", category: "Lifestyle", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop", caption: "Nykaa festive collection haul! Every product is gorgeous ✨ #NykaaFestive #beauty", campaign: "Nykaa Festive Glow", likes: 734, comments: 56, time: "2d ago" },
  { creator: "Dev Anand", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face", category: "Comedy", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop", caption: "Made a skit about tech gadgets and it went viral 😂 The Noise watch is actually fire tho", campaign: "Noise Smartwatch", likes: 3400, comments: 234, time: "3d ago" },
  { creator: "Meera Pillai", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", category: "Fashion", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop", caption: "Styling sunglasses 3 ways for summer ☀️ Collab with Lenskart was a dream!", campaign: "Lenskart SS'26", likes: 1560, comments: 98, time: "4d ago" },
];

const adminPosts = [
  { type: "Regulatory", color: "bg-destructive/10 text-destructive", title: "ASCI Guidelines Update 2026", content: "Mandatory disclosure rules for sponsored content are now in effect. All creators must use #Ad or #Sponsored for paid partnerships. Non-compliance may result in account suspension.", date: "Mar 8, 2026", hasImage: false },
  { type: "Opportunity", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400", title: "ONDC Integration Live", content: "Brands can now run creator campaigns linked to ONDC storefronts. This opens up a new revenue channel for creators in the e-commerce space.", date: "Mar 6, 2026", hasImage: false },
  { type: "Platform Update", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400", title: "New Escrow Milestone Feature", content: "Payments can now be split into multiple milestones instead of just 50/50. Brands and creators can negotiate custom payment splits for each deliverable.", date: "Mar 5, 2026", hasImage: false },
  { type: "Event", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400", title: "Connect & Create Creator Summit Chennai", content: "Join 500+ creators and 100+ brands at India's largest creator economy summit. Workshops, networking, and exclusive brand deals. April 15, 2026 — Registration open now!", date: "Mar 4, 2026", hasImage: true },
  { type: "Regulatory", color: "bg-destructive/10 text-destructive", title: "GST Compliance for Influencers", content: "Creators earning above ₹20L annually must register for GST. TIL now auto-generates GST-compliant invoices. Update your PAN and GST details in Settings.", date: "Mar 1, 2026", hasImage: false },
];

const filterOptions = ["All", "Beauty", "Fashion", "Tech", "Food", "Fitness"];

const Channels = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"spotlight" | "updates">("spotlight");
  const [activeFilter, setActiveFilter] = useState("All");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());

  const filteredPosts = activeFilter === "All" ? showcasePosts : showcasePosts.filter(p => p.category === activeFilter);

  const toggleLike = (i: number) => setLikedPosts(prev => { const n = new Set(prev); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  const toggleSave = (i: number) => setSavedPosts(prev => { const n = new Set(prev); if (n.has(i)) n.delete(i); else n.add(i); return n; });

  return (
    <Layout>
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-heading font-bold text-lg text-foreground">Channels</h1>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4 flex gap-2">
        <button onClick={() => setTab("spotlight")} className={`flex-1 py-2.5 rounded-xl text-xs font-heading font-semibold flex items-center justify-center gap-1.5 transition-all ${tab === "spotlight" ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
          ✨ Creator Spotlight
        </button>
        <button onClick={() => setTab("updates")} className={`flex-1 py-2.5 rounded-xl text-xs font-heading font-semibold flex items-center justify-center gap-1.5 transition-all ${tab === "updates" ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
          <Shield className="w-3.5 h-3.5" /> Official Updates
        </button>
      </div>

      {/* Creator Spotlight */}
      {tab === "spotlight" && (
        <div className="pb-4">
          {/* Filters */}
          <div className="px-4 mt-3 flex gap-1.5 overflow-x-auto no-scrollbar">
            {filterOptions.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1.5 rounded-full text-[11px] font-medium shrink-0 transition-all ${activeFilter === f ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>{f}</button>
            ))}
          </div>

          {/* Submit Work Button */}
          <div className="px-4 mt-3">
            <Button className="w-full h-10 rounded-xl text-xs font-heading" variant="outline">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Submit Your Work
            </Button>
          </div>

          {/* Posts */}
          <div className="mt-3 space-y-4">
            {filteredPosts.map((post, i) => (
              <div key={i} className="border-b border-border pb-4">
                {/* Header */}
                <div className="px-4 flex items-center gap-3 mb-3">
                  <img src={post.avatar} alt={post.creator} className="w-9 h-9 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-sm text-foreground">{post.creator}</p>
                    <div className="flex items-center gap-1.5">
                      <Badge className="text-[8px] border-0 bg-accent/10 text-accent">{post.category}</Badge>
                      <span className="text-[10px] text-muted-foreground">{post.time}</span>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <img src={post.image} alt="" className="w-full aspect-square object-cover" />

                {/* Actions */}
                <div className="px-4 mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleLike(i)} className="flex items-center gap-1.5">
                      <Heart className={`w-5 h-5 transition-all ${likedPosts.has(i) ? "fill-destructive text-destructive" : "text-foreground"}`} />
                      <span className="text-xs font-medium text-foreground">{likedPosts.has(i) ? post.likes + 1 : post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5">
                      <MessageCircle className="w-5 h-5 text-foreground" />
                      <span className="text-xs font-medium text-foreground">{post.comments}</span>
                    </button>
                    <Share2 className="w-5 h-5 text-foreground" />
                  </div>
                  <button onClick={() => toggleSave(i)}>
                    <Bookmark className={`w-5 h-5 transition-all ${savedPosts.has(i) ? "fill-foreground text-foreground" : "text-foreground"}`} />
                  </button>
                </div>

                {/* Caption */}
                <div className="px-4 mt-2">
                  <p className="text-sm text-foreground"><span className="font-heading font-semibold">{post.creator}</span> {post.caption}</p>
                  {post.campaign && <Badge className="mt-1.5 text-[9px] border-0 bg-secondary text-muted-foreground">📌 {post.campaign}</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Updates */}
      {tab === "updates" && (
        <div className="px-4 mt-4 space-y-3 pb-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Official announcements from TIL team</p>
          {adminPosts.map((post, i) => (
            <div key={i} className="border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
                  <span className="text-background font-heading font-bold text-[10px]">T</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-heading font-semibold text-foreground">TIL Team</span>
                    <Badge className="text-[8px] border-0 bg-accent/10 text-accent">Official</Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{post.date}</span>
                </div>
                <Badge className={`text-[9px] border-0 ${post.color}`}>{post.type}</Badge>
              </div>
              <p className="font-heading font-semibold text-sm text-foreground mt-2">{post.title}</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{post.content}</p>
              {post.hasImage && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop" alt="Event" className="w-full h-36 object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Channels;
