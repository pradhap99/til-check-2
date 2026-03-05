import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Instagram, Youtube, Twitter, Linkedin, MapPin, Star, Users,
  TrendingUp, Share2, Copy, CheckCircle, Mail, ExternalLink,
  Briefcase, IndianRupee, Image, Film, Layers, Edit3, Eye
} from "lucide-react";
import { toast } from "sonner";

const mockCollabs = [
  { brand: "boAt", logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop", type: "Product Review" },
  { brand: "Mamaearth", logo: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=60&h=60&fit=crop", type: "Sponsored Post" },
  { brand: "Lenskart", logo: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=60&h=60&fit=crop", type: "Brand Ambassador" },
];

const defaultRates = [
  { label: "Instagram Reel", range: "₹15,000 – ₹50,000" },
  { label: "Instagram Story", range: "₹5,000 – ₹15,000" },
  { label: "Static Post", range: "₹8,000 – ₹20,000" },
  { label: "YouTube Integration", range: "₹25,000 – ₹1,00,000" },
  { label: "Bundle Deal", range: "₹40,000 – ₹1,50,000" },
];

const sampleContentTypes = ["Reel", "Story", "Post", "Reel", "Story", "Post"];

const CreatorMediaKit = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [creatorProfile, setCreatorProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const targetUserId = userId || user?.id;
  const isOwnProfile = user?.id === targetUserId;

  useEffect(() => {
    if (!targetUserId) return;
    const load = async () => {
      const [{ data: p }, { data: cp }, { data: revs }, { data: apps }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", targetUserId).maybeSingle(),
        supabase.from("creator_profiles").select("*").eq("user_id", targetUserId).maybeSingle(),
        supabase.from("reviews").select("*").eq("reviewed_user_id", targetUserId).order("created_at", { ascending: false }).limit(5),
        supabase.from("campaign_applications").select("*, campaigns(title, campaign_type, brand_user_id)")
          .eq("creator_user_id", targetUserId).eq("status", "accepted").limit(10),
      ]);
      setProfile(p);
      setCreatorProfile(cp);
      setReviews(revs || []);
      setCampaigns(apps || []);
      setLoading(false);
    };
    load();
  }, [targetUserId]);

  const shareUrl = `${window.location.origin}/media-kit/${targetUserId}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.overall_rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-primary/20 animate-pulse" />
      </div>
    );
  }

  if (!profile || !creatorProfile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <p className="text-muted-foreground text-sm">Creator profile not found</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const displayName = profile.full_name || "Creator";
  const handle = creatorProfile.instagram_handle ? `@${creatorProfile.instagram_handle}` : "";
  const totalFollowers = (creatorProfile.instagram_followers || 0) + (creatorProfile.youtube_subscribers || 0) + (creatorProfile.tiktok_followers || 0);
  const hasRates = creatorProfile.rate_reel || creatorProfile.rate_feed_post || creatorProfile.rate_story || creatorProfile.rate_youtube;

  const socialPlatforms = [
    { name: "Instagram", icon: Instagram, color: "bg-pink-500/10 text-pink-500 border-pink-500/20", handle: creatorProfile.instagram_handle ? `@${creatorProfile.instagram_handle}` : null, followers: creatorProfile.instagram_followers },
    { name: "YouTube", icon: Youtube, color: "bg-red-500/10 text-red-500 border-red-500/20", handle: creatorProfile.youtube_channel, followers: creatorProfile.youtube_subscribers },
    { name: "Twitter/X", icon: Twitter, color: "bg-blue-400/10 text-blue-400 border-blue-400/20", handle: creatorProfile.twitter_handle ? `@${creatorProfile.twitter_handle}` : null, followers: creatorProfile.tiktok_followers },
    { name: "LinkedIn", icon: Linkedin, color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20", handle: creatorProfile.linkedin_url, followers: null },
  ];

  const rateCardRows = hasRates ? [
    { label: "Instagram Reel", value: creatorProfile.rate_reel ? `₹${parseInt(creatorProfile.rate_reel).toLocaleString("en-IN")}` : null },
    { label: "Instagram Story", value: creatorProfile.rate_story ? `₹${parseInt(creatorProfile.rate_story).toLocaleString("en-IN")}` : null },
    { label: "Static Post", value: creatorProfile.rate_feed_post ? `₹${parseInt(creatorProfile.rate_feed_post).toLocaleString("en-IN")}` : null },
    { label: "YouTube Integration", value: creatorProfile.rate_youtube ? `₹${parseInt(creatorProfile.rate_youtube).toLocaleString("en-IN")}` : null },
  ].filter(r => r.value) : null;

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto pb-24">
      {/* Header */}
      <div className="px-4 pt-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="font-heading font-semibold text-sm text-foreground">Media Kit</h1>
        <div className="flex gap-1.5">
          {isOwnProfile && (
            <button onClick={() => navigate("/profile/edit")} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <button onClick={handleCopyLink} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
            {copied ? <CheckCircle className="w-4 h-4 text-primary" /> : <Share2 className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="px-4 mt-4">
        <div className="rounded-2xl p-6 text-center relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="relative z-10">
            <div className="w-[100px] h-[100px] rounded-full mx-auto ring-4 ring-primary-foreground/20 ring-offset-4 ring-offset-primary overflow-hidden bg-secondary">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-heading font-bold text-muted-foreground">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="font-heading font-bold text-xl text-primary-foreground mt-4">{displayName}</h2>
            {handle && <p className="text-sm text-primary-foreground/70 mt-0.5">{handle}</p>}
            <div className="flex items-center justify-center gap-2 mt-3">
              {creatorProfile.primary_niche && (
                <Badge className="bg-primary-foreground/15 text-primary-foreground border-0 text-[10px]">{creatorProfile.primary_niche}</Badge>
              )}
              {profile.location_city && (
                <span className="text-xs text-primary-foreground/60 flex items-center gap-0.5">
                  <MapPin className="w-3 h-3" /> {profile.location_city}
                </span>
              )}
            </div>
            {profile.bio && (
              <p className="text-xs text-primary-foreground/60 mt-3 max-w-xs mx-auto leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="px-4 mt-4 grid grid-cols-4 gap-2">
        {[
          { label: "Total Followers", value: totalFollowers > 0 ? `${(totalFollowers / 1000).toFixed(totalFollowers > 999999 ? 1 : 0)}${totalFollowers > 999999 ? "M" : "K"}` : "—", icon: Users },
          { label: "Engagement", value: creatorProfile.engagement_rate ? `${creatorProfile.engagement_rate}%` : "—", icon: TrendingUp },
          { label: "Avg Views", value: creatorProfile.instagram_followers ? `${Math.round(creatorProfile.instagram_followers * 0.15 / 1000)}K` : "—", icon: Eye },
          { label: "Campaigns", value: campaigns.length.toString(), icon: Briefcase },
        ].map((s, i) => (
          <div key={i} className="border border-border rounded-xl p-2.5 text-center">
            <s.icon className="w-3.5 h-3.5 mx-auto text-muted-foreground mb-1" />
            <p className="font-heading font-bold text-sm text-foreground">{s.value}</p>
            <p className="text-[8px] text-muted-foreground leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Social Platforms */}
      <div className="px-4 mt-4">
        <p className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-widest mb-2">Social Platforms</p>
        <div className="space-y-2">
          {socialPlatforms.map((plat, i) => (
            <div key={i} className={`border rounded-xl p-3 flex items-center gap-3 ${plat.handle ? "border-border" : "border-dashed border-border/50"}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${plat.color.split(" ").slice(0, 1).join(" ")}`}>
                <plat.icon className={`w-4 h-4 ${plat.color.split(" ").slice(1, 2).join(" ")}`} />
              </div>
              <div className="flex-1 min-w-0">
                {plat.handle ? (
                  <>
                    <p className="text-sm font-heading font-medium text-foreground truncate">{plat.handle}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {plat.followers ? `${plat.followers.toLocaleString()} followers` : plat.name}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">Add in Edit Profile</p>
                )}
              </div>
              {plat.handle && plat.followers && (
                <Badge className="bg-primary/10 text-primary border-0 text-[9px]">
                  <CheckCircle className="w-2.5 h-2.5 mr-0.5" /> Active
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Categories */}
      <div className="px-4 mt-4">
        <p className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-widest mb-2">Content Categories</p>
        <div className="flex flex-wrap gap-1.5">
          {[creatorProfile.primary_niche, ...(creatorProfile.secondary_niches || [])].filter(Boolean).map((n: string, i: number) => (
            <Badge key={i} variant="secondary" className="text-[10px] rounded-lg px-2.5 py-1">{n}</Badge>
          ))}
          {!creatorProfile.primary_niche && <p className="text-xs text-muted-foreground">No categories set</p>}
        </div>
      </div>

      {/* Rate Card */}
      <div className="px-4 mt-4">
        <p className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-widest mb-2">Rate Card</p>
        <div className="border border-border rounded-xl overflow-hidden">
          {(rateCardRows || defaultRates.map(r => ({ label: r.label, value: r.range }))).map((row, i) => (
            <div key={i} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`}>
              <span className="text-xs text-foreground font-medium">{row.label}</span>
              <span className="text-xs font-heading font-semibold text-foreground">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Content */}
      <div className="px-4 mt-4">
        <p className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-widest mb-2">Sample Content</p>
        <div className="grid grid-cols-3 gap-2">
          {sampleContentTypes.map((type, i) => (
            <div key={i} className="aspect-[3/4] rounded-xl bg-gradient-to-br from-secondary to-secondary/50 border border-border flex flex-col items-center justify-center gap-1.5">
              {type === "Reel" ? <Film className="w-5 h-5 text-muted-foreground/40" /> :
               type === "Story" ? <Layers className="w-5 h-5 text-muted-foreground/40" /> :
               <Image className="w-5 h-5 text-muted-foreground/40" />}
              <span className="text-[9px] text-muted-foreground font-medium">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Collaborations */}
      <div className="px-4 mt-4">
        <p className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-widest mb-2">
          Previous Collaborations ({campaigns.length > 0 ? campaigns.length : mockCollabs.length})
        </p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {(campaigns.length > 0
            ? campaigns.slice(0, 5).map((app, i) => ({
                brand: (app as any).campaigns?.title || "Campaign",
                logo: "",
                type: (app as any).campaigns?.campaign_type?.replace(/_/g, " ") || "Collaboration",
              }))
            : mockCollabs
          ).map((collab, i) => (
            <div key={i} className="min-w-[140px] border border-border rounded-xl p-3 text-center shrink-0">
              <div className="w-10 h-10 rounded-lg mx-auto bg-secondary overflow-hidden flex items-center justify-center">
                {collab.logo ? (
                  <img src={collab.logo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-[11px] font-heading font-semibold text-foreground mt-2 truncate">{collab.brand}</p>
              <p className="text-[9px] text-muted-foreground">{collab.type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="px-4 mt-4">
          <p className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-widest mb-2">Reviews</p>
          {reviews.slice(0, 3).map((r, i) => (
            <div key={i} className="border border-border rounded-xl p-3 mb-2">
              <div className="flex gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`w-3 h-3 ${s <= r.overall_rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} />
                ))}
              </div>
              {r.comment && <p className="text-xs text-muted-foreground">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="max-w-lg mx-auto px-4 py-3 flex gap-2">
          {isOwnProfile ? (
            <>
              <Button className="flex-1 h-11 rounded-xl font-heading" onClick={handleCopyLink}>
                <Copy className="w-4 h-4 mr-1.5" /> {copied ? "Copied!" : "Share Media Kit"}
              </Button>
              <Button variant="outline" className="h-11 rounded-xl px-4" onClick={() => navigate("/profile/edit")}>
                <Edit3 className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button className="flex-1 h-11 rounded-xl font-heading" onClick={() => navigate(`/creators/${targetUserId}`)}>
              <Mail className="w-4 h-4 mr-1.5" /> Hire {displayName.split(" ")[0]}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorMediaKit;
