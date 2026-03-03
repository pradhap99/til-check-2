import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User, Settings, Heart, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Layout>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-heading font-bold text-foreground">Profile</h1>
      </header>

      <div className="px-4 mt-4">
        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="w-20 h-20 rounded-2xl gradient-primary mx-auto flex items-center justify-center">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="font-heading font-bold text-lg mt-4 text-card-foreground">
            {user?.user_metadata?.full_name || user?.email}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
          {role && (
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-heading font-medium gradient-primary text-primary-foreground">
              {role === "creator" ? "🎨 Creator" : "🏢 Brand"}
            </span>
          )}
        </div>

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

          <Button variant="outline" className="w-full mt-4" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
