/**
 * Feature: personal-portfolio-blog
 * Case-insensitive substring search over blog post titles.
 */
import type { BlogPost } from "../types/blog";

/**
 * Search posts by title. Case-insensitive, trimmed substring match.
 *
 * - When `query` is empty or whitespace-only, returns a shallow copy of the
 *   entire input (no filter applied).
 * - Otherwise returns posts whose normalized title contains the normalized
 *   query as a substring.
 */
export function searchPostsByTitle(
  posts: BlogPost[],
  query: string,
): BlogPost[] {
  const normalized = query.trim().toLowerCase();
  if (normalized === "") return posts.slice();
  return posts.filter((p) =>
    p.frontmatter.title.toLowerCase().includes(normalized),
  );
}
