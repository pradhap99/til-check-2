import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Shield, Lock, Unlock, CheckCircle, Clock, AlertTriangle,
  ArrowRight, IndianRupee, FileCheck, ChevronRight, Info
} from "lucide-react";

interface EscrowItem {
  id: string;
  campaign_id: string;
  campaign_title: string;
  creator_name: string;
  creator_user_id: string;
  application_id: string;
  total_amount: number;
  upfront_amount: number;
  completion_amount: number;
  upfront_status: "pending" | "released" | "held";
  completion_status: "pending" | "released" | "held" | "locked";
  deliverables_total: number;
  deliverables_approved: number;
  created_at: string;
}

const escrowStatusConfig: Record<string, { color: string; label: string; icon: any }> = {
  pending: { color: "bg-yellow-500/10 text-yellow-600", label: "Pending", icon: Clock },
  held: { color: "bg-accent/10 text-accent", label: "In Escrow", icon: Lock },
  released: { color: "bg-primary/10 text-primary", label: "Released", icon: Unlock },
  locked: { color: "bg-secondary text-muted-foreground", label: "Locked", icon: Lock },
};

const Escrow = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [escrows, setEscrows] = useState<EscrowItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      // Get accepted applications with campaign info
      const column = role === "brand" ? "campaigns.brand_user_id" : "creator_user_id";
      
      let query = supabase
        .from("campaign_applications")
        .select("*, campaigns(id, title, brand_user_id)")
        .eq("status", "accepted");
      
      if (role === "brand") {
        // Get campaigns owned by this brand first
        const { data: myCampaigns } = await supabase
          .from("campaigns")
          .select("id")
          .eq("brand_user_id", user.id);
        
        if (!myCampaigns || myCampaigns.length === 0) {
          setEscrows([]);
          setLoading(false);
          return;
        }
        
        query = query.in("campaign_id", myCampaigns.map(c => c.id));
      } else {
        query = query.eq("creator_user_id", user.id);
      }

      const { data: apps } = await query;
      if (!apps || apps.length === 0) {
        setEscrows([]);
        setLoading(false);
        return;
      }

      // Get creator profiles
      const creatorIds = [...new Set(apps.map(a => a.creator_user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", creatorIds);
      const profileMap = new Map((profiles || []).map(p => [p.user_id, p.full_name || "Creator"]));

      // Get deliverable progress
      const appIds = apps.map(a => a.id);
      const campaignIds = [...new Set(apps.map(a => a.campaign_id))];
      
      const { data: deliverables } = await supabase
        .from("campaign_deliverables")
        .select("id, campaign_id")
        .in("campaign_id", campaignIds);
      
      const { data: submissions } = await supabase
        .from("deliverable_submissions")
        .select("id, application_id, status")
        .in("application_id", appIds);

      // Get transactions for payment status
      const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .in("application_id", appIds);

      const delCountMap = new Map<string, number>();
      (deliverables || []).forEach(d => {
        delCountMap.set(d.campaign_id, (delCountMap.get(d.campaign_id) || 0) + 1);
      });

      const approvedMap = new Map<string, number>();
      (submissions || []).forEach(s => {
        if (["approved", "published"].includes(s.status)) {
          approvedMap.set(s.application_id, (approvedMap.get(s.application_id) || 0) + 1);
        }
      });

      const txMap = new Map<string, { upfront: boolean; completion: boolean }>();
      (transactions || []).forEach(t => {
        const existing = txMap.get(t.application_id || "") || { upfront: false, completion: false };
        if (t.description?.includes("upfront") || t.description?.includes("Upfront")) existing.upfront = true;
        if (t.description?.includes("completion") || t.description?.includes("Completion")) existing.completion = true;
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
          id: app.id,
          campaign_id: app.campaign_id,
          campaign_title: (app as any).campaigns?.title || "Campaign",
          creator_name: profileMap.get(app.creator_user_id) || "Creator",
          creator_user_id: app.creator_user_id,
          application_id: app.id,
          total_amount: rate,
          upfront_amount: upfront,
          completion_amount: completion,
          upfront_status: tx.upfront ? "released" : "held",
          completion_status: tx.completion ? "released" : allApproved ? "held" : "locked",
          deliverables_total: totalDels,
          deliverables_approved: approvedDels,
          created_at: app.created_at,
        };
      });

      setEscrows(items);
      setLoading(false);
    };
    load();
  }, [user, role]);

  const releasePayment = async (escrow: EscrowItem, type: "upfront" | "completion") => {
    const amount = type === "upfront" ? escrow.upfront_amount : escrow.completion_amount;
    
    // Find brand user id
    const { data: campaign } = await supabase
      .from("campaigns")
      .select("brand_user_id")
      .eq("id", escrow.campaign_id)
      .maybeSingle();

    if (!campaign) return;

    // Create transaction
    await supabase.from("transactions").insert({
      amount,
      payer_user_id: campaign.brand_user_id,
      payee_user_id: escrow.creator_user_id,
      campaign_id: escrow.campaign_id,
      application_id: escrow.application_id,
      status: "completed",
      description: `${type === "upfront" ? "Upfront" : "Completion"} payment for "${escrow.campaign_title}"`,
      payment_method: "escrow",
      currency: "INR",
    });

    // Notify creator
    await supabase.from("notifications").insert({
      user_id: escrow.creator_user_id,
      title: type === "upfront" ? "Payment Released! 💰" : "Final Payment Released! 🎉",
      message: `₹${amount.toLocaleString("en-IN")} has been released for "${escrow.campaign_title}"`,
      type: "payment",
      reference_type: "campaign",
      reference_id: escrow.campaign_id,
    });

    // Update local state
    setEscrows(prev => prev.map(e => {
      if (e.id !== escrow.id) return e;
      return type === "upfront"
        ? { ...e, upfront_status: "released" as const }
        : { ...e, completion_status: "released" as const };
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

      {/* How it works */}
      <div className="px-4 mt-4">
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-3.5">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-heading font-semibold text-foreground">Secure Escrow Protection</p>
              <div className="mt-1.5 space-y-1">
                <p className="text-[10px] text-muted-foreground">1. 50% released when creator is accepted</p>
                <p className="text-[10px] text-muted-foreground">2. 50% released when all deliverables approved</p>
                <p className="text-[10px] text-muted-foreground">3. 7-day dispute window before auto-release</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Escrow Items */}
      <div className="px-4 mt-5 mb-4 space-y-3">
        <h3 className="font-heading font-semibold text-sm text-foreground">Active Escrows</h3>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 rounded-xl bg-primary/20 animate-pulse mx-auto" />
          </div>
        ) : escrows.length === 0 ? (
          <div className="text-center py-16">
            <Shield className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-heading font-medium text-muted-foreground">No active escrows</p>
            <p className="text-xs text-muted-foreground mt-1">
              {role === "brand" ? "Accept creator applications to start escrow" : "Get accepted to campaigns to see payment milestones"}
            </p>
          </div>
        ) : (
          escrows.map((escrow, i) => {
            const progress = escrow.deliverables_total > 0
              ? Math.round((escrow.deliverables_approved / escrow.deliverables_total) * 100) : 0;

            return (
              <div key={escrow.id} className="border border-border rounded-xl overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
                {/* Header */}
                <div className="p-4 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-sm text-foreground truncate">{escrow.campaign_title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {role === "brand" ? escrow.creator_name : "Your earnings"}
                        {" • "}₹{escrow.total_amount.toLocaleString("en-IN")} total
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
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

                {/* Payment Milestones */}
                <div className="border-t border-border">
                  {/* Milestone 1: Upfront */}
                  <MilestoneRow
                    label="Upfront Payment (50%)"
                    amount={escrow.upfront_amount}
                    status={escrow.upfront_status}
                    canRelease={role === "brand" && escrow.upfront_status === "held"}
                    onRelease={() => releasePayment(escrow, "upfront")}
                  />
                  
                  {/* Milestone 2: Completion */}
                  <MilestoneRow
                    label="Completion Payment (50%)"
                    amount={escrow.completion_amount}
                    status={escrow.completion_status}
                    canRelease={role === "brand" && escrow.completion_status === "held"}
                    onRelease={() => releasePayment(escrow, "completion")}
                    isLast
                  />
                </div>
              </div>
            );
          })
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
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${config.color}`}>
          <StatusIcon className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-heading font-medium text-foreground">{label}</p>
          <p className="text-[10px] text-muted-foreground">₹{amount.toLocaleString("en-IN")}</p>
        </div>
      </div>
      {canRelease ? (
        <Button size="sm" variant="gradient" className="h-7 text-[10px] rounded-lg px-3" onClick={onRelease}>
          Release
        </Button>
      ) : (
        <Badge className={`${config.color} border-0 text-[9px] font-heading`}>{config.label}</Badge>
      )}
    </div>
  );
};

export default Escrow;
