import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wallet, TrendingUp, Clock, Download, ArrowUpRight,
  Shield, ChevronRight, ChevronDown, ChevronUp, ArrowDownLeft, ArrowUpFromLine,
  CheckCircle, Gift, Building2, Sparkles, Flame, Copy, ArrowRight
} from "lucide-react";
import { toast } from "sonner";

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

const affiliateOffers = [
  { brand: "Lenskart", commission: "8%", color: "from-blue-500 to-blue-700" },
  { brand: "Nykaa", commission: "12%", color: "from-red-500 to-red-700" },
  { brand: "boAt", commission: "6%", color: "from-gray-700 to-gray-900" },
];

const Earnings = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [txOpen, setTxOpen] = useState(false);

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
    { id: "mock-6", amount: 5500, status: "completed", description: "Bewakoof Reel", created_at: "2025-12-15T10:00:00Z", campaign_id: null, currency: "INR", payment_method: "upi" },
    { id: "mock-7", amount: 12000, status: "completed", description: "Lenskart Eyewear", created_at: "2025-11-28T10:00:00Z", campaign_id: "1", currency: "INR", payment_method: "bank" },
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

  const handleCopyLink = (brand: string) => {
    navigator.clipboard.writeText(`https://til.app/ref/${brand.toLowerCase()}-${Date.now()}`);
    toast.success("Link copied!");
  };

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
            </div>
          </div>
        </div>

        {/* Voucher promo banner */}
        <div className="px-4 mt-3">
          <div className="rounded-xl p-3 border border-accent/20" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))" }}>
            <div className="flex items-start gap-2">
              <Gift className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-heading font-semibold text-foreground">Vouchers give you UP TO 20% extra value!</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">₹10,000 balance = ₹12,000 in Amazon vouchers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Voucher CTA */}
        <div className="px-4 mt-3">
          <button
            onClick={() => navigate("/redeem")}
            className="w-full rounded-2xl py-[18px] font-heading font-bold text-[18px] text-white btn-shimmer-hover btn-hover-lift relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
          >
            Redeem as Voucher ✨
          </button>
          <div className="text-center mt-1.5">
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-heading font-bold">UP TO 20% BONUS VALUE</span>
          </div>
        </div>

        {/* Secondary bank transfer */}
        <div className="px-4 mt-2">
          <Button
            variant="outline"
            className="w-full h-10 rounded-xl font-heading text-xs text-muted-foreground border-border"
            onClick={() => navigate("/bank-transfer")}
          >
            <Building2 className="w-3.5 h-3.5 mr-1.5" /> Transfer to Bank
          </Button>
          <p className="text-[9px] text-muted-foreground text-center mt-1">2-3 business days processing</p>
        </div>

        {/* Stats */}
        <div className="px-4 mt-4 grid grid-cols-3 gap-2">
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

        {/* Collapsible Transaction History */}
        <div className="px-4 mt-5 mb-4">
          <button
            onClick={() => setTxOpen(!txOpen)}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-semibold text-sm text-foreground">Transaction History</h3>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-heading">
                {displayTransactions.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-[10px] text-primary font-heading font-medium flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                <Download className="w-3 h-3" /> Export
              </button>
              {txOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </div>
          </button>

          <div
            className="overflow-hidden transition-all duration-350 ease-in-out"
            style={{ maxHeight: txOpen ? `${displayTransactions.length * 80 + 20}px` : "0px" }}
          >
            {loading ? (
              <div className="text-center py-16"><div className="w-8 h-8 rounded-lg bg-primary/20 animate-pulse mx-auto" /></div>
            ) : (
              <div className="space-y-2 pt-2">
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
        </div>

        {/* Affiliate Deals Section */}
        <div className="px-4 mt-2 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-accent" />
            <div>
              <h3 className="font-heading font-semibold text-sm text-foreground">Affiliate Deals</h3>
              <p className="text-[9px] text-muted-foreground">Share links. Earn passive commissions.</p>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {affiliateOffers.map((offer, i) => (
              <div key={i} className="min-w-[160px] border border-border rounded-xl p-3 shrink-0 animate-scale-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${offer.color} flex items-center justify-center`}>
                    <span className="text-white font-heading font-bold text-xs">{offer.brand[0]}</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-heading font-semibold text-foreground">{offer.brand}</p>
                    <p className="text-[10px] text-accent font-heading font-bold">{offer.commission}</p>
                  </div>
                </div>
                <Button size="sm" className="w-full h-7 rounded-lg text-[10px] bg-accent/10 text-accent hover:bg-accent/20 border-0 font-heading" onClick={() => handleCopyLink(offer.brand)}>
                  <Copy className="w-3 h-3 mr-1" /> Copy Link
                </Button>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/offers")} className="flex items-center gap-1 text-xs text-accent font-heading font-medium mt-2">
            View All Offers <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Escrow link */}
        <div className="px-4 mb-6">
          <div className="border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-heading font-semibold text-foreground">Escrow & Payments</p>
                <p className="text-[10px] text-muted-foreground">Track your milestone-based payments</p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">In Escrow: ₹0 | Released: ₹0</p>
            <Button
              className="w-full h-9 rounded-xl text-xs bg-accent hover:bg-accent/90 text-accent-foreground font-heading"
              onClick={() => navigate("/escrow")}
            >
              View Escrow <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Earnings;
