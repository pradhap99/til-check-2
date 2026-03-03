import { Link, useLocation } from "react-router-dom";
import { Home, Users, Briefcase, User } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/creators", icon: Users, label: "Creators" },
  { path: "/campaigns", icon: Briefcase, label: "Campaigns" },
  { path: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 pb-safe animate-slide-up">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-all duration-200 ${
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-heading font-medium">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full gradient-primary mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
