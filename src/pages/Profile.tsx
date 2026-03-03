import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { User, Settings, Heart, Bell, LogOut, Edit3, MapPin, Star, TrendingUp, Users, ChevronRight, Shield, HelpCircle, FileText, Instagram, Youtube, Twitter, BarChart3, Wallet, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [creatorProfile, setCreatorProfile] = useState<any>(null);
  const [brandProfile, setBrandProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const fetchProfiles = async () => {
      const { data: p } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      setProfile(p);
      if (role === "creator") {
        const { data: cp } = await supabase.from("creator_profiles").select("*").eq("user_id", user.id).maybeSingle();
        setCreatorProfile(cp);
      } else {
        const { data: bp } = await supabase.from("brand_profiles").select("*").eq("user_id", user.id).maybeSingle();
        setBrandProfile(bp);
      }
    };
    fetchProfiles();
  }, [user, role]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email;

  return (
    <Layout>
      {/* Profile Header */}
      <div className="relative">
        <div className="h-28 gradient-primary" />
        <div className="px-4 -mt-10">
          <div className="flex items-end gap-3">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl gradient-primary border-4 border-background flex items-center justify-center shadow-lg text-2xl font-heading font-bold text-primary-foreground">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  displayName?.charAt(0)?.toUpperCase() || <User className="w-8 h-8 text-primary-foreground" />
                )}
              </div>
              <button onClick={() => navigate("/profile/edit")} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shadow-md">
                <Edit3 className="w-3.5 h-3.5 text-primary-foreground" />
              </button>
            </div>
            <div className="pb-1 flex-1">
              <h1 className="font-heading font-bold text-lg text-foreground">{displayName}</h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-4 mt-4">
        <div className="flex items-center gap-2 flex-wrap">
          {role && (
            <Badge className="gradient-primary text-primary-foreground border-0 font-heading">
              {role === "creator" ? "🎨 Creator" : "🏢 Brand"}
            </Badge>
          )}
          {profile?.location_city && (
            <Badge variant="secondary" className="text-xs">
              <MapPin className="w-3 h-3 mr-0.5" /> {profile.location_city}
            </Badge>
          )}
          {creatorProfile?.primary_niche && (
            <Badge variant="secondary" className="text-xs">{creatorProfile.primary_niche}</Badge>
          )}
        </div>
        {profile?.bio && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{profile.bio}</p>}
      </div>

      {/* Creator Stats & Handles */}
      {role === "creator" && creatorProfile && (
        <>
          <div className="px-4 mt-4 grid grid-cols-3 gap-2.5">
            {[
              { label: "Followers", value: creatorProfile.instagram_followers ? `${(creatorProfile.instagram_followers / 1000).toFixed(0)}K` : "—" },
              { label: "Engagement", value: creatorProfile.engagement_rate ? `${creatorProfile.engagement_rate}%` : "—" },
              { label: "Rating", value: "4.8⭐" },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-2xl p-3 text-center">
                <p className="font-heading font-bold text-base text-card-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {(creatorProfile.instagram_handle || creatorProfile.youtube_channel) && (
            <div className="px-4 mt-3 flex gap-2">
              {creatorProfile.instagram_handle && (
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                  <Instagram className="w-3 h-3 mr-0.5" /> {creatorProfile.instagram_handle}
                </Badge>
              )}
              {creatorProfile.youtube_channel && (
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                  <Youtube className="w-3 h-3 mr-0.5" /> YouTube
                </Badge>
              )}
            </div>
          )}

          {(creatorProfile.rate_feed_post || creatorProfile.rate_reel || creatorProfile.rate_story) && (
            <div className="px-4 mt-3">
              <div className="glass-card rounded-2xl p-4">
                <h3 className="font-heading font-semibold text-xs text-card-foreground mb-2">Rate Card</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Feed Post", value: creatorProfile.rate_feed_post },
                    { label: "Reel", value: creatorProfile.rate_reel },
                    { label: "Story", value: creatorProfile.rate_story },
                  ].filter(r => r.value).map((rate, i) => (
                    <div key={i} className="text-center">
                      <p className="font-heading font-bold text-sm gradient-text">₹{parseInt(rate.value).toLocaleString()}</p>
                      <p className="text-[9px] text-muted-foreground">{rate.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Brand Info */}
      {role === "brand" && brandProfile && (
        <div className="px-4 mt-4">
          <div className="glass-card rounded-2xl p-4">
            <h3 className="font-heading font-semibold text-sm text-card-foreground">{brandProfile.business_name || "Your Brand"}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{brandProfile.industry || "Industry not set"}</p>
            {brandProfile.website_url && <p className="text-xs text-primary mt-1">{brandProfile.website_url}</p>}
            {brandProfile.brand_description && <p className="text-xs text-muted-foreground mt-2">{brandProfile.brand_description}</p>}
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="px-4 mt-5 space-y-1">
        <p className="text-[10px] font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Account</p>
        {[
          { icon: Edit3, label: "Edit Profile", desc: "Update your info & media kit", to: "/profile/edit" },
          { icon: Wallet, label: role === "brand" ? "Payments" : "Earnings", desc: role === "brand" ? "Track campaign payments" : "Your earnings & withdrawals", to: "/earnings" },
          { icon: BarChart3, label: "Analytics", desc: "Performance & growth metrics", to: "/analytics" },
          { icon: Star, label: "Reviews", desc: "Ratings & feedback", to: "/reviews" },
          { icon: Heart, label: role === "brand" ? "Saved Creators" : "Saved Campaigns", desc: role === "brand" ? "Bookmarked creators" : "Saved campaigns", to: role === "brand" ? "/saved" : "/campaigns" },
          { icon: FileText, label: "My Applications", desc: "Track campaign applications", to: "/applications" },
          { icon: Bell, label: "Notifications", desc: "Campaign updates & messages", to: "/notifications" },
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => item.to && navigate(item.to)}
            className="w-full glass-card rounded-xl p-3.5 flex items-center gap-3 hover-lift opacity-0 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}
          >
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-heading font-medium text-sm text-card-foreground">{item.label}</p>
              <p className="text-[10px] text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}

        <p className="text-[10px] font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-5 px-1">Preferences</p>
        {[
          { icon: Settings, label: "Settings", desc: "Account, notifications, privacy", to: "/settings" },
          { icon: HelpCircle, label: "Help & Support", desc: "FAQ, disputes, contact", to: "/support" },
          { icon: Shield, label: "Privacy & Security", to: "/settings" },
        ].map((item, i) => (
          <button key={i} onClick={() => item.to && navigate(item.to)} className="w-full glass-card rounded-xl p-3.5 flex items-center gap-3 hover-lift opacity-0 animate-fade-up" style={{ animationDelay: `${(i + 7) * 60}ms`, animationFillMode: "forwards" }}>
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <item.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-heading font-medium text-sm text-card-foreground">{item.label}</p>
              {item.desc && <p className="text-[10px] text-muted-foreground">{item.desc}</p>}
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Sign Out */}
      <div className="px-4 py-6">
        <Button variant="outline" className="w-full h-11 rounded-2xl border-destructive/30 text-destructive hover:bg-destructive/5" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" /> Sign Out
        </Button>
        <p className="text-[10px] text-muted-foreground text-center mt-3">TIL v1.0 • India's #1 Creator Marketplace</p>
      </div>
    </Layout>
  );
};

export default Profile;
