/**
 * Feature: personal-portfolio-blog
 *
 * `TagPill` — small pill used to render a single tag/label inside cards
 * and filter bars. When `active` is true it takes on the accent color to
 * indicate selection.
 */
import { cn } from "../../lib/cn";

export interface TagPillProps {
  label: string;
  active?: boolean;
  className?: string;
}

export function TagPill({ label, active, className }: TagPillProps): JSX.Element {
  return (
    <span
      className={cn(
        "glass inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        active ? "bg-accent/20 text-accent" : "text-textSecondary",
        className,
      )}
    >
      {label}
    </span>
  );
}

export default TagPill;
