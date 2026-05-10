/**
 * Feature: personal-portfolio-blog
 *
 * `GlassInput` and `GlassTextarea` — form controls with unified
 * glassmorphism styling and accessible focus ring.
 */
import {
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../../lib/cn";

const sharedClasses = cn(
  "glass w-full rounded-2xl px-4 py-2 text-sm",
  "text-textPrimary placeholder:text-textSecondary/70",
  "bg-transparent",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
  "disabled:opacity-60 disabled:cursor-not-allowed",
);

export type GlassInputProps = InputHTMLAttributes<HTMLInputElement>;

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  function GlassInput({ className, type = "text", ...rest }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(sharedClasses, className)}
        {...rest}
      />
    );
  },
);

export type GlassTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const GlassTextarea = forwardRef<
  HTMLTextAreaElement,
  GlassTextareaProps
>(function GlassTextarea({ className, rows = 5, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(sharedClasses, "resize-y", className)}
      {...rest}
    />
  );
});

export default GlassInput;
