import { ReactNode, CSSProperties } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

type Variant = "up" | "down" | "left" | "right" | "scale" | "fade";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  threshold?: number;
  style?: CSSProperties;
}

const hiddenTransforms: Record<Variant, string> = {
  up: "translate3d(0, 28px, 0)",
  down: "translate3d(0, -28px, 0)",
  left: "translate3d(-32px, 0, 0)",
  right: "translate3d(32px, 0, 0)",
  scale: "scale(0.94)",
  fade: "none",
};

const ScrollReveal = ({
  children,
  variant = "up",
  delay = 0,
  duration = 700,
  className,
  as: Tag = "div",
  threshold = 0.15,
  style,
}: ScrollRevealProps) => {
  const { ref, visible } = useScrollReveal<HTMLElement>({ threshold });

  const transform = visible ? "translate3d(0,0,0) scale(1)" : hiddenTransforms[variant];

  const computedStyle: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform,
    transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    willChange: "opacity, transform",
    ...style,
  };

  // @ts-expect-error - polymorphic ref
  return <Tag ref={ref} className={cn(className)} style={computedStyle}>{children}</Tag>;
};

export default ScrollReveal;
