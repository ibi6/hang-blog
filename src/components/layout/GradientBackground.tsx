/**
 * Feature: personal-portfolio-blog
 *
 * `GradientBackground` — fixed-position, negative z-index gradient layer
 * that sits behind every page. Three soft colored blobs add depth to the
 * glassmorphism surfaces that sit on top.
 *
 * Requirements: 1.4
 */
import { cn } from "../../lib/cn";

export function GradientBackground(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-bgFrom to-bgTo"
    >
      {/* Soft blurred color blobs that give the glass layers something
          interesting to refract. They are purely decorative. */}
      <div
        className={cn(
          "pointer-events-none absolute -top-24 -left-24 h-80 w-80",
          "rounded-full bg-fuchsia-400/40 blur-3xl opacity-60",
          "dark:bg-fuchsia-500/30",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute top-1/3 -right-32 h-96 w-96",
          "rounded-full bg-sky-400/40 blur-3xl opacity-60",
          "dark:bg-indigo-500/30",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute -bottom-32 left-1/4 h-96 w-96",
          "rounded-full bg-violet-400/40 blur-3xl opacity-60",
          "dark:bg-violet-500/30",
        )}
      />
    </div>
  );
}

export default GradientBackground;
