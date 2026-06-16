import { createContext, useContext } from "react";

export interface SceneProgressValue {
  progress: number;
  pinned: boolean;
}

export const SceneProgressContext = createContext<SceneProgressValue>({ progress: 0, pinned: false });

export const useSceneProgress = () => useContext(SceneProgressContext);

export function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function mapRange(v: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  if (inMax === inMin) return outMin;
  const t = clamp((v - inMin) / (inMax - inMin));
  return outMin + t * (outMax - outMin);
}
