import { useEffect, useState } from "react";
import { subscribeRaf } from "./useRafScheduler";

interface Options {
  smoothing?: number;
  decayMs?: number;
}

export function useScrollVelocity({ smoothing = 0.18, decayMs = 280 }: Options = {}) {
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVelocity(0);
      return;
    }

    let lastY = window.scrollY;
    let lastT = performance.now();
    let lastScrollT = lastT;
    let smoothed = 0;

    const tick = (now: number) => {
      const dt = Math.max(1, now - lastT);
      lastT = now;

      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;

      let raw = 0;
      if (dy !== 0) {
        raw = (dy / dt) * 1000; // px/s
        lastScrollT = now;
      } else if (now - lastScrollT > decayMs) {
        raw = 0;
      } else {
        raw = smoothed * 0.85;
      }

      smoothed = smoothed + (raw - smoothed) * smoothing;
      const next = Math.abs(smoothed) < 1 ? 0 : smoothed;

      setVelocity((prev) => (Math.abs(prev - next) > 4 ? next : prev));
    };

    return subscribeRaf(tick);
  }, [smoothing, decayMs]);

  return velocity;
}
