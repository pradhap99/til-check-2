import { ReactNode } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { SceneProgressContext } from "./SceneProgressContext";
import { cn } from "@/lib/utils";

interface Pinned3DSceneProps {
  children: ReactNode;
  height?: string;
  className?: string;
  viewportClassName?: string;
  pinOnMobile?: boolean;
  mobileFallback?: ReactNode;
}

const Pinned3DScene = ({
  children,
  height = "300vh",
  className,
  viewportClassName,
  pinOnMobile = false,
  mobileFallback,
}: Pinned3DSceneProps) => {
  const { wrapperRef, progress, pinned } = useScrollScene<HTMLDivElement>();

  return (
    <SceneProgressContext.Provider value={{ progress, pinned }}>
      {mobileFallback && !pinOnMobile && (
        <div className="md:hidden">{mobileFallback}</div>
      )}
      <div
        ref={wrapperRef}
        className={cn(
          "relative",
          !pinOnMobile && mobileFallback ? "hidden md:block" : "",
          className
        )}
        style={{ height }}
      >
        <div
          className={cn(
            "sticky top-0 h-screen w-full overflow-hidden",
            viewportClassName
          )}
        >
          <div className="absolute inset-0 perspective-1200">
            {children}
          </div>
        </div>
      </div>
    </SceneProgressContext.Provider>
  );
};

export default Pinned3DScene;
