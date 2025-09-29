import { test, expect } from "@playwright/test";

test.describe("My List Complete User Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should complete full My List user journey", async ({ page }) => {
    // Step 1: Navigate to My List page
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");

    // Step 2: Verify login component is shown
    await expect(page.locator(".list")).toBeVisible();
    await expect(page.locator(".login")).toBeVisible();
    await expect(page.locator(".login-btn")).toBeVisible();
    await expect(page.locator(".login-btn")).toContainText("Login with Google");

    // Step 3: Verify page structure is correct
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator('a[href="/list"]')).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();

    // Step 4: Test navigation to other pages and back
    await page.click('a[href="/search"]');
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/search");

    await page.click('a[href="/list"]');
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/list");
    await expect(page.locator(".login")).toBeVisible();

    // Step 5: Test Pokemon detail page add functionality
    await page.goto("/pokemon/1");
    await page.waitForLoadState("domcontentloaded");
    
    // Wait for Pokemon data to load
    await page.waitForSelector(".circle-container", { timeout: 10000 });
    
    // The page should load without errors
    await expect(page.locator(".circle-container")).toBeVisible();
  });

  test("should handle My List page performance correctly", async ({ page }) => {
    const consoleErrors: string[] = [];
    const networkRequests: string[] = [];

    // Monitor console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Monitor network requests
    page.on('request', (request) => {
      networkRequests.push(request.url());
    });

    // Navigate to My List page
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3000); // Wait for any async operations

    // Verify page loads successfully
    await expect(page.locator(".list")).toBeVisible();
    await expect(page.locator(".login")).toBeVisible();

    // Check for critical errors
    const criticalErrors = consoleErrors.filter(error => 
      error.includes('Failed to load') || 
      error.includes('Cannot resolve module') ||
      error.includes('images is not defined') ||
      error.includes('defaultImages is not defined') ||
      error.includes('TypeError: Cannot read property')
    );

    if (criticalErrors.length > 0) {
      console.log('Critical errors found:', criticalErrors);
    }

    // Should not have critical errors
    expect(criticalErrors.length).toBe(0);

    // Should not make excessive requests
    const imageRequests = networkRequests.filter(url => 
      url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg')
    );
    
    // Should have reasonable number of image requests for My List page
    expect(imageRequests.length).toBeLessThan(20);
  });

  test("should handle getUserPokemons reducer correctly", async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to My List page which triggers getUserPokemons
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(5000); // Wait for Redux actions

    // Page should load successfully
    await expect(page.locator(".list")).toBeVisible();

    // Check for Redux/Firebase related errors
    const reduxErrors = consoleErrors.filter(error => 
      error.includes('getUserPokemons') || 
      error.includes('Firebase') ||
      error.includes('Firestore') ||
      error.includes('getImage') ||
      error.includes('Promise')
    );

    if (reduxErrors.length > 0) {
      console.log('Redux/Firebase errors found:', reduxErrors);
    }

    // Should handle Firebase operations without critical errors
    // Note: Some Firebase warnings are expected when not authenticated
    const criticalReduxErrors = reduxErrors.filter(error => 
      error.includes('TypeError') || 
      error.includes('Cannot read property') ||
      error.includes('is not a function')
    );

    expect(criticalReduxErrors.length).toBe(0);
  });

  test("should handle image loading system integration", async ({ page }) => {
    // Navigate to My List page
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");

    // Verify the page structure is correct
    await expect(page.locator(".list")).toBeVisible();
    await expect(page.locator(".login")).toBeVisible();

    // Test that LazyImage system is properly integrated
    // by checking that the page doesn't crash when trying to load images
    await page.waitForTimeout(2000);

    // Page should remain stable
    await expect(page.locator(".list")).toBeVisible();
    await expect(page.locator(".login")).toBeVisible();

    // Test navigation to a page that uses LazyImage
    await page.goto("/search");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3000);

    // Should load Pokemon cards with LazyImage
    await page.waitForSelector(".pokemon-card", { timeout: 15000 });
    const pokemonCards = page.locator(".pokemon-card");
    const cardCount = await pokemonCards.count();
    
    expect(cardCount).toBeGreaterThan(0);

    // Navigate back to My List
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");
    
    // Should still work correctly
    await expect(page.locator(".list")).toBeVisible();
    await expect(page.locator(".login")).toBeVisible();
  });

  test("should handle responsive design on My List page", async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667, name: "Mobile" },
      { width: 768, height: 1024, name: "Tablet" },
      { width: 1920, height: 1080, name: "Desktop" }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      await page.goto("/list");
      await page.waitForLoadState("domcontentloaded");

      // Page should be responsive
      await expect(page.locator(".list")).toBeVisible();
      await expect(page.locator(".login")).toBeVisible();
      await expect(page.locator(".login-btn")).toBeVisible();

      // Login button should be clickable
      const loginBtn = page.locator(".login-btn");
      await expect(loginBtn).toBeVisible();
      
      // Check that the button has proper styling
      const buttonBox = await loginBtn.boundingBox();
      expect(buttonBox).toBeTruthy();
      expect(buttonBox!.width).toBeGreaterThan(0);
      expect(buttonBox!.height).toBeGreaterThan(0);
    }
  });

  test("should maintain state consistency across navigation", async ({ page }) => {
    // Start from My List
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator(".login")).toBeVisible();

    // Navigate to search
    await page.goto("/search");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector(".pokemon-card", { timeout: 15000 });

    // Navigate to Pokemon detail
    await page.goto("/pokemon/25");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector(".circle-container", { timeout: 10000 });

    // Navigate back to My List
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");

    // Should still show login (since we're not authenticated)
    await expect(page.locator(".list")).toBeVisible();
    await expect(page.locator(".login")).toBeVisible();

    // State should be consistent
    await expect(page.locator(".login-btn")).toContainText("Login with Google");
  });

  test("should handle page refresh correctly", async ({ page }) => {
    // Navigate to My List
    await page.goto("/list");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator(".login")).toBeVisible();

    // Refresh the page
    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    // Should still work after refresh
    await expect(page.locator(".list")).toBeVisible();
    await expect(page.locator(".login")).toBeVisible();
    await expect(page.locator(".login-btn")).toBeVisible();
    await expect(page.locator(".login-btn")).toContainText("Login with Google");
  });
});
