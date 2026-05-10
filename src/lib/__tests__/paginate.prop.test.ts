/**
 * Feature: personal-portfolio-blog
 * Property 5: 分页的拼接还原与边界正确性
 * Validates: Requirement 8.5
 */
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { paginate } from "../paginate";

describe("paginate (Property 5)", () => {
  it("satisfies all five sub-properties", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer(), { maxLength: 50 }),
        fc.integer({ min: 1, max: 20 }),
        fc.integer({ min: 1, max: 60 }),
        (items, perPage, page) => {
          const result = paginate(items, page, perPage);
          const expectedTotalPages = Math.max(
            1,
            Math.ceil(items.length / perPage),
          );

          // (a) result.items.length <= perPage
          expect(result.items.length).toBeLessThanOrEqual(perPage);
          // (b) totalPages formula
          expect(result.totalPages).toBe(expectedTotalPages);
          // (c) total equals items.length
          expect(result.total).toBe(items.length);

          // (e) when page > totalPages: items is empty and page clamps to totalPages
          if (page > expectedTotalPages) {
            expect(result.items).toEqual([]);
            expect(result.page).toBe(expectedTotalPages);
          }
        },
      ),
    );
  });

  it("(d) concatenating pages 1..totalPages yields the original array", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer(), { maxLength: 50 }),
        fc.integer({ min: 1, max: 20 }),
        (items, perPage) => {
          const totalPages = Math.max(1, Math.ceil(items.length / perPage));
          const collected: number[] = [];
          for (let p = 1; p <= totalPages; p++) {
            collected.push(...paginate(items, p, perPage).items);
          }
          expect(collected).toEqual(items);
        },
      ),
    );
  });

  it("clamps page < 1 to 1 when results exist on page 1", () => {
    // Example test guarding the lower-bound clamp, since fc min page is 1.
    const result = paginate([1, 2, 3, 4, 5], 0, 2);
    expect(result.page).toBe(1);
    expect(result.items).toEqual([1, 2]);
    expect(result.totalPages).toBe(3);
  });

  it("handles empty input: totalPages=1, items=[], total=0, page=1", () => {
    const result = paginate<number>([], 7, 10);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(1);
    expect(result.items).toEqual([]);
    expect(result.page).toBe(1);
  });
});
