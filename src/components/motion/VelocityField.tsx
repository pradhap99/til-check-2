import { useEffect, useRef } from "react";
import { useScrollVelocity } from "@/hooks/useScrollVelocity";

interface VelocityFieldProps {
  selector: string;
  maxBlurDelta?: number;
  maxScaleDelta?: number;
  maxDriftPx?: number;
}

const VelocityField = ({
  selector,
  maxBlurDelta = 18,
  maxScaleDelta = 0.18,
  maxDriftPx = 80,
}: VelocityFieldProps) => {
  const velocity = useScrollVelocity();
  const nodesRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    nodesRef.current = Array.from(document.querySelectorAll<HTMLElement>(selector));
  }, [selector]);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const blurCap = isMobile ? Math.min(maxBlurDelta, 8) : maxBlurDelta;
    const driftCap = isMobile ? Math.min(maxDriftPx, 36) : maxDriftPx;

    const abs = Math.min(Math.abs(velocity), 3000) / 3000;
    const sign = velocity >= 0 ? 1 : -1;

    nodesRef.current.forEach((node, i) => {
      const flip = i % 2 === 0 ? 1 : -1;
      node.style.setProperty("--orb-drift-x", `${(abs * driftCap * flip * sign).toFixed(1)}px`);
      node.style.setProperty("--orb-drift-y", `${(abs * driftCap * 0.6 * sign).toFixed(1)}px`);
      node.style.setProperty("--orb-blur-delta", `${(abs * blurCap).toFixed(1)}px`);
      node.style.setProperty("--orb-scale", `${(1 + abs * maxScaleDelta).toFixed(3)}`);
    });
  }, [velocity, maxBlurDelta, maxScaleDelta, maxDriftPx]);

  return null;
};

export default VelocityField;
