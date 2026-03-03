import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Clock, CheckCircle, XCircle, FileText, Briefcase, ChevronRight,
  Star, MessageCircle, Upload, AlertCircle
} from "lucide-react";

interface Application {
  id: string;
  campaign_id: string;
  pitch: string | null;
  proposed_rate: string | null;
  status: string;
  brand_feedback: string | null;
  created_at: string;
  campaigns?: {
    title: string;
    brand_user_id: string;
    status: string;
  };
  deliverableCount?: number;
  submittedCount?: number;
  approvedCount?: number;
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: "bg-yellow-500/10 text-yellow-600", label: "Pending Review" },
  shortlisted: { icon: Star, color: "bg-accent/10 text-accent", label: "Shortlisted" },
  accepted: { icon: CheckCircle, color: "bg-primary/10 text-primary", label: "Accepted" },
  rejected: { icon: XCircle, color: "bg-destructive/10 text-destructive", label: "Declined" },
};

const MyApplications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("campaign_applications")
        .select("*, campaigns(title, brand_user_id, status)")
        .eq("creator_user_id", user.id)
        .order("created_at", { ascending: false });

      const apps = (data as any) || [];

      // For accepted apps, fetch deliverable progress
      const acceptedIds = apps.filter((a: any) => a.status === "accepted").map((a: any) => a.id);
      if (acceptedIds.length > 0) {
        const campaignIds = apps.filter((a: any) => a.status === "accepted").map((a: any) => a.campaign_id);
        
        const { data: deliverables } = await supabase
          .from("campaign_deliverables")
          .select("id, campaign_id")
          .in("campaign_id", campaignIds);

        const { data: submissions } = await supabase
          .from("deliverable_submissions")
          .select("id, application_id, status")
          .in("application_id", acceptedIds);

        const delCountMap = new Map<string, number>();
        (deliverables || []).forEach(d => {
          delCountMap.set(d.campaign_id, (delCountMap.get(d.campaign_id) || 0) + 1);
        });

        const subCountMap = new Map<string, { submitted: number; approved: number }>();
        (submissions || []).forEach(s => {
          const existing = subCountMap.get(s.application_id) || { submitted: 0, approved: 0 };
          if (["submitted", "approved", "published"].includes(s.status)) existing.submitted++;
          if (["approved", "published"].includes(s.status)) existing.approved++;
          subCountMap.set(s.application_id, existing);
        });

        apps.forEach((a: any) => {
          if (a.status === "accepted") {
            a.deliverableCount = delCountMap.get(a.campaign_id) || 0;
            const counts = subCountMap.get(a.id) || { submitted: 0, approved: 0 };
            a.submittedCount = counts.submitted;
            a.approvedCount = counts.approved;
          }
        });
      }

      setApplications(apps);
      setLoading(false);
    };
    load();
  }, [user]);

  const filtered = filter === "all" ? applications : applications.filter(a => a.status === filter);

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    shortlisted: applications.filter(a => a.status === "shortlisted").length,
    accepted: applications.filter(a => a.status === "accepted").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  };

  return (
    <Layout>
      <header className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-heading font-bold text-foreground">My Applications</h1>
        <p className="text-xs text-muted-foreground">Track your campaign applications & deliverables</p>
      </header>

      {/* Stats */}
      <div className="px-5 mt-3 grid grid-cols-4 gap-2">
        {[
          { label: "Pending", value: counts.pending, color: "text-yellow-600" },
          { label: "Shortlisted", value: counts.shortlisted, color: "text-accent" },
          { label: "Accepted", value: counts.accepted, color: "text-primary" },
          { label: "Declined", value: counts.rejected, color: "text-destructive" },
        ].map((s, i) => (
          <div key={i} className="border border-border rounded-lg p-2.5 text-center">
            <p className={`font-heading font-bold text-lg ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="px-5 mt-4 overflow-x-auto">
        <div className="flex gap-1.5">
          {(["all", "pending", "shortlisted", "accepted", "rejected"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-[10px] font-heading font-medium transition-all capitalize whitespace-nowrap ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
              {f} {counts[f] > 0 && `(${counts[f]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="px-5 mt-4 space-y-2.5 mb-4">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 rounded-lg gradient-primary animate-pulse-glow mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-heading font-medium text-muted-foreground">
              {applications.length === 0 ? "No applications yet" : "No matching applications"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {applications.length === 0 ? "Browse campaigns and start applying!" : "Try a different filter"}
            </p>
            {applications.length === 0 && (
              <Button variant="gradient" className="mt-4 rounded-lg" onClick={() => navigate("/campaigns")}>
                Browse Campaigns
              </Button>
            )}
          </div>
        ) : (
          filtered.map((app, i) => {
            const config = statusConfig[app.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            const isAccepted = app.status === "accepted";

            return (
              <div
                key={app.id}
                className="border border-border rounded-xl p-4 opacity-0 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-sm text-foreground truncate">
                      {(app as any).campaigns?.title || "Campaign"}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Applied {new Date(app.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <Badge className={`${config.color} border-0 text-[9px] font-heading shrink-0`}>
                    <StatusIcon className="w-3 h-3 mr-0.5" /> {config.label}
                  </Badge>
                </div>

                {app.pitch && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{app.pitch}</p>
                )}

                {app.proposed_rate && (
                  <p className="text-xs font-heading font-semibold text-primary mt-2">₹{parseInt(app.proposed_rate).toLocaleString("en-IN")}</p>
                )}

                {/* Brand Feedback */}
                {app.brand_feedback && (
                  <div className="mt-2 p-2.5 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                    <p className="text-[10px] font-heading font-medium text-yellow-600">Brand Feedback</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{app.brand_feedback}</p>
                  </div>
                )}

                {/* Deliverable Progress for Accepted */}
                {isAccepted && app.deliverableCount !== undefined && app.deliverableCount > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-muted-foreground">Deliverable Progress</span>
                      <span className="text-[10px] font-heading font-medium text-foreground">{app.approvedCount}/{app.deliverableCount}</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(app.approvedCount! / app.deliverableCount!) * 100}%` }} />
                    </div>
                  </div>
                )}

                {/* Actions */}
                {isAccepted && (
                  <Button size="sm" variant="gradient" className="w-full mt-3 h-9 text-xs rounded-lg" onClick={() => navigate(`/workspace/${app.id}`)}>
                    <Upload className="w-3.5 h-3.5" /> Open Workspace <ChevronRight className="w-3 h-3" />
                  </Button>
                )}

                {app.status === "rejected" && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <AlertCircle className="w-3 h-3" />
                    Don't worry — keep applying to other campaigns!
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
};

export default MyApplications;
