import { useLocation, Link } from "react-router-dom";
import { LayoutDashboard, Megaphone, Users, Wallet, Settings2 } from "lucide-react";

const BrandBottomNav = () => {
  const location = useLocation();

  const tabs = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/brand/dashboard" },
    { icon: Megaphone, label: "Campaigns", to: "/brand/campaigns" },
    { icon: Users, label: "Creators", to: "/brand/creators" },
    { icon: Wallet, label: "Payments", to: "/brand/payments" },
    { icon: Settings2, label: "Account", to: "/brand/account" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5" style={{ background: "rgba(9,9,11,0.96)", backdropFilter: "blur(20px)" }}>
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to || location.pathname.startsWith(tab.to + "/");
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className="flex flex-col items-center justify-center gap-1 w-16 py-1.5 transition-all duration-200"
            >
              <tab.icon
                className={`w-5 h-5 transition-all duration-200 ${isActive ? "text-amber-500 scale-110" : "text-zinc-500"}`}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span className={`text-[10px] transition-colors duration-200 ${isActive ? "text-amber-500 font-semibold" : "text-zinc-500 font-normal"}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-amber-500 -mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BrandBottomNav;
