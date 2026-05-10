/**
 * Feature: personal-portfolio-blog
 *
 * `GlassButton` — button with glassmorphism styling, focus ring, and a
 * sensible disabled state. Supports `variant: "primary" | "ghost"`.
 */
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface GlassButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

const baseClasses = cn(
  "inline-flex items-center justify-center gap-2",
  "rounded-2xl px-4 py-2 text-sm font-medium",
  "transition-colors",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
  "disabled:opacity-60 disabled:cursor-not-allowed",
);

const variantClasses = {
  primary: cn(
    "glass text-textPrimary",
    "bg-accent/90 text-accentContrast hover:bg-accent",
  ),
  ghost: cn("glass text-textPrimary hover:text-accent"),
} as const;

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  function GlassButton(
    { variant = "primary", type = "button", className, children, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

export default GlassButton;
