import { ReactNode, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  max?: number;
  scale?: number;
  glare?: boolean;
  perspective?: number;
}

const Tilt3D = ({
  children,
  className,
  max = 10,
  scale = 1.02,
  glare = true,
  perspective = 900,
}: Tilt3DProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>("");
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; o: number }>({ x: 50, y: 50, o: 0 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = node.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 2 * max;
    const rotateX = (0.5 - y) * 2 * max;
    setTransform(`perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`);
    setGlarePos({ x: x * 100, y: y * 100, o: 0.18 });
  }, [max, scale, perspective]);

  const handleLeave = useCallback(() => {
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`);
    setGlarePos((g) => ({ ...g, o: 0 }));
  }, [perspective]);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn("relative transition-transform duration-200 ease-out will-change-transform", className)}
      style={{ transform, transformStyle: "preserve-3d" }}
    >
      {children}
      {glare && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: glarePos.o,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.55), transparent 45%)`,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </div>
  );
};

export default Tilt3D;
