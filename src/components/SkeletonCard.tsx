const SkeletonCard = ({ variant = "default" }: { variant?: "default" | "campaign" | "creator" }) => {
  if (variant === "creator") {
    return (
      <div className="border border-border rounded-2xl p-3.5 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full skeleton-shimmer shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-28 skeleton-shimmer rounded" />
          <div className="h-2.5 w-20 skeleton-shimmer rounded" />
          <div className="flex gap-1.5">
            <div className="h-4 w-14 skeleton-shimmer rounded-full" />
            <div className="h-4 w-16 skeleton-shimmer rounded-full" />
          </div>
        </div>
        <div className="h-3 w-12 skeleton-shimmer rounded" />
      </div>
    );
  }
  if (variant === "campaign") {
    return (
      <div className="border border-border rounded-2xl overflow-hidden">
        <div className="h-[140px] skeleton-shimmer" />
        <div className="p-4 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg skeleton-shimmer shrink-0" />
            <div className="h-3 w-20 skeleton-shimmer rounded" />
          </div>
          <div className="h-4 w-3/4 skeleton-shimmer rounded" />
          <div className="flex gap-3">
            <div className="h-3 w-24 skeleton-shimmer rounded" />
            <div className="h-3 w-20 skeleton-shimmer rounded" />
          </div>
          <div className="h-1.5 w-full skeleton-shimmer rounded-full" />
          <div className="flex gap-1.5">
            <div className="h-5 w-16 skeleton-shimmer rounded-full" />
            <div className="h-5 w-14 skeleton-shimmer rounded-full" />
          </div>
          <div className="h-9 w-full skeleton-shimmer rounded-xl" />
        </div>
      </div>
    );
  }
  return (
    <div className="border border-border rounded-2xl p-4 space-y-3">
      <div className="h-4 w-3/4 skeleton-shimmer rounded" />
      <div className="h-3 w-1/2 skeleton-shimmer rounded" />
      <div className="h-3 w-full skeleton-shimmer rounded" />
    </div>
  );
};

export default SkeletonCard;
