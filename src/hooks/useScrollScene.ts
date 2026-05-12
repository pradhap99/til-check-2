import { useEffect, useRef, useState } from "react";
import { subscribeRaf } from "./useRafScheduler";

interface SceneState {
  progress: number;
  pinned: boolean;
}

export function useScrollScene<T extends HTMLElement = HTMLDivElement>() {
  const wrapperRef = useRef<T>(null);
  const [state, setState] = useState<SceneState>({ progress: 0, pinned: false });

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setState({ progress: 0, pinned: false });
      return;
    }

    let visible = false;
    let unsubRaf: (() => void) | null = null;

    const compute = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const raw = total > 0 ? -rect.top / total : 0;
      const progress = Math.min(1, Math.max(0, raw));
      const pinned = rect.top <= 0 && rect.bottom >= vh;

      setState((prev) =>
        Math.abs(prev.progress - progress) > 0.0008 || prev.pinned !== pinned
          ? { progress, pinned }
          : prev
      );
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !unsubRaf) {
          unsubRaf = subscribeRaf(compute);
        } else if (!visible && unsubRaf) {
          unsubRaf();
          unsubRaf = null;
        }
      },
      { rootMargin: "20% 0px 20% 0px" }
    );
    io.observe(node);
    compute();

    return () => {
      io.disconnect();
      if (unsubRaf) unsubRaf();
    };
  }, []);

  return { wrapperRef, ...state };
}
