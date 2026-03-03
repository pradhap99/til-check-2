import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wallet, TrendingUp, Clock, CheckCircle, Download, ArrowUpRight,
  IndianRupee, Calendar, CreditCard, ArrowRight
} from "lucide-react";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger, DrawerClose,
} from "@/components/ui/drawer";
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

const Earnings = () => {
  const { user, role } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  useEffect(() => {
    if (!user) return;
    const fetchTransactions = async () => {
      const column = role === "brand" ? "payer_user_id" : "payee_user_id";
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq(column, user.id)
        .order("created_at", { ascending: false });
      setTransactions(data || []);
      setLoading(false);
    };
    fetchTransactions();
  }, [user, role]);

  const totalEarned = transactions.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const pending = transactions.filter(t => t.status === "pending").reduce((s, t) => s + t.amount, 0);
  const thisMonth = transactions
    .filter(t => t.status === "completed" && new Date(t.created_at).getMonth() === new Date().getMonth())
    .reduce((s, t) => s + t.amount, 0);

  const statusConfig: Record<string, { color: string; label: string }> = {
    pending: { color: "bg-yellow-500/10 text-yellow-600", label: "Pending" },
    completed: { color: "bg-primary/10 text-primary", label: "Paid" },
    processing: { color: "bg-accent/10 text-accent", label: "Processing" },
    failed: { color: "bg-destructive/10 text-destructive", label: "Failed" },
  };

  const handleWithdraw = () => {
    toast.success("Withdrawal initiated! 🎉 Funds will arrive shortly.");
    setWithdrawOpen(false);
    setWithdrawAmount("");
  };

  return (
    <Layout>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-heading font-bold text-foreground">
          {role === "brand" ? "Payments" : "Earnings"}
        </h1>
        <p className="text-xs text-muted-foreground">
          {role === "brand" ? "Track your campaign payments" : "Your earnings & withdrawals"}
        </p>
      </header>

      {/* Balance Cards */}
      <div className="px-4 mt-4">
        <div className="gradient-primary rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="relative z-10">
            <p className="text-xs text-primary-foreground/70 font-heading">
              {role === "brand" ? "Total Spent" : "Available Balance"}
            </p>
            <h2 className="text-3xl font-heading font-bold text-primary-foreground mt-1">
              ₹{totalEarned.toLocaleString("en-IN")}
            </h2>
            {role === "creator" && (
              <Drawer open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                <DrawerTrigger asChild>
                  <Button size="sm" className="mt-3 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-heading h-9 text-xs rounded-xl">
                    <ArrowUpRight className="w-3.5 h-3.5" /> Withdraw
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle className="font-heading">Withdraw Funds</DrawerTitle>
                    <DrawerDescription>Choose amount and payment method</DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4 space-y-4">
                    <div>
                      <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Amount (₹)</label>
                      <input value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="Enter amount" type="number" className="w-full h-11 px-3 rounded-xl bg-secondary text-foreground text-sm border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <p className="text-[10px] text-muted-foreground mt-1">Min ₹100 • Available: ₹{totalEarned.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Payment Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "upi", label: "UPI", desc: "Instant, 0% fee" },
                          { id: "bank", label: "Bank Transfer", desc: "1-2 days" },
                          { id: "wallet", label: "Wallet", desc: "Instant" },
                        ].map(m => (
                          <button key={m.id} onClick={() => setPaymentMethod(m.id)} className={`p-3 rounded-xl text-center transition-all ${paymentMethod === m.id ? "gradient-primary text-primary-foreground shadow-md" : "bg-secondary text-secondary-foreground"}`}>
                            <p className="text-xs font-heading font-medium">{m.label}</p>
                            <p className="text-[9px] mt-0.5 opacity-70">{m.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DrawerFooter>
                    <Button variant="gradient" className="w-full h-12 rounded-2xl font-heading" disabled={!withdrawAmount || Number(withdrawAmount) < 100} onClick={handleWithdraw}>
                      Confirm Withdrawal
                    </Button>
                    <DrawerClose asChild>
                      <Button variant="outline" className="w-full rounded-2xl">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-2.5">
        <div className="glass-card rounded-2xl p-3.5">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span className="text-[10px] text-muted-foreground">Pending</span>
          </div>
          <p className="font-heading font-bold text-lg text-card-foreground">₹{pending.toLocaleString("en-IN")}</p>
        </div>
        <div className="glass-card rounded-2xl p-3.5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] text-muted-foreground">This Month</span>
          </div>
          <p className="font-heading font-bold text-lg text-card-foreground">₹{thisMonth.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Payment Timeline Info */}
      {role === "creator" && (
        <div className="px-4 mt-4">
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
            <h3 className="font-heading font-semibold text-xs text-foreground mb-2">💡 Payment Timeline</h3>
            <div className="space-y-1.5">
              <p className="text-[10px] text-muted-foreground">• 50% upfront on campaign acceptance</p>
              <p className="text-[10px] text-muted-foreground">• 50% after deliverables approved & published</p>
              <p className="text-[10px] text-muted-foreground">• 7-day dispute window before auto-release</p>
            </div>
          </div>
        </div>
      )}

      {/* Transactions */}
      <div className="px-4 mt-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-base text-foreground">Recent Transactions</h3>
          <button className="text-xs text-primary font-heading font-medium flex items-center gap-0.5">
            <Download className="w-3 h-3" /> Export
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 rounded-xl gradient-primary animate-pulse-glow mx-auto" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16">
            <Wallet className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-heading font-medium text-muted-foreground">No transactions yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              {role === "brand" ? "Your payments to creators will appear here" : "Complete campaigns to start earning!"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx, i) => {
              const config = statusConfig[tx.status] || statusConfig.pending;
              return (
                <div key={tx.id} className="glass-card rounded-2xl p-3.5 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 50}ms`, animationFillMode: "forwards" }}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-sm text-card-foreground truncate">{tx.description || "Campaign Payment"}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(tx.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {tx.payment_method && ` • ${tx.payment_method.toUpperCase()}`}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className={`font-heading font-bold text-sm ${role === "brand" ? "text-destructive" : "text-primary"}`}>
                        {role === "brand" ? "-" : "+"}₹{tx.amount.toLocaleString("en-IN")}
                      </p>
                      <Badge className={`${config.color} border-0 text-[9px] font-heading mt-0.5`}>{config.label}</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Earnings;
