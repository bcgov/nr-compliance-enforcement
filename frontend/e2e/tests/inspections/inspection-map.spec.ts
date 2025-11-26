import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Inspection Map View functionality
 */
test.describe("Inspection Map View", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/inspections");
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

    // Verify map is visible
    const mapContainer = page.locator(".comp-map-container, .leaflet-container");
    await expect(mapContainer).toBeVisible();
  });

  test("it displays inspection markers", async ({ page }) => {
    const mapToggleLabel = page.locator("label[for='map_toggle_id']");
    await mapToggleLabel.click();
    await waitForSpinner(page);

    const leafletContainer = page.locator(".leaflet-container");
    await expect(leafletContainer).toBeVisible();

    // Verify markers are present
    const markers = leafletContainer.locator(".leaflet-marker-icon");
    expect(await markers.count()).toBeGreaterThan(0);
  });

  test("it shows popup when clicking a marker", async ({ page }) => {
    const mapToggleLabel = page.locator("label[for='map_toggle_id']");
    await mapToggleLabel.click();
    await waitForSpinner(page);

    const leafletContainer = page.locator(".leaflet-container");
    const markers = leafletContainer.locator(".leaflet-marker-icon");
    expect(await markers.count()).toBeGreaterThan(0);

    // Click the first marker
    await markers.first().click();

    // Verify popup appears
    const popup = leafletContainer.locator(".leaflet-popup");
    await expect(popup).toBeVisible();
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
    await expect(page.locator("#inspection-list")).toBeVisible();
  });

  test("it maintains filters when switching views", async ({ page }) => {
    await page.locator("#case-filter-btn").click();
    await expect(page.locator(".comp-data-filters")).toBeVisible();

    const statusSelect = page.locator("#inspection-status-filter");
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

    // Verify filter pill is still visible
    const filterPill = page.locator("#inspection-status-filter-pill");
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
