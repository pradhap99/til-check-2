import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { creators } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, MapPin, Users, TrendingUp, Heart, Share2, MessageCircle, Instagram, Youtube, Twitter, Star, Send, Briefcase } from "lucide-react";
import { toast } from "sonner";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger, DrawerClose,
} from "@/components/ui/drawer";

const platformIcon: Record<string, any> = {
  Instagram, YouTube: Youtube, Twitter,
};

const CreatorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [startingChat, setStartingChat] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [dbCreator, setDbCreator] = useState<any>(null);
  const [dbProfile, setDbProfile] = useState<any>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");

  const mockCreator = creators.find((c) => c.id === id);

  useEffect(() => {
    if (mockCreator || !id) return;
    const fetchCreator = async () => {
      const { data: cp } = await supabase.from("creator_profiles").select("*").eq("user_id", id).maybeSingle();
      if (cp) {
        setDbCreator(cp);
        const { data: p } = await supabase.from("profiles").select("*").eq("user_id", id).maybeSingle();
        setDbProfile(p);
      }
    };
    fetchCreator();
  }, [id, mockCreator]);

  useEffect(() => {
    if (!user || role !== "brand" || !id) return;
    const targetId = mockCreator ? null : id;
    if (!targetId) return;
    supabase.from("saved_creators").select("id").eq("brand_user_id", user.id).eq("creator_user_id", targetId).maybeSingle()
      .then(({ data }) => setIsSaved(!!data));
  }, [user, role, id]);

  useEffect(() => {
    if (!user || role !== "brand") return;
    supabase.from("campaigns").select("id, title").eq("brand_user_id", user.id).eq("status", "active")
      .then(({ data }) => setCampaigns(data || []));
  }, [user, role]);

  const creator = mockCreator || (dbCreator ? {
    id: id!,
    name: dbProfile?.full_name || "Creator",
    handle: dbCreator.instagram_handle || "@creator",
    avatar: dbProfile?.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face`,
    category: dbCreator.primary_niche || "Lifestyle",
    followers: dbCreator.instagram_followers ? `${(dbCreator.instagram_followers / 1000).toFixed(0)}K` : "—",
    engagement: dbCreator.engagement_rate ? `${dbCreator.engagement_rate}%` : "—",
    platform: "Instagram" as const,
    location: dbProfile?.location_city || "India",
    rate: dbCreator.rate_reel ? `₹${parseInt(dbCreator.rate_reel).toLocaleString()}` : "Contact for rates",
    verified: dbCreator.verified || false,
    bio: dbProfile?.bio || `Creator specializing in ${dbCreator.primary_niche || "content"}`,
  } : null);

  if (!creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Creator not found</p>
          <Button variant="ghost" className="mt-2" onClick={() => navigate("/creators")}>Browse Creators</Button>
        </div>
      </div>
    );
  }

  const PlatformIcon = platformIcon[creator.platform] || Instagram;
  const isRealUser = !!dbCreator;

  const handleMessage = async () => {
    if (!user || !isRealUser) {
      toast.info("Messaging is available for registered users.");
      return;
    }
    setStartingChat(true);
    const { data: existing } = await supabase
      .from("conversations").select("id")
      .or(`and(participant_1.eq.${user.id},participant_2.eq.${id}),and(participant_1.eq.${id},participant_2.eq.${user.id})`)
      .maybeSingle();

    if (existing) {
      navigate(`/messages/${existing.id}`);
    } else {
      const { data: newConv } = await supabase.from("conversations").insert({ participant_1: user.id, participant_2: id! }).select("id").single();
      if (newConv) navigate(`/messages/${newConv.id}`);
    }
    setStartingChat(false);
  };

  const handleSave = async () => {
    if (!user || !isRealUser) { toast.info("Save works with registered creators."); return; }
    if (isSaved) {
      await supabase.from("saved_creators").delete().eq("brand_user_id", user.id).eq("creator_user_id", id!);
      setIsSaved(false);
      toast.success("Removed from saved");
    } else {
      await supabase.from("saved_creators").insert({ brand_user_id: user.id, creator_user_id: id! });
      setIsSaved(true);
      toast.success("Creator saved");
    }
  };

  const handleInvite = async () => {
    if (!selectedCampaign || !user || !id) return;
    const campaign = campaigns.find(c => c.id === selectedCampaign);
    await supabase.from("notifications").insert({
      user_id: id,
      title: "Campaign Invitation",
      message: `You've been invited to "${campaign?.title}". ${inviteMessage || "Check it out!"}`,
      type: "campaign",
      reference_type: "campaign",
      reference_id: selectedCampaign,
    });
    toast.success("Invitation sent");
    setInviteOpen(false);
    setSelectedCampaign("");
    setInviteMessage("");
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <div className="relative">
        <div className="h-32 gradient-primary relative">
          <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center z-10">
            <ArrowLeft className="w-4 h-4 text-primary-foreground" />
          </button>
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button className="w-8 h-8 rounded-lg bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center">
              <Share2 className="w-4 h-4 text-primary-foreground" />
            </button>
            {role === "brand" && (
              <button onClick={handleSave} className="w-8 h-8 rounded-lg bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center">
                <Heart className={`w-4 h-4 ${isSaved ? "text-accent fill-accent" : "text-primary-foreground"}`} />
              </button>
            )}
          </div>
        </div>

        <div className="px-4 -mt-10 relative z-10">
          <div className="flex items-end gap-3">
            <div className="relative">
              <img src={creator.avatar} alt={creator.name} className="w-20 h-20 rounded-xl border-4 border-background object-cover shadow-md bg-muted" />
              {creator.verified && (
                <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-primary fill-background" />
              )}
            </div>
            <div className="pb-1">
              <h1 className="font-heading font-bold text-lg text-foreground tracking-tight">{creator.name}</h1>
              <p className="text-xs text-muted-foreground">{creator.handle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="px-4 mt-3">
        <p className="text-sm text-muted-foreground leading-relaxed">{creator.bio}</p>
        {dbCreator?.secondary_niches && dbCreator.secondary_niches.length > 0 && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            <Badge variant="secondary" className="text-[10px]">{creator.category}</Badge>
            {dbCreator.secondary_niches.map((n: string) => (
              <Badge key={n} variant="outline" className="text-[10px]">{n}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Followers", value: creator.followers, icon: Users },
          { label: "Engagement", value: creator.engagement, icon: TrendingUp },
          { label: "Rating", value: "4.8", icon: Star },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-lg p-3 text-center">
            <p className="font-heading font-bold text-sm text-card-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="px-4 mt-4 space-y-2">
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-heading font-semibold text-xs text-card-foreground mb-2.5 uppercase tracking-wider">Details</h3>
          <div className="space-y-2">
            {[
              { icon: MapPin, label: "Location", value: creator.location },
              { icon: PlatformIcon, label: "Platform", value: creator.platform },
              { icon: Star, label: "Category", value: creator.category },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-card-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <h3 className="font-heading font-semibold text-xs text-card-foreground mb-2 uppercase tracking-wider">Rate Card</h3>
          {dbCreator && (dbCreator.rate_feed_post || dbCreator.rate_reel || dbCreator.rate_story) ? (
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Feed Post", value: dbCreator.rate_feed_post },
                { label: "Reel", value: dbCreator.rate_reel },
                { label: "Story", value: dbCreator.rate_story },
              ].filter(r => r.value).map((rate, i) => (
                <div key={i} className="text-center p-2 rounded-lg bg-secondary/50">
                  <p className="font-heading font-bold text-sm text-primary">₹{parseInt(rate.value).toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{rate.label}</p>
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className="font-heading font-bold text-base text-primary">{creator.rate}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Per campaign collaboration</p>
            </>
          )}
        </div>

        {dbCreator?.content_formats && dbCreator.content_formats.length > 0 && (
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-heading font-semibold text-xs text-card-foreground mb-2 uppercase tracking-wider">Content Formats</h3>
            <div className="flex gap-1.5 flex-wrap">
              {dbCreator.content_formats.map((f: string) => (
                <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
              ))}
            </div>
          </div>
        )}

        {dbCreator && (
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-heading font-semibold text-xs text-card-foreground mb-2 uppercase tracking-wider">Connected Platforms</h3>
            <div className="space-y-2">
              {dbCreator.instagram_handle && (
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{dbCreator.instagram_handle}</span>
                  {dbCreator.instagram_followers && <Badge variant="secondary" className="text-[9px]">{(dbCreator.instagram_followers / 1000).toFixed(0)}K</Badge>}
                </div>
              )}
              {dbCreator.youtube_channel && (
                <div className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">YouTube</span>
                  {dbCreator.youtube_subscribers && <Badge variant="secondary" className="text-[9px]">{(dbCreator.youtube_subscribers / 1000).toFixed(0)}K</Badge>}
                </div>
              )}
              {dbCreator.twitter_handle && (
                <div className="flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{dbCreator.twitter_handle}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-4 py-5 pb-24">
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 h-11 rounded-lg font-heading" onClick={handleMessage} disabled={startingChat}>
            <MessageCircle className="w-4 h-4" /> Message
          </Button>
          {role === "brand" && isRealUser && campaigns.length > 0 ? (
            <Drawer open={inviteOpen} onOpenChange={setInviteOpen}>
              <DrawerTrigger asChild>
                <Button className="flex-1 h-11 rounded-lg font-heading">
                  <Send className="w-4 h-4" /> Invite
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className="font-heading">Invite to Campaign</DrawerTitle>
                  <DrawerDescription>Select a campaign to invite {creator.name}</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 space-y-3">
                  <div>
                    <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Campaign</label>
                    <div className="space-y-1.5">
                      {campaigns.map(c => (
                        <button key={c.id} onClick={() => setSelectedCampaign(c.id)} className={`w-full p-3 rounded-lg text-left text-sm font-heading transition-all ${selectedCampaign === c.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                          {c.title}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Message (optional)</label>
                    <textarea value={inviteMessage} onChange={e => setInviteMessage(e.target.value)} placeholder="Custom message for the creator..." rows={2} className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  </div>
                </div>
                <DrawerFooter>
                  <Button className="w-full h-11 rounded-lg font-heading" disabled={!selectedCampaign} onClick={handleInvite}>
                    <Send className="w-4 h-4" /> Send Invitation
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full rounded-lg">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : (
            <Button className="flex-1 h-11 rounded-lg font-heading" onClick={() => {
              if (role === "brand") navigate("/campaigns/create");
              else toast.info("Collaboration feature coming soon");
            }}>
              <Briefcase className="w-4 h-4" /> {role === "brand" ? "Create Campaign" : "Collaborate"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorDetail;
