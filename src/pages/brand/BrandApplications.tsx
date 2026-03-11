import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BrandBottomNav from "@/components/BrandBottomNav";

const tabs = ["All", "Pending", "Accepted", "Declined"];

const mockApps = [
  { id: "1", name: "Priya Sharma", handle: "@priya_creates", followers: "245K", engagement: "4.9%", niche: "Beauty", status: "Pending", initials: "PS" },
  { id: "2", name: "Arjun Mehta", handle: "@arjunmehta", followers: "189K", engagement: "4.7%", niche: "Tech", status: "Pending", initials: "AM" },
  { id: "3", name: "Sneha Kapoor", handle: "@snehakapoor", followers: "312K", engagement: "4.8%", niche: "Fashion", status: "Accepted", initials: "SK" },
  { id: "4", name: "Rahul Verma", handle: "@rahulverma", followers: "98K", engagement: "4.6%", niche: "Food", status: "Pending", initials: "RV" },
  { id: "5", name: "Kavya Nair", handle: "@kavyanair", followers: "156K", engagement: "4.8%", niche: "Fitness", status: "Declined", initials: "KN" },
  { id: "6", name: "Dev Anand", handle: "@devanand", followers: "425K", engagement: "4.9%", niche: "Comedy", status: "Accepted", initials: "DA" },
];

const BrandApplications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All" ? mockApps : mockApps.filter(a => a.status === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20 max-w-lg mx-auto">
        <div className="page-transition">
          <header className="px-5 pt-6 pb-2 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-lg font-heading font-bold text-foreground">Applications</h1>
              <p className="text-[10px] text-muted-foreground">Lenskart SS'26 Campaign</p>
            </div>
          </header>

          {/* Tabs */}
          <div className="px-5 mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)} className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium whitespace-nowrap transition-all ${activeTab === t ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                {t} {t !== "All" && `(${mockApps.filter(a => a.status === t).length})`}
              </button>
            ))}
          </div>

          {/* Applications */}
          <div className="px-5 mt-4 space-y-2.5 pb-6">
            {filtered.map((app, i) => (
              <div key={app.id} className="border border-border rounded-2xl p-4 animate-fade-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-start gap-3">
                  <Avatar className="w-11 h-11">
                    <AvatarFallback className="bg-accent/10 text-accent font-heading font-bold text-sm">{app.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-semibold text-sm text-foreground">{app.name}</span>
                      <Badge className={`text-[8px] border-0 ${app.status === "Accepted" ? "bg-emerald-500/10 text-emerald-500" : app.status === "Declined" ? "bg-destructive/10 text-destructive" : "bg-yellow-500/10 text-yellow-600"}`}>
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{app.handle}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-foreground font-medium">{app.followers} followers</span>
                      <span className="text-[10px] text-accent font-medium">{app.engagement} ER</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{app.niche}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {app.status === "Pending" ? (
                    <>
                      <Button size="sm" className="flex-1 h-8 rounded-xl text-[11px] bg-emerald-500 hover:bg-emerald-600 text-white font-heading">
                        <CheckCircle className="w-3 h-3 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 h-8 rounded-xl text-[11px] font-heading text-destructive border-destructive/30">
                        <X className="w-3 h-3 mr-1" /> Decline
                      </Button>
                    </>
                  ) : app.status === "Accepted" ? (
                    <Button size="sm" className="flex-1 h-8 rounded-xl text-[11px] bg-accent hover:bg-accent/90 text-accent-foreground font-heading">
                      Release Payment
                    </Button>
                  ) : null}
                  <Button size="sm" variant="ghost" className="h-8 px-3 rounded-xl text-[11px] font-heading">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BrandBottomNav />
    </div>
  );
};

export default BrandApplications;
