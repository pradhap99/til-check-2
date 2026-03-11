import { useLocation, Link } from "react-router-dom";
import { Home, FileText, Briefcase, TrendingUp, User } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();

  const tabs = [
    { icon: Home, label: "Home", to: "/home" },
    { icon: FileText, label: "Applications", to: "/applications" },
    { icon: Briefcase, label: "Campaigns", to: "/campaigns" },
    { icon: TrendingUp, label: "Earnings", to: "/earnings" },
    { icon: Shield, label: "Escrow", to: "/escrow" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="max-w-lg mx-auto flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to || location.pathname.startsWith(tab.to + "/");
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center justify-center gap-0.5 w-14 py-1 nav-icon-active transition-all duration-200 ${
                isActive ? "text-accent" : "text-[#52525B]"
              }`}
            >
              <tab.icon
                className={`w-[18px] h-[18px] transition-transform duration-200 ${isActive ? "scale-110" : ""}`}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span className={`text-[10px] ${isActive ? "font-bold" : "font-normal"}`}>{tab.label}</span>
              {isActive && (
                <span className="absolute -bottom-0 w-6 h-0.5 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
