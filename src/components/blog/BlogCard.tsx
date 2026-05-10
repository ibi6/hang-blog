/**
 * Feature: personal-portfolio-blog
 *
 * `BlogCard` — glass card summary of a blog post used on the blog list
 * and home "latest posts" section. The entire card is a single link.
 *
 * Requirements: 8.2, 8.3, 12.2, 12.4, 13.3
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import type { BlogPost } from "../../types/blog";
import { GlassCard } from "../glass/GlassCard";
import { TagPill } from "../ui/TagPill";
import { Skeleton } from "../ui/Skeleton";
import { cn } from "../../lib/cn";

export interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

/**
 * Render an ISO date in a human-friendly Simplified Chinese form.
 * Falls back to the raw ISO string when parsing fails (e.g. tests with
 * non-date inputs).
 */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  try {
    return d.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function BlogCard({ post, className }: BlogCardProps): JSX.Element {
  const [loaded, setLoaded] = useState<boolean>(false);
  const { frontmatter, readingTimeMinutes, slug } = post;
  const { cover, title, summary, date, tags } = frontmatter;

  return (
    <Link
      to={`/blog/${slug}`}
      className={cn(
        "block rounded-2xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        className,
      )}
    >
      <GlassCard
        as="article"
        className="flex h-full flex-col overflow-hidden p-0 transition-shadow duration-300 hover:shadow-glassLg"
      >
        {cover !== undefined && (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            {!loaded && (
              <Skeleton
                className="absolute inset-0 h-full w-full"
                rounded="sm"
                ariaLabel="加载封面中"
              />
            )}
            <img
              src={cover}
              alt={title}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-textSecondary">
            <time dateTime={date}>{formatDate(date)}</time>
            <span aria-hidden="true">•</span>
            <span>{readingTimeMinutes} 分钟阅读</span>
          </div>
          <h3 className="text-lg font-semibold text-textPrimary">{title}</h3>
          <p className="flex-1 text-sm leading-relaxed text-textSecondary">
            {summary}
          </p>
          {tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <li key={t}>
                  <TagPill label={t} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </GlassCard>
    </Link>
  );
}

export default BlogCard;
export { formatDate };
