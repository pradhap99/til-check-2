import { useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  ArrowLeft, Bell, Shield, Eye, Globe, Key, Smartphone, LogOut,
  Trash2, Moon, Sun, HelpCircle, MessageCircle, Mail, ChevronRight,
  Instagram, Youtube, Twitter, CreditCard, FileText, Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  // Notification preferences (local state - would persist to DB in production)
  const [emailCampaigns, setEmailCampaigns] = useState(true);
  const [emailPayments, setEmailPayments] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [profilePublic, setProfilePublic] = useState(true);
  const [messagesFrom, setMessagesFrom] = useState("both");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleDeleteAccount = () => {
    toast.info("Account deletion request submitted. You have 30 days to cancel.", { duration: 5000 });
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-4 flex items-center gap-3 sticky top-0 bg-background z-10 pb-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-heading font-semibold text-sm text-foreground">Settings</h1>
      </div>

      {/* Account */}
      <div className="px-4 mt-2">
        <SectionTitle title="Account" />
        <div className="space-y-1">
          <SettingsRow icon={Mail} label="Email" value={user?.email || "—"} />
          <SettingsRow icon={Smartphone} label="Phone" value="Not set" action="Add" />
          <SettingsRow icon={Key} label="Password" value="••••••••" action="Change" onClick={() => toast.info("Password reset link sent to your email")} />
          <SettingsRow icon={Shield} label="Two-Factor Auth" rightContent={<Switch checked={false} />} />
        </div>
      </div>

      {/* Notifications */}
      <div className="px-4 mt-5">
        <SectionTitle title="Notifications" />
        <div className="space-y-1">
          <SettingsRow icon={Smartphone} label="Push Notifications" rightContent={<Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />} />
          <SettingsRow icon={Mail} label="Campaign Email Alerts" rightContent={<Switch checked={emailCampaigns} onCheckedChange={setEmailCampaigns} />} />
          <SettingsRow icon={CreditCard} label="Payment Email Alerts" rightContent={<Switch checked={emailPayments} onCheckedChange={setEmailPayments} />} />
          <SettingsRow icon={MessageCircle} label="SMS/WhatsApp Alerts" rightContent={<Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />} />
          <SettingsRow icon={FileText} label="Weekly Digest" rightContent={<Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />} />
        </div>
      </div>

      {/* Privacy */}
      <div className="px-4 mt-5">
        <SectionTitle title="Privacy & Visibility" />
        <div className="space-y-1">
          <SettingsRow icon={Eye} label="Profile Visibility" rightContent={
            <Badge variant="secondary" className="text-[10px]">{profilePublic ? "Public" : "Hidden"}</Badge>
          } onClick={() => { setProfilePublic(!profilePublic); toast.success(`Profile set to ${!profilePublic ? "public" : "hidden"}`); }} />
          <SettingsRow icon={Users} label="Who Can Message Me" value={messagesFrom === "both" ? "Everyone" : messagesFrom === "brands" ? "Brands only" : "Creators only"} onClick={() => {
            const next = messagesFrom === "both" ? "brands" : messagesFrom === "brands" ? "creators" : "both";
            setMessagesFrom(next);
          }} />
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="px-4 mt-5">
        <SectionTitle title="Connected Accounts" />
        <div className="space-y-1">
          <SettingsRow icon={Instagram} label="Instagram" value="Connected" action="Refresh" />
          <SettingsRow icon={Youtube} label="YouTube" value="Not connected" action="Connect" />
          <SettingsRow icon={Twitter} label="Twitter/X" value="Not connected" action="Connect" />
        </div>
      </div>

      {/* Billing */}
      {role === "creator" && (
        <div className="px-4 mt-5">
          <SectionTitle title="Billing & Tax" />
          <div className="space-y-1">
            <SettingsRow icon={CreditCard} label="GST Details" value="Not set" action="Add" onClick={() => navigate("/profile/edit")} />
            <SettingsRow icon={FileText} label="PAN Number" value="Not set" action="Add" onClick={() => navigate("/profile/edit")} />
            <SettingsRow icon={CreditCard} label="Bank Account" value="Not set" action="Add" onClick={() => navigate("/profile/edit")} />
          </div>
        </div>
      )}

      {/* Support */}
      <div className="px-4 mt-5">
        <SectionTitle title="Support" />
        <div className="space-y-1">
          <SettingsRow icon={HelpCircle} label="Help Center" onClick={() => navigate("/support")} />
          <SettingsRow icon={MessageCircle} label="Contact Support" onClick={() => navigate("/support")} />
          <SettingsRow icon={FileText} label="Terms & Conditions" />
          <SettingsRow icon={Shield} label="Privacy Policy" />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="px-4 mt-5 mb-6">
        <SectionTitle title="Danger Zone" />
        <div className="space-y-2">
          <Button variant="outline" className="w-full h-11 rounded-2xl border-destructive/30 text-destructive hover:bg-destructive/5 justify-start" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
          <Button variant="outline" className="w-full h-11 rounded-2xl border-destructive/30 text-destructive/50 hover:bg-destructive/5 justify-start" onClick={handleDeleteAccount}>
            <Trash2 className="w-4 h-4" /> Delete Account
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-4">TIL v1.0 • India's #1 Creator Marketplace</p>
      </div>
    </div>
  );
};

const SectionTitle = ({ title }: { title: string }) => (
  <p className="text-[10px] font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">{title}</p>
);

const SettingsRow = ({ icon: Icon, label, value, action, rightContent, onClick }: {
  icon: any; label: string; value?: string; action?: string; rightContent?: React.ReactNode; onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full glass-card rounded-xl p-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors"
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
        <span className="text-[10px] font-heading font-medium text-primary">{action}</span>
      ) : (
        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
      )
    )}
  </button>
);

export default Settings;
