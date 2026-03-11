import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { User, Settings, Heart, Bell, LogOut, Edit3, MapPin, Star, ChevronRight, Shield, HelpCircle, FileText, BarChart3, Wallet, Instagram, Youtube, Twitter, Linkedin, CheckCircle, Users, Radio, Sparkles, Sun, Moon } from "lucide-react";
import CreatorLevelBadge from "@/components/CreatorLevelBadge";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const Profile = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [creatorProfile, setCreatorProfile] = useState<any>(null);
  const [brandProfile, setBrandProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

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
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      if (roles?.some(r => r.role === "admin")) setIsAdmin(true);
    };
    fetchProfiles();
  }, [user, role]);

  const handleSignOut = async () => { await signOut(); navigate("/"); };
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email;

  const socialPlatforms = creatorProfile ? [
    { icon: Instagram, label: "IG", value: creatorProfile.instagram_followers, color: "text-pink-500" },
    { icon: Youtube, label: "YT", value: creatorProfile.youtube_subscribers, color: "text-red-500" },
    { icon: Twitter, label: "TW", value: creatorProfile.tiktok_followers, color: "text-blue-400" },
  ].filter(p => p.value && p.value > 0) : [];

  return (
    <Layout>
      <div className="page-transition">
        {/* Profile Header */}
        <div className="px-5 pt-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-xl font-heading font-bold text-muted-foreground">
                {profile?.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" /> : displayName?.charAt(0)?.toUpperCase() || <User className="w-6 h-6" />}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="font-heading font-bold text-lg text-foreground">{displayName}</h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded bg-foreground text-background font-medium">{role === "creator" ? "Creator" : "Brand"}</span>
                {profile?.location_city && <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {profile.location_city}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
              </button>
              <button onClick={() => navigate("/profile/edit")} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                <Edit3 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          {profile?.bio && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{profile.bio}</p>}
        </div>

        {/* Creator Stats */}
        {role === "creator" && creatorProfile && (
          <div className="px-5 mt-4 grid grid-cols-3 gap-2">
            {[
              { label: "Followers", value: creatorProfile.instagram_followers ? `${(creatorProfile.instagram_followers / 1000).toFixed(0)}K` : "—" },
              { label: "Engagement", value: creatorProfile.engagement_rate ? `${creatorProfile.engagement_rate}%` : "—" },
              { label: "Rating", value: "4.8" },
            ].map((stat, i) => (
              <div key={i} className="border border-border rounded-lg p-3 text-center">
                <p className="font-heading font-bold text-base text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Creator Level Badge */}
        {role === "creator" && (
          <div className="px-5 mt-4">
            <CreatorLevelBadge followers={45000} engagementRate={5.2} completedCampaigns={3} size="lg" showProgress showBenefits />
          </div>
        )}

        {/* Social Platforms */}
        {role === "creator" && socialPlatforms.length > 0 && (
          <div className="px-5 mt-3">
            <div className="border border-border rounded-lg p-3 flex items-center gap-3">
              {socialPlatforms.map((p, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <p.icon className={`w-3.5 h-3.5 ${p.color}`} />
                  <span className="text-xs font-heading font-semibold text-foreground">{p.value > 999999 ? `${(p.value / 1000000).toFixed(1)}M` : `${(p.value / 1000).toFixed(0)}K`}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rate Card */}
        {role === "creator" && creatorProfile && (creatorProfile.rate_feed_post || creatorProfile.rate_reel) && (
          <div className="px-5 mt-3">
            <div className="border border-border rounded-lg p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Rate Card</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Feed Post", value: creatorProfile.rate_feed_post },
                  { label: "Reel", value: creatorProfile.rate_reel },
                  { label: "Story", value: creatorProfile.rate_story },
                ].filter(r => r.value).map((rate, i) => (
                  <div key={i} className="text-center">
                    <p className="font-heading font-bold text-sm text-foreground">₹{parseInt(rate.value).toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">{rate.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Brand Info */}
        {role === "brand" && brandProfile && (
          <div className="px-5 mt-4">
            <div className="border border-border rounded-lg p-4">
              <p className="font-heading font-semibold text-sm text-foreground">{brandProfile.business_name || "Your Brand"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{brandProfile.industry || "Industry not set"}</p>
              {brandProfile.website_url && <p className="text-xs text-accent mt-1">{brandProfile.website_url}</p>}
            </div>
          </div>
        )}

        {/* Menu */}
        <div className="px-5 mt-5 space-y-0.5">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 px-1">Account</p>
          {[
            { icon: Edit3, label: "Edit Profile", to: "/profile/edit" },
            ...(role === "creator" ? [{ icon: FileText, label: "My Media Kit", to: "/media-kit" }] : []),
            { icon: Wallet, label: role === "brand" ? "Payments" : "Wallet", to: "/earnings" },
            { icon: BarChart3, label: "Analytics", to: "/analytics" },
            { icon: Star, label: "Reviews", to: "/reviews" },
            { icon: Heart, label: role === "brand" ? "Saved Creators" : "Saved", to: role === "brand" ? "/saved" : "/campaigns" },
            { icon: FileText, label: "Applications", to: "/applications" },
            { icon: Bell, label: "Notifications", to: "/notifications" },
          ].map((item, i) => (
            <button key={i} onClick={() => navigate(item.to)} className="w-full rounded-lg p-3 flex items-center gap-3 hover:bg-secondary transition-colors">
              <item.icon className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 text-left text-sm font-medium text-foreground">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}

          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-4 mb-2 px-1">Explore</p>
          {[
            { icon: Users, label: "Community", to: "/community" },
            { icon: Radio, label: "Channels", to: "/channels" },
            { icon: Sparkles, label: "Managed Services", to: "/managed-services" },
            { icon: HelpCircle, label: "Help & Support", to: "/support" },
            ...(isAdmin ? [{ icon: Shield, label: "Admin Panel", to: "/admin" }] : []),
          ].map((item, i) => (
            <button key={i} onClick={() => navigate(item.to)} className="w-full rounded-lg p-3 flex items-center gap-3 hover:bg-secondary transition-colors">
              <item.icon className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 text-left text-sm font-medium text-foreground">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}

          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-4 mb-2 px-1">Settings</p>
          {[
            { icon: Settings, label: "Settings", to: "/settings" },
            { icon: Shield, label: "Privacy", to: "/settings" },
          ].map((item, i) => (
            <button key={i} onClick={() => navigate(item.to)} className="w-full rounded-lg p-3 flex items-center gap-3 hover:bg-secondary transition-colors">
              <item.icon className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 text-left text-sm font-medium text-foreground">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Sign Out */}
        <div className="px-5 py-6">
          <Button variant="outline" className="w-full h-10 text-destructive border-destructive/20 hover:bg-destructive/5" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-1.5" /> Sign Out
          </Button>
          <p className="text-[10px] text-muted-foreground text-center mt-3">TIL v1.0</p>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
