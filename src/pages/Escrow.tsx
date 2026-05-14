import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Shield, Lock, Unlock, CheckCircle, Clock, AlertTriangle,
  ArrowRight, IndianRupee, FileCheck, ChevronRight, ChevronDown, ChevronUp,
  Info, Tag, Star, Eye, Gift
} from "lucide-react";

interface EscrowItem {
  id: string; campaign_id: string; campaign_title: string; creator_name: string;
  creator_user_id: string; application_id: string; total_amount: number;
  upfront_amount: number; completion_amount: number;
  upfront_status: "pending" | "released" | "held";
  completion_status: "pending" | "released" | "held" | "locked";
  deliverables_total: number; deliverables_approved: number; created_at: string;
}

const smartReleaseSteps = [
  { emoji: "🎯", label: "Brand Posts Campaign" },
  { emoji: "💰", label: "Brand Funds Escrow (100% held)" },
  { emoji: "✅", label: "Creator Accepted" },
  { emoji: "📊", label: "Creator Posts Content" },
  { emoji: "🔄", label: "Engagement Tracked (7 days)" },
  { emoji: "💸", label: "Milestone 1 Released" },
  { emoji: "🏆", label: "Milestone 2 Released" },
  { emoji: "⚠", label: "7-day Dispute Window" },
];

interface Milestone {
  label: string;
  pct: number;
  amount: number;
  status: "completed" | "in_progress" | "locked" | "released" | "in_review";
}

interface MockEscrow {
  id: string;
  brand: string;
  title: string;
  total: number;
  progress: number;
  activeUntil: string | null;
  isPerks?: boolean;
  milestones: Milestone[];
  autoRelease?: string;
}

const mockEscrows: MockEscrow[] = [
  {
    id: "esc-1",
    brand: "boAt",
    title: "Summer Audio Launch 2026",
    total: 60000,
    progress: 45,
    activeUntil: "Mar 15, 2026",
    milestones: [
      { label: "Post 2 Instagram Reels", pct: 30, amount: 18000, status: "completed" },
      { label: "Reach 5,000 views on content", pct: 40, amount: 24000, status: "in_progress" },
      { label: "Campaign completion + brand sign-off", pct: 30, amount: 18000, status: "locked" },
    ],
    autoRelease: "If no dispute within 14 days of Milestone 3",
  },
  {
    id: "esc-2",
    brand: "Mamaearth",
    title: "Vitamin C Glow Series",
    total: 45000,
    progress: 60,
    activeUntil: "Apr 15, 2026",
    milestones: [
      { label: "Publish 3 YouTube Shorts", pct: 25, amount: 11250, status: "released" },
      { label: "Achieve 10K total views across posts", pct: 35, amount: 15750, status: "released" },
      { label: "Submit UGC photos (min 5 images)", pct: 20, amount: 9000, status: "in_review" },
      { label: "Brand approval + final sign-off", pct: 20, amount: 9000, status: "locked" },
    ],
    autoRelease: "Auto-release after 14 days if no dispute",
  },
  {
    id: "esc-3",
    brand: "Blue Tokai Coffee",
    title: "Coffee & Content",
    total: 0,
    progress: 33,
    activeUntil: "May 5, 2026",
    isPerks: true,
    milestones: [
      { label: "Post 1 Instagram Story tagging @bluetokaicoffee → Monthly subscription unlocked", pct: 33, amount: 0, status: "completed" },
      { label: "Post 1 Reel showing morning coffee routine → Merchandise kit", pct: 34, amount: 0, status: "in_progress" },
      { label: "Attend brand event and post coverage → Partner invite access", pct: 33, amount: 0, status: "locked" },
    ],
    autoRelease: "Perks released by brand on milestone verification",
  },
];

const milestoneStatusConfig: Record<string, { color: string; label: string; icon: string }> = {
  completed: { color: "bg-emerald-500/10 text-emerald-500", label: "✅ Completed", icon: "✅" },
  released: { color: "bg-emerald-500/10 text-emerald-500", label: "✅ Released", icon: "✅" },
  in_progress: { color: "bg-yellow-500/10 text-yellow-600", label: "⏳ In Progress", icon: "⏳" },
  in_review: { color: "bg-accent/10 text-accent", label: "📋 In Review", icon: "📋" },
  locked: { color: "bg-secondary text-muted-foreground", label: "🔒 Locked", icon: "🔒" },
};

const Escrow = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [escrows, setEscrows] = useState<EscrowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      let query = supabase.from("campaign_applications").select("*, campaigns(id, title, brand_user_id)").eq("status", "accepted");
      if (role === "brand") {
        const { data: myCampaigns } = await supabase.from("campaigns").select("id").eq("brand_user_id", user.id);
        if (!myCampaigns || myCampaigns.length === 0) { setEscrows([]); setLoading(false); return; }
        query = query.in("campaign_id", myCampaigns.map(c => c.id));
      } else {
        query = query.eq("creator_user_id", user.id);
      }
      const { data: apps } = await query;
      if (!apps || apps.length === 0) { setEscrows([]); setLoading(false); return; }

      const creatorIds = [...new Set(apps.map(a => a.creator_user_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", creatorIds);
      const profileMap = new Map((profiles || []).map(p => [p.user_id, p.full_name || "Creator"]));
      const appIds = apps.map(a => a.id);
      const campaignIds = [...new Set(apps.map(a => a.campaign_id))];
      const { data: deliverables } = await supabase.from("campaign_deliverables").select("id, campaign_id").in("campaign_id", campaignIds);
      const { data: submissions } = await supabase.from("deliverable_submissions").select("id, application_id, status").in("application_id", appIds);
      const { data: transactions } = await supabase.from("transactions").select("*").in("application_id", appIds);

      const delCountMap = new Map<string, number>();
      (deliverables || []).forEach(d => delCountMap.set(d.campaign_id, (delCountMap.get(d.campaign_id) || 0) + 1));
      const approvedMap = new Map<string, number>();
      (submissions || []).forEach(s => { if (["approved", "published"].includes(s.status)) approvedMap.set(s.application_id, (approvedMap.get(s.application_id) || 0) + 1); });
      const txMap = new Map<string, { upfront: boolean; completion: boolean }>();
      (transactions || []).forEach(t => {
        const existing = txMap.get(t.application_id || "") || { upfront: false, completion: false };
        if (t.description?.toLowerCase().includes("upfront")) existing.upfront = true;
        if (t.description?.toLowerCase().includes("completion")) existing.completion = true;
        txMap.set(t.application_id || "", existing);
      });

      const items: EscrowItem[] = apps.map(app => {
        const rate = parseInt(app.proposed_rate || "0");
        const upfront = Math.round(rate * 0.5);
        const completion = rate - upfront;
        const tx = txMap.get(app.id) || { upfront: false, completion: false };
        const totalDels = delCountMap.get(app.campaign_id) || 0;
        const approvedDels = approvedMap.get(app.id) || 0;
        const allApproved = totalDels > 0 && approvedDels >= totalDels;
        return {
          id: app.id, campaign_id: app.campaign_id, campaign_title: (app as any).campaigns?.title || "Campaign",
          creator_name: profileMap.get(app.creator_user_id) || "Creator", creator_user_id: app.creator_user_id,
          application_id: app.id, total_amount: rate, upfront_amount: upfront, completion_amount: completion,
          upfront_status: tx.upfront ? "released" : "held", completion_status: tx.completion ? "released" : allApproved ? "held" : "locked",
          deliverables_total: totalDels, deliverables_approved: approvedDels, created_at: app.created_at,
        };
      });
      setEscrows(items);
      setLoading(false);
    };
    load();
  }, [user, role]);

  const totalInEscrow = escrows.reduce((sum, e) => {
    let held = 0;
    if (e.upfront_status === "held") held += e.upfront_amount;
    if (e.completion_status === "held") held += e.completion_amount;
    return sum + held;
  }, 0);
  const totalReleased = escrows.reduce((sum, e) => {
    let released = 0;
    if (e.upfront_status === "released") released += e.upfront_amount;
    if (e.completion_status === "released") released += e.completion_amount;
    return sum + released;
  }, 0);

  const hasRealEscrows = escrows.length > 0;

  return (
    <Layout>
      <header className="px-4 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">Escrow & Payments</h1>
            <p className="text-xs text-muted-foreground">
              {role === "brand" ? "Manage milestone payments to creators" : "Track your payment milestones"}
            </p>
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-2.5">
        <div className="border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-3.5 h-3.5 text-accent" />
            <span className="text-[10px] text-muted-foreground">In Escrow</span>
          </div>
          <p className="font-heading font-bold text-lg text-foreground">₹{totalInEscrow.toLocaleString("en-IN")}</p>
        </div>
        <div className="border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] text-muted-foreground">Released</span>
          </div>
          <p className="font-heading font-bold text-lg text-foreground">₹{totalReleased.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Collapsible How Milestone Release Works */}
      <div className="px-4 mt-4">
        <button
          onClick={() => setHowItWorksOpen(!howItWorksOpen)}
          className="w-full bg-accent/5 border border-accent/20 rounded-xl p-4 text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <p className="text-xs font-heading font-semibold text-foreground">How Milestone Release Works</p>
            </div>
            {howItWorksOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </button>
        <div
          className="overflow-hidden transition-all duration-350 ease-in-out"
          style={{ maxHeight: howItWorksOpen ? "400px" : "0px" }}
        >
          <div className="pt-3 px-1">
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Every campaign has its own brand-defined milestones. til. holds funds/perks in escrow and releases them automatically when each milestone is verified. If no dispute is raised within 14 days of completion, funds auto-release. Brands set their own KPIs — views, posts, engagement, or deliverables — when creating a campaign.
            </p>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2">
              {smartReleaseSteps.map((s, i) => (
                <div key={i} className="flex items-center shrink-0">
                  <div className="flex flex-col items-center min-w-[48px]">
                    <span className="text-sm">{s.emoji}</span>
                    <p className="text-[7px] text-muted-foreground text-center mt-0.5 leading-tight max-w-[52px]">{s.label}</p>
                  </div>
                  {i < smartReleaseSteps.length - 1 && <span className="text-muted-foreground text-[8px] shrink-0 mx-0.5">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Escrows - Dynamic Milestones */}
      <div className="px-4 mt-5 mb-4 space-y-3">
        <h3 className="font-heading font-semibold text-sm text-foreground">Active Escrows</h3>

        {loading ? (
          <div className="text-center py-16"><div className="w-8 h-8 rounded-xl bg-accent/20 animate-pulse mx-auto" /></div>
        ) : (
          <>
            {/* Real escrows from DB */}
            {escrows.map((escrow, i) => {
              const progress = escrow.deliverables_total > 0 ? Math.round((escrow.deliverables_approved / escrow.deliverables_total) * 100) : 0;
              return (
                <div key={escrow.id} className="border border-border rounded-xl overflow-hidden animate-fade-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="p-4 pb-3">
                    <p className="font-heading font-semibold text-sm text-foreground truncate">{escrow.campaign_title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{role === "brand" ? escrow.creator_name : "Your earnings"} • ₹{escrow.total_amount.toLocaleString("en-IN")} total</p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-muted-foreground">Deliverables</span>
                        <span className="text-[10px] font-heading font-medium text-foreground">{escrow.deliverables_approved}/{escrow.deliverables_total}</span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Mock escrows with dynamic milestones */}
            {!hasRealEscrows && (
              <>
                <div className="flex items-center gap-2 mt-1">
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] text-muted-foreground">Example escrows — real escrows appear when {role === "brand" ? "you accept creators" : "brands accept your applications"}</p>
                </div>

                {mockEscrows.map((ex, i) => (
                  <div key={ex.id} className="border border-border rounded-xl overflow-hidden animate-fade-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                    <Badge className="absolute top-2 right-2 bg-accent/10 text-accent border-0 text-[8px] z-10 relative ml-auto mr-2 mt-2"><Tag className="w-2.5 h-2.5 mr-0.5" />Example</Badge>
                    <div className="p-4 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                          <span className="text-xs font-heading font-bold text-accent">{ex.brand[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold text-sm text-foreground truncate">{ex.title}</p>
                          <p className="text-[10px] text-muted-foreground">{ex.brand}</p>
                        </div>
                        {ex.isPerks && (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-0 text-[9px]">
                            <Gift className="w-3 h-3 mr-0.5" /> Perks
                          </Badge>
                        )}
                      </div>

                      {!ex.isPerks && (
                        <p className="text-xs font-heading font-bold text-foreground mt-2">Total: ₹{ex.total.toLocaleString("en-IN")}</p>
                      )}

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-muted-foreground">Progress</span>
                          <span className="text-[10px] font-heading font-medium text-foreground">{ex.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${ex.progress === 100 ? "bg-emerald-500" : "bg-accent"}`} style={{ width: `${ex.progress}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Dynamic milestones */}
                    <div className="border-t border-border">
                      {ex.milestones.map((ms, mi) => {
                        const cfg = milestoneStatusConfig[ms.status] || milestoneStatusConfig.locked;
                        return (
                          <div key={mi} className={`px-4 py-3 flex items-start gap-3 ${mi < ex.milestones.length - 1 ? "border-b border-border" : ""}`}>
                            <span className="text-[10px] font-heading font-bold text-accent w-8 shrink-0 pt-0.5">{ms.pct}%</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-heading font-medium text-foreground leading-tight">{ms.label}</p>
                              {!ex.isPerks && ms.amount > 0 && (
                                <p className="text-[9px] text-muted-foreground mt-0.5">₹{ms.amount.toLocaleString("en-IN")}</p>
                              )}
                            </div>
                            <Badge className={`${cfg.color} border-0 text-[8px] font-heading shrink-0`}>{cfg.label}</Badge>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2.5 bg-secondary/30 border-t border-border">
                      <p className="text-[9px] text-muted-foreground italic">{ex.autoRelease}</p>
                      {ex.activeUntil && <p className="text-[9px] text-accent mt-0.5">Active until: {ex.activeUntil}</p>}
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>

      {/* Help & Docs links */}
      <div className="px-4 mb-6 space-y-2">
        <Button variant="outline" size="sm" className="w-full h-10 rounded-xl text-xs" onClick={() => navigate("/help")}>
          <Info className="w-3.5 h-3.5" /> How til. Works <ChevronRight className="w-3 h-3" />
        </Button>
        <Button variant="outline" size="sm" className="w-full h-10 rounded-xl text-xs" onClick={() => navigate("/docs")}>
          <FileCheck className="w-3.5 h-3.5" /> Platform Documentation <ChevronRight className="w-3 h-3" />
        </Button>
      </div>
    </Layout>
  );
};

export default Escrow;
