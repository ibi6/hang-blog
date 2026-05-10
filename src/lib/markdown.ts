/**
 * Feature: personal-portfolio-blog
 * Markdown helpers: filename -> slug, frontmatter validation,
 * heading slugification, and TOC extraction.
 */
import type { BlogFrontmatter, TocItem } from "../types/blog";

/**
 * Extract a kebab-case slug from a Markdown file path, e.g.
 * `"../content/posts/2024-03-15-hello-world.md"` -> `"2024-03-15-hello-world"`.
 * Assumes the filename stem is already well-formed.
 */
export function slugFromFilename(path: string): string {
  // Strip directory portion (support both forward and back slashes).
  const base = path.split(/[\\/]/).pop() ?? path;
  return base.replace(/\.md$/i, "");
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

/**
 * Validate and narrow an unknown frontmatter payload to BlogFrontmatter.
 * Throws when a required field is missing or malformed. Optional fields
 * (`author`, `cover`) are preserved only when they are strings.
 */
export function parseFrontmatter(raw: unknown): BlogFrontmatter {
  if (raw === null || typeof raw !== "object") {
    throw new Error("Frontmatter must be an object");
  }
  const r = raw as Record<string, unknown>;

  const { title, date, tags, summary, author, cover } = r;

  if (typeof title !== "string" || title.length === 0) {
    throw new Error("Frontmatter: `title` must be a non-empty string");
  }
  if (typeof date !== "string" || date.length === 0) {
    throw new Error("Frontmatter: `date` must be an ISO date string");
  }
  if (!isStringArray(tags)) {
    throw new Error("Frontmatter: `tags` must be an array of strings");
  }
  if (typeof summary !== "string") {
    throw new Error("Frontmatter: `summary` must be a string");
  }

  const out: BlogFrontmatter = { title, date, tags, summary };
  if (typeof author === "string") out.author = author;
  if (typeof cover === "string") out.cover = cover;
  return out;
}

/**
 * Slugify a heading text into an anchor id.
 *
 * Rules:
 * - trim and lowercase
 * - runs of whitespace collapse to a single `-`
 * - characters outside `[a-z0-9\u4e00-\u9fa5]` become `-`
 * - consecutive `-` collapse
 * - leading/trailing `-` stripped
 * - empty result falls back to `"untitled"`
 *
 * Idempotent: `slugifyHeading(slugifyHeading(t)) === slugifyHeading(t)`.
 */
export function slugifyHeading(text: string): string {
  const lowered = text.toLowerCase().trim();
  // Replace any non-allowed char with '-'. Allow ASCII alnum and CJK unified
  // ideographs so Chinese headings remain readable.
  const replaced = lowered
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return replaced === "" ? "untitled" : replaced;
}

/**
 * Extract h2 and h3 headings from raw Markdown, skipping code blocks.
 *
 * - Code fences (```...```) toggle an ignore flag so `#` inside code is ignored.
 * - Setext-style headings are not supported (ATX only).
 * - Duplicate ids receive a numeric suffix `-1`, `-2`, ... to keep anchors unique.
 */
export function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split(/\r?\n/);
  const items: TocItem[] = [];
  const idCounts = new Map<string, number>();
  let inFence = false;

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const hashes = m[1]!;
    const text = m[2]!.trim();
    if (text.length === 0) continue;
    const depth = hashes.length as 2 | 3;

    const baseId = slugifyHeading(text);
    const count = idCounts.get(baseId) ?? 0;
    idCounts.set(baseId, count + 1);
    const id = count === 0 ? baseId : `${baseId}-${count}`;
    items.push({ id, text, depth });
  }

  return items;
}
