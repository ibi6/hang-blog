/**
 * Feature: personal-portfolio-blog
 * Example-based tests for calculateReadingTime.
 */
import { describe, it, expect } from "vitest";
import { calculateReadingTime } from "../readingTime";

describe("calculateReadingTime", () => {
  it("returns 1 for empty input", () => {
    expect(calculateReadingTime("")).toBe(1);
  });

  it("returns 1 when the document only contains a code block", () => {
    const md = "```\nconsole.log('hello');\nfor (let i = 0; i < 10; i++) {}\n```";
    expect(calculateReadingTime(md)).toBe(1);
  });

  it("counts 440 English words at default 220 wpm to 2 minutes", () => {
    const words = Array.from({ length: 440 }, (_, i) => `word${i}`).join(" ");
    expect(calculateReadingTime(words)).toBe(2);
  });

  it("handles Unicode / CJK characters as one word each", () => {
    // 660 CJK characters at 220 wpm = 3 minutes.
    const cjk = "你好世界这是测试".repeat(Math.ceil(660 / 8)).slice(0, 660);
    expect(calculateReadingTime(cjk)).toBe(Math.ceil(660 / 220));
  });

  it("ignores multiple whitespace runs and still returns at least 1", () => {
    expect(calculateReadingTime("   \n\n \t   ")).toBe(1);
  });

  it("strips frontmatter before counting", () => {
    const md =
      "---\ntitle: Ignore Me\nauthor: Someone\n---\nhello world";
    expect(calculateReadingTime(md)).toBe(1);
  });

  it("uses a custom wpm when provided", () => {
    const words = Array.from({ length: 100 }, (_, i) => `w${i}`).join(" ");
    expect(calculateReadingTime(words, 50)).toBe(2);
  });
});
