import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gift, CheckCircle, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const vouchers = [
  { brand: "Amazon", amounts: [500, 1000, 2000], color: "from-orange-500 to-orange-700", initial: "A", bestValue: [2000] },
  { brand: "Flipkart", amounts: [500, 1000], color: "from-blue-500 to-blue-700", initial: "F", bestValue: [1000] },
  { brand: "Swiggy", amounts: [250, 500], color: "from-orange-400 to-red-500", initial: "S", bestValue: [] },
  { brand: "Zomato", amounts: [250, 500], color: "from-red-500 to-red-700", initial: "Z", bestValue: [] },
  { brand: "Myntra", amounts: [500, 1000], color: "from-pink-500 to-rose-600", initial: "M", bestValue: [] },
];

const Redeem = () => {
  const navigate = useNavigate();
  const [balance] = useState(47500);
  const [redeemed, setRedeemed] = useState(0);

  const handleRedeem = (brand: string, amount: number) => {
    if (redeemed + amount > balance) {
      toast.error("Insufficient balance");
      return;
    }
    setRedeemed(prev => prev + amount);
    toast.success(`₹${amount} ${brand} voucher redeemed!`);
  };

  const getBonusAmount = (amount: number) => Math.round(amount * 1.2);

  return (
    <Layout>
      <div className="page-transition">
        <header className="px-5 pt-6 pb-2 flex items-center gap-3">
          <button onClick={() => navigate("/earnings")} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-heading font-bold text-foreground">Redeem as Voucher</h1>
            <p className="text-[10px] text-muted-foreground">Choose from popular brands</p>
          </div>
        </header>

        {/* Balance */}
        <div className="px-5 mt-4">
          <div className="rounded-xl border border-border p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">Remaining balance</span>
            </div>
            <span className="font-heading font-bold text-foreground">₹{(balance - redeemed).toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Voucher Grid */}
        <div className="px-5 mt-4 space-y-4 pb-4">
          {vouchers.map((v, vi) => (
            <div key={v.brand} className="animate-fade-slide-up" style={{ animationDelay: `${vi * 80}ms` }}>
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${v.color} flex items-center justify-center`}>
                  <span className="text-white font-heading font-bold text-xs">{v.initial}</span>
                </div>
                <span className="font-heading font-semibold text-sm text-foreground">{v.brand}</span>
              </div>
              <div className="flex gap-2">
                {v.amounts.map(amt => {
                  const isBest = v.bestValue.includes(amt);
                  return (
                    <button
                      key={amt}
                      onClick={() => handleRedeem(v.brand, amt)}
                      className={`flex-1 border rounded-xl p-3 text-center transition-all active:scale-95 relative ${isBest ? "border-accent bg-accent/5 hover:bg-accent/10" : "border-border hover:border-accent"}`}
                    >
                      {isBest && (
                        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground border-0 text-[7px] font-heading px-1.5 py-0">
                          BEST VALUE
                        </Badge>
                      )}
                      <p className="font-heading font-bold text-sm text-accent">₹{amt}</p>
                      {isBest && (
                        <p className="text-[8px] text-emerald-500 font-heading mt-0.5">Get ₹{getBonusAmount(amt)} value</p>
                      )}
                      <p className="text-[9px] text-muted-foreground mt-0.5">Redeem</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <div className="px-5 mb-4">
          <div className="rounded-xl border border-accent/20 p-3.5" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.05), transparent)" }}>
            <p className="text-[11px] font-heading font-semibold text-foreground mb-2">Why choose vouchers?</p>
            <div className="flex gap-3">
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] font-heading font-bold text-accent">Voucher</span>
                </div>
                <p className="text-sm font-heading font-bold text-foreground">₹12,000</p>
                <p className="text-[8px] text-muted-foreground">value for ₹10K</p>
              </div>
              <div className="w-px bg-border" />
              <div className="flex-1 text-center opacity-60">
                <span className="text-[10px] font-heading text-muted-foreground">Bank Transfer</span>
                <p className="text-sm font-heading font-bold text-foreground mt-1">₹10,000</p>
                <p className="text-[8px] text-muted-foreground">exact amount</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bank transfer link */}
        <div className="px-5 mb-6 text-center">
          <button onClick={() => navigate("/bank-transfer")} className="text-[10px] text-muted-foreground underline">
            or transfer to bank (less value)
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Redeem;
