import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { toast } from "sonner";

const EditProfile = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");

  // Creator fields
  const [instagramHandle, setInstagramHandle] = useState("");
  const [youtubeChannel, setYoutubeChannel] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [rateFeedPost, setRateFeedPost] = useState("");
  const [rateReel, setRateReel] = useState("");
  const [rateStory, setRateStory] = useState("");

  // Brand fields
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [industry, setIndustry] = useState("");

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: p } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (p) {
        setFullName(p.full_name || "");
        setBio(p.bio || "");
        setCity(p.location_city || "");
        setState(p.location_state || "");
        setPhone(p.phone || "");
      }
      if (role === "creator") {
        const { data: cp } = await supabase.from("creator_profiles").select("*").eq("user_id", user.id).maybeSingle();
        if (cp) {
          setInstagramHandle(cp.instagram_handle || "");
          setYoutubeChannel(cp.youtube_channel || "");
          setTwitterHandle(cp.twitter_handle || "");
          setRateFeedPost(cp.rate_feed_post || "");
          setRateReel(cp.rate_reel || "");
          setRateStory(cp.rate_story || "");
        }
      } else {
        const { data: bp } = await supabase.from("brand_profiles").select("*").eq("user_id", user.id).maybeSingle();
        if (bp) {
          setBusinessName(bp.business_name || "");
          setWebsite(bp.website_url || "");
          setBrandDescription(bp.brand_description || "");
          setIndustry(bp.industry || "");
        }
      }
    };
    load();
  }, [user, role]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await supabase.from("profiles").update({
        full_name: fullName,
        bio,
        location_city: city,
        location_state: state,
        phone,
      }).eq("user_id", user.id);

      if (role === "creator") {
        await supabase.from("creator_profiles").update({
          instagram_handle: instagramHandle,
          youtube_channel: youtubeChannel,
          twitter_handle: twitterHandle,
          rate_feed_post: rateFeedPost,
          rate_reel: rateReel,
          rate_story: rateStory,
        }).eq("user_id", user.id);
      } else {
        await supabase.from("brand_profiles").update({
          business_name: businessName,
          website_url: website,
          brand_description: brandDescription,
          industry,
        }).eq("user_id", user.id);
      }

      toast.success("Profile updated! ✨");
      navigate("/profile");
    } catch {
      toast.error("Failed to save changes");
    }
    setLoading(false);
  };

  const InputField = ({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) => (
    <div>
      <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type} className="w-full h-11 px-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-4 flex items-center justify-between sticky top-0 bg-background z-10 pb-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-heading font-semibold text-sm text-foreground">Edit Profile</h1>
        <Button size="sm" variant="gradient" className="h-8 text-xs rounded-xl" disabled={loading} onClick={handleSave}>
          <Save className="w-3.5 h-3.5" /> Save
        </Button>
      </div>

      {/* Avatar */}
      <div className="px-4 mt-4 flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center text-3xl shadow-lg">
            {fullName ? fullName.charAt(0).toUpperCase() : "?"}
          </div>
          <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-md">
            <Camera className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="px-4 mt-6 space-y-3">
        <p className="text-[10px] font-heading font-semibold text-muted-foreground uppercase tracking-wider">Basic Info</p>
        <InputField label="Full Name" value={fullName} onChange={setFullName} placeholder="Your name" />
        <div>
          <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell people about yourself..." rows={3} className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="City" value={city} onChange={setCity} placeholder="Mumbai" />
          <InputField label="State" value={state} onChange={setState} placeholder="Maharashtra" />
        </div>
        <InputField label="Phone" value={phone} onChange={setPhone} placeholder="+91 98765 43210" type="tel" />
      </div>

      {/* Role-specific */}
      {role === "creator" ? (
        <div className="px-4 mt-6 space-y-3">
          <p className="text-[10px] font-heading font-semibold text-muted-foreground uppercase tracking-wider">Social Handles</p>
          <InputField label="Instagram" value={instagramHandle} onChange={setInstagramHandle} placeholder="@yourhandle" />
          <InputField label="YouTube" value={youtubeChannel} onChange={setYoutubeChannel} placeholder="Channel URL" />
          <InputField label="Twitter" value={twitterHandle} onChange={setTwitterHandle} placeholder="@handle" />

          <p className="text-[10px] font-heading font-semibold text-muted-foreground uppercase tracking-wider mt-4">Rate Card (₹)</p>
          <div className="grid grid-cols-3 gap-2">
            <InputField label="Feed Post" value={rateFeedPost} onChange={setRateFeedPost} placeholder="₹" />
            <InputField label="Reel" value={rateReel} onChange={setRateReel} placeholder="₹" />
            <InputField label="Story" value={rateStory} onChange={setRateStory} placeholder="₹" />
          </div>
        </div>
      ) : (
        <div className="px-4 mt-6 space-y-3">
          <p className="text-[10px] font-heading font-semibold text-muted-foreground uppercase tracking-wider">Brand Details</p>
          <InputField label="Business Name" value={businessName} onChange={setBusinessName} placeholder="Your brand name" />
          <InputField label="Website" value={website} onChange={setWebsite} placeholder="https://..." />
          <InputField label="Industry" value={industry} onChange={setIndustry} placeholder="e.g. Fashion, Tech" />
          <div>
            <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Brand Description</label>
            <textarea value={brandDescription} onChange={e => setBrandDescription(e.target.value)} placeholder="About your brand..." rows={3} className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
        </div>
      )}

      <div className="h-8" />
    </div>
  );
};

export default EditProfile;
