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
    await expect(firstRow.locator("td").nth(3).locator(".badge")).toContainText("Open");
  });

  test("it filters by lead agency", async ({ page }) => {
    await page.locator("#case-filter-btn").click();

    // Select agency
    await selectItemById("investigation-lead-agency-select-id", "Conservation Officer Service", page);
    await waitForSpinner(page);

    // Verify filter pill appears
    await expect(page.locator("#investigation-agency-filter-pill")).toBeVisible();

    // Verify results
    const rows = page.locator("#investigation-list tbody tr");
    const firstRow = rows.first();
    await expect(firstRow.locator("td").nth(4)).toContainText("Conservation Officer Service");
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

    // Apply agency filter
    await selectItemById("investigation-lead-agency-select-id", "Conservation Officer Service", page);
    await waitForSpinner(page);

    // Verify both filter pills appear
    await expect(page.locator("#investigation-status-filter-pill")).toBeVisible();
    await expect(page.locator("#investigation-agency-filter-pill")).toBeVisible();

    // Verify results match both criteria
    const rows = page.locator("#investigation-list tbody tr");
    const firstRow = rows.first();
    await expect(firstRow.locator("td").nth(3).locator(".badge")).toContainText("Open");
    await expect(firstRow.locator("td").nth(4)).toContainText("Conservation Officer Service");
  });
});
