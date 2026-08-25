import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  containerClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, containerClassName, children, ...props }, ref) => {
    return (
      <div className={cn("relative inline-flex items-center", containerClassName)}>
        <select
          ref={ref}
          className={cn(
            "h-9 appearance-none bg-white hover:bg-neutral-50/80 border border-neutral-200 rounded-lg pl-3 pr-8 text-xs font-semibold text-neutral-800 shadow-2xs outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 cursor-pointer transition-colors w-full disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-2.5 size-3.5 text-neutral-500 pointer-events-none shrink-0" />
      </div>
    );
  }
);
Select.displayName = "Select";
