import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BrandBottomNav from "@/components/BrandBottomNav";

const summaryStats = [
  { label: "Total Spent", value: "₹3.2L" },
  { label: "In Escrow", value: "₹45K" },
  { label: "Pending Release", value: "₹18K" },
];

const escrowCampaigns = [
  {
    name: "boAt Summer Audio Launch", total: "₹60,000",
    milestones: [
      { kpi: "Post 2 Instagram Reels", pct: 30, amount: "₹18,000", status: "Released" },
      { kpi: "Reach 5,000 views on content", pct: 40, amount: "₹24,000", status: "In Review" },
      { kpi: "Campaign completion + brand sign-off", pct: 30, amount: "₹18,000", status: "Locked" },
    ],
  },
  {
    name: "Mamaearth Vitamin C Range", total: "₹45,000",
    milestones: [
      { kpi: "Publish 3 YouTube Shorts", pct: 25, amount: "₹11,250", status: "Released" },
      { kpi: "Achieve 10K total views", pct: 35, amount: "₹15,750", status: "Released" },
      { kpi: "Submit UGC photos (min 5)", pct: 20, amount: "₹9,000", status: "In Review" },
      { kpi: "Brand approval + final sign-off", pct: 20, amount: "₹9,000", status: "Locked" },
    ],
  },
];

const invoices = [
  { campaign: "Lenskart SS'26", creator: "Priya Sharma", amount: "₹35,000", date: "Mar 28, 2026", status: "Paid" },
  { campaign: "Lenskart SS'26", creator: "Sneha Kapoor", amount: "₹42,000", date: "Mar 25, 2026", status: "Paid" },
  { campaign: "boAt Summer Audio", creator: "Vikram Singh", amount: "₹18,000", date: "Mar 22, 2026", status: "Partial" },
  { campaign: "Mamaearth Vitamin C", creator: "Kavya Nair", amount: "₹26,250", date: "Mar 20, 2026", status: "Paid" },
  { campaign: "Myntra EOSS", creator: "Rohan K", amount: "₹55,000", date: "Mar 15, 2026", status: "Paid" },
];

const statusColor: Record<string, string> = {
  Released: "bg-emerald-500/15 text-emerald-400",
  "In Review": "bg-amber-500/15 text-amber-400",
  Locked: "bg-secondary text-muted-foreground",
  Paid: "bg-emerald-500/15 text-emerald-400",
  Partial: "bg-amber-500/15 text-amber-400",
};
const statusIcon: Record<string, string> = { Released: "✅", "In Review": "⏳", Locked: "🔒" };

const BrandPayments = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"escrow" | "invoices">("escrow");

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20 max-w-lg mx-auto">
        <div className="page-transition">
          <header className="px-5 pt-6 pb-2">
            <h1 className="text-lg font-heading font-bold text-foreground">Payments & Escrow</h1>
          </header>

          {/* Summary */}
          <div className="px-5 mt-4 flex gap-2">
            {summaryStats.map((s, i) => (
              <div key={i} className="flex-1 border border-border rounded-xl p-3 bg-card text-center">
                <p className="text-lg font-heading font-bold text-foreground">{s.value}</p>
                <p className="text-[9px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="px-5 mt-4 flex gap-1 p-1 rounded-lg bg-secondary/50">
            {(["escrow", "invoices"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-md text-xs font-heading font-medium transition-all ${tab === t ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}>
                {t === "escrow" ? "Escrow Tracking" : "Invoice History"}
              </button>
            ))}
          </div>

          {tab === "escrow" && (
            <div className="px-5 mt-4 space-y-3 pb-6">
              {escrowCampaigns.map((ec, i) => (
                <div key={i} className="border border-border rounded-2xl p-4 bg-card animate-fade-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-heading font-bold text-sm text-foreground">{ec.name}</h4>
                    <span className="text-xs text-accent font-heading font-bold">{ec.total}</span>
                  </div>
                  <div className="space-y-2">
                    {ec.milestones.map((ms, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className="text-sm mt-0.5">{statusIcon[ms.status]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-foreground font-medium">{ms.kpi}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-accent font-heading font-bold">{ms.pct}% · {ms.amount}</span>
                            <Badge className={`text-[8px] border-0 ${statusColor[ms.status]}`}>{ms.status}</Badge>
                          </div>
                        </div>
                        {ms.status === "In Review" && (
                          <Button size="sm" className="h-6 px-2 text-[9px] rounded-md bg-accent hover:bg-accent/90 text-accent-foreground font-heading shrink-0">
                            Release
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <Button size="sm" variant="outline" className="flex-1 h-8 rounded-xl text-[10px] font-heading text-destructive border-destructive/30">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Raise Dispute
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "invoices" && (
            <div className="px-5 mt-4 space-y-2 pb-6">
              {invoices.map((inv, i) => (
                <div key={i} className="border border-border rounded-xl p-3.5 bg-card animate-fade-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-[11px] font-heading font-semibold text-foreground">{inv.campaign}</p>
                      <p className="text-[9px] text-muted-foreground">{inv.creator} · {inv.date}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-heading font-bold text-foreground">{inv.amount}</p>
                        <Badge className={`text-[7px] border-0 ${statusColor[inv.status]}`}>{inv.status}</Badge>
                      </div>
                      <button className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center hover:bg-accent/20 transition-colors">
                        <Download className="w-3 h-3 text-accent" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <BrandBottomNav />
    </div>
  );
};

export default BrandPayments;
