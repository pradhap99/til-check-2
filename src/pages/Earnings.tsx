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
  CheckCircle, FileText, Users, IndianRupee
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
    { id: "mock-5", amount: 7800, status: "completed", description: "Nykaa New Year", created_at: "2025-12-31T10:00:00Z", campaign_id: "5", currency: "INR", payment_method: "upi" },
  ];

  const displayTransactions = transactions.length > 0 ? transactions : mockTransactions;
  const hasMockData = transactions.length === 0;

  const totalEarned = hasMockData ? 47500 : transactions.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const pending = hasMockData ? 12500 : transactions.filter(t => t.status === "pending").reduce((s, t) => s + t.amount, 0);
  const thisMonth = hasMockData ? 18200 : transactions.filter(t => t.status === "completed" && new Date(t.created_at).getMonth() === new Date().getMonth()).reduce((s, t) => s + t.amount, 0);
  const lastMonth = hasMockData ? 14800 : 0;

  const statusConfig: Record<string, { color: string; label: string }> = {
    pending: { color: "bg-yellow-500/10 text-yellow-600", label: "Pending" },
    completed: { color: "bg-primary/10 text-primary", label: "Completed" },
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

  // Earnings calculator
  const ratePerFollower = calcFollowers[0] < 10000 ? 0.3 : calcFollowers[0] < 50000 ? 0.5 : calcFollowers[0] < 200000 ? 0.8 : 1.2;
  const estEarnings = Math.round(calcFollowers[0] * ratePerFollower * calcCampaigns[0] / 1000) * 1000;
  const estMin = Math.round(estEarnings * 0.7);
  const estMax = Math.round(estEarnings * 1.3);

  return (
    <Layout>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-heading font-bold text-foreground">{role === "brand" ? "Payments" : "Earnings"}</h1>
        <p className="text-xs text-muted-foreground">{role === "brand" ? "Track campaign payments & escrow" : "Your earnings, withdrawals & escrow"}</p>
      </header>

      {/* Balance Card */}
      <div className="px-4 mt-4">
        <div className="bg-primary text-primary-foreground rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="relative z-10">
            <p className="text-[10px] text-primary-foreground/70 font-heading uppercase tracking-wider">{role === "brand" ? "Total Spent" : "Available Balance"}</p>
            <h2 className="text-3xl font-heading font-bold text-primary-foreground mt-1">₹{totalEarned.toLocaleString("en-IN")}</h2>
            <div className="flex gap-2 mt-3">
              {role === "creator" && (
                <Button size="sm" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-heading h-8 text-[10px] rounded-lg" onClick={() => setWithdrawOpen(true)}>
                  <ArrowUpRight className="w-3 h-3" /> Withdraw
                </Button>
              )}
              <Button size="sm" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 font-heading h-8 text-[10px] rounded-lg" onClick={() => navigate("/escrow")}>
                <Shield className="w-3 h-3" /> Escrow <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mt-3 grid grid-cols-4 gap-2">
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
        <div className="border border-border rounded-xl p-3 text-center">
          <Wallet className="w-3.5 h-3.5 text-accent mx-auto mb-1" />
          <p className="font-heading font-bold text-sm text-foreground">{displayTransactions.length}</p>
          <p className="text-[9px] text-muted-foreground">Transactions</p>
        </div>
      </div>

      {/* Earnings Chart */}
      {hasMockData && (
        <div className="px-4 mt-4">
          <div className="border border-border rounded-2xl p-4">
            <h4 className="font-heading font-semibold text-sm text-foreground mb-3">Earnings Trend</h4>
            <div className="flex items-end gap-2 h-[120px]">
              {[
                { month: "Sep", amount: 4200 },
                { month: "Oct", amount: 6800 },
                { month: "Nov", amount: 9500 },
                { month: "Dec", amount: 11200 },
                { month: "Jan", amount: 14800 },
                { month: "Feb", amount: 18200 },
              ].map((d, i) => {
                const maxH = 18200;
                const h = (d.amount / maxH) * 90;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[8px] font-heading font-bold text-foreground">₹{(d.amount / 1000).toFixed(1)}K</span>
                    <div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-accent transition-all" style={{ height: `${h}px` }} />
                    <span className="text-[9px] text-muted-foreground">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Transactions or Empty State */}
      <div className="px-4 mt-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-semibold text-sm text-foreground">Transaction History</h3>
          <button className="text-[10px] text-primary font-heading font-medium flex items-center gap-0.5">
            <Download className="w-3 h-3" /> Export
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16"><div className="w-8 h-8 rounded-lg bg-primary/20 animate-pulse mx-auto" /></div>
        ) : displayTransactions.length === 0 ? (
          <>
            {/* How You Get Paid */}
            <div className="border border-border rounded-2xl p-5 mb-4">
              <h4 className="font-heading font-semibold text-sm text-foreground mb-4">How You'll Get Paid</h4>
              <div className="flex items-start gap-3">
                {[
                  { step: "1", icon: FileText, label: "Complete deliverables", desc: "Submit content for review" },
                  { step: "2", icon: CheckCircle, label: "Brand approves", desc: "Content meets guidelines" },
                  { step: "3", icon: IndianRupee, label: "Payment in 7 days", desc: "Instant UPI or bank transfer" },
                ].map((s, i) => (
                  <div key={i} className="flex-1 text-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 mx-auto flex items-center justify-center mb-2 shadow-md">
                      <s.icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-[10px] font-heading font-semibold text-foreground">{s.label}</p>
                    <p className="text-[8px] text-muted-foreground mt-0.5">{s.desc}</p>
                    {i < 2 && <ChevronRight className="w-3 h-3 text-muted-foreground mx-auto mt-1" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Earnings Calculator (GAP 24) */}
            {role === "creator" && (
              <div className="border border-border rounded-2xl p-5">
                <h4 className="font-heading font-semibold text-sm text-foreground mb-1">Earnings Potential Calculator</h4>
                <p className="text-[10px] text-muted-foreground mb-4">Estimate your monthly earnings based on your audience</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" /> Followers</span>
                      <span className="text-xs font-heading font-bold text-foreground">{(calcFollowers[0] / 1000).toFixed(0)}K</span>
                    </div>
                    <Slider value={calcFollowers} onValueChange={setCalcFollowers} min={1000} max={1000000} step={5000} className="w-full" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[10px] text-muted-foreground">Campaigns/month</span>
                      <span className="text-xs font-heading font-bold text-foreground">{calcCampaigns[0]}</span>
                    </div>
                    <Slider value={calcCampaigns} onValueChange={setCalcCampaigns} min={1} max={10} step={1} className="w-full" />
                  </div>
                  <div className="bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/20 rounded-xl p-4 text-center">
                    <p className="text-[10px] text-muted-foreground">Potential Monthly Earnings</p>
                    <p className="text-2xl font-heading font-bold text-foreground mt-1">₹{estMin.toLocaleString("en-IN")} – ₹{estMax.toLocaleString("en-IN")}</p>
                    <p className="text-[9px] text-accent mt-1">Based on average rates for {(calcFollowers[0] / 1000).toFixed(0)}K followers</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-2">
            {displayTransactions.map((tx, i) => {
              const config = statusConfig[tx.status] || statusConfig.pending;
              const isWithdrawal = tx.description?.includes("Withdrawal");
              const isIncoming = role === "creator" && !isWithdrawal;
              return (
                <div key={tx.id} className="border border-border rounded-xl p-3.5 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 40}ms`, animationFillMode: "forwards" }}>
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
                        {isIncoming ? "+" : role === "brand" ? "-" : ""}₹{tx.amount.toLocaleString("en-IN")}
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

      {/* Withdraw Drawer */}
      <Drawer open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="font-heading">Withdraw Funds</DrawerTitle>
            <DrawerDescription>Choose amount and payment method</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 space-y-4">
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Amount (₹)</label>
              <input value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="Enter amount" type="number" className="w-full h-11 px-3 rounded-lg bg-secondary text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <p className="text-[10px] text-muted-foreground mt-1">Min ₹100 • Available: ₹{totalEarned.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[{ id: "upi", label: "UPI", desc: "Instant" }, { id: "bank", label: "Bank", desc: "1–2 days" }, { id: "wallet", label: "Wallet", desc: "Instant" }].map(m => (
                  <button key={m.id} onClick={() => setPaymentMethod(m.id)} className={`p-3 rounded-lg text-center transition-all border ${paymentMethod === m.id ? "border-primary bg-primary/5" : "border-border bg-secondary"}`}>
                    <p className="text-xs font-heading font-medium text-foreground">{m.label}</p>
                    <p className="text-[9px] mt-0.5 text-muted-foreground">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button variant="gradient" className="w-full h-12 rounded-xl font-heading" disabled={!withdrawAmount || Number(withdrawAmount) < 100 || processing} onClick={handleWithdraw}>
              {processing ? "Processing..." : "Confirm Withdrawal"}
            </Button>
            <DrawerClose asChild><Button variant="outline" className="w-full rounded-xl">Cancel</Button></DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Layout>
  );
};

export default Earnings;
