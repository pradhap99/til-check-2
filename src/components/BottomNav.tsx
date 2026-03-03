import { Link, useLocation } from "react-router-dom";
import { Home, Users, Briefcase, MessageCircle, User } from "lucide-react";

const navItems = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/creators", icon: Users, label: "Discover" },
  { path: "/campaigns", icon: Briefcase, label: "Campaigns" },
  { path: "/messages", icon: MessageCircle, label: "Chat" },
  { path: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 pb-safe">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition-all duration-200 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className={`relative ${isActive ? "scale-110" : ""} transition-transform duration-200`}>
                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className={`text-[9px] font-heading ${isActive ? "font-semibold" : "font-medium"}`}>{item.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full gradient-primary" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
