import { useState } from "react";
import { IndianRupee, Lock, Clock, AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BrandBottomNav from "@/components/BrandBottomNav";

const summaryCards = [
  { icon: IndianRupee, color: "text-amber-500", value: "₹3.2L", label: "Total Spent", sub: "All time", borderGradient: "from-amber-500 to-amber-400" },
  { icon: Lock, color: "text-teal-400", value: "₹45K", label: "In Escrow", sub: "Locked funds", borderGradient: "from-teal-500 to-teal-400" },
  { icon: Clock, color: "text-amber-400", value: "₹18K", label: "Pending Release", sub: "Milestone pending", borderGradient: "from-amber-400 to-yellow-400" },
];

const escrowCampaigns = [
  {
    name: "boAt Summer Audio Launch",
    total: "₹60,000",
    progress: 30,
    milestones: [
      { kpi: "Post 2 Instagram Reels", pct: 30, amount: "₹18,000", status: "Released" },
      { kpi: "Reach 5,000 views on content", pct: 40, amount: "₹24,000", status: "In Review" },
      { kpi: "Campaign completion + brand sign-off", pct: 30, amount: "₹18,000", status: "Locked" },
    ],
  },
  {
    name: "Mamaearth Vitamin C Range",
    total: "₹45,000",
    progress: 60,
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

const milestoneStatusStyles: Record<string, { badge: string; border: string }> = {
  Released: { badge: "bg-teal-500/15 text-teal-400", border: "border-l-teal-500" },
  "In Review": { badge: "bg-amber-500/15 text-amber-400", border: "border-l-amber-500" },
  Locked: { badge: "bg-white/5 text-zinc-500", border: "border-l-zinc-700" },
};

const invoiceStatusStyles: Record<string, string> = {
  Paid: "bg-teal-500/15 text-teal-400",
  Partial: "bg-amber-500/15 text-amber-400",
};

const BrandPayments = () => {
  const [tab, setTab] = useState<"escrow" | "invoices">("escrow");

  return (
    <div className="min-h-screen" style={{ background: "#09090B" }}>
      <main className="pb-24 max-w-lg mx-auto">
        <header className="px-5 pt-6 pb-2">
          <h1 className="text-lg font-bold text-[#FAFAFA]">Payments & Escrow</h1>
        </header>

        {/* Summary Cards */}
        <div className="px-5 mt-4 grid grid-cols-3 gap-2.5">
          {summaryCards.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-3.5 border border-white/5 relative overflow-hidden text-center animate-fade-slide-up"
              style={{ background: "#111113", animationDelay: `${i * 80}ms` }}
            >
              {/* Top gradient border */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${s.borderGradient}`} />
              <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1.5`} />
              <p className="text-xl font-bold text-[#FAFAFA]" style={{ fontVariantNumeric: "tabular-nums" }}>{s.value}</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">{s.label}</p>
              <p className="text-[9px] text-zinc-500">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="px-5 mt-5 flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
          {(["escrow", "invoices"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all ${
                tab === t
                  ? "bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold"
                  : "text-zinc-400 hover:text-zinc-300"
              }`}
            >
              {t === "escrow" ? "Escrow Tracking" : "Invoice History"}
            </button>
          ))}
        </div>

        {tab === "escrow" && (
          <div className="px-5 mt-4 space-y-4 pb-6">
            {escrowCampaigns.map((ec, i) => (
              <div
                key={i}
                className="rounded-2xl p-4 border border-white/5 animate-fade-slide-up"
                style={{ background: "#111113", boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4)", animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-[#FAFAFA]">{ec.name}</h4>
                  <span className="text-sm text-amber-500 font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>{ec.total}</span>
                </div>

                <div className="space-y-2.5">
                  {ec.milestones.map((ms, j) => (
                    <div
                      key={j}
                      className={`flex items-start gap-3 pl-3 border-l-2 ${milestoneStatusStyles[ms.status].border}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] rounded-full bg-white/5 text-zinc-300 px-2 py-0.5 shrink-0" style={{ fontVariantNumeric: "tabular-nums" }}>{ms.pct}%</span>
                          <p className="text-[11px] text-zinc-300">{ms.kpi}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-zinc-400" style={{ fontVariantNumeric: "tabular-nums" }}>{ms.amount}</span>
                          <Badge className={`text-[8px] border-0 ${milestoneStatusStyles[ms.status].badge}`}>
                            {ms.status === "Locked" && <Lock className="w-2.5 h-2.5 mr-0.5" />}
                            {ms.status}
                          </Badge>
                        </div>
                      </div>
                      {ms.status === "In Review" && (
                        <Button
                          size="sm"
                          className="h-7 px-3 text-[10px] rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold hover:scale-[1.02] transition-transform border-0 shrink-0"
                        >
                          Release
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-zinc-400">Overall progress</span>
                    <span className="text-[10px] text-amber-500 font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>{ec.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all" style={{ width: `${ec.progress}%` }} />
                  </div>
                </div>

                {ec.milestones.some(m => m.status === "In Review") && (
                  <button className="flex items-center gap-1 mt-3 text-red-400 text-xs hover:text-red-300 transition-colors">
                    <AlertTriangle className="w-3 h-3" /> Raise Dispute
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "invoices" && (
          <div className="px-5 mt-4 space-y-2 pb-6">
            {invoices.map((inv, i) => (
              <div
                key={i}
                className="rounded-xl p-3.5 border border-white/5 flex items-center justify-between animate-fade-slide-up"
                style={{ background: "#111113", animationDelay: `${i * 50}ms` }}
              >
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#FAFAFA]">{inv.campaign}</p>
                  <p className="text-[10px] text-zinc-500">{inv.creator} · {inv.date}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#FAFAFA]" style={{ fontVariantNumeric: "tabular-nums" }}>{inv.amount}</p>
                    <Badge className={`text-[7px] border-0 ${invoiceStatusStyles[inv.status]}`}>{inv.status}</Badge>
                  </div>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors text-zinc-400 hover:text-amber-500">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <BrandBottomNav />
    </div>
  );
};

export default BrandPayments;
