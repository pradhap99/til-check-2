import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, FileText, Briefcase } from "lucide-react";

interface Application {
  id: string;
  campaign_id: string;
  pitch: string | null;
  proposed_rate: string | null;
  status: string;
  created_at: string;
  campaigns?: {
    title: string;
    brand_user_id: string;
  };
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: "bg-yellow-500/10 text-yellow-600", label: "Pending" },
  accepted: { icon: CheckCircle, color: "bg-primary/10 text-primary", label: "Accepted" },
  rejected: { icon: XCircle, color: "bg-destructive/10 text-destructive", label: "Rejected" },
  shortlisted: { icon: FileText, color: "bg-accent/10 text-accent", label: "Shortlisted" },
};

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("campaign_applications")
        .select("*, campaigns(title, brand_user_id)")
        .eq("creator_user_id", user.id)
        .order("created_at", { ascending: false });
      setApplications((data as any) || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const filtered = filter === "all" ? applications : applications.filter(a => a.status === filter);

  return (
    <Layout>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-heading font-bold text-foreground">My Applications</h1>
        <p className="text-xs text-muted-foreground">Track your campaign applications</p>
      </header>

      {/* Filter Tabs */}
      <div className="px-4 mt-3 overflow-x-auto">
        <div className="flex gap-1.5">
          {["all", "pending", "shortlisted", "accepted", "rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-[10px] font-heading font-medium transition-all capitalize ${filter === f ? "gradient-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="px-4 mt-4 space-y-2.5 mb-4">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 rounded-xl gradient-primary animate-pulse-glow mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-heading font-medium text-muted-foreground">
              {applications.length === 0 ? "No applications yet" : "No matching applications"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {applications.length === 0 ? "Browse campaigns and start applying!" : "Try a different filter"}
            </p>
          </div>
        ) : (
          filtered.map((app, i) => {
            const config = statusConfig[app.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            return (
              <div key={app.id} className="glass-card rounded-2xl p-4 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-sm text-card-foreground truncate">
                      {(app as any).campaigns?.title || "Campaign"}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Applied {new Date(app.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <Badge className={`${config.color} border-0 text-[10px] font-heading shrink-0`}>
                    <StatusIcon className="w-3 h-3 mr-0.5" /> {config.label}
                  </Badge>
                </div>
                {app.pitch && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{app.pitch}</p>
                )}
                {app.proposed_rate && (
                  <p className="text-xs font-heading font-semibold gradient-text mt-2">₹{parseInt(app.proposed_rate).toLocaleString()}</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
};

export default MyApplications;
