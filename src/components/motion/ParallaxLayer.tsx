import { ReactNode, useEffect, useRef } from "react";
import { subscribeRaf } from "@/hooks/useRafScheduler";
import { cn } from "@/lib/utils";

interface ParallaxLayerProps {
  children: ReactNode;
  depth?: number;
  axis?: "y" | "x" | "both";
  zScale?: number;
  className?: string;
  as?: "div" | "section" | "span";
}

const ParallaxLayer = ({
  children,
  depth = -1,
  axis = "y",
  zScale = 28,
  className,
  as: Tag = "div",
}: ParallaxLayerProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.style.transform = "";
      return;
    }

    let visible = false;
    let unsub: (() => void) | null = null;

    const apply = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2 - vh / 2;
      const shift = -center * depth * 0.15;
      const z = depth * zScale;
      const tx = axis === "x" || axis === "both" ? shift : 0;
      const ty = axis === "y" || axis === "both" ? shift : 0;
      node.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, ${z}px)`;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !unsub) {
          unsub = subscribeRaf(apply);
        } else if (!visible && unsub) {
          unsub();
          unsub = null;
        }
      },
      { rootMargin: "30% 0px 30% 0px" }
    );
    io.observe(node);
    apply();

    return () => {
      io.disconnect();
      if (unsub) unsub();
    };
  }, [depth, axis, zScale]);

  // @ts-expect-error polymorphic ref
  return <Tag ref={ref} className={cn("will-change-transform", className)}>{children}</Tag>;
};

export default ParallaxLayer;
