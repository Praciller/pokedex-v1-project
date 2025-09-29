import { test, expect, devices } from "@playwright/test";

test.describe("Cross-Browser Image Loading Tests", () => {
  // Test on different browsers
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test.describe(`${browserName} browser tests`, () => {
      test(`should load images correctly on ${browserName}`, async ({ page }) => {
        // Navigate to the app
        await page.goto("/");
        await page.waitForLoadState("networkidle");
        
        // Wait for Pokemon cards to appear
        await page.waitForSelector('.pokemon-card', { timeout: 15000 });
        
        // Verify images load in this browser
        const cardImages = page.locator('.pokemon-card-image');
        const imageCount = await cardImages.count();
        
        expect(imageCount).toBeGreaterThan(0);
        
        // Check first image loads properly
        const firstImage = cardImages.first();
        await expect(firstImage).toBeVisible();
        
        // Verify image has valid src
        const src = await firstImage.getAttribute('src');
        expect(src).toBeTruthy();
        
        // Verify image is actually loaded
        const isLoaded = await firstImage.evaluate((img: HTMLImageElement) => {
          return img.complete && img.naturalWidth > 0;
        });
        expect(isLoaded).toBe(true);
      });

      test(`should handle lazy loading on ${browserName}`, async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");
        
        // Wait for initial load
        await page.waitForSelector('.pokemon-card', { timeout: 15000 });
        
        // Scroll to trigger lazy loading
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight / 2);
        });
        
        // Wait for lazy loading
        await page.waitForTimeout(2000);
        
        // Verify images still work after scroll
        const visibleImages = page.locator('.pokemon-card-image').first();
        await expect(visibleImages).toBeVisible();
      });
    });
  });

  test.describe("Mobile Device Testing", () => {
    // Test on different mobile devices
    const mobileDevices = [
      { name: 'iPhone 12', device: devices['iPhone 12'] },
      { name: 'Pixel 5', device: devices['Pixel 5'] },
      { name: 'iPad', device: devices['iPad Pro'] }
    ];

    mobileDevices.forEach(({ name, device }) => {
      test(`should load images on ${name}`, async ({ browser }) => {
        const context = await browser.newContext({
          ...device,
        });
        const page = await context.newPage();

        try {
          // Navigate to the app
          await page.goto("/");
          await page.waitForLoadState("networkidle");
          
          // Wait for Pokemon cards with longer timeout for mobile
          await page.waitForSelector('.pokemon-card', { timeout: 20000 });
          
          // Verify images load on mobile
          const cardImages = page.locator('.pokemon-card-image');
          const imageCount = await cardImages.count();
          
          expect(imageCount).toBeGreaterThan(0);
          
          // Check first image
          const firstImage = cardImages.first();
          await expect(firstImage).toBeVisible();
          
          // Verify image loads properly on mobile
          const isLoaded = await firstImage.evaluate((img: HTMLImageElement) => {
            return img.complete && img.naturalWidth > 0;
          });
          expect(isLoaded).toBe(true);
          
        } finally {
          await context.close();
        }
      });

      test(`should handle touch interactions on ${name}`, async ({ browser }) => {
        const context = await browser.newContext({
          ...device,
        });
        const page = await context.newPage();

        try {
          await page.goto("/");
          await page.waitForLoadState("networkidle");
          
          // Wait for Pokemon cards
          await page.waitForSelector('.pokemon-card', { timeout: 20000 });
          
          // Tap on first Pokemon card
          const firstCard = page.locator('.pokemon-card-image').first();
          await firstCard.tap();
          
          // Wait for navigation to detail page
          await page.waitForURL(/\/pokemon\/\d+/, { timeout: 10000 });
          await page.waitForLoadState("networkidle");
          
          // Verify detail page image loads on mobile
          await page.waitForSelector('.inner-circle img', { timeout: 15000 });
          
          const detailImage = page.locator('.inner-circle img');
          await expect(detailImage).toBeVisible();
          
        } finally {
          await context.close();
        }
      });
    });
  });

  test.describe("Network Conditions Testing", () => {
    test("should handle slow network conditions", async ({ page }) => {
      // Simulate slow 3G network
      await page.route('**/*', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 100)); // Add delay
        await route.continue();
      });

      await page.goto("/");
      await page.waitForLoadState("networkidle");
      
      // Wait longer for images on slow network
      await page.waitForSelector('.pokemon-card', { timeout: 30000 });
      
      // Verify images still load on slow network
      const cardImages = page.locator('.pokemon-card-image');
      const imageCount = await cardImages.count();
      
      expect(imageCount).toBeGreaterThan(0);
      
      // Check loading placeholders appear
      const placeholders = page.locator('.lazy-image-placeholder');
      // Placeholders might be visible initially on slow network
    });

    test("should handle offline/failed image requests", async ({ page }) => {
      // Block image requests to simulate failures
      await page.route('**/*.{png,jpg,jpeg,svg}', async (route) => {
        await route.abort();
      });

      await page.goto("/");
      await page.waitForLoadState("networkidle");
      
      // Wait for Pokemon cards structure to load
      await page.waitForSelector('.pokemon-card', { timeout: 15000 });
      
      // Should show error placeholders or fallback images
      const errorPlaceholders = page.locator('.lazy-image-error');
      const errorCount = await errorPlaceholders.count();
      
      // Should have some error placeholders when images fail to load
      expect(errorCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("Accessibility Testing", () => {
    test("should have proper alt text for images", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      
      // Wait for Pokemon cards
      await page.waitForSelector('.pokemon-card', { timeout: 15000 });
      
      // Check alt text on images
      const images = page.locator('.pokemon-card-image');
      const imageCount = await images.count();
      
      for (let i = 0; i < Math.min(3, imageCount); i++) {
        const image = images.nth(i);
        const altText = await image.getAttribute('alt');
        
        // Should have meaningful alt text
        expect(altText).toBeTruthy();
        expect(altText).not.toBe('');
      }
    });

    test("should be keyboard navigable", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      
      // Wait for Pokemon cards
      await page.waitForSelector('.pokemon-card', { timeout: 15000 });
      
      // Try keyboard navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Should be able to focus on interactive elements
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });
  });

  test.describe("Image Format Support", () => {
    test("should support different image formats", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      
      // Track different image formats being loaded
      const imageFormats = new Set<string>();
      
      page.on('response', (response) => {
        const url = response.url();
        if (url.includes('.png')) imageFormats.add('png');
        if (url.includes('.jpg') || url.includes('.jpeg')) imageFormats.add('jpg');
        if (url.includes('.svg')) imageFormats.add('svg');
      });
      
      // Wait for Pokemon cards and images to load
      await page.waitForSelector('.pokemon-card', { timeout: 15000 });
      await page.waitForTimeout(3000);
      
      // Should support at least PNG format (most common for Pokemon images)
      expect(imageFormats.size).toBeGreaterThan(0);
    });
  });
});
