import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border border-border bg-slate-950/35 px-4 text-sm text-text placeholder:text-muted outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/25",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
