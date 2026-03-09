import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import {
  ArrowLeft, HelpCircle, MessageCircle, AlertTriangle, Search,
  ChevronRight, Send, Shield, Mail, Phone, Plus,
  ChevronDown
} from "lucide-react";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription,
  DrawerFooter, DrawerTrigger, DrawerClose,
} from "@/components/ui/drawer";

const creatorFaqs = [
  { q: "How do I get approved to join the platform?", a: "Sign up, complete your profile with social handles and follower counts, and submit for review. Our team reviews applications within 24-48 hours. Make sure your profile is complete with a bio, location, and at least one social platform connected." },
  { q: "How does the escrow payment system work?", a: "When a brand accepts you for a campaign, 50% of the payment is placed in escrow. After you deliver approved content, the remaining 50% is released. There's a 7-day dispute window after content goes live. Payments via UPI are instant and free." },
  { q: "What is the level system and how do I level up?", a: "Creator levels (1-6) are based on followers (70%), engagement rate (20%), and completed campaigns (10%). Higher levels unlock premium brands and higher base pay. Level 3+ requires minimum 3% engagement and 5+ completed campaigns." },
  { q: "How long does campaign approval take?", a: "After you apply to a campaign, brands typically review applications within 3-5 days. You'll receive a notification when your application is accepted, rejected, or shortlisted." },
  { q: "Can I apply to multiple campaigns at once?", a: "Yes! You can apply to as many campaigns as you'd like. However, make sure you can deliver quality content on time for each accepted campaign. Overcommitting may affect your platform rating." },
  { q: "What happens if a brand cancels a campaign?", a: "If a brand cancels after accepting you, any escrowed payment is released to you. If cancelled before acceptance, there's no financial impact. Our dispute resolution team handles any issues." },
];

const brandFaqs = [
  { q: "How do I list a campaign?", a: "Go to Campaigns → Create Campaign. Fill in the wizard: basics, budget, target audience, deliverables, and guidelines. You can save as draft or publish immediately. Published campaigns are visible to creators matching your criteria." },
  { q: "How does creator matching work?", a: "Our AI algorithm matches creators based on niche, follower count, engagement rate, location, content style, and past campaign performance. You'll see a match score (0-100%) for each applicant." },
  { q: "What is the platform fee?", a: "Free plan: 5% per campaign. Starter: 3%. Growth: 2%. Enterprise: custom. There are no hidden fees. All pricing is transparent and applied only to successful campaigns." },
  { q: "How do I verify deliverables?", a: "When creators submit content, you'll see it in the campaign management dashboard. Review each deliverable, request revisions (up to 2 per piece), or approve. Approved content triggers the remaining payment release." },
  { q: "Can I run multiple campaigns simultaneously?", a: "Yes! Free plan allows 3 active campaigns, Starter allows 10, Growth allows unlimited. You can manage all campaigns from a single dashboard." },
];

const generalFaqs = [
  { q: "Is the platform free to join?", a: "Yes! Joining TIL is completely free for both creators and brands. Creators pay nothing — the platform fee is charged to brands only on successful campaigns." },
  { q: "How is payment protected?", a: "All payments go through our secure escrow system. Funds are held safely until deliverables are approved. There's a 7-day dispute window, and our mediation team handles any conflicts within 3-5 business days." },
  { q: "What are community guidelines?", a: "All content must comply with ASCI guidelines for sponsored content, Indian advertising standards, and our platform code of conduct. No hate speech, misleading claims, or plagiarized content. Violations may result in account suspension." },
];

const disputeReasons = [
  "Payment not received", "Deliverable unfairly rejected", "Brand not responding",
  "Quality dispute", "Contract violation", "Content removal", "Other",
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
  const [activeSection, setActiveSection] = useState<"faq" | "contact" | "tickets">("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [faqCategory, setFaqCategory] = useState<"creator" | "brand" | "general">("creator");
  const [ticketType, setTicketType] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchDisputes = async () => {
      const { data } = await supabase.from("disputes").select("*").or(`filed_by.eq.${user.id},against_user.eq.${user.id}`).order("created_at", { ascending: false });
      setDisputes(data || []);
      setLoading(false);
    };
    fetchDisputes();
  }, [user]);

  const handleSubmitDispute = async () => {
    if (!user || !reason) return;
    setSubmitting(true);
    const { error } = await supabase.from("disputes").insert({
      filed_by: user.id, against_user: user.id, reason, description, status: "open",
    });
    if (error) { toast.error("Failed to submit dispute"); }
    else {
      toast.success("Dispute submitted!");
      setCreateOpen(false); setReason(""); setDescription("");
      const { data } = await supabase.from("disputes").select("*").or(`filed_by.eq.${user.id},against_user.eq.${user.id}`).order("created_at", { ascending: false });
      setDisputes(data || []);
    }
    setSubmitting(false);
  };

  const handleSubmitTicket = () => {
    if (!ticketSubject || !ticketType) { toast.error("Please fill required fields"); return; }
    toast.success("Ticket submitted! We'll respond within 24 hours.");
    setTicketType(""); setTicketSubject(""); setTicketDesc("");
  };

  const currentFaqs = faqCategory === "creator" ? creatorFaqs : faqCategory === "brand" ? brandFaqs : generalFaqs;
  const filteredFaqs = searchQuery ? currentFaqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase())) : currentFaqs;

  const sampleTickets = [
    { id: "TK-2026-001", subject: "Payment delay for Zomato campaign", status: "In Progress", date: "Mar 7, 2026" },
    { id: "TK-2026-002", subject: "Unable to upload deliverable video", status: "Open", date: "Mar 8, 2026" },
  ];

  return (
    <Layout>
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-heading font-semibold text-lg text-foreground">Help & Support</h1>
      </div>

      {/* Search */}
      <div className="px-4 mt-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search help articles..." className="w-full h-10 pl-9 pr-3 rounded-xl bg-secondary text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-accent/20" />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-3 flex gap-1.5">
        {([
          { id: "faq" as const, label: "FAQ", icon: HelpCircle },
          { id: "contact" as const, label: "Contact", icon: MessageCircle },
          { id: "tickets" as const, label: "Tickets", icon: AlertTriangle },
        ]).map(t => (
          <button key={t.id} onClick={() => setActiveSection(t.id)} className={`flex-1 py-2.5 rounded-xl text-[10px] font-heading font-medium flex items-center justify-center gap-1 transition-all ${activeSection === t.id ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
            <t.icon className="w-3 h-3" /> {t.label}
          </button>
        ))}
      </div>

      {/* FAQ Section */}
      {activeSection === "faq" && (
        <div className="px-4 mt-4 mb-8">
          {/* Category tabs */}
          <div className="flex gap-1.5 mb-3">
            {([
              { id: "creator" as const, label: "For Creators" },
              { id: "brand" as const, label: "For Brands" },
              { id: "general" as const, label: "General" },
            ]).map(c => (
              <button key={c.id} onClick={() => { setFaqCategory(c.id); setOpenFaqIndex(null); }} className={`flex-1 py-2 rounded-lg text-[10px] font-heading font-medium transition-all ${faqCategory === c.id ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {filteredFaqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)} className="w-full flex items-center justify-between p-3.5 text-left">
                  <span className="font-heading font-medium text-sm text-foreground pr-2">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${openFaqIndex === i ? "rotate-180" : ""}`} />
                </button>
                {openFaqIndex === i && (
                  <div className="px-3.5 pb-3.5">
                    <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Section */}
      {activeSection === "contact" && (
        <div className="px-4 mt-4 space-y-3 mb-8">
          {[
            { icon: MessageCircle, label: "Live Chat", desc: "Typically replies in 5 minutes", subtitle: "Online now", online: true },
            { icon: Mail, label: "Email Support", desc: "support@connectandcreate.in", subtitle: "Response within 24 hours", online: false },
            { icon: Phone, label: "WhatsApp Support", desc: "+91 98765 43210", subtitle: "Available 9AM–9PM IST", online: false },
          ].map((item, i) => (
            <div key={i} className="border border-border rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 relative">
                <item.icon className="w-5 h-5 text-accent" />
                {item.online && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />}
              </div>
              <div className="flex-1">
                <p className="font-heading font-semibold text-sm text-foreground">{item.label}</p>
                <p className="text-xs text-accent">{item.desc}</p>
                <p className="text-[10px] text-muted-foreground">{item.subtitle}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}

          {/* Raise Ticket Form */}
          <div className="border border-border rounded-xl p-4 mt-4">
            <p className="font-heading font-semibold text-sm text-foreground mb-3">Raise a Ticket</p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Type</label>
                <select value={ticketType} onChange={e => setTicketType(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-secondary text-foreground text-sm border border-border">
                  <option value="">Select type</option>
                  <option>Creator Issue</option>
                  <option>Brand Issue</option>
                  <option>Payment</option>
                  <option>Technical</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Subject</label>
                <Input value={ticketSubject} onChange={e => setTicketSubject(e.target.value)} placeholder="Brief description of your issue" className="h-10 rounded-lg" />
              </div>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Description</label>
                <textarea value={ticketDesc} onChange={e => setTicketDesc(e.target.value)} rows={3} placeholder="Describe your issue in detail..." className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground text-sm border border-border resize-none" />
              </div>
              <Button className="w-full h-10 rounded-xl text-xs font-heading" onClick={handleSubmitTicket}>
                <Send className="w-3.5 h-3.5 mr-1.5" /> Submit Ticket
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tickets Section */}
      {activeSection === "tickets" && (
        <div className="px-4 mt-4 mb-8 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-heading font-semibold text-foreground">Your Tickets</p>
            <Drawer open={createOpen} onOpenChange={setCreateOpen}>
              <DrawerTrigger asChild>
                <Button size="sm" className="h-7 text-[10px] rounded-lg"><Plus className="w-3 h-3 mr-1" /> File Dispute</Button>
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
                        <button key={r} onClick={() => setReason(r)} className={`p-2 rounded-xl text-[10px] font-heading font-medium transition-all ${reason === r ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>{r}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the issue..." rows={4} className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm border border-border resize-none" />
                  </div>
                </div>
                <DrawerFooter>
                  <Button className="w-full h-12 rounded-2xl font-heading" disabled={!reason || submitting} onClick={handleSubmitDispute}>
                    <Send className="w-4 h-4" /> Submit
                  </Button>
                  <DrawerClose asChild><Button variant="outline" className="w-full rounded-2xl">Cancel</Button></DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Sample Tickets */}
          {sampleTickets.map((t, i) => (
            <div key={i} className="border border-border rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-heading font-semibold text-sm text-foreground">{t.subject}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t.id} · {t.date}</p>
                </div>
                <Badge className={`text-[9px] border-0 ${t.status === "Open" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"}`}>{t.status}</Badge>
              </div>
            </div>
          ))}

          {/* Real Disputes */}
          {disputes.length > 0 && (
            <>
              <p className="text-xs font-heading font-semibold text-foreground mt-4">Disputes</p>
              {disputes.map((d) => (
                <div key={d.id} className="border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-heading font-semibold text-sm text-foreground">{d.reason}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Filed {new Date(d.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                    </div>
                    <Badge className={`text-[9px] border-0 ${d.status === "open" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" : d.status === "resolved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-secondary text-muted-foreground"}`}>
                      {d.status}
                    </Badge>
                  </div>
                  {d.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{d.description}</p>}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Support;
