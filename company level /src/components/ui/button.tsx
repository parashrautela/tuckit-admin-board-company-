import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-primary-500 text-white shadow-sm hover:bg-primary-600 active:bg-primary-700",
        primary:
          "bg-primary-500 text-white shadow-sm hover:bg-primary-600 active:bg-primary-700",
        secondary:
          "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300",
        destructive:
          "bg-error-500 text-white shadow-sm hover:bg-error-700 active:bg-error-700",
        outline:
          "border border-neutral-200 bg-transparent text-neutral-800 hover:bg-neutral-50 active:bg-neutral-100 shadow-xs",
        ghost:
          "bg-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200/60",
        link:
          "text-primary-500 underline-offset-4 hover:underline p-0 h-auto",
        accent:
          "bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8 text-sm",
        icon: "size-9 rounded-md",
        "icon-sm": "size-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
