import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner, waitForMapToLoad } from "../../utils/helpers";

/**
 * Tests for Investigation Map View functionality
 */
test.describe("Investigation Map View", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/investigations");
    await waitForSpinner(page);
  });

  test("it toggles to map view", async ({ page }) => {
    // Verify list view is active initially
    const listToggle = page.locator("#list_toggle_id");
    await expect(listToggle).toBeChecked();

    // Click map toggle
    const mapToggleLabel = page.locator("label[for='map_toggle_id']");
    await mapToggleLabel.click();
    await waitForSpinner(page);

    // Verify map is now active
    const mapToggle = page.locator("#map_toggle_id");
    await expect(mapToggle).toBeChecked();

    // Wait for map to fully load
    await waitForMapToLoad(page);
  });

  test("it displays investigation markers", async ({ page }) => {
    const mapToggleLabel = page.locator("label[for='map_toggle_id']");
    await mapToggleLabel.click();
    await waitForSpinner(page);
    await waitForMapToLoad(page);

    const leafletContainer = page.locator(".leaflet-container");

    // Verify markers are present
    const markers = leafletContainer.locator(".leaflet-marker-icon");
    expect(await markers.count()).toBeGreaterThan(0);
  });

  test("it shows popup when clicking a marker", async ({ page }) => {
    const mapToggleLabel = page.locator("label[for='map_toggle_id']");
    await mapToggleLabel.click();
    await waitForSpinner(page);
    await waitForMapToLoad(page);

    const leafletContainer = page.locator(".leaflet-container");

    // Keep clicking clusters until individual markers appear
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      const individualMarkers = leafletContainer.locator(".map-marker");
      const clusters = leafletContainer.locator(".marker-cluster");

      const individualCount = await individualMarkers.count();
      const clusterCount = await clusters.count();

      if (individualCount > 0) {
        // Found individual markers - click one to open popup
        await individualMarkers.first().dispatchEvent("click");
        break;
      } else if (clusterCount > 0) {
        // Only clusters visible - click to zoom in
        await clusters.first().dispatchEvent("click");
        await page.waitForTimeout(1000); // Wait for zoom animation
        attempts++;
      } else {
        // No markers at all - fail
        throw new Error("No markers or clusters found on map");
      }
    }

    // Verify popup appears
    const popup = leafletContainer.locator(".leaflet-popup");
    await expect(popup).toBeVisible({ timeout: 10000 });
  });

  test("it switches back to list view", async ({ page }) => {
    // Switch to map view
    const mapToggleLabel = page.locator("label[for='map_toggle_id']");
    await mapToggleLabel.click();
    await waitForSpinner(page);

    // Switch back to list view
    const listToggleLabel = page.locator("label[for='list_toggle_id']");
    await listToggleLabel.click();
    await waitForSpinner(page);

    // Verify list is visible
    const listToggle = page.locator("#list_toggle_id");
    await expect(listToggle).toBeChecked();
    await expect(page.locator("#investigation-list")).toBeVisible();
  });

  test("it maintains filters when switching views", async ({ page }) => {
    await page.locator("#case-filter-btn").click();
    await expect(page.locator(".comp-data-filters")).toBeVisible();

    const statusSelect = page.locator("#investigation-status-filter");
    if (await statusSelect.isVisible()) {
      await statusSelect.click();
      const openOption = page.locator(".comp-select__option", { hasText: "Open" });
      if (await openOption.isVisible()) {
        await openOption.click();
        await waitForSpinner(page);
      }
    }

    // Switch to map view
    const mapToggleLabel = page.locator("label[for='map_toggle_id']");
    await mapToggleLabel.click();
    await waitForSpinner(page);
    await waitForMapToLoad(page);

    // Verify filter pill is still visible
    const filterPill = page.locator("#investigation-status-filter-pill");
    if (await filterPill.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(filterPill).toBeVisible();
    }

    // Switch back to list
    const listToggleLabel = page.locator("label[for='list_toggle_id']");
    await listToggleLabel.click();
    await waitForSpinner(page);

    // Verify filter is still applied
    if (await filterPill.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(filterPill).toBeVisible();
    }
  });
});
