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
  Eye, Star, IndianRupee, ChevronRight, Megaphone,
  TrendingUp, Clock, Search, LogOut, Home, UserCheck, Filter,
  Instagram, Youtube, MapPin
} from "lucide-react";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription,
  DrawerFooter, DrawerClose,
} from "@/components/ui/drawer";

type AdminTab = "overview" | "pending" | "members" | "campaigns" | "disputes" | "announcements";

const sidebarItems: { key: AdminTab; label: string; icon: any }[] = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "pending", label: "Pending", icon: Clock },
  { key: "members", label: "Members", icon: Users },
  { key: "campaigns", label: "Campaigns", icon: Megaphone },
  { key: "disputes", label: "Disputes", icon: AlertTriangle },
  { key: "announcements", label: "Announce", icon: Megaphone },
];

const mockPendingCreators = [
  { name: "Ananya Krishnan", type: "creator", niche: "Beauty", platform: "Instagram", handle: "@ananya_beauty", followers: "45K", applied: "Mar 8", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face", city: "Mumbai" },
  { name: "Rohan Iyer", type: "creator", niche: "Tech", platform: "YouTube", handle: "@rohaniyer", followers: "120K", applied: "Mar 8", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face", city: "Bangalore" },
  { name: "Meera Pillai", type: "creator", niche: "Fashion", platform: "Instagram", handle: "@meerafashion", followers: "89K", applied: "Mar 7", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face", city: "Chennai" },
  { name: "Zara Patel", type: "creator", niche: "Lifestyle", platform: "Instagram", handle: "@zaravibes", followers: "34K", applied: "Mar 9", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face", city: "Delhi" },
  { name: "Karthik Menon", type: "creator", niche: "Fitness", platform: "Instagram", handle: "@karthikfit", followers: "67K", applied: "Mar 7", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face", city: "Hyderabad" },
  { name: "Priya Nair", type: "creator", niche: "Food", platform: "YouTube", handle: "@priyanairfood", followers: "92K", applied: "Mar 6", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face", city: "Kochi" },
  { name: "Aditya Kumar", type: "creator", niche: "Gaming", platform: "YouTube", handle: "@adityagaming", followers: "210K", applied: "Mar 8", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face", city: "Pune" },
  { name: "Ishita Reddy", type: "creator", niche: "Education", platform: "Instagram", handle: "@ishitaedu", followers: "55K", applied: "Mar 9", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", city: "Jaipur" },
];

const mockPendingBrands = [
  { name: "Sugar Cosmetics", type: "brand", industry: "Beauty Brand", city: "Mumbai", applied: "Mar 8", avatar: "" },
  { name: "Curefit", type: "brand", industry: "Fitness & Health", city: "Bangalore", applied: "Mar 7", avatar: "" },
  { name: "Sleepy Owl Coffee", type: "brand", industry: "Food & Beverage", city: "Delhi", applied: "Mar 6", avatar: "" },
  { name: "Bewakoof", type: "brand", industry: "Fashion & Apparel", city: "Mumbai", applied: "Mar 9", avatar: "" },
];

const Admin = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [loading, setLoading] = useState(true);
  const [pendingFilter, setPendingFilter] = useState<"all" | "creators" | "brands" | "today" | "week">("all");

  const [stats, setStats] = useState({
    totalUsers: 0, creators: 0, brands: 0,
    totalCampaigns: 0, activeCampaigns: 0,
    totalGMV: 0, pendingPayouts: 0, openDisputes: 0,
  });

  const [users, setUsers] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingCreators, setPendingCreators] = useState(mockPendingCreators);
  const [pendingBrands, setPendingBrands] = useState(mockPendingBrands);

  const [disputeDrawerOpen, setDisputeDrawerOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");

  useEffect(() => {
    if (role !== "admin") { navigate("/home"); return; }
    loadData();
  }, [role]);

  const loadData = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: roles }, { data: camps }, { data: txns }, { data: disps }] = await Promise.all([
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

  const handleApproveCreator = (name: string) => {
    setPendingCreators(prev => prev.filter(c => c.name !== name));
    toast.success(`${name} approved!`);
  };
  const handleRejectCreator = (name: string) => {
    setPendingCreators(prev => prev.filter(c => c.name !== name));
    toast.error(`${name} rejected`);
  };
  const handleApproveBrand = (name: string) => {
    setPendingBrands(prev => prev.filter(b => b.name !== name));
    toast.success(`${name} approved!`);
  };
  const handleRejectBrand = (name: string) => {
    setPendingBrands(prev => prev.filter(b => b.name !== name));
    toast.error(`${name} rejected`);
  };

  const handleDisputeResolve = async (resolution: string) => {
    if (!selectedDispute) return;
    await supabase.from("disputes").update({ status: "resolved", resolution, resolution_notes: resolutionNotes }).eq("id", selectedDispute.id);
    setDisputes(prev => prev.map(d => d.id === selectedDispute.id ? { ...d, status: "resolved", resolution, resolution_notes: resolutionNotes } : d));
    toast.success("Dispute resolved");
    setDisputeDrawerOpen(false); setSelectedDispute(null); setResolutionNotes("");
  };

  const filteredPending = pendingFilter === "creators" ? { c: pendingCreators, b: [] } :
    pendingFilter === "brands" ? { c: [], b: pendingBrands } : { c: pendingCreators, b: pendingBrands };

  const filteredUsers = users.filter(u => !searchQuery || u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-10 h-10 rounded-xl gradient-primary animate-pulse-glow" /></div>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-56 admin-sidebar flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-5 flex items-center gap-2.5 border-b border-primary-foreground/10">
          <img src="/logo-mark.svg" alt="til." className="w-7 h-7" />
          <div>
            <span className="font-display italic font-medium text-primary-foreground text-base">til. <span className="font-body not-italic font-bold text-xs">admin</span></span>
            <p className="text-[9px] text-primary-foreground/40">Platform Management</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {sidebarItems.map(item => (
            <button key={item.key} onClick={() => setTab(item.key)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-heading font-medium transition-all ${tab === item.key ? "bg-primary-foreground/10 text-primary-foreground" : "text-primary-foreground/50 hover:text-primary-foreground/80"}`}>
              <item.icon className="w-4 h-4" /> {item.label}
              {item.key === "pending" && <span className="ml-auto w-5 h-5 rounded-full bg-accent text-[9px] font-bold text-accent-foreground flex items-center justify-center">{pendingCreators.length + pendingBrands.length}</span>}
              {item.key === "disputes" && stats.openDisputes > 0 && <span className="ml-auto w-5 h-5 rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground flex items-center justify-center">{stats.openDisputes}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 space-y-1 border-t border-primary-foreground/10">
          <button onClick={() => navigate("/home")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-primary-foreground/50 hover:text-primary-foreground/80"><Home className="w-4 h-4" /> Back to App</button>
          <button onClick={() => signOut()} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-destructive/70 hover:text-destructive"><LogOut className="w-4 h-4" /> Sign Out</button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 admin-sidebar border-b border-primary-foreground/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2"><img src="/logo-mark.svg" alt="til" className="w-6 h-6" /><span className="font-heading italic font-medium text-primary-foreground text-base">til. <span className="font-body not-italic font-bold text-xs">admin</span></span></div>
          <Badge className="bg-destructive/20 text-destructive border-0 text-[9px]"><Shield className="w-3 h-3 mr-0.5" /> Admin</Badge>
        </div>
        <div className="px-3 pb-2 overflow-x-auto">
          <div className="flex gap-1">
            {sidebarItems.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`px-3 py-1.5 rounded-lg text-[10px] font-heading font-medium whitespace-nowrap flex items-center gap-1 ${tab === t.key ? "bg-primary-foreground/15 text-primary-foreground" : "text-primary-foreground/40"}`}>
                <t.icon className="w-3 h-3" /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 md:ml-56 pt-24 md:pt-0">
        <div className="max-w-4xl mx-auto p-4 md:p-8">

          {/* Overview */}
          {tab === "overview" && (
            <div className="space-y-6">
              <div><h2 className="font-heading font-bold text-xl text-foreground">Dashboard</h2><p className="text-xs text-muted-foreground mt-0.5">Platform overview</p></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Pending", value: pendingCreators.length + pendingBrands.length, sub: "need review", icon: Clock, color: "text-amber-500" },
                  { label: "Approved Today", value: 8, sub: "creators & brands", icon: UserCheck, color: "text-emerald-500" },
                  { label: "Active Creators", value: stats.creators || 342, sub: "verified", icon: Users, color: "text-accent" },
                  { label: "Active Brands", value: stats.brands || 89, sub: "registered", icon: Megaphone, color: "text-blue-500" },
                ].map((s, i) => (
                  <div key={i} className="border border-border rounded-xl p-4">
                    <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
                    <p className={`font-heading font-bold text-xl ${s.color}`}><CountUp end={s.value} duration={1500} /></p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    <p className="text-[9px] text-muted-foreground">{s.sub}</p>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="border border-border rounded-xl p-5">
                  <p className="text-xs font-heading font-semibold text-foreground mb-3">Key Metrics</p>
                  <div className="space-y-2.5">
                    {[
                      { label: "Total Signups (this month)", value: `${stats.totalUsers || 45}` },
                      { label: "Approval Rate", value: "87%" },
                      { label: "Active Campaigns", value: `${stats.activeCampaigns || 12}` },
                      { label: "Revenue (15%)", value: `₹${(stats.totalGMV * 0.15 || 125000).toLocaleString("en-IN")}` },
                    ].map((r, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{r.label}</span>
                        <span className="font-heading font-bold text-foreground">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-border rounded-xl p-5">
                  <p className="text-xs font-heading font-semibold text-foreground mb-3">Transaction Summary</p>
                  <div className="space-y-2.5">
                    {[
                      { label: "Total GMV", value: `₹${(stats.totalGMV || 850000).toLocaleString("en-IN")}` },
                      { label: "Pending Payouts", value: `₹${(stats.pendingPayouts || 125000).toLocaleString("en-IN")}` },
                      { label: "Open Disputes", value: `${stats.openDisputes || 3}` },
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

          {/* Pending Approvals */}
          {tab === "pending" && (
            <div className="space-y-4">
              <div><h2 className="font-heading font-bold text-xl text-foreground">Pending Approvals</h2><p className="text-xs text-muted-foreground">{pendingCreators.length + pendingBrands.length} awaiting review</p></div>
              <div className="flex gap-1.5 flex-wrap">
                {(["all", "creators", "brands", "today", "week"] as const).map(f => (
                  <button key={f} onClick={() => setPendingFilter(f)} className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${pendingFilter === f ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
                    {f === "all" ? `All (${pendingCreators.length + pendingBrands.length})` : f === "creators" ? `Creators (${pendingCreators.length})` : f === "brands" ? `Brands (${pendingBrands.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {/* Creator Cards */}
              {filteredPending.c.map((c, i) => (
                <div key={i} className="border border-border rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-heading font-semibold text-sm text-foreground">{c.name}</p>
                        <Badge className="text-[8px] border-0 bg-accent/10 text-accent">{c.niche}</Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        {c.platform === "Instagram" ? <Instagram className="w-3 h-3" /> : <Youtube className="w-3 h-3" />}
                        {c.handle} · {c.followers} followers
                      </p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {c.city} · Applied {c.applied}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1 h-8 text-[10px] rounded-lg" variant="outline"><Eye className="w-3 h-3 mr-1" /> View Profile</Button>
                    <Button size="sm" className="h-8 text-[10px] rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => handleApproveCreator(c.name)}><CheckCircle className="w-3 h-3 mr-1" /> Approve</Button>
                    <Button size="sm" className="h-8 text-[10px] rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={() => handleRejectCreator(c.name)}><XCircle className="w-3 h-3 mr-1" /> Reject</Button>
                  </div>
                </div>
              ))}

              {/* Brand Cards */}
              {filteredPending.b.map((b, i) => (
                <div key={i} className="border border-border rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-lg font-heading font-bold text-muted-foreground">{b.name.charAt(0)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-heading font-semibold text-sm text-foreground">{b.name}</p>
                        <Badge className="text-[8px] border-0 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">Brand</Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{b.industry} · {b.city}</p>
                      <p className="text-[10px] text-muted-foreground">Applied {b.applied}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1 h-8 text-[10px] rounded-lg" variant="outline"><Eye className="w-3 h-3 mr-1" /> View Details</Button>
                    <Button size="sm" className="h-8 text-[10px] rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => handleApproveBrand(b.name)}><CheckCircle className="w-3 h-3 mr-1" /> Approve</Button>
                    <Button size="sm" className="h-8 text-[10px] rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={() => handleRejectBrand(b.name)}><XCircle className="w-3 h-3 mr-1" /> Reject</Button>
                  </div>
                </div>
              ))}

              {filteredPending.c.length === 0 && filteredPending.b.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm">No pending approvals 🎉</div>
              )}
            </div>
          )}

          {/* Members */}
          {tab === "members" && (
            <div className="space-y-4">
              <div><h2 className="font-heading font-bold text-xl text-foreground">Active Members</h2><p className="text-xs text-muted-foreground">{users.length} registered users</p></div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name..." className="w-full h-10 pl-9 pr-3 rounded-lg bg-secondary text-foreground text-sm border border-border" />
              </div>
              {filteredUsers.slice(0, 50).map((u, i) => (
                <div key={u.id} className="border border-border rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-heading font-bold text-muted-foreground">{u.full_name?.charAt(0)?.toUpperCase() || "?"}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-heading font-medium text-foreground truncate">{u.full_name || "No Name"}</p>
                    <p className="text-[10px] text-muted-foreground">{u.location_city || "—"} · Joined {new Date(u.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p>
                  </div>
                  <Badge className={`text-[9px] border-0 ${u.role === "creator" ? "bg-accent/10 text-accent" : u.role === "brand" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" : "bg-secondary text-muted-foreground"}`}>{u.role}</Badge>
                </div>
              ))}
            </div>
          )}

          {/* Campaigns */}
          {tab === "campaigns" && (
            <div className="space-y-4">
              <div><h2 className="font-heading font-bold text-xl text-foreground">Campaign Approval</h2><p className="text-xs text-muted-foreground">{campaigns.length} campaigns</p></div>
              {campaigns.length === 0 ? <div className="text-center py-16 text-muted-foreground text-sm">No campaigns</div> : campaigns.map((c, i) => (
                <div key={c.id} className="border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-sm text-foreground truncate">{c.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{c.campaign_type} · ₹{parseInt(c.total_budget || "0").toLocaleString("en-IN")}</p>
                    </div>
                    <Badge className={`text-[9px] border-0 ${c.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : c.status === "draft" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" : "bg-secondary text-muted-foreground"}`}>{c.status}</Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {c.status === "draft" && (
                      <>
                        <Button size="sm" className="h-8 text-[10px] flex-1 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => handleCampaignStatusChange(c.id, "active")}><CheckCircle className="w-3 h-3" /> Approve</Button>
                        <Button size="sm" variant="outline" className="h-8 text-[10px] border-destructive/30 text-destructive" onClick={() => handleCampaignStatusChange(c.id, "rejected")}><XCircle className="w-3 h-3" /> Reject</Button>
                      </>
                    )}
                    {c.status === "active" && <Button size="sm" variant="outline" className="h-8 text-[10px]" onClick={() => handleCampaignStatusChange(c.id, "paused")}>Pause</Button>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Disputes */}
          {tab === "disputes" && (
            <div className="space-y-4">
              <div><h2 className="font-heading font-bold text-xl text-foreground">Disputes</h2><p className="text-xs text-muted-foreground">{stats.openDisputes} open</p></div>
              {disputes.length === 0 ? <div className="text-center py-16 text-muted-foreground text-sm">No disputes 🎉</div> : disputes.map((d) => (
                <div key={d.id} className="border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div><p className="font-heading font-semibold text-sm text-foreground">{d.reason}</p><p className="text-[10px] text-muted-foreground">Filed {new Date(d.created_at).toLocaleDateString("en-IN")}</p></div>
                    <Badge className={`text-[9px] border-0 ${d.status === "open" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"}`}>{d.status}</Badge>
                  </div>
                  {d.status === "open" && (
                    <Button size="sm" className="mt-3 h-8 text-[10px]" onClick={() => { setSelectedDispute(d); setDisputeDrawerOpen(true); }}>Resolve</Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Announcements */}
          {tab === "announcements" && (
            <div className="space-y-4">
              <div><h2 className="font-heading font-bold text-xl text-foreground">Announcements</h2><p className="text-xs text-muted-foreground">Post updates to the Admin Channel</p></div>
              <div className="border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-2">Coming soon: Post announcements directly from the admin panel to the Official Updates channel.</p>
                <Button size="sm" className="h-8 text-xs" disabled>Post Announcement</Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Dispute Resolution Drawer */}
      <Drawer open={disputeDrawerOpen} onOpenChange={setDisputeDrawerOpen}>
        <DrawerContent>
          <DrawerHeader><DrawerTitle>Resolve Dispute</DrawerTitle><DrawerDescription>{selectedDispute?.reason}</DrawerDescription></DrawerHeader>
          <div className="px-4 space-y-3">
            <textarea value={resolutionNotes} onChange={e => setResolutionNotes(e.target.value)} placeholder="Resolution notes..." rows={3} className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm border border-border resize-none" />
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 h-10 text-xs bg-emerald-500 text-white" onClick={() => handleDisputeResolve("resolved_for_creator")}>For Creator</Button>
              <Button size="sm" className="flex-1 h-10 text-xs bg-blue-500 text-white" onClick={() => handleDisputeResolve("split")}>Split</Button>
              <Button size="sm" className="flex-1 h-10 text-xs bg-amber-500 text-white" onClick={() => handleDisputeResolve("resolved_for_brand")}>For Brand</Button>
            </div>
          </div>
          <DrawerFooter><DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Admin;
