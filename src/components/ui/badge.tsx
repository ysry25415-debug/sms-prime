import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "danger" | "outline";
};

const variants = {
  default: "bg-white/10 text-text",
  success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
  warning: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
  danger: "bg-red-500/15 text-red-300 border border-red-500/20",
  outline: "border border-border text-muted bg-transparent"
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", variants[variant], className)}
      {...props}
    />
  );
}
