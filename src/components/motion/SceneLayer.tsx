import { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface SceneLayerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  z?: number | string;
}

const SceneLayer = ({ children, className, style, z }: SceneLayerProps) => (
  <div
    className={cn("absolute inset-0 will-change-transform", className)}
    style={{ zIndex: z, ...style }}
  >
    {children}
  </div>
);

export default SceneLayer;
