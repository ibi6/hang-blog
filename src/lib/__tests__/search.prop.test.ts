/**
 * Feature: personal-portfolio-blog
 * Property 4: 博客标题搜索的子集与匹配性
 * Validates: Requirement 8.6
 */
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { searchPostsByTitle } from "../search";
import type { BlogPost } from "../../types/blog";

const postArb: fc.Arbitrary<BlogPost> = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 16 }),
  frontmatter: fc.record({
    title: fc.string(),
    date: fc.constant("2024-01-01"),
    tags: fc.constant<string[]>([]),
    summary: fc.constant(""),
  }),
  contentHtml: fc.constant(""),
  contentRaw: fc.constant(""),
  readingTimeMinutes: fc.constant(1),
  toc: fc.constant([]),
});

const whitespaceQueryArb = fc.stringMatching(/^[ \t\n]*$/);

describe("searchPostsByTitle (Property 4)", () => {
  it("returns a subset", () => {
    fc.assert(
      fc.property(
        fc.array(postArb, { maxLength: 20 }),
        fc.string(),
        (posts, query) => {
          const result = searchPostsByTitle(posts, query);
          for (const p of result) {
            expect(posts).toContain(p);
          }
        },
      ),
    );
  });

  it("returns the full input when query is empty or whitespace-only", () => {
    fc.assert(
      fc.property(
        fc.array(postArb, { maxLength: 20 }),
        whitespaceQueryArb,
        (posts, query) => {
          const result = searchPostsByTitle(posts, query);
          expect(result.length).toBe(posts.length);
          for (const p of posts) {
            expect(result).toContain(p);
          }
        },
      ),
    );
  });

  it("matches iff normalized title contains normalized query", () => {
    fc.assert(
      fc.property(
        fc.array(postArb, { maxLength: 20 }),
        fc.string(),
        (posts, query) => {
          const normalized = query.trim().toLowerCase();
          if (normalized === "") return; // covered elsewhere
          const result = searchPostsByTitle(posts, query);
          // forward: each result contains
          for (const p of result) {
            expect(p.frontmatter.title.toLowerCase().includes(normalized)).toBe(
              true,
            );
          }
          // reverse: every matching input is in result
          for (const p of posts) {
            if (p.frontmatter.title.toLowerCase().includes(normalized)) {
              expect(result).toContain(p);
            }
          }
        },
      ),
    );
  });
});
