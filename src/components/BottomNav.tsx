import { useLocation, Link } from "react-router-dom";
import { Home, Search, Briefcase, MessageCircle, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const BottomNav = () => {
  const location = useLocation();
  const { role } = useAuth();

  const tabs = [
    { icon: Home, label: "Home", to: "/home" },
    { icon: Search, label: role === "brand" ? "Creators" : "Discover", to: "/creators" },
    { icon: Briefcase, label: "Campaigns", to: "/campaigns" },
    { icon: MessageCircle, label: "Messages", to: "/messages" },
    { icon: User, label: "Profile", to: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="max-w-lg mx-auto flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to || location.pathname.startsWith(tab.to + "/");
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center justify-center gap-0.5 w-14 py-1 transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={`text-[10px] ${isActive ? "font-semibold" : "font-normal"}`}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
