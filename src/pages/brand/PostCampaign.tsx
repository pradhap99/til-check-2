import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Gift, IndianRupee, Sparkles, Plus, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import BrandBottomNav from "@/components/BrandBottomNav";

const niches = ["Fashion", "Beauty", "Tech", "Food", "Lifestyle", "Fitness", "Travel", "Comedy"];

const campaignTypes = [
  { value: "Paid", icon: IndianRupee, label: "Paid", desc: "Monetary compensation" },
  { value: "Perks", icon: Gift, label: "Perks / Barter", desc: "Products, meals, vouchers" },
  { value: "Hybrid", icon: Sparkles, label: "Hybrid", desc: "Cash + perks combined" },
];

const PostCampaign = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "", brand: "", category: "Fashion", type: "Paid", description: "",
    minFollowers: 10000, niches: [] as string[], payoutMin: "", payoutMax: "",
    creatorCount: "", startDate: "", endDate: "", location: "",
    milestones: [{ description: "", percentage: "" }] as { description: string; percentage: string }[],
    perks: [""] as string[],
  });

  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));
  const toggleNiche = (n: string) => set("niches", form.niches.includes(n) ? form.niches.filter(x => x !== n) : [...form.niches, n]);

  const handlePost = () => {
    toast.success("Campaign posted successfully!");
    navigate("/brand/dashboard");
  };

  const formatFollowers = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : `${n}`;

  const milestoneTotal = form.milestones.reduce((s, m) => s + (parseInt(m.percentage) || 0), 0);

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
            <Progress value={(step / 3) * 100} className="h-1.5 [&>div]:bg-accent" />
          </div>

          <div className="px-5 mt-5 space-y-4 pb-6">
            {step === 1 && (
              <>
                {/* Campaign Type Selection */}
                <div className="space-y-2">
                  <Label className="text-xs font-heading font-medium">Campaign Type</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {campaignTypes.map(ct => (
                      <button
                        key={ct.value}
                        onClick={() => set("type", ct.value)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                          form.type === ct.value
                            ? "border-accent bg-accent/10"
                            : "border-border bg-card hover:border-accent/30"
                        }`}
                      >
                        <ct.icon className={`w-5 h-5 ${form.type === ct.value ? "text-accent" : "text-muted-foreground"}`} />
                        <span className={`text-[11px] font-heading font-semibold ${form.type === ct.value ? "text-accent" : "text-foreground"}`}>{ct.label}</span>
                        <span className="text-[8px] text-muted-foreground text-center">{ct.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

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
                  <Label className="text-xs">Description</Label>
                  <Textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="What are you looking for?" rows={3} />
                </div>

                {/* Perks input for Perks/Hybrid */}
                {(form.type === "Perks" || form.type === "Hybrid") && (
                  <div className="space-y-2">
                    <Label className="text-xs">Perks Offered</Label>
                    {form.perks.map((p, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={p}
                          onChange={e => {
                            const updated = [...form.perks];
                            updated[i] = e.target.value;
                            set("perks", updated);
                          }}
                          placeholder={`e.g. Free meal for 2, ₹500 voucher`}
                          className="flex-1"
                        />
                        {form.perks.length > 1 && (
                          <button onClick={() => set("perks", form.perks.filter((_, j) => j !== i))} className="text-destructive text-xs">✕</button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => set("perks", [...form.perks, ""])} className="text-xs text-accent font-heading font-medium">
                      <Plus className="w-3 h-3 inline mr-0.5" /> Add Perk
                    </button>
                  </div>
                )}
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

                {/* Budget fields for Paid/Hybrid */}
                {(form.type === "Paid" || form.type === "Hybrid") && (
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
                )}

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
                <div className="space-y-2 border border-border rounded-xl p-3">
                  <Label className="text-xs font-heading font-bold">Define Milestones (must total 100%)</Label>
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
                      <div className="w-20">
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
                        <button onClick={() => set("milestones", form.milestones.filter((_, j) => j !== i))} className="text-destructive text-xs mt-2">✕</button>
                      )}
                    </div>
                  ))}
                  {form.milestones.length < 5 && (
                    <button onClick={() => set("milestones", [...form.milestones, { description: "", percentage: "" }])} className="text-xs text-accent font-heading font-medium">
                      + Add Milestone
                    </button>
                  )}
                  <p className={`text-[10px] font-heading ${milestoneTotal === 100 ? "text-emerald-500" : "text-accent"}`}>
                    Total: {milestoneTotal}%{milestoneTotal !== 100 && ` — need ${100 - milestoneTotal}% more`}
                  </p>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-sm text-foreground">Review & Post</h3>
                {/* Preview Card */}
                <div className="border border-accent/30 rounded-2xl overflow-hidden bg-card">
                  <div className="h-32 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                    <span className="text-4xl font-heading font-bold text-accent/30">{form.brand || "Brand"}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-sm text-foreground flex-1">{form.title || "Campaign Title"}</h4>
                      <Badge className="text-[8px] border-0 bg-accent/15 text-accent">{form.type}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      {form.location && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {form.location}</span>}
                      {form.startDate && <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" /> {form.startDate}</span>}
                    </div>
                    {(form.type === "Paid" || form.type === "Hybrid") && form.payoutMin && (
                      <p className="text-xs text-accent font-heading font-bold mt-2">₹{form.payoutMin} – ₹{form.payoutMax}</p>
                    )}
                    {(form.type === "Perks" || form.type === "Hybrid") && form.perks.filter(Boolean).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {form.perks.filter(Boolean).map((p, i) => (
                          <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{p}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{form.category}</span>
                      {form.niches.map(n => (
                        <span key={n} className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{n}</span>
                      ))}
                    </div>
                    {form.milestones.filter(m => m.description).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-[9px] text-muted-foreground font-heading font-medium mb-1">Milestones</p>
                        {form.milestones.filter(m => m.description).map((m, i) => (
                          <p key={i} className="text-[10px] text-foreground">{m.description} — {m.percentage}%</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

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
