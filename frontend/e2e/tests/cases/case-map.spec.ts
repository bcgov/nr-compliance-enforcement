import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { selectItemById, waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Case Map View functionality
 * Note: The map view is currently a placeholder - only tests toggle behavior
 */
test.describe("Case Map View", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);
  });

  test("it displays map/list toggle button", async ({ page }) => {
    const toggleGroup = page.locator("#map_list_toggle_id");
    await expect(toggleGroup).toBeVisible();

    const listToggle = page.locator("#list_toggle_id");
    const mapToggle = page.locator("#map_toggle_id");

    await expect(listToggle).toBeVisible();
    await expect(mapToggle).toBeVisible();
  });

  test("it defaults to list view", async ({ page }) => {
    const caseList = page.locator("#case-list");
    await expect(caseList).toBeVisible();

    const listToggle = page.locator("#list_toggle_id");
    await expect(listToggle).toBeChecked();
  });

  test("it switches to map view when clicking map toggle", async ({ page }) => {
    const mapToggle = page.locator('label[for="map_toggle_id"]');
    await mapToggle.click();
    await waitForSpinner(page);

    const mapContainer = page.locator(".comp-map-container");
    await expect(mapContainer).toBeVisible();

    const caseList = page.locator("#case-list");
    await expect(caseList).not.toBeVisible();
  });

  test("it switches back to list view when clicking list toggle", async ({ page }) => {
    await page.locator('label[for="map_toggle_id"]').click();
    await waitForSpinner(page);

    await expect(page.locator(".comp-map-container")).toBeVisible();

    // Switch back to list view
    await page.locator('label[for="list_toggle_id"]').click();
    await waitForSpinner(page);

    const caseList = page.locator("#case-list");
    await expect(caseList).toBeVisible();

    await expect(page.locator(".comp-map-container")).not.toBeVisible();
  });
});
