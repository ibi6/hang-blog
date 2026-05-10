/**
 * Feature: personal-portfolio-blog
 * Tag filtering helpers for projects and blog posts.
 */
import type { Project } from "../types/project";
import type { BlogPost } from "../types/blog";

/**
 * Filter projects by tag. When `tag` is null returns a shallow copy of the
 * entire input. Otherwise returns projects whose `tags` array contains the tag.
 */
export function filterProjectsByTag(
  projects: Project[],
  tag: string | null,
): Project[] {
  if (tag === null) return projects.slice();
  return projects.filter((p) => p.tags.includes(tag));
}

/**
 * Filter blog posts by tag. When `tag` is null returns a shallow copy of the
 * entire input. Otherwise returns posts whose frontmatter.tags contains the tag.
 */
export function filterPostsByTag(
  posts: BlogPost[],
  tag: string | null,
): BlogPost[] {
  if (tag === null) return posts.slice();
  return posts.filter((p) => p.frontmatter.tags.includes(tag));
}
