import Layout from "@/components/Layout";
import { Bell, CheckCircle, Briefcase, MessageCircle, Star, TrendingUp } from "lucide-react";

const mockNotifications = [
  { id: "1", icon: Briefcase, title: "New Campaign Match", message: "BoAt's Summer Audio Launch matches your profile!", time: "5m", read: false, color: "text-primary" },
  { id: "2", icon: CheckCircle, title: "Application Accepted", message: "Mamaearth accepted your campaign application 🎉", time: "1h", read: false, color: "text-green-500" },
  { id: "3", icon: MessageCircle, title: "New Message", message: "Priya Sharma sent you a message", time: "2h", read: false, color: "text-accent" },
  { id: "4", icon: Star, title: "New Review", message: "You received a 5-star review from Lenskart", time: "1d", read: true, color: "text-yellow-500" },
  { id: "5", icon: TrendingUp, title: "Profile View", message: "Your profile was viewed 28 times this week", time: "2d", read: true, color: "text-primary" },
];

const Notifications = () => {
  return (
    <Layout>
      <header className="px-4 pt-6 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-heading font-bold text-foreground">Notifications</h1>
        <button className="text-xs text-primary font-heading font-medium">Mark all read</button>
      </header>

      <div className="mt-2">
        {mockNotifications.map((notif, i) => (
          <div
            key={notif.id}
            className={`px-4 py-3.5 flex items-start gap-3 cursor-pointer transition-colors opacity-0 animate-fade-up ${
              !notif.read ? "bg-primary/5" : "hover:bg-secondary/30"
            }`}
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: "forwards" }}
          >
            <div className={`w-9 h-9 rounded-xl ${!notif.read ? "gradient-primary" : "bg-secondary"} flex items-center justify-center shrink-0`}>
              <notif.icon className={`w-4 h-4 ${!notif.read ? "text-primary-foreground" : "text-muted-foreground"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-heading ${!notif.read ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}>{notif.title}</h3>
                <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{notif.time}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
            </div>
            {!notif.read && (
              <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Notifications;
