import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight, Building2, Users, CreditCard, Bell, FileText, HelpCircle, ArrowRightLeft, LogOut, CheckCircle, Megaphone, IndianRupee, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BrandBottomNav from "@/components/BrandBottomNav";

const menuItems = [
  { icon: Building2, label: "Brand Profile", sub: "Company name, website, logo, bio", to: "/profile/edit" },
  { icon: Users, label: "Team Members", sub: "Add/remove team users", to: "/settings" },
  { icon: CreditCard, label: "Billing & Subscription", sub: "Current plan, payment methods", to: "/settings" },
  { icon: Bell, label: "Notification Preferences", sub: "Which alerts to receive", to: "/settings" },
  { icon: FileText, label: "Campaign Templates", sub: "Saved campaign brief templates", to: "/brand/campaigns" },
  { icon: FileText, label: "TIL for Business Docs", sub: "Platform documentation", to: "/docs" },
  { icon: HelpCircle, label: "Help & Support", sub: "FAQs and contact support", to: "/help" },
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
    <div className="min-h-screen bg-background">
      <main className="pb-20 max-w-lg mx-auto">
        <div className="page-transition">
          <header className="px-5 pt-6 pb-2">
            <h1 className="text-lg font-heading font-bold text-foreground">Account</h1>
          </header>

          {/* Brand Card */}
          <div className="px-5 mt-4">
            <div className="border border-border rounded-2xl p-5 bg-card">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
                  <span className="font-heading font-bold text-accent text-xl">{brandName.charAt(0)}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading font-bold text-lg text-foreground">{brandName}</h2>
                    <Badge className="text-[8px] border-0 bg-emerald-500/15 text-emerald-400"><CheckCircle className="w-2.5 h-2.5 mr-0.5" /> Verified</Badge>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">Fashion & Lifestyle</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
                {[
                  { icon: Megaphone, label: "Campaigns", value: "8" },
                  { icon: IndianRupee, label: "Total Spend", value: "₹3.2L" },
                  { icon: Star, label: "Avg. Rating", value: "4.8" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-lg font-heading font-bold text-foreground">{s.value}</p>
                    <p className="text-[9px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="px-5 mt-5 space-y-1">
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.to)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-heading font-medium text-foreground">{item.label}</p>
                  <p className="text-[9px] text-muted-foreground">{item.sub}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}

            <div className="pt-3 border-t border-border mt-3">
              <button
                onClick={() => navigate("/home")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4 text-accent shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-heading font-medium text-accent">Switch to Creator View</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/5 transition-colors"
              >
                <LogOut className="w-4 h-4 text-destructive shrink-0" />
                <p className="text-sm font-heading font-medium text-destructive">Log Out</p>
              </button>
            </div>
          </div>
        </div>
      </main>
      <BrandBottomNav />
    </div>
  );
};

export default BrandAccount;
