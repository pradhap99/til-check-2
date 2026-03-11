import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wallet, TrendingUp, Clock, Download, ArrowUpRight,
  Shield, ChevronRight, ArrowDownLeft, ArrowUpFromLine,
  CheckCircle, FileText, Users, IndianRupee, Gift, Building2
} from "lucide-react";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription,
  DrawerFooter, DrawerClose,
} from "@/components/ui/drawer";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

interface Transaction {
  id: string;
  amount: number;
  status: string;
  description: string | null;
  created_at: string;
  campaign_id: string | null;
  currency: string | null;
  payment_method: string | null;
}

const Earnings = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [calcFollowers, setCalcFollowers] = useState([50000]);
  const [calcCampaigns, setCalcCampaigns] = useState([3]);

  useEffect(() => {
    if (!user) return;
    const fetchTransactions = async () => {
      const column = role === "brand" ? "payer_user_id" : "payee_user_id";
      const { data } = await supabase.from("transactions").select("*").eq(column, user.id).order("created_at", { ascending: false });
      setTransactions(data || []);
      setLoading(false);
    };
    fetchTransactions();
  }, [user, role]);

  const mockTransactions: Transaction[] = [
    { id: "mock-1", amount: 9000, status: "completed", description: "Zomato Food Stories", created_at: "2026-02-28T10:00:00Z", campaign_id: "4", currency: "INR", payment_method: "upi" },
    { id: "mock-2", amount: 8500, status: "completed", description: "Mamaearth Vitamin C", created_at: "2026-02-15T10:00:00Z", campaign_id: "2", currency: "INR", payment_method: "bank" },
    { id: "mock-3", amount: 7200, status: "completed", description: "Sugar Cosmetics Reel", created_at: "2026-01-30T10:00:00Z", campaign_id: null, currency: "INR", payment_method: "upi" },
    { id: "mock-4", amount: 15000, status: "completed", description: "boAt Audio Review", created_at: "2026-01-12T10:00:00Z", campaign_id: "3", currency: "INR", payment_method: "bank" },
    { id: "mock-5", amount: 7800, status: "pending", description: "Nykaa New Year", created_at: "2025-12-31T10:00:00Z", campaign_id: "5", currency: "INR", payment_method: "upi" },
  ];

  const displayTransactions = transactions.length > 0 ? transactions : mockTransactions;
  const hasMockData = transactions.length === 0;

  const totalEarned = hasMockData ? 47500 : transactions.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const pending = hasMockData ? 7800 : transactions.filter(t => t.status === "pending").reduce((s, t) => s + t.amount, 0);
  const thisMonth = hasMockData ? 18200 : transactions.filter(t => t.status === "completed" && new Date(t.created_at).getMonth() === new Date().getMonth()).reduce((s, t) => s + t.amount, 0);
  const lastMonth = hasMockData ? 14800 : 0;

  const statusConfig: Record<string, { color: string; label: string }> = {
    pending: { color: "bg-yellow-500/10 text-yellow-600", label: "Pending" },
    completed: { color: "bg-primary/10 text-primary", label: "Received" },
    processing: { color: "bg-accent/10 text-accent", label: "Processing" },
    failed: { color: "bg-destructive/10 text-destructive", label: "Failed" },
  };

  const handleWithdraw = async () => {
    if (!user) return;
    setProcessing(true);
    await supabase.from("transactions").insert({
      amount: Number(withdrawAmount), payer_user_id: user.id, payee_user_id: user.id,
      status: "completed", description: `Withdrawal via ${paymentMethod.toUpperCase()}`,
      payment_method: paymentMethod, currency: "INR",
    });
    toast.success(`₹${Number(withdrawAmount).toLocaleString("en-IN")} withdrawal initiated`);
    setWithdrawOpen(false); setWithdrawAmount(""); setProcessing(false);
    const column = role === "brand" ? "payer_user_id" : "payee_user_id";
    const { data } = await supabase.from("transactions").select("*").eq(column, user.id).order("created_at", { ascending: false });
    setTransactions(data || []);
  };

  const ratePerFollower = calcFollowers[0] < 10000 ? 0.3 : calcFollowers[0] < 50000 ? 0.5 : calcFollowers[0] < 200000 ? 0.8 : 1.2;
  const estEarnings = Math.round(calcFollowers[0] * ratePerFollower * calcCampaigns[0] / 1000) * 1000;
  const estMin = Math.round(estEarnings * 0.7);
  const estMax = Math.round(estEarnings * 1.3);

  return (
    <Layout>
      <div className="page-transition">
        <header className="px-4 pt-6 pb-2">
          <h1 className="text-xl font-heading font-bold text-foreground">{role === "brand" ? "Payments" : "Wallet"}</h1>
          <p className="text-xs text-muted-foreground">{role === "brand" ? "Track campaign payments & escrow" : "Your wallet, payouts & earnings"}</p>
        </header>

        {/* Premium Wallet Balance Card */}
        <div className="px-4 mt-4">
          <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0533, #2d1b69)" }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.15), transparent 70%)" }} />
            <div className="relative z-10">
              <p className="text-[10px] text-white/50 font-heading uppercase tracking-wider">Available Balance</p>
              <h2 className="text-3xl font-heading font-bold mt-1" style={{ color: "#f59e0b" }}>₹{totalEarned.toLocaleString("en-IN")}</h2>
              {pending > 0 && <p className="text-[10px] text-white/40 mt-0.5">+ ₹{pending.toLocaleString("en-IN")} pending</p>}
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  className="h-9 rounded-xl font-heading text-[11px] btn-hover-lift btn-shimmer-hover border-0"
                  style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" }}
                  onClick={() => navigate("/redeem")}
                >
                  <Gift className="w-3.5 h-3.5" /> Redeem as Voucher
                </Button>
                <Button
                  size="sm"
                  className="h-9 rounded-xl font-heading text-[11px] text-white btn-hover-lift btn-shimmer-hover"
                  style={{ background: "#f59e0b" }}
                  onClick={() => navigate("/bank-transfer")}
                >
                  <Building2 className="w-3.5 h-3.5" /> Transfer to Bank
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 mt-3 grid grid-cols-3 gap-2">
          <div className="border border-border rounded-xl p-3 text-center">
            <Clock className="w-3.5 h-3.5 text-yellow-600 mx-auto mb-1" />
            <p className="font-heading font-bold text-sm text-foreground">₹{pending.toLocaleString("en-IN")}</p>
            <p className="text-[9px] text-muted-foreground">Pending</p>
          </div>
          <div className="border border-border rounded-xl p-3 text-center">
            <TrendingUp className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
            <p className="font-heading font-bold text-sm text-foreground">₹{thisMonth.toLocaleString("en-IN")}</p>
            <p className="text-[9px] text-muted-foreground">This Month</p>
          </div>
          <div className="border border-border rounded-xl p-3 text-center">
            <ArrowDownLeft className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1" />
            <p className="font-heading font-bold text-sm text-foreground">₹{lastMonth.toLocaleString("en-IN")}</p>
            <p className="text-[9px] text-muted-foreground">Last Month</p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="px-4 mt-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-sm text-foreground">Transaction History</h3>
            <button className="text-[10px] text-primary font-heading font-medium flex items-center gap-0.5">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16"><div className="w-8 h-8 rounded-lg bg-primary/20 animate-pulse mx-auto" /></div>
          ) : (
            <div className="space-y-2">
              {displayTransactions.map((tx, i) => {
                const config = statusConfig[tx.status] || statusConfig.pending;
                const isWithdrawal = tx.description?.includes("Withdrawal");
                const isIncoming = role === "creator" && !isWithdrawal;
                return (
                  <div key={tx.id} className="border border-border rounded-xl p-3.5 animate-fade-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isIncoming ? "bg-primary/10" : "bg-secondary"}`}>
                        {isIncoming ? <ArrowDownLeft className="w-4 h-4 text-primary" /> : <ArrowUpFromLine className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-medium text-sm text-foreground truncate">{tx.description || "Campaign Payment"}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(tx.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          {tx.payment_method && ` • ${tx.payment_method.toUpperCase()}`}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`font-heading font-bold text-sm ${isIncoming ? "text-primary" : "text-foreground"}`}>
                          {isIncoming ? "+" : ""}₹{tx.amount.toLocaleString("en-IN")}
                        </p>
                        <Badge className={`${config.color} border-0 text-[8px] font-heading mt-0.5`}>{config.label}</Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Escrow link */}
        <div className="px-4 mb-6">
          <Button variant="outline" size="sm" className="w-full h-10 rounded-xl text-xs" onClick={() => navigate("/escrow")}>
            <Shield className="w-3.5 h-3.5" /> View Escrow <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Earnings;
