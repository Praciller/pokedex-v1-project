import { test, expect } from "@playwright/test";

test.describe("My List Image Loading Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should load My List page without console errors", async ({ page }) => {
    const consoleErrors: string[] = [];
    
    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to My List page
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000); // Wait for any async operations

    // Check that the page loaded successfully
    await expect(page.locator(".list")).toBeVisible();

    // Verify no critical console errors related to image loading
    const criticalErrors = consoleErrors.filter(error => 
      error.includes('Failed to load') || 
      error.includes('404') || 
      error.includes('Cannot resolve module') ||
      error.includes('images') ||
      error.includes('defaultImages')
    );

    if (criticalErrors.length > 0) {
      console.log('Console errors found:', criticalErrors);
    }

    // The page should load without critical image-related errors
    expect(criticalErrors.length).toBe(0);
  });

  test("should handle getUserPokemons reducer without errors", async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to My List page which triggers getUserPokemons
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3000); // Wait for Redux actions to complete

    // Check for Redux-related errors
    const reduxErrors = consoleErrors.filter(error => 
      error.includes('getUserPokemons') || 
      error.includes('images is not defined') ||
      error.includes('defaultImages is not defined') ||
      error.includes('Cannot read property') ||
      error.includes('TypeError')
    );

    if (reduxErrors.length > 0) {
      console.log('Redux errors found:', reduxErrors);
    }

    expect(reduxErrors.length).toBe(0);
  });

  test("should display login component correctly", async ({ page }) => {
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");

    // Should show login when not authenticated
    await expect(page.locator(".login")).toBeVisible();
    await expect(page.locator(".login-btn")).toBeVisible();
    await expect(page.locator(".login-btn")).toContainText("Login with Google");

    // Login button should have Google icon
    await expect(page.locator(".login-btn svg")).toBeVisible();
  });

  test("should handle navigation to My List from different pages", async ({ page }) => {
    // Test navigation from search page
    await page.goto("/search");
    await page.waitForLoadState("domcontentloaded");
    
    await page.click('a[href="/list"]');
    await page.waitForLoadState("domcontentloaded");
    
    expect(page.url()).toContain("/list");
    await expect(page.locator(".list")).toBeVisible();

    // Test navigation from Pokemon detail page
    await page.goto("/pokemon/1");
    await page.waitForLoadState("domcontentloaded");
    
    await page.click('a[href="/list"]');
    await page.waitForLoadState("domcontentloaded");
    
    expect(page.url()).toContain("/list");
    await expect(page.locator(".list")).toBeVisible();

    // Test navigation from compare page
    await page.goto("/compare");
    await page.waitForLoadState("domcontentloaded");
    
    await page.click('a[href="/list"]');
    await page.waitForLoadState("domcontentloaded");
    
    expect(page.url()).toContain("/list");
    await expect(page.locator(".list")).toBeVisible();
  });

  test("should handle page refresh without errors", async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to My List page
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);

    // Refresh the page
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);

    // Page should still work after refresh
    await expect(page.locator(".list")).toBeVisible();

    // Check for errors after refresh
    const criticalErrors = consoleErrors.filter(error => 
      error.includes('Failed to load') || 
      error.includes('Cannot resolve module') ||
      error.includes('TypeError')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test("should maintain proper component structure", async ({ page }) => {
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");

    // Check main structure
    await expect(page.locator(".list")).toBeVisible();
    
    // Should have navbar with MY LIST link highlighted or accessible
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator('a[href="/list"]')).toBeVisible();
    
    // Should have footer
    await expect(page.locator("footer")).toBeVisible();

    // Should show login component when not authenticated
    await expect(page.locator(".login")).toBeVisible();
  });

  test("should handle lazy image loading system integration", async ({ page }) => {
    // This test verifies that the LazyImage component system is properly integrated
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");

    // The page should load without errors even though we changed the image system
    await expect(page.locator(".list")).toBeVisible();

    // If user were authenticated and had Pokemon, LazyImage components would be used
    // For now, we verify the page structure is correct
    const hasLogin = await page.locator(".login").isVisible();
    const hasGrid = await page.locator(".pokemon-card-grid-container").isVisible();
    
    // One of these should be visible
    expect(hasLogin || hasGrid).toBeTruthy();
  });

  test("should handle mobile viewport correctly", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");

    // Page should be responsive
    await expect(page.locator(".list")).toBeVisible();
    await expect(page.locator(".login")).toBeVisible();

    // Login button should be visible and clickable on mobile
    await expect(page.locator(".login-btn")).toBeVisible();
  });
});
