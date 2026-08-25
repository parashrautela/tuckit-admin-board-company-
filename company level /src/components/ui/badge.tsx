import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-600 text-white shadow-xs hover:bg-primary-700",
        secondary:
          "border-neutral-300 bg-neutral-100 text-neutral-900 font-semibold",
        destructive:
          "border-error-200 bg-error-50 text-error-700 font-semibold",
        outline:
          "border-neutral-300 text-neutral-900 bg-white font-semibold",
        success:
          "border-success-200 bg-success-50 text-success-700 font-semibold",
        warning:
          "border-warning-200 bg-warning-50 text-warning-700 font-bold",
        info:
          "border-info-200 bg-info-50 text-info-700 font-semibold",
        primary:
          "border-primary-300 bg-primary-50 text-primary-900 font-bold",
      },
      size: {
        default: "px-2.5 py-1 text-xs font-semibold",
        sm: "px-2.5 py-0.5 text-xs font-semibold",
        lg: "px-3 py-1 text-sm font-semibold",
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
