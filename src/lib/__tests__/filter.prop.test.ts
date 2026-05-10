/**
 * Feature: personal-portfolio-blog
 * Property 2: 项目/博客标签过滤的包含性与完备性
 * Validates: Requirements 7.6, 8.4
 */
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { filterProjectsByTag, filterPostsByTag } from "../filter";
import type { Project } from "../../types/project";
import type { BlogPost } from "../../types/blog";

const projectArb: fc.Arbitrary<Project> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 16 }),
  name: fc.string(),
  description: fc.string(),
  cover: fc.string(),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 12 }), { maxLength: 6 }),
  links: fc.constant([]),
});

const postArb: fc.Arbitrary<BlogPost> = fc.record({
  slug: fc.string({ minLength: 1, maxLength: 16 }),
  frontmatter: fc.record({
    title: fc.string(),
    date: fc.constant("2024-01-01"),
    tags: fc.array(fc.string({ minLength: 1, maxLength: 12 }), {
      maxLength: 6,
    }),
    summary: fc.string(),
  }),
  contentHtml: fc.constant(""),
  contentRaw: fc.constant(""),
  readingTimeMinutes: fc.constant(1),
  toc: fc.constant([]),
});

describe("filterProjectsByTag (Property 2)", () => {
  it("returns a subset, full list when tag=null, and iff containment otherwise", () => {
    fc.assert(
      fc.property(
        fc.array(projectArb, { maxLength: 20 }),
        fc.option(fc.string({ minLength: 1, maxLength: 12 }), { nil: null }),
        (projects, tag) => {
          const result = filterProjectsByTag(projects, tag);
          // (a) subset
          for (const p of result) {
            expect(projects).toContain(p);
          }
          if (tag === null) {
            // (b) full list
            expect(result.length).toBe(projects.length);
            for (const p of projects) {
              expect(result).toContain(p);
            }
          } else {
            // (c) iff containment
            for (const p of result) {
              expect(p.tags).toContain(tag);
            }
            for (const p of projects) {
              if (p.tags.includes(tag)) {
                expect(result).toContain(p);
              }
            }
          }
        },
      ),
    );
  });
});

describe("filterPostsByTag (Property 2)", () => {
  it("returns a subset, full list when tag=null, and iff containment otherwise", () => {
    fc.assert(
      fc.property(
        fc.array(postArb, { maxLength: 20 }),
        fc.option(fc.string({ minLength: 1, maxLength: 12 }), { nil: null }),
        (posts, tag) => {
          const result = filterPostsByTag(posts, tag);
          for (const p of result) {
            expect(posts).toContain(p);
          }
          if (tag === null) {
            expect(result.length).toBe(posts.length);
            for (const p of posts) {
              expect(result).toContain(p);
            }
          } else {
            for (const p of result) {
              expect(p.frontmatter.tags).toContain(tag);
            }
            for (const p of posts) {
              if (p.frontmatter.tags.includes(tag)) {
                expect(result).toContain(p);
              }
            }
          }
        },
      ),
    );
  });
});
