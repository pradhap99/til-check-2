import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft, Users, CheckCircle, XCircle, Clock, MessageCircle,
  Eye, ThumbsUp, ThumbsDown, Star, Send, ChevronRight, Upload,
  FileCheck, AlertCircle, ExternalLink, RotateCcw
} from "lucide-react";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger, DrawerClose,
} from "@/components/ui/drawer";

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

interface Submission {
  id: string;
  deliverable_id: string;
  creator_user_id: string;
  status: string;
  content_url: string | null;
  caption: string | null;
  submission_notes: string | null;
  review_feedback: string | null;
  published_url: string | null;
  revision_count: number | null;
  submitted_at: string | null;
  creatorName?: string;
  deliverableType?: string;
}

const CampaignManage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"applications" | "accepted" | "deliverables">("applications");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [feedback, setFeedback] = useState("");

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

      // Fetch deliverable submissions
      const { data: subs } = await supabase
        .from("deliverable_submissions")
        .select("*, campaign_deliverables(content_type)")
        .in("application_id", (apps || []).map(a => a.id));

      if (subs && subs.length > 0) {
        const creatorIds = [...new Set(subs.map(s => s.creator_user_id))];
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", creatorIds);
        const pMap = new Map((profiles || []).map(p => [p.user_id, p.full_name]));

        setSubmissions(subs.map(s => ({
          ...s,
          creatorName: pMap.get(s.creator_user_id) || "Creator",
          deliverableType: (s as any).campaign_deliverables?.content_type || "Content",
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

  const handleReviewSubmission = async (action: "approved" | "revision_requested" | "rejected") => {
    if (!selectedSubmission) return;
    const updates: any = { status: action, review_feedback: feedback };
    if (action === "approved") updates.approved_at = new Date().toISOString();
    if (action === "revision_requested") updates.revision_count = (selectedSubmission.revision_count || 0) + 1;

    await supabase.from("deliverable_submissions").update(updates).eq("id", selectedSubmission.id);

    // Notify creator
    await supabase.from("notifications").insert({
      user_id: selectedSubmission.creator_user_id,
      title: action === "approved" ? "Content Approved! ✅" : action === "revision_requested" ? "Revision Requested 📝" : "Content Update",
      message: feedback || `Your submission has been ${action.replace("_", " ")}.`,
      type: "campaign",
      reference_type: "campaign",
      reference_id: id,
    });

    setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? { ...s, status: action, review_feedback: feedback } : s));
    toast.success(action === "approved" ? "Content approved! ✅" : action === "revision_requested" ? "Revision requested" : "Submission rejected");
    setReviewOpen(false);
    setFeedback("");
    setSelectedSubmission(null);
  };

  const startConversation = async (creatorUserId: string) => {
    if (!user) return;
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .or(`and(participant_1.eq.${user.id},participant_2.eq.${creatorUserId}),and(participant_1.eq.${creatorUserId},participant_2.eq.${user.id})`)
      .maybeSingle();

    if (existing) {
      navigate(`/messages/${existing.id}`);
      return;
    }

    const { data: newConv } = await supabase.from("conversations").insert({
      participant_1: user.id,
      participant_2: creatorUserId,
      campaign_id: id,
    }).select("id").single();

    if (newConv) navigate(`/messages/${newConv.id}`);
  };

  const pendingApps = applications.filter(a => a.status === "pending");
  const acceptedApps = applications.filter(a => a.status === "accepted");
  const pendingSubs = submissions.filter(s => s.status === "submitted");
  const approvedSubs = submissions.filter(s => s.status === "approved");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl gradient-primary animate-pulse-glow" />
      </div>
    );
  }

  const submissionStatusConfig: Record<string, { color: string; icon: any; label: string }> = {
    not_started: { color: "bg-secondary text-muted-foreground", icon: Clock, label: "Not Started" },
    in_progress: { color: "bg-yellow-500/10 text-yellow-600", icon: Upload, label: "In Progress" },
    submitted: { color: "bg-accent/10 text-accent", icon: FileCheck, label: "Submitted" },
    approved: { color: "bg-primary/10 text-primary", icon: CheckCircle, label: "Approved" },
    revision_requested: { color: "bg-yellow-500/10 text-yellow-600", icon: RotateCcw, label: "Revision" },
    published: { color: "bg-primary/10 text-primary", icon: ExternalLink, label: "Published" },
    rejected: { color: "bg-destructive/10 text-destructive", icon: XCircle, label: "Rejected" },
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-heading font-semibold text-sm text-foreground truncate">{campaign?.title || "Campaign"}</h1>
          <p className="text-[10px] text-muted-foreground">{applications.length} applications • {submissions.length} submissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mt-4 grid grid-cols-4 gap-2">
        <div className="glass-card rounded-xl p-2.5 text-center">
          <p className="font-heading font-bold text-lg text-card-foreground">{pendingApps.length}</p>
          <p className="text-[8px] text-muted-foreground">Pending</p>
        </div>
        <div className="glass-card rounded-xl p-2.5 text-center">
          <p className="font-heading font-bold text-lg text-primary">{acceptedApps.length}</p>
          <p className="text-[8px] text-muted-foreground">Accepted</p>
        </div>
        <div className="glass-card rounded-xl p-2.5 text-center">
          <p className="font-heading font-bold text-lg text-accent">{pendingSubs.length}</p>
          <p className="text-[8px] text-muted-foreground">To Review</p>
        </div>
        <div className="glass-card rounded-xl p-2.5 text-center">
          <p className="font-heading font-bold text-lg text-card-foreground">{campaign?.slots_total || 0}</p>
          <p className="text-[8px] text-muted-foreground">Slots</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4 flex gap-1.5">
        {(["applications", "accepted", "deliverables"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-xl text-[10px] font-heading font-medium capitalize transition-all relative ${tab === t ? "gradient-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground"}`}>
            {t}
            {t === "deliverables" && pendingSubs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[9px] font-bold text-accent-foreground flex items-center justify-center">{pendingSubs.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 mt-4 space-y-2.5 mb-8">
        {tab === "applications" && (
          pendingApps.length === 0 ? (
            <EmptyState icon={Users} text="No pending applications" />
          ) : (
            pendingApps.map((app, i) => (
              <ApplicationCard key={app.id} app={app} onAccept={() => updateStatus(app.id, "accepted")} onReject={() => updateStatus(app.id, "rejected")} onMessage={() => startConversation(app.creator_user_id)} index={i} />
            ))
          )
        )}

        {tab === "accepted" && (
          acceptedApps.length === 0 ? (
            <EmptyState icon={CheckCircle} text="No accepted creators yet" />
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
          submissions.length === 0 ? (
            <EmptyState icon={Eye} text="No submissions yet" subtitle="Accepted creators will submit their content here" />
          ) : (
            submissions.map((sub, i) => {
              const config = submissionStatusConfig[sub.status] || submissionStatusConfig.not_started;
              const StatusIcon = config.icon;
              return (
                <div key={sub.id} className="glass-card rounded-2xl p-4 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-heading font-semibold text-sm text-card-foreground">{sub.creatorName}</p>
                      <p className="text-[10px] text-muted-foreground">{sub.deliverableType} • {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Not submitted"}</p>
                    </div>
                    <Badge className={`${config.color} border-0 text-[9px] font-heading`}>
                      <StatusIcon className="w-3 h-3 mr-0.5" /> {config.label}
                    </Badge>
                  </div>

                  {sub.content_url && (
                    <a href={sub.content_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary mt-2 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> View Content
                    </a>
                  )}

                  {sub.caption && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{sub.caption}</p>}
                  {sub.submission_notes && <p className="text-[10px] text-muted-foreground mt-1 italic">"{sub.submission_notes}"</p>}

                  {sub.review_feedback && (
                    <div className="mt-2 p-2 rounded-lg bg-primary/5">
                      <p className="text-[10px] text-primary font-heading font-medium">Feedback: {sub.review_feedback}</p>
                    </div>
                  )}

                  {sub.published_url && (
                    <a href={sub.published_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary mt-1 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Published Link
                    </a>
                  )}

                  {(sub.status === "submitted" || sub.status === "revision_requested") && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="h-7 text-[10px] rounded-lg border-destructive/30 text-destructive" onClick={() => { setSelectedSubmission(sub); setReviewOpen(true); }}>
                        <RotateCcw className="w-3 h-3" /> Revise
                      </Button>
                      <Button size="sm" variant="gradient" className="flex-1 h-7 text-[10px] rounded-lg" onClick={() => {
                        setSelectedSubmission(sub);
                        handleReviewSubmission("approved");
                      }}>
                        <CheckCircle className="w-3 h-3" /> Approve
                      </Button>
                    </div>
                  )}

                  {sub.revision_count && sub.revision_count > 0 && (
                    <p className="text-[9px] text-muted-foreground mt-1">Revision #{sub.revision_count}</p>
                  )}
                </div>
              );
            })
          )
        )}
      </div>

      {/* Review Drawer */}
      <Drawer open={reviewOpen} onOpenChange={setReviewOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="font-heading">Review Submission</DrawerTitle>
            <DrawerDescription>Provide feedback for {selectedSubmission?.creatorName}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 space-y-3">
            {selectedSubmission?.content_url && (
              <a href={selectedSubmission.content_url} target="_blank" rel="noopener noreferrer" className="glass-card rounded-xl p-3 flex items-center gap-2 text-sm text-primary">
                <ExternalLink className="w-4 h-4" /> View Submitted Content
              </a>
            )}
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-1 block">Checklist</label>
              <div className="space-y-1.5">
                {["Product prominently featured", "Captions match guidelines", "Legal disclaimers included", "Content quality meets standards", "Correct hashtags used"].map((item, i) => (
                  <label key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input type="checkbox" className="rounded border-border" />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Feedback</label>
              <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Comments for the creator..." rows={3} className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          </div>
          <DrawerFooter>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1 h-11 rounded-2xl border-destructive/30 text-destructive" onClick={() => handleReviewSubmission("rejected")}>
                <XCircle className="w-4 h-4" /> Reject
              </Button>
              <Button variant="outline" className="flex-1 h-11 rounded-2xl" onClick={() => handleReviewSubmission("revision_requested")}>
                <RotateCcw className="w-4 h-4" /> Request Changes
              </Button>
            </div>
            <Button variant="gradient" className="w-full h-12 rounded-2xl font-heading" onClick={() => handleReviewSubmission("approved")}>
              <CheckCircle className="w-4 h-4" /> Approve Content
            </Button>
            <DrawerClose asChild>
              <Button variant="ghost" className="w-full">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

const EmptyState = ({ icon: Icon, text, subtitle }: { icon: any; text: string; subtitle?: string }) => (
  <div className="text-center py-12">
    <Icon className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
    <p className="font-heading font-medium text-muted-foreground">{text}</p>
    {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
  </div>
);

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
