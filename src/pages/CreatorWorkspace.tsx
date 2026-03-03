import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft, Upload, CheckCircle, Clock, FileText, ExternalLink,
  Send, RotateCcw, AlertCircle, Link2, MessageCircle, IndianRupee
} from "lucide-react";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription,
  DrawerFooter, DrawerClose,
} from "@/components/ui/drawer";

interface Deliverable {
  id: string;
  content_type: string;
  description: string | null;
  deadline: string | null;
  platform: string | null;
  quantity: number | null;
  specifications: string | null;
}

interface Submission {
  id: string;
  deliverable_id: string;
  status: string;
  content_url: string | null;
  caption: string | null;
  submission_notes: string | null;
  review_feedback: string | null;
  revision_count: number | null;
  submitted_at: string | null;
  approved_at: string | null;
  published_url: string | null;
}

const statusConfig: Record<string, { color: string; label: string; icon: any }> = {
  not_started: { color: "bg-secondary text-muted-foreground", label: "Not Started", icon: Clock },
  in_progress: { color: "bg-yellow-500/10 text-yellow-600", label: "In Progress", icon: Upload },
  submitted: { color: "bg-accent/10 text-accent", label: "Under Review", icon: FileText },
  approved: { color: "bg-primary/10 text-primary", label: "Approved", icon: CheckCircle },
  revision_requested: { color: "bg-yellow-500/10 text-yellow-600", label: "Revision Needed", icon: RotateCcw },
  published: { color: "bg-primary/10 text-primary", label: "Published", icon: ExternalLink },
  rejected: { color: "bg-destructive/10 text-destructive", label: "Rejected", icon: AlertCircle },
};

const CreatorWorkspace = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  // Submit drawer
  const [submitOpen, setSubmitOpen] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);
  const [contentUrl, setContentUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [notes, setNotes] = useState("");
  const [publishedUrl, setPublishedUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user || !applicationId) return;
    const load = async () => {
      const { data: app } = await supabase
        .from("campaign_applications")
        .select("*, campaigns(*)")
        .eq("id", applicationId)
        .eq("creator_user_id", user.id)
        .maybeSingle();

      if (!app) { navigate("/applications"); return; }
      setApplication(app);
      setCampaign((app as any).campaigns);

      const { data: dels } = await supabase
        .from("campaign_deliverables")
        .select("*")
        .eq("campaign_id", app.campaign_id);
      setDeliverables(dels || []);

      const { data: subs } = await supabase
        .from("deliverable_submissions")
        .select("*")
        .eq("application_id", applicationId);
      setSubmissions(subs || []);

      setLoading(false);
    };
    load();
  }, [user, applicationId]);

  const getSubmission = (delId: string) => submissions.find(s => s.deliverable_id === delId);

  const handleSubmit = async () => {
    if (!user || !selectedDeliverable || !applicationId) return;
    setSubmitting(true);

    const existing = getSubmission(selectedDeliverable.id);
    const now = new Date().toISOString();

    if (existing) {
      await supabase.from("deliverable_submissions").update({
        content_url: contentUrl,
        caption,
        submission_notes: notes,
        published_url: publishedUrl || null,
        status: publishedUrl ? "published" : "submitted",
        submitted_at: now,
      }).eq("id", existing.id);

      setSubmissions(prev => prev.map(s => s.id === existing.id ? {
        ...s, content_url: contentUrl, caption, submission_notes: notes,
        published_url: publishedUrl || null,
        status: publishedUrl ? "published" : "submitted", submitted_at: now,
      } : s));
    } else {
      const { data } = await supabase.from("deliverable_submissions").insert({
        application_id: applicationId,
        deliverable_id: selectedDeliverable.id,
        creator_user_id: user.id,
        content_url: contentUrl,
        caption,
        submission_notes: notes,
        published_url: publishedUrl || null,
        status: publishedUrl ? "published" : "submitted",
        submitted_at: now,
      }).select().single();

      if (data) setSubmissions(prev => [...prev, data]);
    }

    // Notify brand
    if (campaign) {
      await supabase.from("notifications").insert({
        user_id: campaign.brand_user_id,
        title: "New Content Submission",
        message: `A creator submitted ${selectedDeliverable.content_type} for "${campaign.title}"`,
        type: "campaign",
        reference_type: "campaign",
        reference_id: campaign.id,
      });
    }

    toast.success(publishedUrl ? "Published link submitted!" : "Content submitted for review!");
    setSubmitOpen(false);
    resetForm();
    setSubmitting(false);
  };

  const resetForm = () => {
    setContentUrl(""); setCaption(""); setNotes(""); setPublishedUrl("");
    setSelectedDeliverable(null);
  };

  const openSubmit = (del: Deliverable) => {
    const existing = getSubmission(del.id);
    setSelectedDeliverable(del);
    setContentUrl(existing?.content_url || "");
    setCaption(existing?.caption || "");
    setNotes(existing?.submission_notes || "");
    setPublishedUrl(existing?.published_url || "");
    setSubmitOpen(true);
  };

  const completedCount = submissions.filter(s => ["approved", "published"].includes(s.status)).length;
  const progress = deliverables.length > 0 ? Math.round((completedCount / deliverables.length) * 100) : 0;

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
        <button onClick={() => navigate("/applications")} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-heading font-semibold text-sm text-foreground truncate">{campaign?.title || "Campaign"}</h1>
          <p className="text-[10px] text-muted-foreground">{deliverables.length} deliverables • {completedCount} completed</p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 mt-4">
        <div className="border border-border rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground font-heading">Campaign Progress</span>
            <span className="text-xs font-heading font-bold text-foreground">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Payment Info */}
      {application?.proposed_rate && (
        <div className="px-4 mt-3">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">Agreed Rate</p>
              <p className="font-heading font-bold text-base text-foreground">₹{parseInt(application.proposed_rate).toLocaleString("en-IN")}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Payment Structure</p>
              <p className="text-xs font-heading font-medium text-foreground">50% upfront + 50% on approval</p>
            </div>
          </div>
        </div>
      )}

      {/* Deliverables */}
      <div className="px-4 mt-5 mb-8">
        <h3 className="font-heading font-semibold text-sm text-foreground mb-3">Deliverables</h3>
        <div className="space-y-2.5">
          {deliverables.length === 0 ? (
            <div className="text-center py-12 border border-border rounded-xl">
              <FileText className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No deliverables defined yet</p>
              <p className="text-xs text-muted-foreground mt-1">The brand will add deliverables soon</p>
            </div>
          ) : (
            deliverables.map((del, i) => {
              const sub = getSubmission(del.id);
              const config = statusConfig[sub?.status || "not_started"];
              const StatusIcon = config.icon;

              return (
                <div key={del.id} className="border border-border rounded-xl p-4 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-heading font-semibold text-sm text-foreground">{del.content_type}</p>
                        {del.platform && (
                          <Badge variant="secondary" className="text-[9px]">{del.platform}</Badge>
                        )}
                      </div>
                      {del.description && (
                        <p className="text-xs text-muted-foreground mt-1">{del.description}</p>
                      )}
                      {del.deadline && (
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Due: {new Date(del.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                    <Badge className={`${config.color} border-0 text-[9px] font-heading shrink-0`}>
                      <StatusIcon className="w-3 h-3 mr-0.5" /> {config.label}
                    </Badge>
                  </div>

                  {del.specifications && (
                    <div className="mt-2 p-2.5 rounded-lg bg-secondary/50">
                      <p className="text-[10px] font-heading font-medium text-foreground mb-0.5">Specifications</p>
                      <p className="text-[10px] text-muted-foreground">{del.specifications}</p>
                    </div>
                  )}

                  {/* Feedback from brand */}
                  {sub?.review_feedback && (
                    <div className="mt-2 p-2.5 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                      <p className="text-[10px] font-heading font-medium text-yellow-600">Brand Feedback</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{sub.review_feedback}</p>
                    </div>
                  )}

                  {/* Action buttons */}
                  {(!sub || ["not_started", "in_progress", "revision_requested"].includes(sub.status)) && (
                    <Button size="sm" variant="gradient" className="w-full mt-3 h-9 text-xs rounded-lg" onClick={() => openSubmit(del)}>
                      <Upload className="w-3.5 h-3.5" />
                      {sub?.status === "revision_requested" ? "Resubmit Content" : "Submit Content"}
                    </Button>
                  )}

                  {sub?.status === "approved" && !sub.published_url && (
                    <Button size="sm" variant="outline" className="w-full mt-3 h-9 text-xs rounded-lg" onClick={() => openSubmit(del)}>
                      <Link2 className="w-3.5 h-3.5" /> Add Published Link
                    </Button>
                  )}

                  {sub?.status === "submitted" && (
                    <p className="text-[10px] text-accent mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Waiting for brand review
                    </p>
                  )}

                  {sub?.revision_count != null && sub.revision_count > 0 && (
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[9px] text-muted-foreground">Revision #{sub.revision_count} of 2</p>
                      {sub.revision_count >= 2 && (
                        <span className="text-[9px] text-yellow-600 font-heading font-medium">Max revisions reached</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Submit Drawer */}
      <Drawer open={submitOpen} onOpenChange={setSubmitOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="font-heading">Submit {selectedDeliverable?.content_type}</DrawerTitle>
            <DrawerDescription>Upload your content for brand review</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 space-y-3">
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Content URL *</label>
              <input value={contentUrl} onChange={e => setContentUrl(e.target.value)} placeholder="Google Drive, Dropbox, or direct link" className="w-full h-11 px-3 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Caption / Copy</label>
              <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Post caption with hashtags..." rows={3} className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Notes for Brand</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any additional context..." rows={2} className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Published URL (optional)</label>
              <input value={publishedUrl} onChange={e => setPublishedUrl(e.target.value)} placeholder="Link to live post (if already published)" className="w-full h-11 px-3 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <p className="text-[10px] text-muted-foreground mt-1">Add this after the content goes live</p>
            </div>
          </div>
          <DrawerFooter>
            <Button variant="gradient" className="w-full h-12 rounded-xl font-heading" disabled={!contentUrl || submitting} onClick={handleSubmit}>
              <Send className="w-4 h-4" /> {publishedUrl ? "Submit with Published Link" : "Submit for Review"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full rounded-xl">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CreatorWorkspace;
