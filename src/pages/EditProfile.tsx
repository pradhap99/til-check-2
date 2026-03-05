import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Instagram, Youtube, Twitter, Linkedin, CheckCircle, Info } from "lucide-react";
import { toast } from "sonner";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose,
} from "@/components/ui/drawer";

const EditProfile = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [connectDrawer, setConnectDrawer] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");

  const [instagramHandle, setInstagramHandle] = useState("");
  const [instagramFollowers, setInstagramFollowers] = useState("");
  const [youtubeChannel, setYoutubeChannel] = useState("");
  const [youtubeSubscribers, setYoutubeSubscribers] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [twitterFollowers, setTwitterFollowers] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [rateFeedPost, setRateFeedPost] = useState("");
  const [rateReel, setRateReel] = useState("");
  const [rateStory, setRateStory] = useState("");
  const [rateYoutube, setRateYoutube] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [industry, setIndustry] = useState("");

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: p } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (p) { setFullName(p.full_name || ""); setBio(p.bio || ""); setCity(p.location_city || ""); setState(p.location_state || ""); setPhone(p.phone || ""); }
      if (role === "creator") {
        const { data: cp } = await supabase.from("creator_profiles").select("*").eq("user_id", user.id).maybeSingle();
        if (cp) {
          setInstagramHandle(cp.instagram_handle || ""); setInstagramFollowers(cp.instagram_followers?.toString() || "");
          setYoutubeChannel(cp.youtube_channel || ""); setYoutubeSubscribers(cp.youtube_subscribers?.toString() || "");
          setTwitterHandle(cp.twitter_handle || ""); setTwitterFollowers(cp.tiktok_followers?.toString() || "");
          setLinkedinUrl(cp.linkedin_url || "");
          setRateFeedPost(cp.rate_feed_post || ""); setRateReel(cp.rate_reel || ""); setRateStory(cp.rate_story || ""); setRateYoutube(cp.rate_youtube || "");
        }
      } else {
        const { data: bp } = await supabase.from("brand_profiles").select("*").eq("user_id", user.id).maybeSingle();
        if (bp) { setBusinessName(bp.business_name || ""); setWebsite(bp.website_url || ""); setBrandDescription(bp.brand_description || ""); setIndustry(bp.industry || ""); }
      }
    };
    load();
  }, [user, role]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await supabase.from("profiles").update({ full_name: fullName, bio, location_city: city, location_state: state, phone }).eq("user_id", user.id);
      if (role === "creator") {
        await supabase.from("creator_profiles").update({
          instagram_handle: instagramHandle, instagram_followers: instagramFollowers ? parseInt(instagramFollowers) : 0,
          youtube_channel: youtubeChannel, youtube_subscribers: youtubeSubscribers ? parseInt(youtubeSubscribers) : 0,
          twitter_handle: twitterHandle, tiktok_followers: twitterFollowers ? parseInt(twitterFollowers) : 0,
          linkedin_url: linkedinUrl,
          rate_feed_post: rateFeedPost, rate_reel: rateReel, rate_story: rateStory, rate_youtube: rateYoutube,
        }).eq("user_id", user.id);
      } else {
        await supabase.from("brand_profiles").update({ business_name: businessName, website_url: website, brand_description: brandDescription, industry }).eq("user_id", user.id);
      }
      toast.success("Profile updated");
      navigate("/profile");
    } catch {
      toast.error("Failed to save changes");
    }
    setLoading(false);
  };

  const Field = ({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) => (
    <div>
      <label className="text-xs font-medium text-foreground mb-1.5 block">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type} className="w-full h-11 px-3 rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring/20" />
    </div>
  );

  const SocialRow = ({ icon: Icon, label, color, handle, setHandle, handlePlaceholder, followers, setFollowers }: any) => {
    const hasData = handle && handle.length > 0;
    return (
      <div className="border border-border rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-heading font-medium text-foreground">{label}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {hasData && parseInt(followers || "0") > 0 ? (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-0.5">
                <CheckCircle className="w-2.5 h-2.5" /> Verified
              </span>
            ) : (
              <button onClick={() => setConnectDrawer(label)} className="text-[9px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">
                {hasData ? "Self-reported" : "Connect"}
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input placeholder={handlePlaceholder} value={handle} onChange={e => setHandle(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring/20" />
          {setFollowers && (
            <input placeholder="Followers" value={followers} onChange={e => setFollowers(e.target.value)} type="number" className="w-full h-10 px-3 rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring/20" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      <div className="px-5 pt-4 flex items-center justify-between sticky top-0 bg-background z-10 pb-3 border-b border-border">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <h1 className="font-heading font-semibold text-sm text-foreground">Edit Profile</h1>
        <Button size="sm" className="h-8 text-xs font-medium" disabled={loading} onClick={handleSave}>
          <Save className="w-3.5 h-3.5 mr-1" /> Save
        </Button>
      </div>

      {/* Avatar */}
      <div className="px-5 mt-6 flex justify-center">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-2xl font-heading font-bold text-muted-foreground">
          {fullName ? fullName.charAt(0).toUpperCase() : "?"}
        </div>
      </div>

      <div className="px-5 mt-6 space-y-4">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Basic Info</p>
        <Field label="Full Name" value={fullName} onChange={setFullName} placeholder="Your name" />
        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell people about yourself..." rows={3} className="w-full px-3 py-2 rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="City" value={city} onChange={setCity} placeholder="Mumbai" />
          <Field label="State" value={state} onChange={setState} placeholder="Maharashtra" />
        </div>
        <Field label="Phone" value={phone} onChange={setPhone} placeholder="+91 98765 43210" type="tel" />
      </div>

      {role === "creator" ? (
        <>
          <div className="px-5 mt-6 space-y-3">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Social Accounts</p>
            <SocialRow icon={Instagram} label="Instagram" color="bg-pink-500/10 text-pink-500" handle={instagramHandle} setHandle={setInstagramHandle} handlePlaceholder="@yourhandle" followers={instagramFollowers} setFollowers={setInstagramFollowers} />
            <SocialRow icon={Youtube} label="YouTube" color="bg-red-500/10 text-red-500" handle={youtubeChannel} setHandle={setYoutubeChannel} handlePlaceholder="Channel URL" followers={youtubeSubscribers} setFollowers={setYoutubeSubscribers} />
            <SocialRow icon={Twitter} label="Twitter / X" color="bg-blue-400/10 text-blue-400" handle={twitterHandle} setHandle={setTwitterHandle} handlePlaceholder="@handle" followers={twitterFollowers} setFollowers={setTwitterFollowers} />
            <SocialRow icon={Linkedin} label="LinkedIn" color="bg-indigo-500/10 text-indigo-500" handle={linkedinUrl} setHandle={setLinkedinUrl} handlePlaceholder="Profile URL" followers="" setFollowers={null} />
          </div>

          <div className="px-5 mt-6 space-y-4">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Rate Card (₹)</p>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Reel" value={rateReel} onChange={setRateReel} placeholder="₹" />
              <Field label="Story" value={rateStory} onChange={setRateStory} placeholder="₹" />
              <Field label="Feed Post" value={rateFeedPost} onChange={setRateFeedPost} placeholder="₹" />
              <Field label="YouTube" value={rateYoutube} onChange={setRateYoutube} placeholder="₹" />
            </div>
          </div>
        </>
      ) : (
        <div className="px-5 mt-6 space-y-4">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Brand Details</p>
          <Field label="Business Name" value={businessName} onChange={setBusinessName} placeholder="Your brand" />
          <Field label="Website" value={website} onChange={setWebsite} placeholder="https://..." />
          <Field label="Industry" value={industry} onChange={setIndustry} placeholder="e.g. Fashion, Tech" />
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">Brand Description</label>
            <textarea value={brandDescription} onChange={e => setBrandDescription(e.target.value)} placeholder="About your brand..." rows={3} className="w-full px-3 py-2 rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none" />
          </div>
        </div>
      )}

      <div className="h-8" />

      {/* Connect Drawer */}
      <Drawer open={!!connectDrawer} onOpenChange={() => setConnectDrawer(null)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="font-heading">{connectDrawer} Integration</DrawerTitle>
            <DrawerDescription>API verification coming soon</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-2">
            <div className="flex items-start gap-3 bg-secondary/50 rounded-xl p-4">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium">{connectDrawer} API verification is coming soon</p>
                <p className="text-xs text-muted-foreground mt-1">Your metrics are self-reported until verification is available. We'll notify you when API integration launches.</p>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button className="w-full rounded-xl">Got it</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default EditProfile;
