import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Instagram, Youtube, Twitter, MapPin, Star, Users,
  TrendingUp, Share2, Copy, CheckCircle, Mail, ExternalLink,
  Briefcase, IndianRupee, Globe, Heart
} from "lucide-react";
import { toast } from "sonner";

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

  const isOwnProfile = user?.id === targetUserId;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl gradient-primary animate-pulse-glow" />
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

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="font-heading font-semibold text-sm text-foreground">Media Kit</h1>
        <button onClick={handleCopyLink} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
          {copied ? <CheckCircle className="w-4 h-4 text-primary" /> : <Share2 className="w-4 h-4 text-muted-foreground" />}
        </button>
      </div>

      {/* Hero */}
      <div className="px-4 mt-6 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary mx-auto flex items-center justify-center text-2xl font-heading font-bold text-muted-foreground border-2 border-border">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
          ) : displayName.charAt(0).toUpperCase()}
        </div>
        <h2 className="font-heading font-bold text-xl text-foreground mt-3">{displayName}</h2>
        {creatorProfile.primary_niche && (
          <Badge className="mt-1.5 bg-accent/10 text-accent border-0 text-[10px]">{creatorProfile.primary_niche}</Badge>
        )}
        {profile.location_city && (
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3" /> {profile.location_city}{profile.location_state ? `, ${profile.location_state}` : ""}
          </p>
        )}
        {profile.bio && (
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-sm mx-auto">{profile.bio}</p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="px-4 mt-5 grid grid-cols-3 gap-2">
        {[
          { label: "Followers", value: creatorProfile.instagram_followers ? `${(creatorProfile.instagram_followers / 1000).toFixed(creatorProfile.instagram_followers > 999999 ? 1 : 0)}${creatorProfile.instagram_followers > 999999 ? "M" : "K"}` : "—", icon: Users },
          { label: "Engagement", value: creatorProfile.engagement_rate ? `${creatorProfile.engagement_rate}%` : "—", icon: TrendingUp },
          { label: "Rating", value: avgRating || "New", icon: Star },
        ].map((s, i) => (
          <div key={i} className="border border-border rounded-xl p-3 text-center">
            <s.icon className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
            <p className="font-heading font-bold text-lg text-foreground">{s.value}</p>
            <p className="text-[9px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Social Handles */}
      <div className="px-4 mt-4">
        <div className="border border-border rounded-xl p-4">
          <p className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-widest mb-2.5">Social Platforms</p>
          <div className="space-y-2">
            {creatorProfile.instagram_handle && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <Instagram className="w-4 h-4 text-pink-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-heading font-medium text-foreground">@{creatorProfile.instagram_handle}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {creatorProfile.instagram_followers ? `${creatorProfile.instagram_followers.toLocaleString()} followers` : "Instagram"}
                  </p>
                </div>
              </div>
            )}
            {creatorProfile.youtube_channel && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Youtube className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-heading font-medium text-foreground">{creatorProfile.youtube_channel}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {creatorProfile.youtube_subscribers ? `${creatorProfile.youtube_subscribers.toLocaleString()} subscribers` : "YouTube"}
                  </p>
                </div>
              </div>
            )}
            {creatorProfile.twitter_handle && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Twitter className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-heading font-medium text-foreground">@{creatorProfile.twitter_handle}</p>
                  <p className="text-[10px] text-muted-foreground">Twitter/X</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rate Card */}
      {(creatorProfile.rate_feed_post || creatorProfile.rate_reel || creatorProfile.rate_story || creatorProfile.rate_youtube) && (
        <div className="px-4 mt-3">
          <div className="border border-border rounded-xl p-4">
            <p className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-widest mb-2.5">Rate Card</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Feed Post", value: creatorProfile.rate_feed_post },
                { label: "Reel", value: creatorProfile.rate_reel },
                { label: "Story", value: creatorProfile.rate_story },
                { label: "YouTube", value: creatorProfile.rate_youtube },
              ].filter(r => r.value).map((r, i) => (
                <div key={i} className="bg-secondary rounded-lg p-2.5 text-center">
                  <p className="font-heading font-bold text-sm text-foreground">₹{parseInt(r.value).toLocaleString("en-IN")}</p>
                  <p className="text-[9px] text-muted-foreground">{r.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Categories */}
      {creatorProfile.secondary_niches && creatorProfile.secondary_niches.length > 0 && (
        <div className="px-4 mt-3">
          <div className="border border-border rounded-xl p-4">
            <p className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-widest mb-2">Content Categories</p>
            <div className="flex flex-wrap gap-1.5">
              {[creatorProfile.primary_niche, ...creatorProfile.secondary_niches].filter(Boolean).map((n: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-[10px]">{n}</Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Past Collaborations */}
      {campaigns.length > 0 && (
        <div className="px-4 mt-3">
          <div className="border border-border rounded-xl p-4">
            <p className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-widest mb-2.5">
              Past Collaborations ({campaigns.length})
            </p>
            <div className="space-y-2">
              {campaigns.slice(0, 5).map((app, i) => (
                <div key={i} className="flex items-center gap-2.5 py-1.5">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-heading font-medium text-foreground truncate">{(app as any).campaigns?.title || "Campaign"}</p>
                    <p className="text-[10px] text-muted-foreground">{(app as any).campaigns?.campaign_type?.replace(/_/g, " ")}</p>
                  </div>
                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="px-4 mt-3">
          <div className="border border-border rounded-xl p-4">
            <p className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-widest mb-2.5">Reviews</p>
            {reviews.slice(0, 3).map((r, i) => (
              <div key={i} className="py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-3 h-3 ${s <= r.overall_rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} />
                  ))}
                </div>
                {r.comment && <p className="text-xs text-muted-foreground">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      {!isOwnProfile && (
        <div className="px-4 mt-5 pb-8">
          <Button className="w-full h-12 rounded-xl font-heading" onClick={() => navigate(`/creators/${targetUserId}`)}>
            <Mail className="w-4 h-4" /> Hire {displayName.split(" ")[0]}
          </Button>
        </div>
      )}

      {/* Own profile actions */}
      {isOwnProfile && (
        <div className="px-4 mt-5 pb-8 space-y-2">
          <Button variant="outline" className="w-full h-10 rounded-xl font-heading text-xs" onClick={handleCopyLink}>
            <Copy className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Copy Shareable Link"}
          </Button>
          <Button variant="outline" className="w-full h-10 rounded-xl font-heading text-xs" onClick={() => navigate("/profile/edit")}>
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreatorMediaKit;
