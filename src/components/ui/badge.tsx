import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "danger" | "outline";
};

const variants = {
  default: "bg-[#F1EEDC] text-text",
  success: "border border-[#B7DEC7] bg-[#DCF3E4] text-[#175C37]",
  warning: "border border-[#F0D47A] bg-[#FFFBEB] text-[#714A00]",
  danger: "border border-[#F2BBB5] bg-[#FCE8E6] text-[#8F1D13]",
  outline: "border border-border text-muted bg-transparent"
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", variants[variant], className)}
      {...props}
    />
  );
}
