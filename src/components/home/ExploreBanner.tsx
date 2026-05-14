import { useNavigate } from "react-router-dom";
import { Sparkles, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ExploreBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="px-5 mt-4">
      <div
        className="relative rounded-2xl overflow-hidden p-5 h-[140px] flex flex-col justify-center"
        style={{ background: "linear-gradient(135deg, hsl(var(--champagne-deep)) 0%, hsl(var(--onyx)) 60%, hsl(var(--onyx-elev)) 100%)" }}
      >
        {/* Corner sparkle */}
        <Sparkles className="absolute top-4 right-4 w-5 h-5 text-accent/60" />

        {/* Subtle glow accent */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />

        <h2 className="font-heading font-bold text-[22px] leading-tight text-white relative z-10">
          Explore Chennai's
        </h2>
        <h2
          className="font-heading font-bold text-[28px] leading-tight relative z-10"
          style={{
            background: "linear-gradient(90deg, hsl(45,93%,58%), hsl(35,90%,50%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Top Brands
        </h2>

        <Button
          onClick={() => navigate("/campaigns")}
          className="mt-3 w-fit h-9 rounded-xl text-[11px] font-heading font-bold gap-1.5 relative z-10 collab-btn-glow"
          style={{
            background: "linear-gradient(90deg, hsl(45,93%,52%), hsl(35,90%,45%))",
            color: "hsl(var(--onyx))",
          }}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          LET'S COLLAB!
        </Button>
      </div>
    </section>
  );
};

export default ExploreBanner;
