/**
 * Feature: personal-portfolio-blog
 *
 * `GlassCard` — generic glassmorphism container.
 *
 * Polymorphic via the `as` prop (defaults to `div`). Two visual variants
 * (`default` and `strong`) map to the `.glass` / `.glass-strong` utility
 * classes defined in `tailwind.config.ts`.
 *
 * Extra props beyond the declared surface are forwarded to the rendered
 * element. We keep the polymorphism intentionally loose on the type side
 * (treating forwarded props as `Record<string, unknown>`) to avoid the
 * combinatorial explosion of fully-typed polymorphic components.
 */
import { forwardRef, createElement, type ElementType, type Ref } from "react";
import { cn } from "../../lib/cn";

export interface GlassCardOwnProps {
  as?: ElementType;
  variant?: "default" | "strong";
  className?: string;
  children?: React.ReactNode;
}

export type GlassCardProps = GlassCardOwnProps & Record<string, unknown>;

export const GlassCard = forwardRef<HTMLElement, GlassCardProps>(
  function GlassCard(props, ref: Ref<HTMLElement>) {
    const {
      as = "div",
      variant = "default",
      className,
      children,
      ...rest
    } = props as GlassCardOwnProps & Record<string, unknown>;
    const base = variant === "strong" ? "glass-strong" : "glass";
    return createElement(
      as,
      {
        ref,
        className: cn(base, "rounded-2xl p-6", className),
        ...rest,
      },
      children,
    );
  },
);

export default GlassCard;
