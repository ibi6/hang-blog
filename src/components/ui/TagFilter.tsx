/**
 * Feature: personal-portfolio-blog
 *
 * `TagFilter` — single-select tag filter rendered as a row of pill buttons.
 * An "All" button clears the selection (`selected === null`).
 *
 * Requirements: 7.5, 7.6, 8.4, 13.1, 13.2
 */
import { cn } from "../../lib/cn";

export interface TagFilterProps {
  tags: readonly string[];
  selected: string | null;
  onSelect: (tag: string | null) => void;
  className?: string;
  ariaLabel?: string;
}

function buttonClass(isActive: boolean): string {
  return cn(
    "glass inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
    "transition-colors",
    isActive
      ? "bg-accent/20 text-accent"
      : "text-textSecondary hover:text-accent",
  );
}

export function TagFilter({
  tags,
  selected,
  onSelect,
  className,
  ariaLabel = "按标签筛选",
}: TagFilterProps): JSX.Element {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-pressed={selected === null}
        className={buttonClass(selected === null)}
      >
        全部
      </button>
      {tags.map((tag) => {
        const active = selected === tag;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onSelect(active ? null : tag)}
            aria-pressed={active}
            className={buttonClass(active)}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}

export default TagFilter;
