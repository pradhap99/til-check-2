import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { User, Settings, LogIn, Heart, Bell } from "lucide-react";

const Profile = () => {
  return (
    <Layout>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-heading font-bold text-foreground">Profile</h1>
      </header>

      <div className="px-4 mt-4">
        {/* Avatar Placeholder */}
        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="w-20 h-20 rounded-2xl gradient-primary mx-auto flex items-center justify-center animate-pulse-glow">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="font-heading font-bold text-lg mt-4 text-card-foreground">Welcome to TIL</h2>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage your profile, track campaigns, and connect with brands.</p>
          <Button variant="gradient" size="lg" className="mt-4 w-full">
            <LogIn className="w-4 h-4" /> Sign In / Sign Up
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-4 space-y-2">
          {[
            { icon: Heart, label: "Saved Creators", desc: "Your bookmarked creators" },
            { icon: Bell, label: "Notifications", desc: "Campaign updates & messages" },
            { icon: Settings, label: "Settings", desc: "Account preferences" },
          ].map((item, i) => (
            <div
              key={i}
              className="glass-card rounded-xl p-4 flex items-center gap-3 cursor-pointer hover-lift opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-heading font-medium text-sm text-card-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
