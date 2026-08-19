"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  dismissible?: boolean;
  glow?: boolean;
  onDismiss?: () => void;
  size?: "sm" | "md";
  variant?: "default" | "success" | "warning" | "danger" | "outline";
}

const variantStyles = {
  danger: "border-destructive/50 bg-destructive/15 text-destructive",
  default: "border-primary/50 bg-primary/15 text-primary",
  outline:
    "border-primary/40 bg-primary/5 text-primary hover:border-primary/70 hover:bg-primary/15",
  success: "border-green-500/50 bg-green-500/15 text-green-500",
  warning: "border-amber-500/50 bg-amber-500/15 text-amber-500",
};

const variantGlow = {
  danger:
    "shadow-[0_0_8px_color-mix(in_oklch,var(--destructive)_30%,transparent)]",
  default: "shadow-[0_0_8px_color-mix(in_oklch,var(--glow)_35%,transparent)]",
  outline: "",
  success: "shadow-[0_0_8px_color-mix(in_oklch,#22c55e_30%,transparent)]",
  warning: "shadow-[0_0_8px_color-mix(in_oklch,#f59e0b_30%,transparent)]",
};

const sizeStyles = {
  md: "px-3 py-1 text-[10px]",
  sm: "px-2 py-0.5 text-[9px]",
};

export function Tag({
  variant = "default",
  size = "sm",
  glow = false,
  dismissible = false,
  onDismiss,
  className,
  children,
  ...props
}: TagProps) {
  return (
    <span
      data-slot="tron-tag"
      data-variant={variant}
      data-size={size}
      className={cn(
        "inline-flex items-center gap-1.5 rounded border font-mono uppercase tracking-widest transition-all duration-200",
        variantStyles[variant],
        sizeStyles[size],
        glow && variantGlow[variant],
        className,
      )}
      {...props}
    >
      {children}
      {dismissible ? (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="ml-0.5 opacity-60 transition-opacity hover:opacity-100"
        >
          &#10005;
        </button>
      ) : null}
    </span>
  );
}
