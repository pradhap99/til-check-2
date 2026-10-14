import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2, Smartphone } from "lucide-react";
import ComingSoonBadge from "@/components/ComingSoonBadge";
import PaymentsComingSoonNotice from "@/components/PaymentsComingSoonNotice";

const BankTransfer = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"bank" | "upi">("bank");
  const [form, setForm] = useState({ name: "", bank: "", account: "", ifsc: "", amount: "", upiId: "" });

  // Bank and UPI transfers are not live: there is no payment provider, so submitting does nothing.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Layout>
      <div className="page-transition">
        <header className="px-5 pt-6 pb-2 flex items-center gap-3">
          <button onClick={() => navigate("/earnings")} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-heading font-bold text-foreground">Transfer to Bank</h1>
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] text-muted-foreground">Send to bank account or UPI</p>
              <ComingSoonBadge />
            </div>
          </div>
        </header>

        <div className="px-5 mt-3">
          <PaymentsComingSoonNotice>
            Bank and UPI transfers are coming soon. This form is switched off and nothing you type here is saved or sent. Until payments launch, creators and brands settle payment directly.
          </PaymentsComingSoonNotice>
        </div>

        {/* Mode Toggle */}
        <div className="px-5 mt-4">
          <div className="flex gap-1 p-1 bg-secondary rounded-lg">
            <button
              onClick={() => setMode("bank")}
              className={`flex-1 py-2.5 rounded-md text-sm font-heading font-medium flex items-center justify-center gap-1.5 transition-all ${
                mode === "bank" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Bank Account
            </button>
            <button
              onClick={() => setMode("upi")}
              className={`flex-1 py-2.5 rounded-md text-sm font-heading font-medium flex items-center justify-center gap-1.5 transition-all ${
                mode === "upi" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> UPI
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 mt-5 pb-6">
          <fieldset disabled className="space-y-4 border-0 p-0 m-0 min-w-0 opacity-70">
          {mode === "bank" ? (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Account Holder Name</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name as per bank" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Bank Name</Label>
                <Input value={form.bank} onChange={e => setForm({ ...form, bank: e.target.value })} placeholder="e.g. HDFC Bank" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Account Number</Label>
                <Input value={form.account} onChange={e => setForm({ ...form, account: e.target.value })} placeholder="••••••••1234" type="password" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">IFSC Code</Label>
                <Input value={form.ifsc} onChange={e => setForm({ ...form, ifsc: e.target.value })} placeholder="e.g. HDFC0001234" required />
              </div>
            </>
          ) : (
            <div className="space-y-1.5">
              <Label className="text-xs">UPI ID</Label>
              <Input value={form.upiId} onChange={e => setForm({ ...form, upiId: e.target.value })} placeholder="yourname@upi" required />
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs">Amount to Transfer</Label>
            <Input value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="₹" type="number" required min={100} />
            <p className="text-[10px] text-muted-foreground">Min ₹100</p>
          </div>

          <Button
            type="submit"
            title="Coming soon"
            data-testid="bank-transfer-submit"
            className="w-full h-12 rounded-xl font-heading font-bold bg-amber-500 hover:bg-amber-600 text-white"
            disabled
          >
            Initiate Transfer · Coming soon
          </Button>

          <p className="text-[10px] text-muted-foreground text-center">Bank and UPI transfers are coming soon</p>
          </fieldset>
        </form>
      </div>
    </Layout>
  );
};

export default BankTransfer;
