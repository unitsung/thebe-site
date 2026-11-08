import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Portal pages layout and accessibility", () => {
  const routes = [
    { path: "/", titleRegex: /Thebe/ },
    { path: "/en/", titleRegex: /Thebe/ },
    { path: "/app/", titleRegex: /App/ },
    { path: "/en/app/", titleRegex: /App/ },
    { path: "/core/", titleRegex: /Core/ },
    { path: "/en/core/", titleRegex: /Core/ },
    { path: "/core/docs/", titleRegex: /Core/ },
    { path: "/en/core/docs/", titleRegex: /Core/ },
  ];

  for (const { path, titleRegex } of routes) {
    test(`renders ${path} without horizontal scroll or broken layout`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(titleRegex);

      // Check no horizontal scroll overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // 1px margin for subpixel rendering
    });
  }

  test("accessibility check on entry pages", async ({ page }) => {
    for (const path of ["/", "/en/", "/core/docs/"]) {
      await page.goto(path);
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .disableRules(["color-contrast"]) // theme-dependent contrast is checked in design review
        .analyze();

      const seriousOrCritical = accessibilityScanResults.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(seriousOrCritical).toEqual([]);
    }
  });

  test("404 returns status 404 and displays error page", async ({ page }) => {
    const response = await page.goto("/non-existent-route-for-testing");
    expect(response.status()).toBe(404);
    await expect(page.locator("h1")).toContainText(/页面未找到|Page not found/);
  });
});
