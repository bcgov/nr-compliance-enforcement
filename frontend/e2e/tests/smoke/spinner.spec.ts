// frontend/e2e/tests/smoke/spinner.spec.ts
import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner } from "../../utils/helpers";

test.describe("COMPENF-138 - loading spinner", () => {
  const selectors = {
    loadingSpinner: "#page-loader",
  };

  // Use the COS role by default since that's what the original test used
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("should show the loading spinner when loading the data then hide it afterwards", async ({ page }) => {
    // Create a route to intercept and pause the data request
    await page.route("**/data-url", async (route) => {
      // Store the continue function to call it later
      const response = await route.fetch();
      await new Promise((resolve) => {
        // We'll resolve this after we verify the spinner is visible
        setTimeout(resolve, 1000);
      });
      await route.fulfill({ response });
    });

    // Visit the page
    await page.goto("/zone/at-a-glance");

    // Verify spinner is visible
    await expect(page.locator(selectors.loadingSpinner)).toBeVisible();

    // Wait for spinner to disappear using our helper
    await waitForSpinner(page);

    // Verify spinner is no longer visible
    await expect(page.locator(selectors.loadingSpinner)).not.toBeVisible();
  });
});
