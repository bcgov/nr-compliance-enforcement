import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../utils/authConfig";

test.describe("COMPENF-138 - loading spinner", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  const selectors = {
    loadingSpinner: "#page-loader",
  };

  test("should show the loading spinner when loading the data then hide it afterwards", async ({ page }) => {
    // Create a manual promise to control when the response should be sent
    let sendResponse: () => void;
    const trigger = new Promise<void>((resolve) => {
      sendResponse = resolve;
    });

    // Intercept the request and delay the response until the promise is resolved
    await page.route("**/data-url", async (route) => {
      await trigger; // Wait until sendResponse() is called
      await route.continue(); // Continue with the request as normal
    });

    // Visit the page
    await page.goto("/zone/at-a-glance");

    // Assert that the loading spinner is visible
    await expect(page.locator(selectors.loadingSpinner)).toBeVisible();

    // Resolve the trigger, which lets the intercepted request continue
    sendResponse!();

    // Wait for the spinner to be gone (spinner removed or hidden)
    await expect(page.locator(selectors.loadingSpinner)).toBeHidden();
  });
});
