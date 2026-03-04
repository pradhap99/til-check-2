import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import CountUp from "@/components/CountUp";
import {
  Users, BarChart3, Shield, AlertTriangle, CheckCircle, XCircle,
  Eye, Ban, Star, IndianRupee, ChevronRight, Megaphone,
  TrendingUp, Clock, Search, LogOut, Home, UserCheck
} from "lucide-react";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription,
  DrawerFooter, DrawerClose,
} from "@/components/ui/drawer";

type AdminTab = "overview" | "users" | "campaigns" | "disputes" | "payouts";

const sidebarItems: { key: AdminTab; label: string; icon: any }[] = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "users", label: "Users", icon: Users },
  { key: "campaigns", label: "Campaigns", icon: Megaphone },
  { key: "disputes", label: "Disputes", icon: AlertTriangle },
  { key: "payouts", label: "Payouts", icon: IndianRupee },
];

const Admin = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0, creators: 0, brands: 0,
    totalCampaigns: 0, activeCampaigns: 0,
    totalGMV: 0, pendingPayouts: 0,
    openDisputes: 0,
  });

  const [users, setUsers] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [disputeDrawerOpen, setDisputeDrawerOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");

  useEffect(() => {
    if (role !== "admin") { navigate("/home"); return; }
    loadData();
  }, [role]);

  const loadData = async () => {
    setLoading(true);
    const [
      { data: profiles }, { data: roles }, { data: camps },
      { data: txns }, { data: disps },
    ] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("user_roles").select("*"),
      supabase.from("campaigns").select("*").order("created_at", { ascending: false }),
      supabase.from("transactions").select("*").order("created_at", { ascending: false }),
      supabase.from("disputes").select("*").order("created_at", { ascending: false }),
    ]);

    const roleMap = new Map((roles || []).map(r => [r.user_id, r.role]));
    const enrichedUsers = (profiles || []).map(p => ({ ...p, role: roleMap.get(p.user_id) || "unknown" }));

    const creatorCount = (roles || []).filter(r => r.role === "creator").length;
    const brandCount = (roles || []).filter(r => r.role === "brand").length;
    const activeCamps = (camps || []).filter(c => c.status === "active").length;
    const totalGMV = (txns || []).filter(t => t.status === "completed").reduce((s, t) => s + Number(t.amount), 0);
    const pendingPayouts = (txns || []).filter(t => t.status === "pending").reduce((s, t) => s + Number(t.amount), 0);
    const openDisps = (disps || []).filter(d => d.status === "open").length;

    setStats({ totalUsers: enrichedUsers.length, creators: creatorCount, brands: brandCount, totalCampaigns: (camps || []).length, activeCampaigns: activeCamps, totalGMV, pendingPayouts, openDisputes: openDisps });
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
    await supabase.from("disputes").update({ status: "resolved", resolution, resolution_notes: resolutionNotes }).eq("id", selectedDispute.id);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl gradient-primary animate-pulse-glow" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Dark sidebar - desktop */}
      <aside className="hidden md:flex w-56 admin-sidebar flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-5 flex items-center gap-2.5 border-b border-primary-foreground/10">
          <div className="w-7 h-7 rounded-md bg-primary-foreground flex items-center justify-center">
            <span className="text-primary font-heading font-bold text-xs">T</span>
          </div>
          <div>
            <span className="font-heading font-bold text-primary-foreground text-sm">TIL Admin</span>
            <p className="text-[9px] text-primary-foreground/40">Platform Management</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {sidebarItems.map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-heading font-medium transition-all ${
                tab === item.key
                  ? "bg-primary-foreground/10 text-primary-foreground"
                  : "text-primary-foreground/50 hover:text-primary-foreground/80 hover:bg-primary-foreground/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.key === "disputes" && stats.openDisputes > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground flex items-center justify-center">{stats.openDisputes}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 space-y-1 border-t border-primary-foreground/10">
          <button onClick={() => navigate("/home")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-primary-foreground/50 hover:text-primary-foreground/80 hover:bg-primary-foreground/5 transition-all">
            <Home className="w-4 h-4" /> Back to App
          </button>
          <button onClick={() => signOut()} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 admin-sidebar border-b border-primary-foreground/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary-foreground flex items-center justify-center">
              <span className="text-primary font-heading font-bold text-[10px]">T</span>
            </div>
            <span className="font-heading font-bold text-primary-foreground text-sm">Admin</span>
          </div>
          <Badge className="bg-destructive/20 text-destructive border-0 text-[9px]">
            <Shield className="w-3 h-3 mr-0.5" /> Admin
          </Badge>
        </div>
        <div className="px-3 pb-2 overflow-x-auto">
          <div className="flex gap-1">
            {sidebarItems.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-heading font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                  tab === t.key ? "bg-primary-foreground/15 text-primary-foreground" : "text-primary-foreground/40"
                }`}>
                <t.icon className="w-3 h-3" /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-56 pt-24 md:pt-0">
        <div className="max-w-4xl mx-auto p-4 md:p-8">

          {/* Overview */}
          {tab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading font-bold text-xl text-foreground">Dashboard</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Platform overview & key metrics</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Total Users", value: stats.totalUsers, sub: `${stats.creators}C · ${stats.brands}B`, icon: Users, color: "text-foreground" },
                  { label: "Active Campaigns", value: stats.activeCampaigns, sub: `${stats.totalCampaigns} total`, icon: Megaphone, color: "text-accent" },
                  { label: "Total GMV", value: stats.totalGMV, sub: "completed", icon: TrendingUp, color: "text-success", isCurrency: true },
                  { label: "Open Disputes", value: stats.openDisputes, sub: "need resolution", icon: AlertTriangle, color: stats.openDisputes > 0 ? "text-destructive" : "text-muted-foreground" },
                ].map((s, i) => (
                  <div key={i} className="border border-border rounded-xl p-4 hover-lift transition-all opacity-0 animate-fade-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}>
                    <div className="flex items-center justify-between mb-2">
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                    <p className={`font-heading font-bold text-xl ${s.color}`}>
                      {s.isCurrency ? `₹${s.value.toLocaleString("en-IN")}` : <CountUp end={s.value} duration={1500} />}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Revenue + Pending */}
              <div className="grid md:grid-cols-2 gap-3">
                <div className="border border-border rounded-xl p-5">
                  <p className="text-xs font-heading font-semibold text-foreground mb-3">Revenue</p>
                  <div className="space-y-2.5">
                    {[
                      { label: "Total GMV", value: `₹${stats.totalGMV.toLocaleString("en-IN")}`, color: "text-foreground" },
                      { label: "Pending Payouts", value: `₹${stats.pendingPayouts.toLocaleString("en-IN")}`, color: "text-warning" },
                      { label: "Platform Revenue (15%)", value: `₹${Math.round(stats.totalGMV * 0.15).toLocaleString("en-IN")}`, color: "text-success" },
                    ].map((r, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{r.label}</span>
                        <span className={`font-heading font-bold ${r.color}`}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-border rounded-xl p-5">
                  <p className="text-xs font-heading font-semibold text-foreground mb-3">Quick Stats</p>
                  <div className="space-y-2.5">
                    {[
                      { label: "Avg Campaign Budget", value: campaigns.length > 0 ? `₹${Math.round(campaigns.reduce((s, c) => s + parseInt(c.total_budget || "0"), 0) / campaigns.length).toLocaleString("en-IN")}` : "—" },
                      { label: "Total Transactions", value: transactions.length.toString() },
                      { label: "User Growth (this month)", value: `${users.filter(u => new Date(u.created_at) > new Date(Date.now() - 30 * 86400000)).length} new` },
                    ].map((r, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{r.label}</span>
                        <span className="font-heading font-bold text-foreground">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {tab === "users" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-bold text-xl text-foreground">Users</h2>
                  <p className="text-xs text-muted-foreground">{users.length} registered users</p>
                </div>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name or ID..." className="w-full h-10 pl-9 pr-3 rounded-lg bg-secondary text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-accent/20" />
              </div>

              <div className="space-y-2">
                {filteredUsers.slice(0, 50).map((u, i) => (
                  <div key={u.id} className="border border-border rounded-xl p-3.5 flex items-center gap-3 hover-lift opacity-0 animate-fade-up" style={{ animationDelay: `${i * 30}ms`, animationFillMode: "forwards" }}>
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-heading font-bold text-muted-foreground">
                      {u.full_name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-heading font-medium text-foreground truncate">{u.full_name || "No Name"}</p>
                      <p className="text-[10px] text-muted-foreground">{u.location_city || "—"} · Joined {new Date(u.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p>
                    </div>
                    <Badge className={`text-[9px] border-0 ${u.role === "creator" ? "bg-accent/10 text-accent" : u.role === "brand" ? "bg-info/10 text-info" : "bg-secondary text-muted-foreground"}`}>
                      {u.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campaigns */}
          {tab === "campaigns" && (
            <div className="space-y-4">
              <div>
                <h2 className="font-heading font-bold text-xl text-foreground">Campaign Approval</h2>
                <p className="text-xs text-muted-foreground">{campaigns.length} campaigns · {campaigns.filter(c => c.status === "draft").length} pending approval</p>
              </div>
              {campaigns.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm">No campaigns</div>
              ) : campaigns.map((c, i) => (
                <div key={c.id} className="border border-border rounded-xl p-4 hover-lift opacity-0 animate-fade-up" style={{ animationDelay: `${i * 40}ms`, animationFillMode: "forwards" }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-sm text-foreground truncate">{c.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {c.campaign_type} · ₹{parseInt(c.total_budget || "0").toLocaleString("en-IN")}
                        {c.is_barter && " · 🎁 Barter"}
                      </p>
                    </div>
                    <Badge className={`text-[9px] border-0 ${
                      c.status === "active" ? "bg-success/10 text-success" :
                      c.status === "draft" ? "bg-warning/10 text-warning" :
                      c.status === "paused" ? "bg-destructive/10 text-destructive" :
                      "bg-secondary text-muted-foreground"
                    }`}>
                      {c.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {c.status === "draft" && (
                      <>
                        <Button size="sm" className="h-8 text-[10px] flex-1 btn-micro bg-success hover:bg-success/90 text-success-foreground" onClick={() => handleCampaignStatusChange(c.id, "active")}>
                          <CheckCircle className="w-3 h-3" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 text-[10px] btn-micro border-destructive/30 text-destructive" onClick={() => handleCampaignStatusChange(c.id, "rejected")}>
                          <XCircle className="w-3 h-3" /> Reject
                        </Button>
                      </>
                    )}
                    {c.status === "active" && (
                      <Button size="sm" variant="outline" className="h-8 text-[10px] flex-1 btn-micro" onClick={() => handleCampaignStatusChange(c.id, "paused")}>
                        <Ban className="w-3 h-3" /> Pause
                      </Button>
                    )}
                    {c.status === "paused" && (
                      <Button size="sm" className="h-8 text-[10px] flex-1 btn-micro" onClick={() => handleCampaignStatusChange(c.id, "active")}>
                        <CheckCircle className="w-3 h-3" /> Resume
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Disputes */}
          {tab === "disputes" && (
            <div className="space-y-4">
              <div>
                <h2 className="font-heading font-bold text-xl text-foreground">Dispute Management</h2>
                <p className="text-xs text-muted-foreground">{disputes.length} total · {stats.openDisputes} open</p>
              </div>
              {disputes.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm">No disputes filed</div>
              ) : disputes.map((d, i) => (
                <div key={d.id} className="border border-border rounded-xl p-4 hover-lift opacity-0 animate-fade-up" style={{ animationDelay: `${i * 40}ms`, animationFillMode: "forwards" }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-heading font-semibold text-sm text-foreground">{d.reason}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{d.description?.slice(0, 100)}</p>
                    </div>
                    <Badge className={`text-[9px] border-0 ${d.status === "open" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                      {d.status}
                    </Badge>
                  </div>
                  {d.status === "open" && (
                    <Button size="sm" className="w-full mt-3 h-9 text-[10px] btn-micro" onClick={() => { setSelectedDispute(d); setDisputeDrawerOpen(true); }}>
                      <Eye className="w-3 h-3" /> Review & Resolve
                    </Button>
                  )}
                  {d.resolution && (
                    <p className="text-[10px] text-muted-foreground mt-2 bg-secondary p-2.5 rounded-lg">
                      ✅ {d.resolution.replace(/_/g, " ")} — {d.resolution_notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Payouts */}
          {tab === "payouts" && (
            <div className="space-y-4">
              <div>
                <h2 className="font-heading font-bold text-xl text-foreground">Payouts</h2>
                <p className="text-xs text-muted-foreground">Transaction history & pending payouts</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-border rounded-xl p-4 text-center">
                  <p className="font-heading font-bold text-xl text-foreground">₹{stats.totalGMV.toLocaleString("en-IN")}</p>
                  <p className="text-[10px] text-muted-foreground">Total Processed</p>
                </div>
                <div className="border border-border rounded-xl p-4 text-center">
                  <p className="font-heading font-bold text-xl text-warning">₹{stats.pendingPayouts.toLocaleString("en-IN")}</p>
                  <p className="text-[10px] text-muted-foreground">Pending</p>
                </div>
              </div>
              {transactions.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm">No transactions</div>
              ) : transactions.slice(0, 30).map((tx, i) => (
                <div key={tx.id} className="border border-border rounded-xl p-3.5 flex items-center justify-between hover-lift opacity-0 animate-fade-up" style={{ animationDelay: `${i * 30}ms`, animationFillMode: "forwards" }}>
                  <div>
                    <p className="text-xs font-heading font-medium text-foreground">{tx.description?.slice(0, 50) || "Payment"}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(tx.created_at).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-sm text-foreground">₹{Number(tx.amount).toLocaleString("en-IN")}</p>
                    <Badge className={`text-[8px] border-0 ${tx.status === "completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

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
                className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none" />
            </div>
          </div>
          <DrawerFooter>
            <Button className="w-full h-10 text-xs btn-micro" onClick={() => handleDisputeResolve("resolved_for_creator")}>
              <CheckCircle className="w-3.5 h-3.5" /> Resolve for Creator
            </Button>
            <Button variant="outline" className="w-full h-10 text-xs btn-micro" onClick={() => handleDisputeResolve("resolved_for_brand")}>
              Resolve for Brand
            </Button>
            <Button variant="secondary" className="w-full h-10 text-xs btn-micro" onClick={() => handleDisputeResolve("split")}>
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
