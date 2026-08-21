import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-500 text-white shadow-xs hover:bg-primary-600",
        secondary:
          "border-transparent bg-neutral-100 text-neutral-800 hover:bg-neutral-200",
        destructive:
          "border-error-100 bg-error-50 text-error-700",
        outline:
          "border-neutral-200 text-neutral-800 bg-transparent",
        success:
          "border-success-100 bg-success-50 text-success-700",
        warning:
          "border-warning-100 bg-warning-50 text-warning-700",
        info:
          "border-info-100 bg-info-50 text-info-700",
        primary:
          "border-primary-200 bg-primary-50 text-primary-700 font-semibold",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[11px]",
        lg: "px-3 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
