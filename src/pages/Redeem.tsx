import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gift, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const vouchers = [
  { brand: "Amazon", amounts: [500, 1000, 2000], color: "from-orange-500 to-orange-700", initial: "A" },
  { brand: "Flipkart", amounts: [500, 1000], color: "from-blue-500 to-blue-700", initial: "F" },
  { brand: "Swiggy", amounts: [250, 500], color: "from-orange-400 to-red-500", initial: "S" },
  { brand: "Zomato", amounts: [250, 500], color: "from-red-500 to-red-700", initial: "Z" },
  { brand: "Myntra", amounts: [500, 1000], color: "from-pink-500 to-rose-600", initial: "M" },
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
        <div className="px-5 mt-4 space-y-4 pb-6">
          {vouchers.map((v, vi) => (
            <div key={v.brand} className="animate-fade-slide-up" style={{ animationDelay: `${vi * 80}ms` }}>
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${v.color} flex items-center justify-center`}>
                  <span className="text-white font-heading font-bold text-xs">{v.initial}</span>
                </div>
                <span className="font-heading font-semibold text-sm text-foreground">{v.brand}</span>
              </div>
              <div className="flex gap-2">
                {v.amounts.map(amt => (
                  <button
                    key={amt}
                    onClick={() => handleRedeem(v.brand, amt)}
                    className="flex-1 border border-border rounded-xl p-3 text-center hover:border-accent transition-colors active:scale-95"
                  >
                    <p className="font-heading font-bold text-sm text-amber-500">₹{amt}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">Redeem</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Redeem;
