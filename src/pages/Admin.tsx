import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Users, BarChart3, Shield, AlertTriangle, CheckCircle, XCircle,
  Eye, Ban, Star, IndianRupee, ArrowLeft, ChevronRight, Megaphone,
  FileText, TrendingUp, Clock, Search, Filter
} from "lucide-react";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription,
  DrawerFooter, DrawerClose,
} from "@/components/ui/drawer";

type AdminTab = "overview" | "users" | "campaigns" | "disputes" | "payouts";

const Admin = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0, creators: 0, brands: 0,
    totalCampaigns: 0, activeCampaigns: 0,
    totalGMV: 0, pendingPayouts: 0,
    openDisputes: 0,
  });

  // Data
  const [users, setUsers] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Drawers
  const [disputeDrawerOpen, setDisputeDrawerOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");

  useEffect(() => {
    if (role !== "admin") {
      navigate("/home");
      return;
    }
    loadData();
  }, [role]);

  const loadData = async () => {
    setLoading(true);
    const [
      { data: profiles },
      { data: roles },
      { data: camps },
      { data: txns },
      { data: disps },
    ] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("user_roles").select("*"),
      supabase.from("campaigns").select("*").order("created_at", { ascending: false }),
      supabase.from("transactions").select("*").order("created_at", { ascending: false }),
      supabase.from("disputes").select("*").order("created_at", { ascending: false }),
    ]);

    const roleMap = new Map((roles || []).map(r => [r.user_id, r.role]));
    const enrichedUsers = (profiles || []).map(p => ({
      ...p,
      role: roleMap.get(p.user_id) || "unknown",
    }));

    const creatorCount = (roles || []).filter(r => r.role === "creator").length;
    const brandCount = (roles || []).filter(r => r.role === "brand").length;
    const activeCamps = (camps || []).filter(c => c.status === "active").length;
    const totalGMV = (txns || []).filter(t => t.status === "completed").reduce((s, t) => s + Number(t.amount), 0);
    const pendingPayouts = (txns || []).filter(t => t.status === "pending").reduce((s, t) => s + Number(t.amount), 0);
    const openDisps = (disps || []).filter(d => d.status === "open").length;

    setStats({
      totalUsers: enrichedUsers.length,
      creators: creatorCount,
      brands: brandCount,
      totalCampaigns: (camps || []).length,
      activeCampaigns: activeCamps,
      totalGMV,
      pendingPayouts,
      openDisputes: openDisps,
    });

    setUsers(enrichedUsers);
    setCampaigns(camps || []);
    setTransactions(txns || []);
    setDisputes(disps || []);
    setLoading(false);
  };

  const handleCampaignStatusChange = async (campId: string, newStatus: string) => {
    await supabase.from("campaigns").update({ status: newStatus }).eq("id", campId);
    setCampaigns(prev => prev.map(c => c.id === campId ? { ...c, status: newStatus } : c));
    toast.success(`Campaign ${newStatus}`);
  };

  const handleDisputeResolve = async (resolution: "resolved_for_creator" | "resolved_for_brand" | "split") => {
    if (!selectedDispute) return;
    await supabase.from("disputes").update({
      status: "resolved",
      resolution,
      resolution_notes: resolutionNotes,
    }).eq("id", selectedDispute.id);

    setDisputes(prev => prev.map(d => d.id === selectedDispute.id ? { ...d, status: "resolved", resolution, resolution_notes: resolutionNotes } : d));
    setStats(prev => ({ ...prev, openDisputes: prev.openDisputes - 1 }));
    toast.success("Dispute resolved");
    setDisputeDrawerOpen(false);
    setSelectedDispute(null);
    setResolutionNotes("");
  };

  const filteredUsers = users.filter(u =>
    !searchQuery || u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.user_id?.includes(searchQuery)
  );

  const tabs: { key: AdminTab; label: string; icon: any }[] = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "users", label: "Users", icon: Users },
    { key: "campaigns", label: "Campaigns", icon: Megaphone },
    { key: "disputes", label: "Disputes", icon: AlertTriangle },
    { key: "payouts", label: "Payouts", icon: IndianRupee },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl gradient-primary animate-pulse-glow" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-4 flex items-center gap-3 sticky top-0 bg-background z-10 pb-3 border-b border-border">
        <button onClick={() => navigate("/home")} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="font-heading font-bold text-sm text-foreground">Admin Dashboard</h1>
          <p className="text-[10px] text-muted-foreground">Platform management</p>
        </div>
        <Badge className="bg-destructive/10 text-destructive border-0 text-[9px]">
          <Shield className="w-3 h-3 mr-0.5" /> Admin
        </Badge>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-3 overflow-x-auto">
        <div className="flex gap-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-3 py-2 rounded-lg text-[10px] font-heading font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${tab === t.key ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
              <t.icon className="w-3 h-3" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div className="px-4 mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Total Users", value: stats.totalUsers, sub: `${stats.creators} creators, ${stats.brands} brands`, icon: Users, color: "text-foreground" },
              { label: "Campaigns", value: stats.totalCampaigns, sub: `${stats.activeCampaigns} active`, icon: Megaphone, color: "text-accent" },
              { label: "Total GMV", value: `₹${stats.totalGMV.toLocaleString("en-IN")}`, sub: "completed transactions", icon: TrendingUp, color: "text-primary" },
              { label: "Open Disputes", value: stats.openDisputes, sub: "need resolution", icon: AlertTriangle, color: "text-destructive" },
            ].map((s, i) => (
              <div key={i} className="border border-border rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-1">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <p className={`font-heading font-bold text-lg ${s.color}`}>{s.value}</p>
                <p className="text-[9px] text-muted-foreground">{s.label}</p>
                <p className="text-[8px] text-muted-foreground mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="border border-border rounded-xl p-4">
            <p className="text-xs font-heading font-semibold text-foreground mb-2">Revenue Summary</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total GMV</span>
                <span className="font-heading font-bold text-foreground">₹{stats.totalGMV.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Pending Payouts</span>
                <span className="font-heading font-bold text-yellow-600">₹{stats.pendingPayouts.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Platform Commission (15%)</span>
                <span className="font-heading font-bold text-primary">₹{Math.round(stats.totalGMV * 0.15).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div className="px-4 mt-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search users..." className="w-full h-10 pl-9 pr-3 rounded-lg bg-secondary text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
          <p className="text-[10px] text-muted-foreground">{filteredUsers.length} users</p>
          {filteredUsers.slice(0, 50).map((u, i) => (
            <div key={u.id} className="border border-border rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-heading font-bold text-muted-foreground">
                {u.full_name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-heading font-medium text-foreground truncate">{u.full_name || "No Name"}</p>
                <p className="text-[10px] text-muted-foreground">{u.location_city || "—"}</p>
              </div>
              <Badge className={`text-[9px] border-0 ${u.role === "creator" ? "bg-accent/10 text-accent" : u.role === "brand" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                {u.role}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Campaigns Tab */}
      {tab === "campaigns" && (
        <div className="px-4 mt-4 space-y-2.5">
          {campaigns.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No campaigns yet</div>
          ) : campaigns.map(c => (
            <div key={c.id} className="border border-border rounded-xl p-3.5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-sm text-foreground truncate">{c.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {c.campaign_type} • ₹{parseInt(c.total_budget || "0").toLocaleString("en-IN")}
                    {c.is_barter && " • 🎁 Barter"}
                  </p>
                </div>
                <Badge className={`text-[9px] border-0 ${c.status === "active" ? "bg-primary/10 text-primary" : c.status === "draft" ? "bg-secondary text-muted-foreground" : "bg-yellow-500/10 text-yellow-600"}`}>
                  {c.status}
                </Badge>
              </div>
              <div className="flex gap-2 mt-2.5">
                {c.status === "draft" && (
                  <Button size="sm" className="h-7 text-[10px] flex-1" onClick={() => handleCampaignStatusChange(c.id, "active")}>
                    <CheckCircle className="w-3 h-3" /> Approve
                  </Button>
                )}
                {c.status === "active" && (
                  <Button size="sm" variant="outline" className="h-7 text-[10px] flex-1" onClick={() => handleCampaignStatusChange(c.id, "paused")}>
                    <Ban className="w-3 h-3" /> Pause
                  </Button>
                )}
                {c.status === "paused" && (
                  <Button size="sm" className="h-7 text-[10px] flex-1" onClick={() => handleCampaignStatusChange(c.id, "active")}>
                    <CheckCircle className="w-3 h-3" /> Resume
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disputes Tab */}
      {tab === "disputes" && (
        <div className="px-4 mt-4 space-y-2.5">
          {disputes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No disputes</div>
          ) : disputes.map(d => (
            <div key={d.id} className="border border-border rounded-xl p-3.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-heading font-semibold text-sm text-foreground">{d.reason}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{d.description?.slice(0, 80)}...</p>
                </div>
                <Badge className={`text-[9px] border-0 ${d.status === "open" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                  {d.status}
                </Badge>
              </div>
              {d.status === "open" && (
                <Button size="sm" className="w-full mt-2.5 h-8 text-[10px]" onClick={() => { setSelectedDispute(d); setDisputeDrawerOpen(true); }}>
                  <Eye className="w-3 h-3" /> Review & Resolve
                </Button>
              )}
              {d.resolution && (
                <p className="text-[10px] text-muted-foreground mt-2 bg-secondary p-2 rounded-lg">
                  Resolution: {d.resolution.replace(/_/g, " ")} — {d.resolution_notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Payouts Tab */}
      {tab === "payouts" && (
        <div className="px-4 mt-4 space-y-2.5">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="border border-border rounded-xl p-3 text-center">
              <p className="font-heading font-bold text-lg text-foreground">₹{stats.totalGMV.toLocaleString("en-IN")}</p>
              <p className="text-[9px] text-muted-foreground">Total Processed</p>
            </div>
            <div className="border border-border rounded-xl p-3 text-center">
              <p className="font-heading font-bold text-lg text-yellow-600">₹{stats.pendingPayouts.toLocaleString("en-IN")}</p>
              <p className="text-[9px] text-muted-foreground">Pending</p>
            </div>
          </div>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No transactions</div>
          ) : transactions.slice(0, 30).map(tx => (
            <div key={tx.id} className="border border-border rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-heading font-medium text-foreground">{tx.description?.slice(0, 40) || "Payment"}</p>
                <p className="text-[10px] text-muted-foreground">{new Date(tx.created_at).toLocaleDateString("en-IN")}</p>
              </div>
              <div className="text-right">
                <p className="font-heading font-bold text-sm text-foreground">₹{Number(tx.amount).toLocaleString("en-IN")}</p>
                <Badge className={`text-[8px] border-0 ${tx.status === "completed" ? "bg-primary/10 text-primary" : "bg-yellow-500/10 text-yellow-600"}`}>
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="h-8" />

      {/* Dispute Resolution Drawer */}
      <Drawer open={disputeDrawerOpen} onOpenChange={setDisputeDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="font-heading">Resolve Dispute</DrawerTitle>
            <DrawerDescription>{selectedDispute?.reason}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 space-y-3">
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-xs text-muted-foreground">{selectedDispute?.description}</p>
            </div>
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Resolution Notes</label>
              <textarea value={resolutionNotes} onChange={e => setResolutionNotes(e.target.value)}
                placeholder="Explain the resolution..." rows={3}
                className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none" />
            </div>
          </div>
          <DrawerFooter>
            <Button className="w-full h-10 text-xs" onClick={() => handleDisputeResolve("resolved_for_creator")}>
              <CheckCircle className="w-3.5 h-3.5" /> Resolve for Creator
            </Button>
            <Button variant="outline" className="w-full h-10 text-xs" onClick={() => handleDisputeResolve("resolved_for_brand")}>
              Resolve for Brand
            </Button>
            <Button variant="secondary" className="w-full h-10 text-xs" onClick={() => handleDisputeResolve("split")}>
              Split Resolution
            </Button>
            <DrawerClose asChild>
              <Button variant="ghost" className="w-full text-xs">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Admin;
