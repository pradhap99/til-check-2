import { useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  ArrowLeft, Bell, Shield, Eye, Globe, Key, Smartphone, LogOut,
  Trash2, Moon, Sun, HelpCircle, MessageCircle, Mail, ChevronRight,
  Instagram, Youtube, Twitter, CreditCard, FileText, Users,
  Landmark, Ban, DollarSign, Settings2, AlertTriangle, ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const nicheOptions = ["Fashion", "Tech", "Beauty", "Food", "Fitness", "Travel", "Gaming", "Lifestyle", "Finance", "Comedy"];

const Settings = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const [emailCampaigns, setEmailCampaigns] = useState(true);
  const [emailPayments, setEmailPayments] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [profilePublic, setProfilePublic] = useState(true);
  const [messagesFrom, setMessagesFrom] = useState("both");

  // Payment fields
  const [bankAccount, setBankAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [upiId, setUpiId] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Preferences
  const [preferredNiches, setPreferredNiches] = useState<string[]>([]);
  const [minBudget, setMinBudget] = useState([5000]);
  const [blacklistedBrands, setBlacklistedBrands] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleNiche = (n: string) => setPreferredNiches(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]);
  const toggleSection = (s: string) => setExpandedSection(prev => prev === s ? null : s);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSavePayment = async () => {
    if (!user) return;
    const table = role === "creator" ? "creator_profiles" : "brand_profiles";
    const { error } = await supabase.from(table).update({
      bank_account_number: bankAccount || null,
      bank_ifsc: ifsc || null,
      upi_id: upiId || null,
      gst_number: gstNumber || null,
    } as any).eq("user_id", user.id);
    if (error) toast.error("Failed to save");
    else toast.success("Payment details saved");
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset link sent to your email");
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="px-4 pt-4 flex items-center gap-3 sticky top-0 bg-background z-10 pb-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-heading font-semibold text-sm text-foreground">Settings</h1>
        </div>

        {/* Account */}
        <div className="px-4 mt-2">
          <CollapsibleSection title="Account" icon={Settings2} expanded={expandedSection === "account"} onToggle={() => toggleSection("account")}>
            <div className="space-y-1">
              <SettingsRow icon={Mail} label="Email" value={user?.email || "—"} />
              <SettingsRow icon={Smartphone} label="Phone" value="Not set" action="Add" onClick={() => toast.info("Phone verification coming soon")} />
              <SettingsRow icon={Key} label="Change Password" action="Reset" onClick={handlePasswordReset} />
              <SettingsRow icon={Shield} label="Two-Factor Auth" rightContent={<Switch checked={false} />} />
            </div>
          </CollapsibleSection>
        </div>

        {/* Notifications */}
        <div className="px-4 mt-3">
          <CollapsibleSection title="Email Preferences" icon={Bell} expanded={expandedSection === "notifs"} onToggle={() => toggleSection("notifs")}>
            <div className="space-y-1">
              <SettingsRow icon={Smartphone} label="Push Notifications" rightContent={<Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />} />
              <SettingsRow icon={Mail} label="Campaign Alerts" rightContent={<Switch checked={emailCampaigns} onCheckedChange={setEmailCampaigns} />} />
              <SettingsRow icon={CreditCard} label="Payment Notifications" rightContent={<Switch checked={emailPayments} onCheckedChange={setEmailPayments} />} />
              <SettingsRow icon={MessageCircle} label="SMS/WhatsApp Alerts" rightContent={<Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />} />
              <SettingsRow icon={FileText} label="Weekly Digest" rightContent={<Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />} />
            </div>
          </CollapsibleSection>
        </div>

        {/* Privacy */}
        <div className="px-4 mt-3">
          <CollapsibleSection title="Privacy" icon={Eye} expanded={expandedSection === "privacy"} onToggle={() => toggleSection("privacy")}>
            <div className="space-y-1">
              <SettingsRow
                icon={Eye}
                label="Profile Visibility"
                rightContent={
                  <Badge variant="secondary" className="text-[10px]">{profilePublic ? "Public" : "Brands only"}</Badge>
                }
                onClick={() => { setProfilePublic(!profilePublic); toast.success(`Profile set to ${!profilePublic ? "public" : "brands only"}`); }}
              />
              <SettingsRow
                icon={Users}
                label="Who Can Message Me"
                value={messagesFrom === "both" ? "Anyone" : messagesFrom === "brands" ? "Brands you've applied to" : "Anyone"}
                onClick={() => {
                  const next = messagesFrom === "both" ? "brands" : "both";
                  setMessagesFrom(next);
                  toast.success(`Messages from: ${next === "both" ? "Anyone" : "Brands you've applied to"}`);
                }}
              />
            </div>
          </CollapsibleSection>
        </div>

        {/* Payments */}
        <div className="px-4 mt-3">
          <CollapsibleSection title="Payments" icon={Landmark} expanded={expandedSection === "payments"} onToggle={() => toggleSection("payments")}>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Account Holder Name</label>
                <Input value={accountHolder} onChange={e => setAccountHolder(e.target.value)} placeholder="Full name as per bank" className="h-10 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Bank Account Number</label>
                <Input value={bankAccount} onChange={e => setBankAccount(e.target.value)} placeholder="Enter account number" className="h-10 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-wider mb-1 block">IFSC Code</label>
                <Input value={ifsc} onChange={e => setIfsc(e.target.value)} placeholder="e.g. SBIN0001234" className="h-10 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-wider mb-1 block">UPI ID</label>
                <Input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" className="h-10 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-wider mb-1 block">GST Number (optional)</label>
                <Input value={gstNumber} onChange={e => setGstNumber(e.target.value)} placeholder="22AAAAA0000A1Z5" className="h-10 rounded-xl text-sm" />
              </div>
              <Button onClick={handleSavePayment} className="w-full h-10 rounded-xl text-sm">Save Payment Details</Button>
              <div className="bg-accent/5 border border-accent/10 rounded-xl p-3">
                <p className="text-[10px] text-accent font-heading font-medium">Verify Bank Account</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">We'll deposit ₹1 to verify your account. This takes 1-2 business days.</p>
                <Button variant="outline" size="sm" className="mt-2 h-7 text-[10px] rounded-lg">Start Verification</Button>
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {/* Preferences */}
        {role === "creator" && (
          <div className="px-4 mt-3">
            <CollapsibleSection title="Preferences" icon={Settings2} expanded={expandedSection === "prefs"} onToggle={() => toggleSection("prefs")}>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Preferred Campaign Categories</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {nicheOptions.map(n => (
                      <button key={n} onClick={() => toggleNiche(n)} className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${preferredNiches.includes(n) ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>{n}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Minimum Budget Threshold: ₹{minBudget[0].toLocaleString()}</label>
                  <Slider value={minBudget} onValueChange={setMinBudget} min={0} max={100000} step={1000} className="w-full" />
                  <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                    <span>₹0</span><span>₹1,00,000</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-heading font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Blacklist Brands (comma-separated)</label>
                  <Input value={blacklistedBrands} onChange={e => setBlacklistedBrands(e.target.value)} placeholder="Brand A, Brand B" className="h-10 rounded-xl text-sm" />
                  <p className="text-[9px] text-muted-foreground mt-1">Campaigns from these brands won't appear in your feed</p>
                </div>
                <Button variant="outline" className="w-full h-10 rounded-xl text-sm">Save Preferences</Button>
              </div>
            </CollapsibleSection>
          </div>
        )}

        {/* Connected Accounts */}
        <div className="px-4 mt-3">
          <CollapsibleSection title="Connected Accounts" icon={Globe} expanded={expandedSection === "accounts"} onToggle={() => toggleSection("accounts")}>
            <div className="space-y-1">
              <SettingsRow icon={Instagram} label="Instagram" value="Connected" action="Refresh" />
              <SettingsRow icon={Youtube} label="YouTube" value="Not connected" action="Connect" />
              <SettingsRow icon={Twitter} label="Twitter/X" value="Not connected" action="Connect" />
            </div>
          </CollapsibleSection>
        </div>

        {/* Support */}
        <div className="px-4 mt-3">
          <CollapsibleSection title="Support" icon={HelpCircle} expanded={expandedSection === "support"} onToggle={() => toggleSection("support")}>
            <div className="space-y-1">
              <SettingsRow icon={HelpCircle} label="Help Center" onClick={() => navigate("/support")} />
              <SettingsRow icon={MessageCircle} label="Contact Support" onClick={() => navigate("/support")} />
              <SettingsRow icon={FileText} label="Terms & Conditions" />
              <SettingsRow icon={Shield} label="Privacy Policy" />
            </div>
          </CollapsibleSection>
        </div>

        {/* Danger Zone */}
        <div className="px-4 mt-3 mb-6">
          <CollapsibleSection title="Danger Zone" icon={AlertTriangle} expanded={expandedSection === "danger"} onToggle={() => toggleSection("danger")} destructive>
            <div className="space-y-2">
              <Button variant="outline" className="w-full h-11 rounded-2xl border-destructive/30 text-destructive hover:bg-destructive/5 justify-start" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full h-11 rounded-2xl border-destructive/30 text-destructive/50 hover:bg-destructive/5 justify-start">
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. Your profile, campaigns, and all data will be permanently deleted after a 30-day grace period.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => toast.info("Account deletion request submitted. You have 30 days to cancel.", { duration: 5000 })}>
                      Yes, delete my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CollapsibleSection>
          <p className="text-[10px] text-muted-foreground text-center mt-4">til. v1.0 · Chennai · invite-only</p>
        </div>
      </div>
    </Layout>
  );
};

const CollapsibleSection = ({ title, icon: Icon, expanded, onToggle, destructive, children }: {
  title: string; icon: any; expanded: boolean; onToggle: () => void; destructive?: boolean; children: React.ReactNode;
}) => (
  <div className={`border rounded-2xl overflow-hidden transition-all ${destructive ? "border-destructive/20" : "border-border"}`}>
    <button onClick={onToggle} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary/30 transition-colors">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${destructive ? "bg-destructive/10" : "bg-secondary"}`}>
        <Icon className={`w-4 h-4 ${destructive ? "text-destructive" : "text-muted-foreground"}`} />
      </div>
      <span className={`font-heading font-semibold text-sm flex-1 text-left ${destructive ? "text-destructive" : "text-foreground"}`}>{title}</span>
      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
    </button>
    {expanded && <div className="px-4 pb-4">{children}</div>}
  </div>
);

const SettingsRow = ({ icon: Icon, label, value, action, rightContent, onClick }: {
  icon: any; label: string; value?: string; action?: string; rightContent?: React.ReactNode; onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full rounded-xl p-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors"
  >
    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4 text-muted-foreground" />
    </div>
    <div className="flex-1 text-left min-w-0">
      <p className="font-heading font-medium text-sm text-card-foreground">{label}</p>
      {value && <p className="text-[10px] text-muted-foreground truncate">{value}</p>}
    </div>
    {rightContent || (
      action ? (
        <span className="text-[10px] font-heading font-medium text-accent">{action}</span>
      ) : (
        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
      )
    )}
  </button>
);

export default Settings;
