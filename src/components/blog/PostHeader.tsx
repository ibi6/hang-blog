/**
 * Feature: personal-portfolio-blog
 *
 * `PostHeader` — large hero block above a blog post's body. Shows the
 * tag list, title, publication date, reading time, and optional author.
 *
 * Requirements: 9.1, 13.5
 */
import type { BlogPost } from "../../types/blog";
import { TagPill } from "../ui/TagPill";
import { formatDate } from "./BlogCard";

export interface PostHeaderProps {
  post: BlogPost;
}

export function PostHeader({ post }: PostHeaderProps): JSX.Element {
  const { frontmatter, readingTimeMinutes } = post;
  const { tags, title, date, author } = frontmatter;

  return (
    <header className="mb-8 space-y-4">
      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t}>
              <TagPill label={t} />
            </li>
          ))}
        </ul>
      )}
      <h1 className="text-3xl font-semibold leading-tight text-textPrimary md:text-4xl">
        {title}
      </h1>
      <div className="flex flex-wrap items-center gap-3 text-sm text-textSecondary">
        <time dateTime={date}>{formatDate(date)}</time>
        <span aria-hidden="true">•</span>
        <span>{readingTimeMinutes} 分钟阅读</span>
        {author !== undefined && (
          <>
            <span aria-hidden="true">•</span>
            <span>{author}</span>
          </>
        )}
      </div>
    </header>
  );
}

export default PostHeader;
