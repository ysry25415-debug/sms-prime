import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-text placeholder:text-muted outline-none transition focus:border-[#B38E17] focus:ring-2 focus:ring-[#E5B928]/20",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
