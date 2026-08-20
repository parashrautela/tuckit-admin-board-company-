import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neutral-800 text-white shadow-2xs",
        secondary:
          "border-neutral-200 bg-neutral-100 text-neutral-700",
        destructive:
          "border-error-100 bg-error-50 text-error-700",
        outline:
          "border-neutral-200 text-neutral-700 bg-neutral-0",
        success:
          "border-success-100 bg-success-50 text-success-700",
        warning:
          "border-warning-100 bg-warning-50 text-warning-700",
        info:
          "border-info-100 bg-info-50 text-info-700",
        primary:
          "border-primary-200 bg-primary-100 text-primary-700 font-semibold",
      },
      size: {
        default: "px-2 py-0.5 text-[11px]",
        sm: "px-1.5 py-0.2 text-[10px]",
        lg: "px-2.5 py-1 text-xs",
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
