import { useSceneProgress, clamp } from "@/components/motion/SceneProgressContext";

interface Step {
  step: string;
  title: string;
  desc: string;
}
interface ColData {
  label: string;
  steps: Step[];
}

interface Props {
  cols: ColData[];
}

const HowItWorksSceneContent = ({ cols }: Props) => {
  const { progress } = useSceneProgress();
  const total = cols[0].steps.length; // 4
  const p4 = clamp(progress, 0, 0.999) * total;
  const activeIdx = Math.min(total - 1, Math.floor(p4));

  return (
    <div className="absolute inset-0 px-5 py-12 md:py-20 flex flex-col items-center">
      <div className="text-center mb-6 md:mb-12">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">How it works</p>
        <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground tracking-tight">
          From signup to payout in four steps
        </h2>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === activeIdx ? 32 : 12,
              background: i <= activeIdx ? "hsl(var(--accent))" : "hsl(var(--border))",
            }}
          />
        ))}
      </div>

      {/* Stacked step cards */}
      <div className="step-card-stack flex-1 w-full max-w-3xl">
        <div className="relative h-[360px] md:h-[420px]">
          {cols[0].steps.map((step, i) => {
            const phase = p4 - i;
            const distance = Math.abs(phase - 0.5);
            const z = -distance * 280;
            const scale = 1 - distance * 0.18;
            const ty = phase < 0.5 ? (0.5 - phase) * -20 : (phase - 0.5) * 18;
            const opacity = 1 - clamp((distance - 0.45) / 0.4);
            const rotate = phase < 0.5 ? (0.5 - phase) * 6 : (phase - 0.5) * -6;

            return (
              <div
                key={step.step}
                className="step-card"
                style={{
                  transform: `translate3d(0, ${ty}vh, ${z}px) scale(${scale}) rotateX(${rotate}deg)`,
                  opacity,
                  zIndex: 10 - Math.round(distance * 10),
                  pointerEvents: i === activeIdx ? "auto" : "none",
                }}
              >
                <div className="grid md:grid-cols-2 gap-4 h-full">
                  {cols.map((col) => (
                    <div
                      key={col.label}
                      className="card-3d border border-border rounded-2xl p-6 bg-card shadow-xl flex flex-col"
                    >
                      <p className="text-[10px] font-heading font-semibold text-accent uppercase tracking-widest mb-3">
                        {col.label}
                      </p>
                      <div className="flex items-start gap-4 mt-1">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center font-heading font-bold text-accent text-sm">
                          {col.steps[i].step}
                        </div>
                        <div>
                          <p className="font-heading font-bold text-base md:text-lg text-foreground tracking-tight">
                            {col.steps[i].title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                            {col.steps[i].desc}
                          </p>
                        </div>
                      </div>
                      <div className="floor-reflection" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-8 hidden md:block">
        Keep scrolling to advance · Step {activeIdx + 1} of {total}
      </p>
    </div>
  );
};

// Flat fallback for mobile
export const HowItWorksFallback = ({ cols }: Props) => (
  <section className="px-5 mt-16 max-w-4xl mx-auto">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-2">How it works</p>
    <h2 className="font-heading font-bold text-2xl text-center text-foreground tracking-tight">
      From signup to payout in four steps
    </h2>
    <div className="grid gap-4 mt-8">
      {cols.map((col) => (
        <div key={col.label} className="border border-border rounded-xl p-6 bg-card">
          <p className="text-xs font-medium text-accent uppercase tracking-widest mb-4">{col.label}</p>
          <div className="space-y-5">
            {col.steps.map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <span className="text-[10px] font-heading font-bold text-muted-foreground mt-1 w-5 shrink-0">{item.step}</span>
                <div>
                  <p className="font-heading font-semibold text-sm text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default HowItWorksSceneContent;
