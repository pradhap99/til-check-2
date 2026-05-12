import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium transition-colors duration-fast ease-out-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        neutral:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        primary:
          "bg-primary/15 text-primary hover:bg-primary/25 ring-1 ring-inset ring-primary/30",
        emerald:
          "bg-emerald/15 text-emerald hover:bg-emerald/25 ring-1 ring-inset ring-emerald/30",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-secondary",
        muted:
          "bg-muted text-muted-foreground hover:bg-muted/80",
        selected:
          "bg-foreground text-background",
      },
      size: {
        sm: "h-7 px-2.5 text-xs [&_svg]:size-3.5",
        md: "h-8 px-3 text-sm [&_svg]:size-4",
        lg: "h-10 px-4 text-sm [&_svg]:size-4",
      },
      interactive: {
        true: "cursor-pointer active:scale-[0.97]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
      interactive: false,
    },
  },
);

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  asChild?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      variant,
      size,
      interactive,
      leadingIcon,
      trailingIcon,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isInteractive = interactive ?? (!!props.onClick || !props.disabled);
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          chipVariants({ variant, size, interactive: isInteractive }),
          className,
        )}
        {...props}
      >
        {leadingIcon}
        {children}
        {trailingIcon}
      </button>
    );
  },
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
