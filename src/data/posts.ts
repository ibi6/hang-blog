/**
 * Feature: personal-portfolio-blog
 *
 * Build-time aggregation of blog posts.
 *
 * Loads every Markdown file under `src/content/posts/` via Vite's
 * `import.meta.glob` and turns each into a fully-hydrated `BlogPost`.
 *
 * Notes:
 * - Uses Vite 5's `{ query: "?raw", import: "default" }` form. The legacy
 *   `{ as: "raw" }` form is deprecated in Vite 5.
 * - Frontmatter parsing is done with a small in-house parser to avoid the
 *   Node `Buffer` dependency introduced by `gray-matter` in the browser.
 *   Our frontmatter format is controlled and simple: a single `---` block
 *   with `key: value` lines and optional JSON-style array literals.
 * - `contentHtml` stays empty on purpose; `BlogPost` pages render Markdown
 *   at runtime via `react-markdown`.
 */
import type { BlogPost } from "../types/blog";
import {
  extractToc,
  parseFrontmatter,
  slugFromFilename,
} from "../lib/markdown";
import { calculateReadingTime } from "../lib/readingTime";
import { sortByDateDesc } from "../lib/sort";

interface SimpleFrontmatter {
  data: Record<string, unknown>;
  content: string;
}

/**
 * Minimal YAML frontmatter parser that handles the subset we use:
 * scalar strings (optionally quoted) and inline array literals.
 */
function parseSimpleFrontmatter(raw: string): SimpleFrontmatter {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, content: raw };
  const yaml = match[1] ?? "";
  const content = match[2] ?? "";
  const data: Record<string, unknown> = {};

  const lines = yaml.split(/\r?\n/);
  for (const line of lines) {
    if (line.trim().length === 0) continue;
    const kv = /^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*)$/.exec(line);
    if (!kv) continue;
    const key = kv[1] ?? "";
    if (key === "") continue;
    let value = (kv[2] ?? "").trim();

    // Array literal: ["a", "b"] or ['a', 'b']
    if (value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1);
      const parts = inner
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => unquote(s));
      data[key] = parts;
      continue;
    }

    data[key] = unquote(value);
  }

  return { data, content };
}

function unquote(s: string): string {
  if (s.length < 2) return s;
  const first = s[0];
  const last = s[s.length - 1];
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    return s.slice(1, -1);
  }
  return s;
}

// Vite 5: use `{ query: "?raw", import: "default" }` instead of the deprecated
// `{ as: "raw" }` form. `eager: true` inlines every file at build time.
const rawModules = import.meta.glob("../content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function buildPost(path: string, source: string): BlogPost {
  const { data, content } = parseSimpleFrontmatter(source);
  const frontmatter = parseFrontmatter(data);
  const slug = slugFromFilename(path);
  const readingTimeMinutes = calculateReadingTime(content);
  const toc = extractToc(content);

  return {
    slug,
    frontmatter,
    contentHtml: "",
    contentRaw: content,
    readingTimeMinutes,
    toc,
  };
}

const unsorted: BlogPost[] = Object.entries(rawModules).map(([path, source]) =>
  buildPost(path, source),
);

/**
 * All known blog posts, sorted by frontmatter date (descending, stable).
 */
export const posts: BlogPost[] = sortByDateDesc(unsorted);

/**
 * Find a post by its slug. Returns `undefined` when no post matches.
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export interface PrevNext {
  prev: BlogPost | null;
  next: BlogPost | null;
}

/**
 * Given a sorted list of posts and an index, return the previous and next
 * posts in the list. Returns `{ prev: null, next: null }` for any invalid
 * index (out of range).
 */
export function computePrevNext(
  list: readonly BlogPost[],
  index: number,
): PrevNext {
  if (!Number.isInteger(index) || index < 0 || index >= list.length) {
    return { prev: null, next: null };
  }
  const prev = index > 0 ? (list[index - 1] ?? null) : null;
  const next = index < list.length - 1 ? (list[index + 1] ?? null) : null;
  return { prev, next };
}
