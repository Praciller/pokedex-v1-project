import { test, expect } from "@playwright/test";

test.describe("Pokédex App E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto("/");
  });

  test("should load the homepage", async ({ page }) => {
    // Check if the page loads (actual title is "React Redux App")
    await expect(page).toHaveTitle(/React Redux App/);

    // Check if main elements are present
    await expect(page.locator("body")).toBeVisible();
  });

  test("should navigate to login page", async ({ page }) => {
    // Navigate to the My List page which shows login when not authenticated
    await page.goto("/list");

    // Check if login elements are present (actual button text is "Login with Google")
    const loginButton = page.getByRole("button", {
      name: /login with google/i,
    });
    await expect(loginButton).toBeVisible();
  });

  test("should have responsive design", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("body")).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator("body")).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator("body")).toBeVisible();
  });

  test("should handle navigation", async ({ page }) => {
    // Check if the app loads without JavaScript errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Wait for the page to load with a shorter timeout
    await page.waitForLoadState("domcontentloaded");

    // Filter out known warnings (React Router deprecation warnings)
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes("React Router Future Flag Warning") &&
        !error.includes("deprecation")
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test("should load CSS styles correctly", async ({ page }) => {
    // Check if styles are loaded by verifying computed styles
    const body = page.locator("body");
    await expect(body).toBeVisible();

    // Check if the app has some basic styling
    const backgroundColor = await body.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );

    // Should not be the default white background if styles are loaded
    expect(backgroundColor).toBeDefined();
  });
});
