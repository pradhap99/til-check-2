import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight, Building2, Users, CreditCard, Bell, FileText, HelpCircle, ArrowRightLeft, LogOut, CheckCircle, Megaphone, IndianRupee, Star, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BrandBottomNav from "@/components/BrandBottomNav";

const menuItems = [
  { icon: Building2, label: "Brand Profile", sub: "Company name, website, logo, bio", to: "/profile/edit", iconBg: "bg-blue-500/15", iconColor: "text-blue-400" },
  { icon: Users, label: "Team Members", sub: "Add/remove team users", to: "/settings", iconBg: "bg-purple-500/15", iconColor: "text-purple-400" },
  { icon: CreditCard, label: "Billing & Subscription", sub: "Current plan, payment methods", to: "/settings", iconBg: "bg-emerald-500/15", iconColor: "text-emerald-400" },
  { icon: Bell, label: "Notification Preferences", sub: "Which alerts to receive", to: "/settings", iconBg: "bg-amber-500/15", iconColor: "text-amber-400" },
  { icon: FileText, label: "Campaign Templates", sub: "Saved campaign brief templates", to: "/brand/campaigns", iconBg: "bg-pink-500/15", iconColor: "text-pink-400" },
  { icon: FileText, label: "TIL for Business Docs", sub: "Platform documentation", to: "/docs", iconBg: "bg-cyan-500/15", iconColor: "text-cyan-400" },
  { icon: HelpCircle, label: "Help & Support", sub: "FAQs and contact support", to: "/help", iconBg: "bg-teal-500/15", iconColor: "text-teal-400" },
];

const BrandAccount = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const brandName = user?.user_metadata?.full_name || "Lenskart";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen" style={{ background: "#09090B" }}>
      <main className="pb-24 max-w-lg mx-auto">
        <header className="px-5 pt-6 pb-2">
          <h1 className="text-lg font-bold text-[#FAFAFA]">Account</h1>
        </header>

        {/* Brand Hero Card */}
        <div className="px-5 mt-4 animate-fade-slide-up">
          <div
            className="rounded-2xl p-5 border border-white/5 relative overflow-hidden"
            style={{ background: "#111113", boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4)" }}
          >
            {/* Gold gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-amber-400" />

            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                <span className="font-bold text-black text-xl">{brandName.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-lg text-[#FAFAFA]">{brandName}</h2>
                  <Badge className="text-[8px] border-0 bg-emerald-500/15 text-emerald-400">
                    <CheckCircle className="w-2.5 h-2.5 mr-0.5" /> Verified
                  </Badge>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 inline-block mt-1">Fashion & Lifestyle</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
              {[
                { icon: Megaphone, label: "Campaigns", value: "8" },
                { icon: IndianRupee, label: "Total Spend", value: "₹3.2L" },
                { icon: Star, label: "Avg. Rating", value: "4.8" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl font-bold text-[#FAFAFA]" style={{ fontVariantNumeric: "tabular-nums" }}>{s.value}</p>
                  <p className="text-[9px] text-zinc-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Badge */}
        <div className="px-5 mt-3 animate-fade-slide-up" style={{ animationDelay: "80ms" }}>
          <div className="rounded-xl p-4 border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-amber-400/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-amber-500" />
              <div>
                <p className="font-bold text-sm text-[#FAFAFA]">Growth Plan</p>
                <p className="text-[10px] text-zinc-400">3 active campaigns · Unlimited creators</p>
              </div>
            </div>
            <button className="text-xs text-amber-500 font-semibold hover:text-amber-400 transition-colors">Upgrade →</button>
          </div>
        </div>

        {/* Menu */}
        <div className="px-5 mt-5 space-y-2 animate-fade-slide-up" style={{ animationDelay: "160ms" }}>
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.to)}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
              style={{ background: "#111113" }}
            >
              <div className={`w-9 h-9 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
                <item.icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-[#FAFAFA]">{item.label}</p>
                <p className="text-[10px] text-zinc-500">{item.sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="px-5 mt-4 pt-4 border-t border-white/5 space-y-2 animate-fade-slide-up" style={{ animationDelay: "240ms" }}>
          <button
            onClick={() => navigate("/home")}
            className="w-full flex items-center gap-3 p-4 rounded-xl border border-white/5 hover:border-amber-500/30 transition-colors"
            style={{ background: "#111113" }}
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
              <ArrowRightLeft className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-sm font-semibold text-amber-500">Switch to Creator View</p>
            <ChevronRight className="w-4 h-4 text-zinc-600 ml-auto" />
          </button>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-red-500/5 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0">
              <LogOut className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-sm font-semibold text-red-400">Log Out</p>
          </button>
        </div>
      </main>
      <BrandBottomNav />
    </div>
  );
};

export default BrandAccount;
