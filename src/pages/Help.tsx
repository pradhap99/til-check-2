import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { ArrowLeft, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const helpSections = [
  {
    id: "what-is-til",
    title: "What is TIL?",
    content: "TIL (The Influencer League) is India's premier creator economy platform connecting brands with creators for paid campaigns, barter collaborations, and affiliate deals. We handle discovery, escrow payments, and performance tracking — so both sides can focus on creating great content.",
  },
  {
    id: "escrow",
    title: "How does Escrow work?",
    content: "When a brand posts a campaign, they fund 100% of the payout into TIL's smart escrow. Money is released in milestones based on engagement: 30% on content publication + 500 engagements, 40% on reaching 2,000 engagements within 7 days, and the final 30% on campaign completion with brand approval. If no dispute is filed, funds auto-release after 14 days. This protects both creators and brands.",
  },
  {
    id: "perks",
    title: "What are Perks Campaigns?",
    content: "Perks campaigns are non-monetary collaborations where creators receive benefits like free meals, product samples, event invitations, vouchers, or subscriptions instead of cash. These are great for building your portfolio and brand relationships. Access to premium perks depends on your creator level — higher levels unlock better opportunities.",
  },
  {
    id: "levels",
    title: "How are Creator Levels determined?",
    content: "Your creator level is calculated from three factors: follower count (70% weight), engagement rate (20%), and completed campaigns (10%). There are 6 levels: Rising Star (✨), Micro Influencer (🌟), Content Creator (🔥), Brand Partner (💫), Top Creator (👑), and Elite (🥇). Higher levels unlock access to premium campaigns, better payout rates, and exclusive perks. Level 3+ requires a minimum 3% engagement rate and 5 completed campaigns.",
  },
  {
    id: "affiliate",
    title: "What is the Affiliate Program?",
    content: "TIL's affiliate program lets creators earn passive income by sharing branded links with their audience. Every sale made through your link earns you a commission (typically 6-12% depending on the brand). TIL tracks all conversions automatically and credits earnings to your wallet. A 2% platform fee applies to each affiliate transaction.",
  },
  {
    id: "vouchers",
    title: "How do Vouchers work?",
    content: "When you redeem your wallet balance as vouchers (Amazon, Flipkart, Swiggy, etc.), you get up to 20% bonus value — meaning ₹10,000 balance becomes ₹12,000 in vouchers. This is significantly better than a direct bank transfer where you receive the exact amount. Vouchers are delivered instantly to your email.",
  },
];

const Help = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="page-transition">
        <header className="px-5 pt-6 pb-2 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-heading font-bold text-foreground">How TIL Works</h1>
            <p className="text-[10px] text-muted-foreground">Everything you need to know</p>
          </div>
        </header>

        <div className="px-5 mt-4 pb-6">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {helpSections.map((section, i) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border border-border rounded-xl px-4 animate-fade-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <AccordionTrigger className="text-sm font-heading font-semibold text-foreground hover:no-underline py-3">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-3">
                  {section.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
