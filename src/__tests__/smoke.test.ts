/**
 * Smoke test to verify Vitest test pipeline is operational.
 * Feature: personal-portfolio-blog
 * Task 1.5: Smoke verification
 */

import { describe, it, expect } from "vitest";

describe("Vitest smoke test", () => {
  it("should perform basic arithmetic correctly", () => {
    expect(1 + 1).toBe(2);
  });

  it("should handle string operations", () => {
    expect("hello" + " " + "world").toBe("hello world");
  });

  it("should verify array operations", () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr[0]).toBe(1);
  });
});
