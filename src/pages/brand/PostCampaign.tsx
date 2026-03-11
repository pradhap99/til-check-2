import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import BrandBottomNav from "@/components/BrandBottomNav";

const niches = ["Fashion", "Beauty", "Tech", "Food", "Lifestyle", "Fitness", "Travel", "Comedy"];

const PostCampaign = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "", brand: "", category: "Fashion", type: "Paid", description: "",
    minFollowers: 10000, niches: [] as string[], payoutMin: "", payoutMax: "",
    creatorCount: "", startDate: "", endDate: "", location: "",
    milestones: [{ description: "", percentage: "" }] as { description: string; percentage: string }[],
  });

  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));
  const toggleNiche = (n: string) => set("niches", form.niches.includes(n) ? form.niches.filter(x => x !== n) : [...form.niches, n]);

  const handlePost = () => {
    toast.success("Campaign posted successfully!");
    navigate("/brand/dashboard");
  };

  const formatFollowers = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : `${n}`;

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20 max-w-lg mx-auto">
        <div className="page-transition">
          <header className="px-5 pt-6 pb-2 flex items-center gap-3">
            <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-heading font-bold text-foreground">Post Campaign</h1>
              <p className="text-[10px] text-muted-foreground">Step {step} of 3</p>
            </div>
          </header>

          <div className="px-5 mt-3">
            <Progress value={(step / 3) * 100} className="h-1.5" />
          </div>

          <div className="px-5 mt-5 space-y-4 pb-6">
            {step === 1 && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs">Campaign Title</Label>
                  <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Summer Fashion Drop" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Brand Name</Label>
                  <Input value={form.brand} onChange={e => set("brand", e.target.value)} placeholder="Your brand name" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Fashion", "Beauty", "Tech", "Food", "Lifestyle"].map(c => (
                      <button key={c} onClick={() => set("category", c)} className={`px-3 py-1.5 rounded-full text-xs font-heading ${form.category === c ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Campaign Type</Label>
                  <div className="flex gap-2">
                    {["Paid", "Barter", "Both"].map(t => (
                      <button key={t} onClick={() => set("type", t)} className={`flex-1 py-2.5 rounded-xl text-xs font-heading font-medium ${form.type === t ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Description</Label>
                  <Textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="What are you looking for?" rows={3} />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs">Min Followers: {formatFollowers(form.minFollowers)}</Label>
                  <input type="range" min={1000} max={1000000} step={1000} value={form.minFollowers} onChange={e => set("minFollowers", Number(e.target.value))} className="w-full accent-amber-500" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Niche Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {niches.map(n => (
                      <button key={n} onClick={() => toggleNiche(n)} className={`px-3 py-1.5 rounded-full text-xs font-heading ${form.niches.includes(n) ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Payout Min (₹)</Label>
                    <Input value={form.payoutMin} onChange={e => set("payoutMin", e.target.value)} type="number" placeholder="₹10,000" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Payout Max (₹)</Label>
                    <Input value={form.payoutMax} onChange={e => set("payoutMax", e.target.value)} type="number" placeholder="₹50,000" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Number of Creators</Label>
                  <Input value={form.creatorCount} onChange={e => set("creatorCount", e.target.value)} type="number" placeholder="e.g. 10" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Start Date</Label>
                    <Input value={form.startDate} onChange={e => set("startDate", e.target.value)} type="date" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">End Date</Label>
                    <Input value={form.endDate} onChange={e => set("endDate", e.target.value)} type="date" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Location</Label>
                  <Input value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Mumbai, Delhi" />
                </div>

                {/* Define Milestones */}
                <div className="space-y-2">
                  <Label className="text-xs">Define Milestones (must total 100%)</Label>
                  {form.milestones.map((ms, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <Input
                        className="flex-1"
                        value={ms.description}
                        onChange={e => {
                          const updated = [...form.milestones];
                          updated[i] = { ...updated[i], description: e.target.value };
                          set("milestones", updated);
                        }}
                        placeholder={`Milestone ${i + 1} KPI`}
                      />
                      <div className="w-20 relative">
                        <Input
                          value={ms.percentage}
                          onChange={e => {
                            const updated = [...form.milestones];
                            updated[i] = { ...updated[i], percentage: e.target.value };
                            set("milestones", updated);
                          }}
                          placeholder="%"
                          type="number"
                        />
                      </div>
                      {form.milestones.length > 1 && (
                        <button
                          onClick={() => set("milestones", form.milestones.filter((_, j) => j !== i))}
                          className="text-destructive text-xs mt-2"
                        >✕</button>
                      )}
                    </div>
                  ))}
                  {form.milestones.length < 5 && (
                    <button
                      onClick={() => set("milestones", [...form.milestones, { description: "", percentage: "" }])}
                      className="text-xs text-accent font-heading font-medium"
                    >+ Add Milestone</button>
                  )}
                  {(() => {
                    const total = form.milestones.reduce((s, m) => s + (parseInt(m.percentage) || 0), 0);
                    return (
                      <p className={`text-[10px] font-heading ${total === 100 ? "text-emerald-500" : "text-accent"}`}>
                        Total: {total}%{total !== 100 && ` — need ${100 - total}% more`}
                      </p>
                    );
                  })()}
                </div>
              </>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-sm text-foreground">Review Campaign</h3>
                {[
                  ["Title", form.title], ["Brand", form.brand], ["Category", form.category],
                  ["Type", form.type], ["Min Followers", formatFollowers(form.minFollowers)],
                  ["Niches", form.niches.join(", ") || "—"], ["Payout", `₹${form.payoutMin} – ₹${form.payoutMax}`],
                  ["Creators", form.creatorCount || "—"], ["Dates", `${form.startDate} to ${form.endDate}` || "—"],
                  ["Location", form.location || "—"],
                ].map(([label, val], i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-xs font-heading font-medium text-foreground text-right max-w-[60%] truncate">{val}</span>
                  </div>
                ))}
                <div className="pt-2 space-y-2">
                  <Button className="w-full h-11 rounded-xl font-heading bg-accent hover:bg-accent/90 text-accent-foreground btn-hover-lift" onClick={handlePost}>
                    Post Campaign
                  </Button>
                </div>
              </div>
            )}

            {step < 3 && (
              <Button className="w-full h-11 rounded-xl font-heading bg-accent hover:bg-accent/90 text-accent-foreground btn-hover-lift" onClick={() => setStep(s => s + 1)}>
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
      <BrandBottomNav />
    </div>
  );
};

export default PostCampaign;
