import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";

// There are no published creator stories yet. This page deliberately renders an honest empty state
// instead of invented quotes or results. Wire it to real, consented stories when they exist.
const SuccessStories = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="page-transition">
        <header className="px-5 pt-6 pb-2 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-heading font-bold text-foreground">Creator Stories</h1>
            <p className="text-[10px] text-muted-foreground">Stories from creators on TIL</p>
          </div>
        </header>

        <div className="px-5 mt-8 pb-6">
          <div className="border border-dashed border-border rounded-2xl p-8 text-center animate-fade-slide-up">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
              <Star className="w-5 h-5 text-accent" />
            </div>
            <p className="font-heading font-semibold text-sm text-foreground">No stories yet</p>
            <p className="text-xs text-muted-foreground mt-1.5">Finish a campaign and yours could be the first.</p>
            <Button size="sm" variant="outline" className="mt-4 h-9 rounded-xl text-xs font-heading" onClick={() => navigate("/campaigns")}>
              Browse campaigns
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SuccessStories;
