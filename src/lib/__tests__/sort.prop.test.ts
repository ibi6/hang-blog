/**
 * Feature: personal-portfolio-blog
 * Property 3: 博客按日期倒序排序的不变量
 * Validates: Requirement 8.1
 */
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { sortByDateDesc } from "../sort";

interface TestItem {
  id: string;
  frontmatter: { date: string };
}

const itemArb: fc.Arbitrary<TestItem> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 16 }),
  frontmatter: fc.record({
    date: fc.date({ min: new Date("1970-01-01"), max: new Date("2099-12-31") })
      .map((d) => d.toISOString()),
  }),
});

function multisetById(items: TestItem[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const it of items) {
    m.set(it.id, (m.get(it.id) ?? 0) + 1);
  }
  return m;
}

describe("sortByDateDesc (Property 3)", () => {
  it("preserves length, permutation (by id), and non-increasing dates", () => {
    fc.assert(
      fc.property(fc.array(itemArb, { maxLength: 50 }), (items) => {
        const input = items.slice();
        const result = sortByDateDesc(items);
        // (a) length preserved
        expect(result.length).toBe(input.length);
        // (b) multiset equal by id
        const a = multisetById(input);
        const b = multisetById(result);
        expect(b.size).toBe(a.size);
        for (const [k, v] of a) {
          expect(b.get(k)).toBe(v);
        }
        // (c) adjacent non-increasing dates
        for (let i = 1; i < result.length; i++) {
          const prev = result[i - 1]!.frontmatter.date;
          const curr = result[i]!.frontmatter.date;
          expect(prev >= curr).toBe(true);
        }
      }),
    );
  });

  it("does not mutate the input array", () => {
    fc.assert(
      fc.property(fc.array(itemArb, { maxLength: 20 }), (items) => {
        const snapshot = items.slice();
        sortByDateDesc(items);
        expect(items).toEqual(snapshot);
      }),
    );
  });
});
