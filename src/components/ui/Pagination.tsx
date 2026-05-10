/**
 * Feature: personal-portfolio-blog
 *
 * `Pagination` — page number navigator with previous/next buttons and
 * smart ellipsis elision for large totals.
 *
 * Requirements: 8.5, 13.1, 13.4, 13.6
 */
import { cn } from "../../lib/cn";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

type PageSlot = number | "ellipsis";

/**
 * Compute the slots shown in the pagination bar.
 *
 * When there are more than 7 pages we collapse the interior with ellipses:
 * `[1, "...", current-1, current, current+1, "...", last]`, trimming
 * neighbours that would overlap with the edges.
 */
function computeSlots(current: number, total: number): PageSlot[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const slots: PageSlot[] = [1];
  const left = Math.max(current - 1, 2);
  const right = Math.min(current + 1, total - 1);

  if (left > 2) slots.push("ellipsis");
  for (let i = left; i <= right; i++) slots.push(i);
  if (right < total - 1) slots.push("ellipsis");

  slots.push(total);
  return slots;
}

function baseButtonClass(): string {
  return cn(
    "glass inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-full px-3 text-sm font-medium",
    "text-textPrimary hover:text-accent",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-textPrimary",
    "transition-colors",
  );
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps): JSX.Element {
  const clamped = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  const slots = computeSlots(clamped, Math.max(totalPages, 1));
  const atStart = clamped <= 1;
  const atEnd = clamped >= totalPages;

  return (
    <nav
      aria-label="分页导航"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      <button
        type="button"
        className={baseButtonClass()}
        onClick={() => onPageChange(clamped - 1)}
        disabled={atStart}
        aria-label="上一页"
      >
        ‹
      </button>
      <ul className="flex items-center gap-2">
        {slots.map((slot, idx) => {
          if (slot === "ellipsis") {
            return (
              <li
                key={`ellipsis-${idx}`}
                aria-hidden="true"
                className="px-1 text-sm text-textSecondary"
              >
                …
              </li>
            );
          }
          const isCurrent = slot === clamped;
          return (
            <li key={slot}>
              <button
                type="button"
                className={cn(
                  baseButtonClass(),
                  isCurrent && "bg-accent/20 text-accent",
                )}
                {...(isCurrent ? { "aria-current": "page" as const } : {})}
                aria-label={`第 ${slot} 页`}
                onClick={() => onPageChange(slot)}
              >
                {slot}
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className={baseButtonClass()}
        onClick={() => onPageChange(clamped + 1)}
        disabled={atEnd}
        aria-label="下一页"
      >
        ›
      </button>
    </nav>
  );
}

export default Pagination;
