/**
 * Feature: personal-portfolio-blog
 * Property 9: TOC 提取与标题 slug 的一致性
 * Validates: Requirement 9.2
 */
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { slugifyHeading, extractToc } from "../markdown";

// Arbitrary heading text: produce strings containing alnum + whitespace/punct
// so slugifying is meaningful. Ensure non-empty after trim so TOC includes it.
const headingTextArb = fc
  .string({ minLength: 1, maxLength: 40 })
  .filter((s) => s.trim().length > 0 && !/[\r\n]/.test(s));

const headingArb = fc.record({
  depth: fc.constantFrom<2 | 3>(2, 3),
  text: headingTextArb,
});

// Body paragraph arbitrary - avoid starting with `#` to not be mistaken
// for a heading, and avoid triple backticks.
const paragraphArb = fc
  .string({ minLength: 0, maxLength: 60 })
  .map((s) => s.replace(/`{3,}/g, ""))
  .map((s) => (s.startsWith("#") ? `.${s}` : s));

describe("slugifyHeading (Property 9)", () => {
  it("is idempotent", () => {
    fc.assert(
      fc.property(fc.string(), (t) => {
        const once = slugifyHeading(t);
        const twice = slugifyHeading(once);
        expect(twice).toBe(once);
      }),
    );
  });

  it("returns a non-empty slug for empty / whitespace-only input", () => {
    expect(slugifyHeading("")).toBe("untitled");
    expect(slugifyHeading("   ")).toBe("untitled");
    expect(slugifyHeading("\t\n ")).toBe("untitled");
    expect(slugifyHeading("")).not.toBe("");
  });
});

describe("extractToc (Property 9)", () => {
  it("length equals the number of h2+h3 headings; depths are 2 or 3; id matches slugifyHeading when titles are unique", () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(headingArb, {
          maxLength: 8,
          selector: (h) => slugifyHeading(h.text),
        }),
        fc.array(paragraphArb, { maxLength: 5 }),
        (headings, paragraphs) => {
          // Build Markdown by interleaving headings and paragraphs.
          const lines: string[] = [];
          headings.forEach((h, idx) => {
            lines.push(`${"#".repeat(h.depth)} ${h.text}`);
            const p = paragraphs[idx % Math.max(1, paragraphs.length)];
            if (p !== undefined && p.length > 0) lines.push(p);
          });
          const md = lines.join("\n");

          const toc = extractToc(md);
          expect(toc.length).toBe(headings.length);
          for (let i = 0; i < toc.length; i++) {
            const item = toc[i]!;
            const source = headings[i]!;
            expect([2, 3]).toContain(item.depth);
            expect(item.depth).toBe(source.depth);
            // Unique titles => id must equal slugifyHeading(item.text)
            expect(item.id).toBe(slugifyHeading(item.text));
          }
        },
      ),
    );
  });

  it("ignores headings inside fenced code blocks", () => {
    const md = [
      "## Real Heading",
      "```",
      "## Not A Heading",
      "### Also Not",
      "```",
      "### Another Real",
    ].join("\n");
    const toc = extractToc(md);
    expect(toc.map((t) => t.text)).toEqual(["Real Heading", "Another Real"]);
  });

  it("de-duplicates repeating slugs with numeric suffixes", () => {
    const md = "## Hello\n## Hello\n## Hello";
    const toc = extractToc(md);
    expect(toc.map((t) => t.id)).toEqual(["hello", "hello-1", "hello-2"]);
  });
});
