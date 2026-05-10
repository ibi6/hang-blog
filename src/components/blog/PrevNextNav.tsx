/**
 * Feature: personal-portfolio-blog
 *
 * `PrevNextNav` — post-level navigation shown below the article that
 * links to the previous and next posts in date-descending order.
 *
 * When one side has no neighbour (boundary post) we render an empty
 * placeholder `<div>` so the two-column grid remains balanced.
 *
 * Requirements: 9.6
 */
import { Link } from "react-router-dom";
import type { BlogPost } from "../../types/blog";
import { cn } from "../../lib/cn";

export interface PrevNextNavProps {
  prev: BlogPost | null;
  next: BlogPost | null;
  className?: string;
}

function linkClass(): string {
  return cn(
    "glass flex h-full flex-col gap-1 rounded-2xl p-5",
    "text-textPrimary hover:text-accent",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
    "transition-colors",
  );
}

export function PrevNextNav({
  prev,
  next,
  className,
}: PrevNextNavProps): JSX.Element {
  return (
    <nav
      aria-label="上下篇导航"
      className={cn("mt-12 grid grid-cols-1 gap-4 md:grid-cols-2", className)}
    >
      {prev !== null ? (
        <Link to={`/blog/${prev.slug}`} className={linkClass()}>
          <span className="text-xs text-textSecondary">← 上一篇</span>
          <span className="text-sm font-medium">{prev.frontmatter.title}</span>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}
      {next !== null ? (
        <Link
          to={`/blog/${next.slug}`}
          className={cn(linkClass(), "text-right md:items-end")}
        >
          <span className="text-xs text-textSecondary">下一篇 →</span>
          <span className="text-sm font-medium">{next.frontmatter.title}</span>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}
    </nav>
  );
}

export default PrevNextNav;
