/**
 * Feature: personal-portfolio-blog
 * Reading-time estimation for Markdown content.
 */

const FRONTMATTER_RE = /^---\n[\s\S]*?\n---\n?/;
const CODE_FENCE_RE = /```[\s\S]*?```/g;

/**
 * Estimate reading time in minutes for a Markdown string.
 *
 * - Strips YAML frontmatter block from the top.
 * - Removes fenced code blocks so their contents don't inflate the count.
 * - Counts CJK characters individually (1 word each) and non-CJK runs of
 *   non-whitespace as single words.
 * - Returns at least 1 minute.
 */
export function calculateReadingTime(
  markdown: string,
  wpm: number = 220,
): number {
  const safeWpm = wpm > 0 ? wpm : 220;
  const withoutFrontmatter = markdown.replace(FRONTMATTER_RE, "");
  const withoutCode = withoutFrontmatter.replace(CODE_FENCE_RE, " ");
  const tokens = withoutCode.match(/[\u4e00-\u9fa5]|\S+/g);
  const words = tokens ? tokens.length : 0;
  return Math.max(1, Math.ceil(words / safeWpm));
}
