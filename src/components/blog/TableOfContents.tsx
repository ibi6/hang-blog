/**
 * Feature: personal-portfolio-blog
 *
 * `TableOfContents` — in-page navigation for a blog post. Uses
 * `useScrollSpy` to highlight the active heading. On mobile the whole
 * TOC collapses inside a `<details>` element; on desktop it becomes a
 * sticky sidebar.
 *
 * Requirements: 9.4, 9.5, 13.6
 */
import { useMemo } from "react";
import type { TocItem } from "../../types/blog";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import { cn } from "../../lib/cn";

export interface TableOfContentsProps {
  items: readonly TocItem[];
  className?: string;
}

export function TableOfContents({
  items,
  className,
}: TableOfContentsProps): JSX.Element | null {
  const ids = useMemo(() => items.map((i) => i.id), [items]);
  const activeId = useScrollSpy(ids);

  if (items.length === 0) return null;

  const list = (
    <ol className="space-y-1 text-sm">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <li
            key={item.id}
            className={cn(item.depth === 3 && "ml-4")}
          >
            <a
              href={`#${item.id}`}
              {...(isActive ? { "aria-current": "true" as const } : {})}
              className={cn(
                "block rounded-lg px-2 py-1 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                isActive
                  ? "text-accent font-medium"
                  : "text-textSecondary hover:text-accent",
              )}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <aside
      aria-label="文章目录"
      className={cn("w-full", className)}
    >
      {/* Mobile: collapsible */}
      <details className="glass rounded-2xl p-4 lg:hidden">
        <summary className="cursor-pointer text-sm font-medium text-textPrimary">
          目录
        </summary>
        <div className="mt-3">{list}</div>
      </details>

      {/* Desktop: sticky sidebar */}
      <div className="hidden lg:sticky lg:top-28 lg:block">
        <div className="glass rounded-2xl p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-textSecondary">
            目录
          </p>
          {list}
        </div>
      </div>
    </aside>
  );
}

export default TableOfContents;
