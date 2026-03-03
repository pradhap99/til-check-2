import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft, Users, CheckCircle, XCircle, Clock, MessageCircle,
  Eye, ThumbsUp, ThumbsDown, Star, Send, ChevronRight
} from "lucide-react";

interface Application {
  id: string;
  creator_user_id: string;
  pitch: string | null;
  proposed_rate: string | null;
  status: string;
  content_concept: string | null;
  created_at: string;
  creatorName?: string;
  creatorAvatar?: string;
  creatorNiche?: string;
  creatorFollowers?: number;
}

const CampaignManage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"applications" | "accepted" | "deliverables">("applications");

  useEffect(() => {
    if (!user || !id) return;
    const fetch = async () => {
      const { data: camp } = await supabase.from("campaigns").select("*").eq("id", id).maybeSingle();
      setCampaign(camp);

      const { data: apps } = await supabase
        .from("campaign_applications")
        .select("*")
        .eq("campaign_id", id)
        .order("created_at", { ascending: false });

      if (apps && apps.length > 0) {
        const creatorIds = apps.map(a => a.creator_user_id);
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, avatar_url").in("user_id", creatorIds);
        const { data: creatorProfiles } = await supabase.from("creator_profiles").select("user_id, primary_niche, instagram_followers").in("user_id", creatorIds);

        const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));
        const cpMap = new Map((creatorProfiles || []).map(p => [p.user_id, p]));

        setApplications(apps.map(a => ({
          ...a,
          creatorName: profileMap.get(a.creator_user_id)?.full_name || "Creator",
          creatorAvatar: profileMap.get(a.creator_user_id)?.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${a.creator_user_id.slice(0,8)}`,
          creatorNiche: cpMap.get(a.creator_user_id)?.primary_niche || "—",
          creatorFollowers: cpMap.get(a.creator_user_id)?.instagram_followers || 0,
        })));
      }
      setLoading(false);
    };
    fetch();
  }, [user, id]);

  const updateStatus = async (appId: string, status: string) => {
    const { error } = await supabase.from("campaign_applications").update({ status }).eq("id", appId);
    if (error) {
      toast.error("Failed to update");
      return;
    }
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    toast.success(status === "accepted" ? "Creator accepted! 🎉" : status === "rejected" ? "Application declined" : "Status updated");

    // Create notification for creator
    const app = applications.find(a => a.id === appId);
    if (app) {
      await supabase.from("notifications").insert({
        user_id: app.creator_user_id,
        title: status === "accepted" ? "Application Accepted! 🎉" : "Application Update",
        message: `Your application for "${campaign?.title}" has been ${status}.`,
        type: "application",
        reference_type: "campaign",
        reference_id: id,
      });
    }
  };

  const startConversation = async (creatorUserId: string) => {
    if (!user) return;
    // Check existing conversation
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .or(`and(participant_1.eq.${user.id},participant_2.eq.${creatorUserId}),and(participant_1.eq.${creatorUserId},participant_2.eq.${user.id})`)
      .maybeSingle();

    if (existing) {
      navigate(`/messages/${existing.id}`);
      return;
    }

    const { data: newConv, error } = await supabase.from("conversations").insert({
      participant_1: user.id,
      participant_2: creatorUserId,
      campaign_id: id,
    }).select("id").single();

    if (newConv) {
      navigate(`/messages/${newConv.id}`);
    }
  };

  const pendingApps = applications.filter(a => a.status === "pending");
  const acceptedApps = applications.filter(a => a.status === "accepted");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl gradient-primary animate-pulse-glow" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-heading font-semibold text-sm text-foreground truncate">{campaign?.title || "Campaign"}</h1>
          <p className="text-[10px] text-muted-foreground">{applications.length} applications</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-2">
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="font-heading font-bold text-lg text-card-foreground">{pendingApps.length}</p>
          <p className="text-[9px] text-muted-foreground">Pending</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="font-heading font-bold text-lg text-primary">{acceptedApps.length}</p>
          <p className="text-[9px] text-muted-foreground">Accepted</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="font-heading font-bold text-lg text-card-foreground">{campaign?.slots_total || 0}</p>
          <p className="text-[9px] text-muted-foreground">Total Slots</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4 flex gap-1.5">
        {(["applications", "accepted", "deliverables"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-full text-[10px] font-heading font-medium capitalize transition-all ${tab === t ? "gradient-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 mt-4 space-y-2.5 mb-8">
        {tab === "applications" && (
          pendingApps.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-heading font-medium text-muted-foreground">No pending applications</p>
            </div>
          ) : (
            pendingApps.map((app, i) => (
              <ApplicationCard key={app.id} app={app} onAccept={() => updateStatus(app.id, "accepted")} onReject={() => updateStatus(app.id, "rejected")} onMessage={() => startConversation(app.creator_user_id)} index={i} />
            ))
          )
        )}

        {tab === "accepted" && (
          acceptedApps.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-heading font-medium text-muted-foreground">No accepted creators yet</p>
            </div>
          ) : (
            acceptedApps.map((app, i) => (
              <div key={app.id} className="glass-card rounded-2xl p-4 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
                <div className="flex items-center gap-3">
                  <img src={app.creatorAvatar} alt="" className="w-11 h-11 rounded-xl object-cover bg-secondary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-sm text-card-foreground">{app.creatorName}</p>
                    <p className="text-[10px] text-muted-foreground">{app.creatorNiche} • {app.creatorFollowers ? `${(app.creatorFollowers/1000).toFixed(0)}K` : "—"} followers</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-0 text-[9px]">Active</Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs rounded-xl" onClick={() => startConversation(app.creator_user_id)}>
                    <MessageCircle className="w-3 h-3" /> Chat
                  </Button>
                  <Button size="sm" variant="gradient" className="flex-1 h-8 text-xs rounded-xl" onClick={() => navigate(`/campaigns/${id}`)}>
                    View Campaign <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )
        )}

        {tab === "deliverables" && (
          <div className="text-center py-12">
            <Eye className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-heading font-medium text-muted-foreground">Content submissions will appear here</p>
            <p className="text-xs text-muted-foreground mt-1">Once accepted creators submit their deliverables</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ApplicationCard = ({ app, onAccept, onReject, onMessage, index }: { app: Application; onAccept: () => void; onReject: () => void; onMessage: () => void; index: number }) => (
  <div className="glass-card rounded-2xl p-4 opacity-0 animate-fade-up" style={{ animationDelay: `${index * 60}ms`, animationFillMode: "forwards" }}>
    <div className="flex items-center gap-3">
      <img src={app.creatorAvatar} alt="" className="w-11 h-11 rounded-xl object-cover bg-secondary" />
      <div className="flex-1 min-w-0">
        <p className="font-heading font-semibold text-sm text-card-foreground">{app.creatorName}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge variant="secondary" className="text-[9px] px-1.5 py-0">{app.creatorNiche}</Badge>
          {app.creatorFollowers ? (
            <span className="text-[10px] text-muted-foreground">{(app.creatorFollowers/1000).toFixed(0)}K followers</span>
          ) : null}
        </div>
      </div>
      {app.proposed_rate && (
        <p className="text-xs font-heading font-bold gradient-text">₹{parseInt(app.proposed_rate).toLocaleString("en-IN")}</p>
      )}
    </div>

    {app.pitch && (
      <p className="text-xs text-muted-foreground mt-2.5 line-clamp-3 leading-relaxed">{app.pitch}</p>
    )}
    {app.content_concept && (
      <div className="mt-2 p-2.5 rounded-xl bg-secondary/50">
        <p className="text-[10px] font-heading font-medium text-card-foreground mb-0.5">Content Concept</p>
        <p className="text-[10px] text-muted-foreground line-clamp-2">{app.content_concept}</p>
      </div>
    )}

    <div className="flex gap-2 mt-3">
      <Button size="sm" variant="outline" className="h-8 text-xs rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5" onClick={onReject}>
        <XCircle className="w-3 h-3" /> Decline
      </Button>
      <Button size="sm" variant="outline" className="h-8 text-xs rounded-xl" onClick={onMessage}>
        <MessageCircle className="w-3 h-3" /> Chat
      </Button>
      <Button size="sm" variant="gradient" className="flex-1 h-8 text-xs rounded-xl" onClick={onAccept}>
        <CheckCircle className="w-3 h-3" /> Accept
      </Button>
    </div>
  </div>
);

export default CampaignManage;
