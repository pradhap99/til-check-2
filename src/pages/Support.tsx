import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft, HelpCircle, MessageCircle, AlertTriangle, FileText,
  ChevronRight, Send, Shield, CreditCard, Briefcase, Plus, Mail
} from "lucide-react";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger, DrawerClose,
} from "@/components/ui/drawer";

const disputeReasons = [
  "Payment not received",
  "Deliverable unfairly rejected",
  "Brand not responding",
  "Quality dispute",
  "Contract violation",
  "Content removal",
  "Other",
];

const faqItems = [
  { q: "How do I get paid?", a: "Payments are processed via UPI (instant, 0% fee) or bank transfer (1-2 days). 50% upfront on acceptance, 50% after deliverables approved." },
  { q: "What if a brand doesn't pay?", a: "TIL holds all payments in escrow. If a brand withholds payment after approved deliverables, file a dispute and our team will review within 3-5 business days." },
  { q: "How long is the dispute window?", a: "7 days after content publication. After this window, payments auto-release to the creator." },
  { q: "Is GST mandatory?", a: "GST registration is optional but recommended for creators earning ₹40L+/year. TIL auto-generates compliant invoices." },
  { q: "Can I cancel a campaign?", a: "Creators can withdraw before content submission. After submission, cancellation requires mutual agreement or dispute resolution." },
  { q: "How does TDS work?", a: "For payments ≥₹30,000, TDS is deducted as per Indian tax law. You'll receive a TDS certificate for your tax filing." },
];

const Support = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<"faq" | "disputes" | "contact">("faq");

  useEffect(() => {
    if (!user) return;
    const fetchDisputes = async () => {
      const { data } = await supabase
        .from("disputes")
        .select("*")
        .or(`filed_by.eq.${user.id},against_user.eq.${user.id}`)
        .order("created_at", { ascending: false });
      setDisputes(data || []);
      setLoading(false);
    };
    fetchDisputes();
  }, [user]);

  const handleSubmitDispute = async () => {
    if (!user || !reason) return;
    setSubmitting(true);
    const { error } = await supabase.from("disputes").insert({
      filed_by: user.id,
      against_user: user.id, // Placeholder - in production would be the other party
      reason,
      description,
      status: "open",
    });
    if (error) {
      toast.error("Failed to submit dispute");
    } else {
      toast.success("Dispute submitted! Our team will review it within 3-5 business days.");
      setCreateOpen(false);
      setReason("");
      setDescription("");
      // Refresh
      const { data } = await supabase.from("disputes").select("*").or(`filed_by.eq.${user.id},against_user.eq.${user.id}`).order("created_at", { ascending: false });
      setDisputes(data || []);
    }
    setSubmitting(false);
  };

  const statusConfig: Record<string, { color: string; label: string }> = {
    open: { color: "bg-yellow-500/10 text-yellow-600", label: "Open" },
    in_review: { color: "bg-accent/10 text-accent", label: "In Review" },
    resolved: { color: "bg-primary/10 text-primary", label: "Resolved" },
    closed: { color: "bg-secondary text-muted-foreground", label: "Closed" },
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-heading font-semibold text-sm text-foreground">Help & Support</h1>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4 flex gap-1.5">
        {([
          { id: "faq", label: "FAQ", icon: HelpCircle },
          { id: "disputes", label: "Disputes", icon: AlertTriangle },
          { id: "contact", label: "Contact", icon: MessageCircle },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setActiveSection(t.id)} className={`flex-1 py-2.5 rounded-xl text-[10px] font-heading font-medium flex items-center justify-center gap-1 transition-all ${activeSection === t.id ? "gradient-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground"}`}>
            <t.icon className="w-3 h-3" /> {t.label}
          </button>
        ))}
      </div>

      {/* FAQ Section */}
      {activeSection === "faq" && (
        <div className="px-4 mt-4 space-y-2 mb-8">
          {faqItems.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
          ))}
        </div>
      )}

      {/* Disputes Section */}
      {activeSection === "disputes" && (
        <div className="px-4 mt-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-sm text-foreground">Your Disputes</h3>
            <Drawer open={createOpen} onOpenChange={setCreateOpen}>
              <DrawerTrigger asChild>
                <Button size="sm" variant="gradient" className="h-8 text-xs rounded-xl">
                  <Plus className="w-3 h-3" /> File Dispute
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className="font-heading">File a Dispute</DrawerTitle>
                  <DrawerDescription>Our team will review within 3-5 business days</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 space-y-3">
                  <div>
                    <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Reason</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {disputeReasons.map(r => (
                        <button key={r} onClick={() => setReason(r)} className={`p-2 rounded-xl text-[10px] font-heading font-medium transition-all ${reason === r ? "gradient-primary text-primary-foreground shadow-md" : "bg-secondary text-secondary-foreground"}`}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the issue in detail..." rows={4} className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  </div>
                </div>
                <DrawerFooter>
                  <Button variant="gradient" className="w-full h-12 rounded-2xl font-heading" disabled={!reason || submitting} onClick={handleSubmitDispute}>
                    <Send className="w-4 h-4" /> Submit Dispute
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full rounded-2xl">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 rounded-xl gradient-primary animate-pulse-glow mx-auto" />
            </div>
          ) : disputes.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-heading font-medium text-muted-foreground">No disputes</p>
              <p className="text-xs text-muted-foreground mt-1">Everything looks good! 🎉</p>
            </div>
          ) : (
            <div className="space-y-2">
              {disputes.map((d, i) => {
                const config = statusConfig[d.status] || statusConfig.open;
                return (
                  <div key={d.id} className="glass-card rounded-2xl p-4 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-heading font-semibold text-sm text-card-foreground">{d.reason}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Filed {new Date(d.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <Badge className={`${config.color} border-0 text-[9px] font-heading`}>{config.label}</Badge>
                    </div>
                    {d.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{d.description}</p>}
                    {d.resolution_notes && (
                      <div className="mt-2 p-2 rounded-lg bg-primary/5">
                        <p className="text-[10px] text-primary font-heading font-medium">Resolution: {d.resolution_notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Contact Section */}
      {activeSection === "contact" && (
        <div className="px-4 mt-4 space-y-3 mb-8">
          {[
            { icon: Mail, label: "Email Support", desc: "support@til.com", subtitle: "Response within 24 hours" },
            { icon: MessageCircle, label: "WhatsApp Support", desc: "+91 98765 43210", subtitle: "Mon-Sat, 10AM-7PM" },
            { icon: HelpCircle, label: "Community Forum", desc: "Join discussions", subtitle: "Connect with other creators" },
          ].map((item, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 flex items-center gap-3 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}>
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-heading font-semibold text-sm text-card-foreground">{item.label}</p>
                <p className="text-xs text-primary">{item.desc}</p>
                <p className="text-[10px] text-muted-foreground">{item.subtitle}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FAQItem = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card rounded-xl overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: `${index * 60}ms`, animationFillMode: "forwards" }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3.5 text-left">
        <span className="font-heading font-medium text-sm text-card-foreground pr-2">{question}</span>
        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="px-3.5 pb-3.5">
          <p className="text-xs text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default Support;
