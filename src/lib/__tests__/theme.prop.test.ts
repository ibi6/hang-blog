/**
 * Feature: personal-portfolio-blog
 * Property 1: 主题初始化解析的分支完备性
 * Validates: Requirements 3.2, 3.6, 3.7
 */
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { resolveInitialTheme } from "../theme";

describe("resolveInitialTheme (Property 1)", () => {
  it("branch completeness over arbitrary stored/prefersDark", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(null),
          fc.constantFrom<string>("light", "dark"),
          fc.string(),
        ),
        fc.boolean(),
        (stored, prefersDark) => {
          const result = resolveInitialTheme(stored, prefersDark);
          if (stored === "light") {
            expect(result).toBe("light");
          } else if (stored === "dark") {
            expect(result).toBe("dark");
          } else {
            expect(result).toBe(prefersDark ? "dark" : "light");
          }
        },
      ),
    );
  });
});
