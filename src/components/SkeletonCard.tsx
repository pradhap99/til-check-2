const SkeletonCard = ({ variant = "default" }: { variant?: "default" | "campaign" | "creator" }) => {
  if (variant === "creator") {
    return (
      <div className="border border-border rounded-xl p-3.5 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full skeleton-shimmer shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-28 skeleton-shimmer rounded" />
          <div className="h-2.5 w-20 skeleton-shimmer rounded" />
        </div>
        <div className="h-3 w-12 skeleton-shimmer rounded" />
      </div>
    );
  }
  if (variant === "campaign") {
    return (
      <div className="border border-border rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg skeleton-shimmer shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-32 skeleton-shimmer rounded" />
            <div className="h-2.5 w-20 skeleton-shimmer rounded" />
          </div>
        </div>
        <div className="h-1.5 w-full skeleton-shimmer rounded-full mt-3" />
      </div>
    );
  }
  return (
    <div className="border border-border rounded-xl p-4 space-y-3">
      <div className="h-4 w-3/4 skeleton-shimmer rounded" />
      <div className="h-3 w-1/2 skeleton-shimmer rounded" />
      <div className="h-3 w-full skeleton-shimmer rounded" />
    </div>
  );
};

export default SkeletonCard;
