import * as React from "react";
import { Drawer as Vaul } from "vaul";
import { cn } from "@/lib/utils";

/**
 * BottomSheet — vaul-powered modal sheet with a Zomato-style grab handle.
 * Used for filter drawers, action sheets, attachment pickers.
 */

const BottomSheet = Vaul.Root;
const BottomSheetTrigger = Vaul.Trigger;
const BottomSheetClose = Vaul.Close;

const BottomSheetPortal = Vaul.Portal;

const BottomSheetOverlay = React.forwardRef<
  React.ElementRef<typeof Vaul.Overlay>,
  React.ComponentPropsWithoutRef<typeof Vaul.Overlay>
>(({ className, ...props }, ref) => (
  <Vaul.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-onyx/70 backdrop-blur-sm", className)}
    {...props}
  />
));
BottomSheetOverlay.displayName = "BottomSheetOverlay";

const BottomSheetContent = React.forwardRef<
  React.ElementRef<typeof Vaul.Content>,
  React.ComponentPropsWithoutRef<typeof Vaul.Content> & {
    /** Hide the grab handle (rarely needed). */
    noHandle?: boolean;
  }
>(({ className, children, noHandle, ...props }, ref) => (
  <BottomSheetPortal>
    <BottomSheetOverlay />
    <Vaul.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto max-h-[92dvh] flex-col rounded-t-2xl border border-border bg-card shadow-elev-3",
        "outline-none",
        className,
      )}
      {...props}
    >
      {!noHandle && (
        <div
          aria-hidden
          className="mx-auto mt-2 mb-1 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/30"
        />
      )}
      {children}
    </Vaul.Content>
  </BottomSheetPortal>
));
BottomSheetContent.displayName = "BottomSheetContent";

const BottomSheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1 px-5 pt-3 pb-2", className)} {...props} />
);

const BottomSheetTitle = React.forwardRef<
  React.ElementRef<typeof Vaul.Title>,
  React.ComponentPropsWithoutRef<typeof Vaul.Title>
>(({ className, ...props }, ref) => (
  <Vaul.Title
    ref={ref}
    className={cn("text-base font-semibold leading-tight tracking-tight", className)}
    {...props}
  />
));
BottomSheetTitle.displayName = "BottomSheetTitle";

const BottomSheetDescription = React.forwardRef<
  React.ElementRef<typeof Vaul.Description>,
  React.ComponentPropsWithoutRef<typeof Vaul.Description>
>(({ className, ...props }, ref) => (
  <Vaul.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
BottomSheetDescription.displayName = "BottomSheetDescription";

const BottomSheetBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto px-5 py-3", className)} {...props} />
);

const BottomSheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "sticky bottom-0 flex items-center justify-end gap-2 border-t border-border bg-card/95 px-5 py-3 backdrop-blur",
      className,
    )}
    {...props}
  />
);

export {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetBody,
  BottomSheetFooter,
};
