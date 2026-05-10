/**
 * Smoke test to verify Playwright E2E test pipeline is operational.
 * Feature: personal-portfolio-blog
 * Task 1.5: Smoke verification
 *
 * This test verifies that:
 * 1. The Vite preview server starts successfully
 * 2. The root route (/) returns HTTP 200
 * 3. Basic page navigation works
 */

import { test, expect } from "@playwright/test";

test.describe("Playwright smoke test", () => {
  test("should load the home page and return 200", async ({ page }) => {
    // Navigate to the root route
    const response = await page.goto("/");

    // Verify HTTP 200 status
    expect(response).not.toBeNull();
    expect(response?.status()).toBe(200);

    // Verify the page loaded by checking for basic HTML structure
    const html = await page.content();
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html");
  });

  test("should have a valid document title", async ({ page }) => {
    await page.goto("/");

    // Verify the page has a title (even if it's the default Vite title)
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test("should render the root element", async ({ page }) => {
    await page.goto("/");

    // Verify the React root element exists
    const root = await page.locator("#root");
    await expect(root).toBeAttached();
  });
});
