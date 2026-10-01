import { useEffect } from "react";

type Tick = (now: number) => void;

const subs = new Set<Tick>();
let rafId: number | null = null;

const loop = (now: number) => {
  subs.forEach((cb) => {
    try { cb(now); } catch (e) { console.error(e); }
  });
  rafId = subs.size > 0 ? requestAnimationFrame(loop) : null;
};

const start = () => {
  if (rafId == null && subs.size > 0) {
    rafId = requestAnimationFrame(loop);
  }
};

export function subscribeRaf(cb: Tick): () => void {
  subs.add(cb);
  start();
  return () => {
    subs.delete(cb);
    if (subs.size === 0 && rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}

export function useRafScheduler(cb: Tick, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    return subscribeRaf(cb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}
