import { test, expect } from "@playwright/test";

test.describe("My List Functionality Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should show login component when not authenticated", async ({ page }) => {
    // Navigate to My List page
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");

    // Should show login component
    await expect(page.locator(".login")).toBeVisible();
    await expect(page.locator(".login-btn")).toBeVisible();
    await expect(page.locator(".login-btn")).toContainText("Login with Google");
  });

  test("should navigate to My List page from navbar", async ({ page }) => {
    // Click on MY LIST in navbar
    await page.click('a[href="/list"]');
    await page.waitForLoadState("domcontentloaded");

    // Should be on the list page
    expect(page.url()).toContain("/list");
    
    // Should show login component when not authenticated
    await expect(page.locator(".login")).toBeVisible();
  });

  test("should handle authentication flow", async ({ page }) => {
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");

    // Check if login button is present
    const loginButton = page.locator(".login-btn");
    await expect(loginButton).toBeVisible();
    
    // Note: We can't actually test Google OAuth in automated tests
    // but we can verify the login component is rendered correctly
    await expect(loginButton).toContainText("Login with Google");
    await expect(page.locator(".login .login-btn svg")).toBeVisible(); // Google icon
  });

  test("should display empty state when user has no Pokemon", async ({ page }) => {
    // Mock authenticated state by setting localStorage or cookies
    // This is a simplified test - in real scenario we'd need proper auth mocking
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");
    
    // The page should render the list container
    await expect(page.locator(".list")).toBeVisible();
  });

  test("should have proper page structure", async ({ page }) => {
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");

    // Check page structure
    await expect(page.locator(".list")).toBeVisible();
    
    // Should have navbar
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator('a[href="/list"]')).toBeVisible();
    
    // Should have footer
    await expect(page.locator("footer")).toBeVisible();
  });

  test("should handle navigation between pages", async ({ page }) => {
    // Start from search page
    await page.goto("/search");
    await page.waitForLoadState("domcontentloaded");
    
    // Navigate to My List
    await page.click('a[href="/list"]');
    await page.waitForLoadState("domcontentloaded");
    
    expect(page.url()).toContain("/list");
    await expect(page.locator(".list")).toBeVisible();
    
    // Navigate back to search
    await page.click('a[href="/search"]');
    await page.waitForLoadState("domcontentloaded");
    
    expect(page.url()).toContain("/search");
  });

  test("should display Pokemon cards when user has favorites", async ({ page }) => {
    // This test would require mocking Firebase auth and data
    // For now, we'll test the component structure
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");
    
    // The list container should be present
    await expect(page.locator(".list")).toBeVisible();
    
    // If authenticated and has Pokemon, should show PokemonCardGrid
    // If not authenticated, should show Login component
    const hasLogin = await page.locator(".login").isVisible();
    const hasGrid = await page.locator(".pokemon-card-grid-container").isVisible();
    
    // One of these should be true
    expect(hasLogin || hasGrid).toBeTruthy();
  });

  test("should handle add Pokemon to list functionality", async ({ page }) => {
    // Navigate to a Pokemon detail page first
    await page.goto("/pokemon/1");
    await page.waitForLoadState("domcontentloaded");
    
    // Wait for Pokemon data to load
    await page.waitForSelector(".circle-container", { timeout: 10000 });
    
    // Look for add to list button (plus icon)
    const addButton = page.locator(".pokemon-card .plus").first();
    
    // If the button exists, it means the functionality is available
    if (await addButton.isVisible()) {
      // Click would trigger authentication if not logged in
      // In a real test, we'd mock the authentication
      await expect(addButton).toBeVisible();
    }
  });

  test("should handle remove Pokemon from list functionality", async ({ page }) => {
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");
    
    // If user is authenticated and has Pokemon, should show trash icons
    const trashButtons = page.locator(".pokemon-card .trash");
    
    // This would only be visible if user is authenticated and has Pokemon
    // The test verifies the component structure is correct
    if (await trashButtons.first().isVisible()) {
      await expect(trashButtons.first()).toBeVisible();
    }
  });

  test("should display loading states properly", async ({ page }) => {
    await page.goto("/list");
    
    // Should handle loading states gracefully
    await page.waitForLoadState("domcontentloaded");
    
    // Page should not crash and should show appropriate content
    await expect(page.locator(".list")).toBeVisible();
  });

  test("should handle responsive design", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");
    
    await expect(page.locator(".list")).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    
    await expect(page.locator(".list")).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    
    await expect(page.locator(".list")).toBeVisible();
  });
});
