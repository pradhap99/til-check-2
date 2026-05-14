import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { ArrowLeft, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sections = [
  { id: "levels", label: "Creator Levels" },
  { id: "escrow", label: "Escrow Rules" },
  { id: "campaigns", label: "Campaign & Perks" },
  { id: "affiliate", label: "Affiliate Program" },
  { id: "policies", label: "Platform Policies" },
];

const levels = [
  { emoji: "✨", name: "Rising Star", level: 1, followers: "0 — 5,000", req: "Account created, profile 50%+ complete", unlocks: "Basic paid campaigns (up to ₹5K), all Perks campaigns (Level 1)", pay: "₹3,000 — ₹15,000 per campaign" },
  { emoji: "🌟", name: "Micro Influencer", level: 2, followers: "5,000 — 25,000", req: "5,000+ followers OR 3+ completed campaigns", unlocks: "Mid-tier paid campaigns (up to ₹25K), Level 2 Perks, Dining & Staycation campaigns", pay: "₹10,000 — ₹40,000 per campaign" },
  { emoji: "🔥", name: "Content Creator", level: 3, followers: "25,000 — 1,00,000", req: "25,000+ followers OR 10+ completed campaigns + 3.5%+ engagement rate", unlocks: "Premium brand campaigns, affiliate program access, Priority support", pay: "₹35,000 — ₹1,00,000 per campaign" },
  { emoji: "💫", name: "Brand Partner", level: 4, followers: "1L — 5L", req: "1,00,000+ followers OR 25+ campaigns + 4%+ engagement", unlocks: "Exclusive brand partnerships, advance payout option, dedicated account manager", pay: "₹80,000 — ₹5,00,000 per campaign" },
  { emoji: "👑", name: "Top Creator", level: 5, followers: "5L+", req: "5,00,000+ followers OR top 1% engagement in category", unlocks: "All features, custom deal negotiation, til. Ambassador status", pay: "₹3,00,000+ per campaign (negotiable)" },
  { emoji: "🥇", name: "Elite", level: 6, followers: "Invitation only", req: "Invitation only — til. verified celebrity/macro creator", unlocks: "White-glove service, priority brand matching, til. Elite badge on profile", pay: "Custom" },
];

const validationRules = [
  "Levels are reviewed every 30 days automatically",
  "Follower count is verified via connected social account (Instagram/YouTube)",
  "Engagement rate = avg likes+comments / followers over last 30 posts",
  "Completed campaigns count only if brand confirms delivery",
  "Fraudulent follower detection: if >30% fake followers detected, level is frozen",
  "Level downgrade: if followers drop below tier threshold for 60 consecutive days",
];

const escrowRules = [
  "Brand funds 100% of campaign payout into til. escrow BEFORE creator is contacted",
  "Funds are held by til. until milestones are verified — creators receive nothing upfront",
  "Each campaign has brand-defined milestones (1 to 5 milestones, must total 100%)",
  "Milestone verification: til. team reviews submitted deliverables within 48 hours",
  "On milestone approval: corresponding % is released to creator's til. wallet instantly",
  "Auto-release: if brand does not raise a dispute within 14 days of milestone submission, funds auto-release",
  "Dispute window: 7 days after each milestone release for brand to raise a quality dispute",
  "In case of dispute: til. mediates. Decision within 5 business days. til.'s decision is final.",
  "Cancellation by brand before campaign start: 100% refund to brand",
  "Cancellation by creator after acceptance: 10% penalty held by til., rest refunded to brand",
  "Perks campaigns: benefits are verified and confirmed by brand directly. til. records the transaction.",
  "til. platform fee: 15% of total campaign payout, deducted from brand's escrow deposit",
];

const paidCampaignRules = [
  "Campaign goes live only after brand escrow is fully funded",
  "Creators can apply within the campaign application window",
  "Brand reviews and accepts/declines within 5 business days",
  "Accepted creators receive campaign brief via in-app messaging",
  "Deliverables must be submitted via til. app (upload link or content URL)",
  "Campaign dates are binding — late submissions may forfeit milestone payment",
];

const perksCampaignRules = [
  "Available to creators from Level 1 (basic perks) and Level 2+ (premium perks)",
  "No monetary payout — benefits include: meals, vouchers, event invites, merchandise, subscriptions",
  "Minimum Level requirement is set by the brand/venue",
  "Creator must check in physically OR submit proof of visit/content",
  "Perks cannot be exchanged for cash",
  "Max 2 active Perks campaigns simultaneously per creator",
  "Brands/venues validate perk delivery directly and confirm in-app",
];

const affiliateRules = [
  "Any creator at Level 3+ can access affiliate deals",
  "Creator receives a unique tracked link per offer",
  "Commission is credited to til. wallet 30 days after the sale (returns window)",
  "til. takes a 2% platform fee on all affiliate commissions",
  "Minimum withdrawal: ₹500 affiliate balance",
  "Links are valid for 90 days from generation",
  "Fraudulent clicks or self-purchases result in account suspension",
  "Commission rates are set by the brand and vary per offer",
];

const platformPolicies = [
  "til. is a marketplace connecting creators and brands — we do not employ creators",
  "All content must follow Instagram/YouTube community guidelines",
  "Misleading or undisclosed sponsored content is prohibited (ASCI guidelines apply)",
  "til. reserves the right to suspend accounts for policy violations",
  "Data privacy: creator social data is used only for level calculation and is never sold",
  "Dispute resolution is binding and final per til. Terms of Service",
  "til. is not responsible for brand or venue closures affecting Perks campaigns",
];

const Documentation = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("levels");

  return (
    <Layout>
      <div className="page-transition">
        <header className="px-5 pt-6 pb-2 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-heading font-bold text-foreground">til. Documentation</h1>
              <Badge className="bg-accent/10 text-accent border-0 text-[9px]">v1.0</Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">Last updated: March 2026</p>
          </div>
        </header>

        {/* Section Tabs */}
        <div className="px-5 mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-heading font-medium whitespace-nowrap shrink-0 transition-colors ${
                activeSection === s.id ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="px-5 mt-4 pb-8">
          {/* SECTION 1: Creator Levels */}
          {activeSection === "levels" && (
            <div className="space-y-4 animate-fade-slide-up">
              <div>
                <h2 className="text-base font-heading font-bold text-foreground">Creator Levels System</h2>
                <p className="text-xs text-muted-foreground mt-0.5">How your level is calculated and what it unlocks</p>
              </div>

              <div className="space-y-3">
                {levels.map((lv, i) => (
                  <div key={i} className="border border-border rounded-xl p-4 border-l-4 border-l-accent animate-fade-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{lv.emoji}</span>
                      <div>
                        <p className="text-sm font-heading font-bold text-foreground">Level {lv.level} — {lv.name}</p>
                        <p className="text-[10px] text-muted-foreground">Followers: {lv.followers}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 mt-2">
                      <div>
                        <p className="text-[10px] text-accent font-heading font-semibold uppercase">Requirements</p>
                        <p className="text-xs text-muted-foreground">{lv.req}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-accent font-heading font-semibold uppercase">Unlocks</p>
                        <p className="text-xs text-muted-foreground">{lv.unlocks}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-accent font-heading font-semibold uppercase">Base Pay</p>
                        <p className="text-xs text-foreground font-heading font-medium">{lv.pay}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-heading font-bold text-foreground mb-2">Validation Rules</h3>
                <div className="space-y-2">
                  {validationRules.map((rule, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[10px] font-heading font-bold text-accent w-5 shrink-0 mt-0.5">•</span>
                      <p className="text-xs text-muted-foreground">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Escrow Rules */}
          {activeSection === "escrow" && (
            <div className="space-y-4 animate-fade-slide-up">
              <div>
                <h2 className="text-base font-heading font-bold text-foreground">Escrow & Payment Rules</h2>
                <p className="text-xs text-muted-foreground mt-0.5">How til. holds and releases campaign payments</p>
              </div>
              <div className="space-y-2.5">
                {escrowRules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-3 animate-fade-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
                    <span className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center text-[10px] font-heading font-bold text-accent shrink-0">{i + 1}</span>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: Campaign & Perks */}
          {activeSection === "campaigns" && (
            <div className="space-y-5 animate-fade-slide-up">
              <div>
                <h2 className="text-base font-heading font-bold text-foreground">Campaign Rules & Perks Validation</h2>
              </div>
              <div>
                <h3 className="text-sm font-heading font-bold text-foreground mb-2">Paid Campaigns</h3>
                <div className="space-y-2">
                  {paidCampaignRules.map((rule, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[10px] font-heading font-bold text-accent w-5 shrink-0 mt-0.5">•</span>
                      <p className="text-xs text-muted-foreground">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-heading font-bold text-foreground mb-2">Perks Campaigns</h3>
                <div className="space-y-2">
                  {perksCampaignRules.map((rule, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[10px] font-heading font-bold text-emerald-500 w-5 shrink-0 mt-0.5">•</span>
                      <p className="text-xs text-muted-foreground">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: Affiliate */}
          {activeSection === "affiliate" && (
            <div className="space-y-4 animate-fade-slide-up">
              <div>
                <h2 className="text-base font-heading font-bold text-foreground">Affiliate Program</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Earn passive commissions by sharing brand links</p>
              </div>
              <div className="space-y-2.5">
                {affiliateRules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-3 animate-fade-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
                    <span className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center text-[10px] font-heading font-bold text-accent shrink-0">{i + 1}</span>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: Platform Policies */}
          {activeSection === "policies" && (
            <div className="space-y-4 animate-fade-slide-up">
              <div>
                <h2 className="text-base font-heading font-bold text-foreground">Platform Policies</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Terms and guidelines for using til.</p>
              </div>
              <div className="space-y-2">
                {platformPolicies.map((rule, i) => (
                  <div key={i} className="flex items-start gap-2 animate-fade-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
                    <span className="text-[10px] font-heading font-bold text-accent w-5 shrink-0 mt-0.5">•</span>
                    <p className="text-xs text-muted-foreground">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;
