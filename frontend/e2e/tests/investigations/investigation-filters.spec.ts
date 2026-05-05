import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { selectItemById, waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Investigation Filter functionality
 */
test.describe("Investigation Filters", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/investigations");
    await waitForSpinner(page);
  });

  test("it filters by investigation status", async ({ page }) => {
    await page.locator("#case-filter-btn").click();

    // Select Open status
    await selectItemById("investigation-investigationStatus-select-id", "Open", page);
    await waitForSpinner(page);

    // Verify filter pill appears
    await expect(page.locator("#investigation-status-filter-pill")).toBeVisible();

    // Verify results have Open status
    const rows = page.locator("#investigation-list tbody tr");
    const firstRow = rows.first();
    await expect(firstRow.locator("td").nth(5).locator(".badge")).toContainText("Open");
  });

  test("it clears filters", async ({ page }) => {
    // Apply a filter
    await page.locator("#case-filter-btn").click();
    await selectItemById("investigation-investigationStatus-select-id", "Open", page);
    await waitForSpinner(page);

    // Verify filter is applied
    const filterPill = page.locator("#investigation-status-filter-pill");
    await expect(filterPill).toBeVisible();

    // Clear the filter
    await filterPill.click();
    await waitForSpinner(page);

    // Verify filter is removed
    await expect(filterPill).not.toBeVisible();
  });

  test("it combines multiple filters", async ({ page }) => {
    await page.locator("#case-filter-btn").click();

    // Apply status filter
    await selectItemById("investigation-investigationStatus-select-id", "Open", page);
    await waitForSpinner(page);

    // Apply community filter
    await selectItemById("investigation-community-select-id", "70 Mile House", page);
    await waitForSpinner(page);

    // Both pills should appear
    await expect(page.locator("#investigation-status-filter-pill")).toBeVisible();
    await expect(page.locator("#investigation-community-filter-pill")).toBeVisible();
  });
});
