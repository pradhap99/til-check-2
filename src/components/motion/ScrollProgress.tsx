import { useScrollProgress } from "@/hooks/useScrollReveal";

const ScrollProgress = () => {
  const progress = useScrollProgress();
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent pointer-events-none">
      <div
        className="h-full origin-left bg-gradient-to-r from-accent via-foreground to-accent"
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: "left center",
          transition: "transform 80ms linear",
          boxShadow: "0 0 8px hsl(var(--accent) / 0.6)",
        }}
      />
    </div>
  );
};

export default ScrollProgress;
