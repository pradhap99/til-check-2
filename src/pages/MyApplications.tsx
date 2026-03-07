import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SkeletonCard from "@/components/SkeletonCard";
import {
  Clock, CheckCircle, XCircle, FileText, Briefcase, ChevronRight,
  Star, MessageCircle, Upload, AlertCircle, Eye, MessageSquare
} from "lucide-react";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription,
  DrawerFooter, DrawerClose,
} from "@/components/ui/drawer";

interface Application {
  id: string;
  campaign_id: string;
  pitch: string | null;
  proposed_rate: string | null;
  status: string;
  brand_feedback: string | null;
  created_at: string;
  campaigns?: { title: string; brand_user_id: string; status: string; };
  deliverableCount?: number;
  submittedCount?: number;
  approvedCount?: number;
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: "bg-warning/10 text-warning", label: "Pending Review" },
  shortlisted: { icon: Star, color: "bg-accent/10 text-accent", label: "Shortlisted" },
  accepted: { icon: CheckCircle, color: "bg-success/10 text-success", label: "Accepted" },
  rejected: { icon: XCircle, color: "bg-destructive/10 text-destructive", label: "Declined" },
};

const MyApplications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [feedbackDrawerOpen, setFeedbackDrawerOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("campaign_applications")
        .select("*, campaigns(title, brand_user_id, status)")
        .eq("creator_user_id", user.id)
        .order("created_at", { ascending: false });

      const apps = (data as any) || [];

      const acceptedIds = apps.filter((a: any) => a.status === "accepted").map((a: any) => a.id);
      if (acceptedIds.length > 0) {
        const campaignIds = apps.filter((a: any) => a.status === "accepted").map((a: any) => a.campaign_id);
        const { data: deliverables } = await supabase.from("campaign_deliverables").select("id, campaign_id").in("campaign_id", campaignIds);
        const { data: submissions } = await supabase.from("deliverable_submissions").select("id, application_id, status").in("application_id", acceptedIds);

        const delCountMap = new Map<string, number>();
        (deliverables || []).forEach(d => { delCountMap.set(d.campaign_id, (delCountMap.get(d.campaign_id) || 0) + 1); });

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

  // Mock applications when user has none
  const mockApplications: Application[] = [
    {
      id: "mock-1", campaign_id: "1", pitch: "I'd love to create fashion-forward content featuring Lenskart's SS'26 collection with my signature styling approach.", proposed_rate: "12000", status: "shortlisted", brand_feedback: null, created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      campaigns: { title: "Lenskart SS'26 — Style Your Vision", brand_user_id: "", status: "active" },
    },
    {
      id: "mock-2", campaign_id: "2", pitch: "As a skincare enthusiast, I can create authentic before/after content for the Vitamin C range.", proposed_rate: "8500", status: "accepted", brand_feedback: null, created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      campaigns: { title: "Mamaearth Vitamin C Range", brand_user_id: "", status: "active" },
      deliverableCount: 4, submittedCount: 3, approvedCount: 2,
    },
    {
      id: "mock-3", campaign_id: "3", pitch: "Tech reviews are my forte — I'll create engaging unboxing + review content for the Airdopes 500.", proposed_rate: "15000", status: "pending", brand_feedback: null, created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      campaigns: { title: "boAt Summer Audio Launch", brand_user_id: "", status: "active" },
    },
    {
      id: "mock-4", campaign_id: "5", pitch: "I specialize in festive beauty looks and have a loyal audience in the beauty niche.", proposed_rate: "6000", status: "rejected", brand_feedback: "Thank you for your interest. We've selected creators with a stronger focus on skincare tutorials.", created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      campaigns: { title: "Nykaa Festive Glow", brand_user_id: "", status: "active" },
    },
    {
      id: "mock-5", campaign_id: "4", pitch: "Food is my passion — I create cinematic street food and restaurant review content.", proposed_rate: "9000", status: "accepted", brand_feedback: null, created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      campaigns: { title: "Zomato Food Stories", brand_user_id: "", status: "active" },
      deliverableCount: 3, submittedCount: 3, approvedCount: 3,
    },
  ];

  const displayApplications = applications.length > 0 ? applications : mockApplications;
  const filtered = filter === "all" ? displayApplications : displayApplications.filter(a => a.status === filter);
  const counts = {
    all: displayApplications.length,
    pending: displayApplications.filter(a => a.status === "pending").length,
    shortlisted: displayApplications.filter(a => a.status === "shortlisted").length,
    accepted: displayApplications.filter(a => a.status === "accepted").length,
    rejected: displayApplications.filter(a => a.status === "rejected").length,
  };

  return (
    <Layout>
      <header className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-heading font-bold text-foreground">My Applications</h1>
        <p className="text-xs text-muted-foreground">Track your campaign applications & deliverables</p>
      </header>

      <div className="px-5 mt-3 grid grid-cols-4 gap-2">
        {[
          { label: "Pending", value: counts.pending, color: "text-warning" },
          { label: "Shortlisted", value: counts.shortlisted, color: "text-accent" },
          { label: "Accepted", value: counts.accepted, color: "text-success" },
          { label: "Declined", value: counts.rejected, color: "text-destructive" },
        ].map((s, i) => (
          <div key={i} className="border border-border rounded-lg p-2.5 text-center hover-lift">
            <p className={`font-heading font-bold text-lg ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-5 mt-4 overflow-x-auto">
        <div className="flex gap-1.5">
          {(["all", "pending", "shortlisted", "accepted", "rejected"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-[10px] font-heading font-medium transition-all capitalize whitespace-nowrap btn-micro ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
              {f} {counts[f] > 0 && `(${counts[f]})`}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 space-y-2.5 mb-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-heading font-medium text-muted-foreground">
              {applications.length === 0 ? "No applications yet" : "No matching applications"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Try a different filter</p>
          </div>
        ) : (
          filtered.map((app, i) => {
            const config = statusConfig[app.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            const isAccepted = app.status === "accepted";
            const isRejected = app.status === "rejected";

            return (
              <div
                key={app.id}
                className={`border rounded-xl p-4 opacity-0 animate-fade-up ${
                  isRejected ? "border-destructive/20 bg-destructive/[0.02]" : "border-border"
                }`}
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}
              >
                {/* Thumbnail + info */}
                <div className="flex gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary shrink-0">
                    <img
                      src={
                        app.campaign_id === "1" ? "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=120" :
                        app.campaign_id === "2" ? "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120" :
                        app.campaign_id === "3" ? "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120" :
                        app.campaign_id === "4" ? "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120" :
                        app.campaign_id === "5" ? "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=120" :
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120"
                      }
                      alt="" className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-heading font-semibold text-sm text-foreground truncate">
                        {(app as any).campaigns?.title || "Campaign"}
                      </h3>
                      <Badge className={`${config.color} border-0 text-[9px] font-heading shrink-0 ml-2`}>
                        <StatusIcon className="w-3 h-3 mr-0.5" /> {config.label}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Applied {new Date(app.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>

                {app.pitch && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{app.pitch}</p>}
                {app.proposed_rate && <p className="text-xs font-heading font-semibold text-primary mt-2">₹{parseInt(app.proposed_rate).toLocaleString("en-IN")}</p>}

                {/* Brand Feedback - visible for rejected */}
                {app.brand_feedback && (
                  <div className={`mt-2 p-2.5 rounded-lg border ${
                    isRejected ? "bg-destructive/5 border-destructive/10" : "bg-warning/5 border-warning/10"
                  }`}>
                    <p className={`text-[10px] font-heading font-medium ${isRejected ? "text-destructive" : "text-warning"}`}>
                      {isRejected ? "Rejection Reason" : "Brand Feedback"}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{app.brand_feedback}</p>
                  </div>
                )}

                {/* View Feedback button for rejected without visible feedback */}
                {isRejected && !app.brand_feedback && (
                  <Button
                    size="sm" variant="ghost"
                    className="mt-2 h-7 text-[10px] text-muted-foreground btn-micro"
                    onClick={() => { setSelectedApp(app); setFeedbackDrawerOpen(true); }}
                  >
                    <Eye className="w-3 h-3" /> View Feedback
                  </Button>
                )}

                {/* Deliverable Progress for Accepted */}
                {isAccepted && app.deliverableCount !== undefined && app.deliverableCount > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-muted-foreground">Deliverable Progress</span>
                      <span className="text-[10px] font-heading font-medium text-foreground">{app.approvedCount}/{app.deliverableCount}</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full transition-all" style={{ width: `${(app.approvedCount! / app.deliverableCount!) * 100}%` }} />
                    </div>
                  </div>
                )}

                {isAccepted && (
                  <Button size="sm" className="w-full mt-3 h-9 text-xs rounded-lg btn-micro" onClick={() => navigate(`/workspace/${app.id}`)}>
                    <Upload className="w-3.5 h-3.5" /> Open Workspace <ChevronRight className="w-3 h-3" />
                  </Button>
                )}

                {isRejected && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <AlertCircle className="w-3 h-3 text-destructive" />
                    Don't worry — keep applying to other campaigns!
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Feedback Drawer */}
      <Drawer open={feedbackDrawerOpen} onOpenChange={setFeedbackDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="font-heading">Application Feedback</DrawerTitle>
            <DrawerDescription>{(selectedApp as any)?.campaigns?.title}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 space-y-3">
            <div className="bg-destructive/5 border border-destructive/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-destructive" />
                <p className="text-xs font-heading font-semibold text-destructive">Application Declined</p>
              </div>
              {selectedApp?.brand_feedback ? (
                <p className="text-xs text-muted-foreground">{selectedApp.brand_feedback}</p>
              ) : (
                <p className="text-xs text-muted-foreground">No specific feedback was provided by the brand. This could be due to budget constraints, content style preferences, or other internal factors.</p>
              )}
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-xs font-heading font-medium text-foreground mb-1">💡 Tips for next time</p>
              <ul className="text-[10px] text-muted-foreground space-y-1 list-disc pl-3">
                <li>Tailor your pitch to each brand's specific needs</li>
                <li>Include relevant portfolio examples</li>
                <li>Propose a competitive rate within the campaign budget</li>
                <li>Highlight past collaboration results</li>
              </ul>
            </div>
          </div>
          <DrawerFooter>
            <Button className="w-full h-10 rounded-xl font-heading text-xs btn-micro" onClick={() => { setFeedbackDrawerOpen(false); navigate("/campaigns"); }}>
              Browse More Campaigns
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full rounded-xl text-xs">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Layout>
  );
};

export default MyApplications;
