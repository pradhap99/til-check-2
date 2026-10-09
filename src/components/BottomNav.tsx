import { useLocation, Link } from "react-router-dom";
import { Home, FileText, Briefcase, TrendingUp, User } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();

  const tabs = [
    { icon: Home, label: "Home", to: "/home" },
    { icon: FileText, label: "Applications", to: "/applications" },
    { icon: Briefcase, label: "Campaigns", to: "/campaigns" },
    { icon: TrendingUp, label: "Earnings", to: "/earnings" },
    { icon: User, label: "Profile", to: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-1 pointer-events-none">
      <div className="max-w-md mx-auto glass-nav rounded-2xl border border-border/80 shadow-2xl backdrop-blur-xl pointer-events-auto">
        <div className="flex items-center justify-around h-14 px-2">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.to || location.pathname.startsWith(tab.to + "/");
            return (
              <Link
                key={tab.to}
                to={tab.to}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex flex-col items-center justify-center gap-0.5 w-14 py-1.5 rounded-xl transition-all duration-300 active:scale-90 ${
                  isActive ? "text-accent font-bold" : "text-muted-foreground hover:text-foreground font-medium"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 bg-accent/10 rounded-xl animate-fade-in border border-accent/20" />
                )}
                <tab.icon
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? "scale-110 text-accent" : "scale-100"
                  }`}
                  strokeWidth={isActive ? 2.5 : 1.75}
                />
                <span className="text-[10px] leading-tight tracking-tight relative z-10">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
