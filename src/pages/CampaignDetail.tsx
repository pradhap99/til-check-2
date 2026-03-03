import { useParams, useNavigate } from "react-router-dom";
import { campaigns } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Users, MapPin, Share2, Bookmark, CheckCircle2, Clock, IndianRupee } from "lucide-react";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const campaign = campaigns.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Campaign not found</p>
      </div>
    );
  }

  const progressPercent = (campaign.filled / campaign.slots) * 100;
  const slotsLeft = campaign.slots - campaign.filled;

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-heading font-semibold text-sm text-foreground">Campaign Details</h1>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
            <Share2 className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
            <Bookmark className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Brand Info */}
      <div className="px-4 mt-5">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-3xl shadow-lg">
            {campaign.logo}
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-foreground">{campaign.title}</h2>
            <p className="text-sm text-muted-foreground">by {campaign.brand}</p>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="px-4 mt-4">
        <div className="bg-accent/10 rounded-2xl p-3 flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-accent" />
          <div>
            <p className="text-xs font-heading font-semibold text-accent">{slotsLeft} slots remaining</p>
            <p className="text-[10px] text-muted-foreground">Deadline: {campaign.deadline}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 mt-4">
        <h3 className="font-heading font-semibold text-sm text-foreground mb-1.5">About this campaign</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{campaign.description}</p>
      </div>

      {/* Details Grid */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-2.5">
        {[
          { icon: IndianRupee, label: "Budget", value: campaign.budget },
          { icon: Users, label: "Slots", value: `${campaign.filled}/${campaign.slots}` },
          { icon: Calendar, label: "Deadline", value: campaign.deadline },
          { icon: MapPin, label: "Category", value: campaign.category },
        ].map((item, i) => (
          <div key={i} className="glass-card rounded-2xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <item.icon className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] text-muted-foreground">{item.label}</span>
            </div>
            <p className="font-heading font-semibold text-sm text-card-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="px-4 mt-4">
        <div className="glass-card rounded-2xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground text-xs">Application Progress</span>
            <span className="font-heading font-semibold text-card-foreground text-xs">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full gradient-primary rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Platforms */}
      <div className="px-4 mt-4">
        <h3 className="font-heading font-semibold text-sm text-foreground mb-2">Required Platforms</h3>
        <div className="flex gap-2">
          {campaign.platforms.map((p) => (
            <Badge key={p} className="bg-secondary text-secondary-foreground rounded-xl px-3 py-1.5 text-xs font-heading">
              {p}
            </Badge>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="px-4 mt-4">
        <h3 className="font-heading font-semibold text-sm text-foreground mb-2">Requirements</h3>
        <div className="space-y-2">
          {[
            "Minimum 10K followers on required platform",
            "Content must align with brand guidelines",
            "Deliver within 7 days of acceptance",
            "Original content only — no reposts",
          ].map((req, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">{req}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 py-5 pb-8">
        <Button variant="gradient" className="w-full h-13 rounded-2xl font-heading text-base">
          Apply Now
        </Button>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          By applying, you agree to the campaign terms & conditions
        </p>
      </div>
    </div>
  );
};

export default CampaignDetail;
