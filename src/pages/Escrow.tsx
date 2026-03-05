import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Shield, Lock, Unlock, CheckCircle, Clock, AlertTriangle,
  ArrowRight, IndianRupee, FileCheck, ChevronRight, Info, Tag, Star, Eye
} from "lucide-react";

interface EscrowItem {
  id: string; campaign_id: string; campaign_title: string; creator_name: string;
  creator_user_id: string; application_id: string; total_amount: number;
  upfront_amount: number; completion_amount: number;
  upfront_status: "pending" | "released" | "held";
  completion_status: "pending" | "released" | "held" | "locked";
  deliverables_total: number; deliverables_approved: number; created_at: string;
}

const escrowStatusConfig: Record<string, { color: string; label: string; icon: any }> = {
  pending: { color: "bg-yellow-500/10 text-yellow-600", label: "Pending", icon: Clock },
  held: { color: "bg-accent/10 text-accent", label: "In Escrow", icon: Lock },
  released: { color: "bg-primary/10 text-primary", label: "Released", icon: Unlock },
  locked: { color: "bg-secondary text-muted-foreground", label: "Locked", icon: Lock },
};

const exampleEscrows = [
  {
    id: "ex-1",
    title: "Summer Audio Launch 2026",
    creator: "Priya Sharma (@priyafashion)",
    total: 60000,
    upfront: 30000, upfrontStatus: "released" as const, upfrontDate: "Mar 1, 2026",
    completion: 30000, completionStatus: "held" as const,
    progress: 75, totalDels: 4, approvedDels: 3,
    remaining: "Instagram Stories (x3) - Submitted, under review",
    disputeWindow: "Active until Mar 15, 2026",
    isActive: true,
  },
  {
    id: "ex-2",
    title: "Mamaearth Skincare Review",
    creator: "Neha Kapoor (@nehabeauty)",
    total: 45000,
    upfront: 22500, upfrontStatus: "released" as const, upfrontDate: "Feb 28, 2026",
    completion: 22500, completionStatus: "released" as const,
    progress: 100, totalDels: 3, approvedDels: 3,
    remaining: null,
    disputeWindow: null,
    isActive: false,
  },
];

const Escrow = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [escrows, setEscrows] = useState<EscrowItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  const releasePayment = async (escrow: EscrowItem, type: "upfront" | "completion") => {
    const amount = type === "upfront" ? escrow.upfront_amount : escrow.completion_amount;
    const { data: campaign } = await supabase.from("campaigns").select("brand_user_id").eq("id", escrow.campaign_id).maybeSingle();
    if (!campaign) return;
    await supabase.from("transactions").insert({ amount, payer_user_id: campaign.brand_user_id, payee_user_id: escrow.creator_user_id, campaign_id: escrow.campaign_id, application_id: escrow.application_id, status: "completed", description: `${type === "upfront" ? "Upfront" : "Completion"} payment for "${escrow.campaign_title}"`, payment_method: "escrow", currency: "INR" });
    await supabase.from("notifications").insert({ user_id: escrow.creator_user_id, title: type === "upfront" ? "Payment Released! 💰" : "Final Payment Released! 🎉", message: `₹${amount.toLocaleString("en-IN")} has been released for "${escrow.campaign_title}"`, type: "payment", reference_type: "campaign", reference_id: escrow.campaign_id });
    setEscrows(prev => prev.map(e => {
      if (e.id !== escrow.id) return e;
      return type === "upfront" ? { ...e, upfront_status: "released" as const } : { ...e, completion_status: "released" as const };
    }));
  };

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
        <h1 className="text-xl font-heading font-bold text-foreground">Escrow & Payments</h1>
        <p className="text-xs text-muted-foreground">
          {role === "brand" ? "Manage milestone payments to creators" : "Track your payment milestones"}
        </p>
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
            <CheckCircle className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] text-muted-foreground">Released</span>
          </div>
          <p className="font-heading font-bold text-lg text-foreground">₹{totalReleased.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* How Escrow Works - Visual Timeline */}
      <div className="px-4 mt-4">
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-primary" />
            <p className="text-xs font-heading font-semibold text-foreground">How Escrow Protects Both Parties</p>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { step: "1", label: "Accept\nCreator", icon: "✅" },
              { step: "", label: "", icon: "→" },
              { step: "2", label: "50%\nReleased", icon: "💰" },
              { step: "", label: "", icon: "→" },
              { step: "3", label: "Creator\nDelivers", icon: "📦" },
              { step: "", label: "", icon: "→" },
              { step: "4", label: "You\nApprove", icon: "👍" },
              { step: "", label: "", icon: "→" },
              { step: "5", label: "50%\nAuto-Released", icon: "🎉" },
              { step: "", label: "", icon: "→" },
              { step: "6", label: "7-day\nDispute", icon: "🛡️" },
            ].map((s, i) => (
              s.step ? (
                <div key={i} className="flex flex-col items-center shrink-0 min-w-[48px]">
                  <span className="text-sm">{s.icon}</span>
                  <p className="text-[8px] text-muted-foreground text-center mt-0.5 whitespace-pre-line leading-tight">{s.label}</p>
                </div>
              ) : (
                <span key={i} className="text-muted-foreground text-xs shrink-0">→</span>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Active Escrows */}
      <div className="px-4 mt-5 mb-4 space-y-3">
        <h3 className="font-heading font-semibold text-sm text-foreground">Active Escrows</h3>

        {loading ? (
          <div className="text-center py-16"><div className="w-8 h-8 rounded-xl bg-primary/20 animate-pulse mx-auto" /></div>
        ) : (
          <>
            {/* Real escrows */}
            {escrows.map((escrow, i) => {
              const progress = escrow.deliverables_total > 0 ? Math.round((escrow.deliverables_approved / escrow.deliverables_total) * 100) : 0;
              return (
                <div key={escrow.id} className="border border-border rounded-xl overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
                  <div className="p-4 pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-sm text-foreground truncate">{escrow.campaign_title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{role === "brand" ? escrow.creator_name : "Your earnings"} • ₹{escrow.total_amount.toLocaleString("en-IN")} total</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-muted-foreground">Deliverables</span>
                        <span className="text-[10px] font-heading font-medium text-foreground">{escrow.deliverables_approved}/{escrow.deliverables_total}</span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-border">
                    <MilestoneRow label="Upfront Payment (50%)" amount={escrow.upfront_amount} status={escrow.upfront_status} canRelease={role === "brand" && escrow.upfront_status === "held"} onRelease={() => releasePayment(escrow, "upfront")} />
                    <MilestoneRow label="Completion Payment (50%)" amount={escrow.completion_amount} status={escrow.completion_status} canRelease={role === "brand" && escrow.completion_status === "held"} onRelease={() => releasePayment(escrow, "completion")} isLast />
                  </div>
                </div>
              );
            })}

            {/* Example escrows when no real ones */}
            {!hasRealEscrows && (
              <>
                <div className="flex items-center gap-2 mt-1">
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] text-muted-foreground">Example escrows — real escrows appear when {role === "brand" ? "you accept creators" : "brands accept your applications"}</p>
                </div>

                {exampleEscrows.map((ex, i) => (
                  <div key={ex.id} className="border border-border rounded-xl overflow-hidden opacity-0 animate-fade-up relative" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}>
                    <Badge className="absolute top-2 right-2 bg-accent/10 text-accent border-0 text-[8px] z-10"><Tag className="w-2.5 h-2.5 mr-0.5" />Example</Badge>
                    <div className="p-4 pb-3">
                      <p className="font-heading font-semibold text-sm text-foreground">{ex.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">with {ex.creator}</p>
                      <p className="text-xs font-heading font-bold text-foreground mt-2">Total: ₹{ex.total.toLocaleString("en-IN")}</p>
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-muted-foreground">Deliverable Progress</span>
                          <span className="text-[10px] font-heading font-medium text-foreground">{ex.approvedDels}/{ex.totalDels}</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${ex.progress === 100 ? "bg-primary" : "bg-accent"}`} style={{ width: `${ex.progress}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border">
                      {/* Upfront */}
                      <div className="px-4 py-3 flex items-center justify-between border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                            <Unlock className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-xs font-heading font-medium text-foreground">Upfront (50%)</p>
                            <p className="text-[10px] text-muted-foreground">₹{ex.upfront.toLocaleString("en-IN")} • {ex.upfrontDate}</p>
                          </div>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-0 text-[9px]">✅ Released</Badge>
                      </div>
                      {/* Completion */}
                      <div className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${ex.completionStatus === "released" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                            {ex.completionStatus === "released" ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <p className="text-xs font-heading font-medium text-foreground">Completion (50%)</p>
                            <p className="text-[10px] text-muted-foreground">₹{ex.completion.toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                        <Badge className={`border-0 text-[9px] ${ex.completionStatus === "released" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                          {ex.completionStatus === "released" ? "✅ Released" : "🟡 In Escrow"}
                        </Badge>
                      </div>
                    </div>

                    {/* Bottom info */}
                    {ex.remaining && (
                      <div className="px-4 py-2.5 bg-secondary/30 border-t border-border">
                        <p className="text-[10px] text-muted-foreground">Remaining: {ex.remaining}</p>
                        {ex.disputeWindow && <p className="text-[10px] text-accent mt-0.5">🛡️ {ex.disputeWindow}</p>}
                      </div>
                    )}
                    {!ex.isActive && (
                      <div className="px-4 py-2.5 bg-primary/5 border-t border-border">
                        <p className="text-[10px] text-primary font-medium">✅ Campaign Completed Successfully</p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="px-4 py-2.5 border-t border-border flex gap-2">
                      {ex.isActive ? (
                        <>
                          <Button size="sm" variant="outline" className="flex-1 h-8 text-[10px] rounded-lg"><Eye className="w-3 h-3" /> View Deliverables</Button>
                          <Button size="sm" variant="outline" className="flex-1 h-8 text-[10px] rounded-lg text-accent border-accent/30"><Unlock className="w-3 h-3" /> Release Early</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" className="flex-1 h-8 text-[10px] rounded-lg"><FileCheck className="w-3 h-3" /> View Report</Button>
                          <Button size="sm" variant="outline" className="flex-1 h-8 text-[10px] rounded-lg text-accent border-accent/30"><Star className="w-3 h-3" /> Leave Review</Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

const MilestoneRow = ({ label, amount, status, canRelease, onRelease, isLast }: {
  label: string; amount: number; status: string; canRelease: boolean; onRelease: () => void; isLast?: boolean;
}) => {
  const config = escrowStatusConfig[status] || escrowStatusConfig.pending;
  const StatusIcon = config.icon;
  return (
    <div className={`px-4 py-3 flex items-center justify-between ${!isLast ? "border-b border-border" : ""}`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${config.color}`}><StatusIcon className="w-3.5 h-3.5" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-heading font-medium text-foreground">{label}</p>
          <p className="text-[10px] text-muted-foreground">₹{amount.toLocaleString("en-IN")}</p>
        </div>
      </div>
      {canRelease ? (
        <Button size="sm" variant="gradient" className="h-7 text-[10px] rounded-lg px-3" onClick={onRelease}>Release</Button>
      ) : (
        <Badge className={`${config.color} border-0 text-[9px] font-heading`}>{config.label}</Badge>
      )}
    </div>
  );
};

export default Escrow;
