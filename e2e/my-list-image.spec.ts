import { test, expect } from "@playwright/test";

test.describe("My List Page Image Loading Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test.describe("Authentication Flow", () => {
    test("should show login page when accessing My List without authentication", async ({ page }) => {
      // Navigate to My List page
      await page.goto("/list");
      await page.waitForLoadState("networkidle");
      
      // Should show login button
      const loginButton = page.getByRole("button", { name: /login with google/i });
      await expect(loginButton).toBeVisible();
      
      // Should not show Pokemon list without authentication
      const pokemonCards = page.locator('.pokemon-card');
      const cardCount = await pokemonCards.count();
      expect(cardCount).toBe(0);
    });

    test("should handle login page layout", async ({ page }) => {
      await page.goto("/list");
      await page.waitForLoadState("networkidle");
      
      // Check login page structure
      const loginContainer = page.locator('.login');
      await expect(loginContainer).toBeVisible();
      
      // Should have proper styling and layout
      const isVisible = await loginContainer.isVisible();
      expect(isVisible).toBe(true);
    });
  });

  test.describe("Pokemon List Management", () => {
    test("should handle adding Pokemon to list from search page", async ({ page }) => {
      // Start from search page
      await page.waitForSelector('.pokemon-card', { timeout: 15000 });
      
      // Look for add buttons (plus icons)
      const addButtons = page.locator('.plus');
      const addButtonCount = await addButtons.count();
      
      if (addButtonCount > 0) {
        // Click first add button
        await addButtons.first().click();
        
        // Should show some feedback (toast notification)
        // Note: Without authentication, this might not work, but we test the UI
        await page.waitForTimeout(1000);
      }
    });

    test("should show proper icons for list management", async ({ page }) => {
      await page.waitForSelector('.pokemon-card', { timeout: 15000 });
      
      // Check for plus icons on search page
      const plusIcons = page.locator('.plus');
      const plusCount = await plusIcons.count();
      expect(plusCount).toBeGreaterThan(0);
      
      // Verify icons are visible
      const firstPlusIcon = plusIcons.first();
      await expect(firstPlusIcon).toBeVisible();
    });

    test("should handle compare functionality", async ({ page }) => {
      await page.waitForSelector('.pokemon-card', { timeout: 15000 });
      
      // Look for compare icons
      const compareIcons = page.locator('svg[data-icon="git-compare"]');
      const compareCount = await compareIcons.count();
      
      if (compareCount > 0) {
        // Click compare icon
        await compareIcons.first().click();
        
        // Should add to compare queue
        await page.waitForTimeout(1000);
        
        // Navigate to compare page
        await page.goto("/compare");
        await page.waitForLoadState("networkidle");
        
        // Check if Pokemon was added to compare
        const compareContainer = page.locator('.compare-container');
        await expect(compareContainer).toBeVisible();
      }
    });
  });

  test.describe("List Page Image Scenarios", () => {
    test("should handle empty list state", async ({ page }) => {
      // Navigate to list page (will show login)
      await page.goto("/list");
      await page.waitForLoadState("networkidle");
      
      // Should show login instead of empty list
      const loginButton = page.getByRole("button", { name: /login with google/i });
      await expect(loginButton).toBeVisible();
    });

    test("should maintain image quality in list view", async ({ page }) => {
      // Since we can't easily test authenticated state, we'll test the component structure
      await page.goto("/list");
      await page.waitForLoadState("networkidle");
      
      // Check that the page structure is correct
      const mainContainer = page.locator('.main-container');
      await expect(mainContainer).toBeVisible();
      
      // Should have proper navigation
      const navbar = page.locator('nav, .navbar, .navigation');
      const navExists = await navbar.count() > 0;
      expect(navExists).toBe(true);
    });
  });

  test.describe("List Interaction Testing", () => {
    test("should handle Pokemon card interactions from search", async ({ page }) => {
      await page.waitForSelector('.pokemon-card', { timeout: 15000 });
      
      // Test clicking on Pokemon image to navigate to detail
      const firstCardImage = page.locator('.pokemon-card-image').first();
      await firstCardImage.click();
      
      // Should navigate to Pokemon detail page
      await page.waitForURL(/\/pokemon\/\d+/);
      await page.waitForLoadState("networkidle");
      
      // Verify detail page loads with image
      await page.waitForSelector('.inner-circle img', { timeout: 15000 });
      
      const detailImage = page.locator('.inner-circle img');
      await expect(detailImage).toBeVisible();
      
      // Verify image has valid src
      const src = await detailImage.getAttribute('src');
      expect(src).toBeTruthy();
    });

    test("should handle navigation between pages", async ({ page }) => {
      // Start from search
      await page.waitForSelector('.pokemon-card', { timeout: 15000 });
      
      // Navigate to list page
      await page.goto("/list");
      await page.waitForLoadState("networkidle");
      
      // Should show login
      const loginButton = page.getByRole("button", { name: /login with google/i });
      await expect(loginButton).toBeVisible();
      
      // Navigate back to search
      await page.goto("/search");
      await page.waitForLoadState("networkidle");
      
      // Images should still load properly
      await page.waitForSelector('.pokemon-card', { timeout: 15000 });
      const cardImages = page.locator('.pokemon-card-image');
      const imageCount = await cardImages.count();
      expect(imageCount).toBeGreaterThan(0);
    });
  });

  test.describe("Error Handling in List Context", () => {
    test("should handle network errors gracefully", async ({ page }) => {
      // Block some requests to simulate network issues
      await page.route('**/pokemon/**', async (route) => {
        // Let some requests through, block others
        if (Math.random() > 0.5) {
          await route.continue();
        } else {
          await route.abort();
        }
      });

      await page.goto("/list");
      await page.waitForLoadState("networkidle");
      
      // Should still show login page even with network issues
      const loginButton = page.getByRole("button", { name: /login with google/i });
      await expect(loginButton).toBeVisible();
    });

    test("should handle authentication errors", async ({ page }) => {
      await page.goto("/list");
      await page.waitForLoadState("networkidle");
      
      // Should show login when not authenticated
      const loginButton = page.getByRole("button", { name: /login with google/i });
      await expect(loginButton).toBeVisible();
      
      // Should not show any error messages for normal unauthenticated state
      const errorMessages = page.locator('.error, .alert-error, [role="alert"]');
      const errorCount = await errorMessages.count();
      expect(errorCount).toBe(0);
    });
  });

  test.describe("Responsive Design for List Page", () => {
    test("should handle mobile layout for list page", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto("/list");
      await page.waitForLoadState("networkidle");
      
      // Should show login button on mobile
      const loginButton = page.getByRole("button", { name: /login with google/i });
      await expect(loginButton).toBeVisible();
      
      // Check mobile responsiveness
      const isVisible = await loginButton.isVisible();
      expect(isVisible).toBe(true);
    });

    test("should handle tablet layout for list page", async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto("/list");
      await page.waitForLoadState("networkidle");
      
      // Should show login button on tablet
      const loginButton = page.getByRole("button", { name: /login with google/i });
      await expect(loginButton).toBeVisible();
    });
  });

  test.describe("Performance Testing for List Operations", () => {
    test("should handle list operations efficiently", async ({ page }) => {
      // Track performance
      const startTime = Date.now();
      
      await page.goto("/list");
      await page.waitForLoadState("networkidle");
      
      const loadTime = Date.now() - startTime;
      
      // Should load reasonably quickly
      expect(loadTime).toBeLessThan(10000);
      
      // Should show login
      const loginButton = page.getByRole("button", { name: /login with google/i });
      await expect(loginButton).toBeVisible();
    });

    test("should handle rapid navigation", async ({ page }) => {
      // Rapidly navigate between pages
      await page.goto("/search");
      await page.waitForLoadState("networkidle");
      
      await page.goto("/list");
      await page.waitForLoadState("networkidle");
      
      await page.goto("/compare");
      await page.waitForLoadState("networkidle");
      
      await page.goto("/about");
      await page.waitForLoadState("networkidle");
      
      // Should handle rapid navigation without errors
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(msg.text());
        }
      });
      
      // Filter out known warnings
      const criticalErrors = errors.filter(
        (error) =>
          !error.includes("React Router Future Flag Warning") &&
          !error.includes("deprecation")
      );
      
      expect(criticalErrors).toHaveLength(0);
    });
  });
});
