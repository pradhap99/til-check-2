import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft, Star, Send, Plus, MessageCircle, ThumbsUp
} from "lucide-react";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger, DrawerClose,
} from "@/components/ui/drawer";

interface Review {
  id: string;
  overall_rating: number;
  comment: string | null;
  reviewer_role: string;
  created_at: string;
  content_quality_rating: number | null;
  delivery_rating: number | null;
  communication_rating: number | null;
  responsiveness_rating: number | null;
  response: string | null;
  reviewer_name?: string;
}

const Reviews = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user") || user?.id;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [writeOpen, setWriteOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [qualityRating, setQualityRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [commRating, setCommRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<"received" | "given">("received");

  useEffect(() => {
    if (!userId) return;
    const fetchReviews = async () => {
      const column = tab === "received" ? "reviewed_user_id" : "reviewer_user_id";
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq(column, userId)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        const reviewerIds = data.map(r => tab === "received" ? r.reviewer_user_id : r.reviewed_user_id);
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", reviewerIds);
        const map = new Map((profiles || []).map(p => [p.user_id, p.full_name]));

        setReviews(data.map(r => ({
          ...r,
          reviewer_name: map.get(tab === "received" ? r.reviewer_user_id : r.reviewed_user_id) || "Anonymous",
        })));
      } else {
        setReviews([]);
      }
      setLoading(false);
    };
    fetchReviews();
  }, [userId, tab]);

  const handleSubmitReview = async () => {
    if (!user || !userId || rating === 0) return;
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      reviewer_user_id: user.id,
      reviewed_user_id: userId,
      overall_rating: rating,
      comment,
      reviewer_role: role || "creator",
      content_quality_rating: qualityRating || null,
      delivery_rating: deliveryRating || null,
      communication_rating: commRating || null,
    });
    if (error) {
      toast.error("Failed to submit review");
    } else {
      toast.success("Review submitted! ⭐");
      setWriteOpen(false);
      setRating(0);
      setComment("");
      // Refresh
      const { data } = await supabase.from("reviews").select("*").eq("reviewed_user_id", userId).order("created_at", { ascending: false });
      setReviews(data || []);
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.overall_rating, 0) / reviews.length).toFixed(1) : "—";

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-heading font-semibold text-sm text-foreground">Reviews & Ratings</h1>
      </div>

      {/* Rating Summary */}
      <div className="px-4 mt-4">
        <div className="glass-card rounded-2xl p-5 text-center">
          <p className="font-heading font-bold text-4xl text-card-foreground">{avgRating}</p>
          <div className="flex justify-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className={`w-4 h-4 ${s <= Math.round(Number(avgRating)) ? "text-accent fill-accent" : "text-muted-foreground"}`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{reviews.length} reviews</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4 flex gap-2">
        <button onClick={() => setTab("received")} className={`flex-1 py-2 rounded-xl text-xs font-heading font-medium transition-all ${tab === "received" ? "gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
          Received
        </button>
        <button onClick={() => setTab("given")} className={`flex-1 py-2 rounded-xl text-xs font-heading font-medium transition-all ${tab === "given" ? "gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
          Given
        </button>
      </div>

      {/* Reviews List */}
      <div className="px-4 mt-4 space-y-2.5 mb-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 rounded-xl gradient-primary animate-pulse-glow mx-auto" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-heading font-medium text-muted-foreground">No reviews yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              {tab === "received" ? "Complete campaigns to earn reviews" : "Rate creators/brands after campaigns"}
            </p>
          </div>
        ) : (
          reviews.map((review, i) => (
            <div key={review.id} className="glass-card rounded-2xl p-4 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-heading font-semibold text-sm text-card-foreground">{review.reviewer_name}</p>
                  <Badge variant="secondary" className="text-[9px] mt-0.5">{review.reviewer_role}</Badge>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-3 h-3 ${s <= review.overall_rating ? "text-accent fill-accent" : "text-muted-foreground"}`} />
                  ))}
                </div>
              </div>
              {review.comment && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{review.comment}</p>}

              {/* Sub-ratings */}
              {(review.content_quality_rating || review.delivery_rating || review.communication_rating) && (
                <div className="flex gap-3 mt-2 text-[10px] text-muted-foreground">
                  {review.content_quality_rating && <span>Quality: {review.content_quality_rating}/5</span>}
                  {review.delivery_rating && <span>Delivery: {review.delivery_rating}/5</span>}
                  {review.communication_rating && <span>Communication: {review.communication_rating}/5</span>}
                </div>
              )}

              {review.response && (
                <div className="mt-2 p-2.5 rounded-xl bg-primary/5">
                  <p className="text-[10px] font-heading font-medium text-primary mb-0.5">Response</p>
                  <p className="text-[10px] text-muted-foreground">{review.response}</p>
                </div>
              )}

              <p className="text-[9px] text-muted-foreground mt-2">
                {new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Write Review FAB */}
      <Drawer open={writeOpen} onOpenChange={setWriteOpen}>
        <DrawerTrigger asChild>
          <button className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-xl z-20">
            <Plus className="w-6 h-6 text-primary-foreground" />
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="font-heading">Write a Review</DrawerTitle>
            <DrawerDescription>Share your experience</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 space-y-4">
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-2 block">Overall Rating</label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setRating(s)} className="p-1">
                    <Star className={`w-8 h-8 transition-all ${s <= rating ? "text-accent fill-accent scale-110" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Quality", value: qualityRating, set: setQualityRating },
                { label: "Delivery", value: deliveryRating, set: setDeliveryRating },
                { label: "Communication", value: commRating, set: setCommRating },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <p className="text-[10px] font-heading font-medium text-muted-foreground mb-1">{item.label}</p>
                  <div className="flex gap-0.5 justify-center">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} onClick={() => item.set(s)}>
                        <Star className={`w-3.5 h-3.5 ${s <= item.value ? "text-accent fill-accent" : "text-muted-foreground"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <label className="text-xs font-heading font-medium text-foreground mb-1.5 block">Comment</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience (min 50 words for visibility boost)..." rows={4} className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          </div>
          <DrawerFooter>
            <Button variant="gradient" className="w-full h-12 rounded-2xl font-heading" disabled={rating === 0 || submitting} onClick={handleSubmitReview}>
              <Send className="w-4 h-4" /> Submit Review
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full rounded-2xl">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Reviews;
