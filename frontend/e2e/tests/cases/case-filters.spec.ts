import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { selectItemById, waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Case Filter functionality
 */
test.describe("Case Filter Logic", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);
  });

  test("it displays filter button and opens filter panel", async ({ page }) => {
    const filterButton = page.locator("#case-filter-btn");
    await expect(filterButton).toBeVisible();
    await expect(filterButton).toContainText("Filters");

    await filterButton.click();

    // Verify filter panel opens
    const filterPanel = page.locator(".comp-data-filters");
    await expect(filterPanel).toBeVisible();

    // Verify filter header shows
    await expect(filterPanel.locator(".comp-data-filters-header")).toContainText("Filter by");
  });

  // Agency tests commented out as this has been featured flagged off
  // remove comments if agency gets added back in at some point.

  /** 
  test("it displays lead agency filter in panel", async ({ page }) => {
    await page.locator("#case-filter-btn").click();

    // Verify lead agency filter is present
    const agencyFilter = page.locator("#case-lead-agency-filter-id");
    await expect(agencyFilter).toBeVisible();
    await expect(agencyFilter.locator("label")).toContainText("Lead Agency");

    // Verify dropdown works
    const agencySelect = page.locator("#case-lead-agency-select-id");
    await expect(agencySelect).toBeVisible();
  });
  */

  test("it displays date range filter in panel", async ({ page }) => {
    await page.locator("#case-filter-btn").click();

    // Verify date range filter is present
    const dateFilter = page.locator("#case-date-range-filter");
    await expect(dateFilter).toBeVisible();
    await expect(dateFilter.locator("label")).toContainText("Date Range");
  });

  /** 
  test("it filters cases by lead agency", async ({ page }) => {
    // Open filter panel
    await page.locator("#case-filter-btn").click();

    // Select an agency (COS - Conservation Officer Service)
    await selectItemById("case-lead-agency-select-id", "Conservation Officer Service", page);
    await waitForSpinner(page);

    // Verify filter pill appears
    const filterPill = page.locator("#case-agency-filter-pill");
    await expect(filterPill).toBeVisible();

    // Verify filtered results show the selected agency
    const filteredRows = page.locator("#case-list tbody tr");
    const filteredCount = await filteredRows.count();

    if (filteredCount > 0) {
      for (let i = 0; i < Math.min(filteredCount, 5); i++) {
        const agencyCell = filteredRows.nth(i).locator("td").nth(3);
        await expect(agencyCell).toContainText("Conservation Officer Service");
      }
    }
  });
  */

  /** 
  test("it clears agency filter when clicking filter pill", async ({ page }) => {
    // Open filter panel and apply agency filter
    await page.locator("#case-filter-btn").click();
    await selectItemById("case-lead-agency-select-id", "Conservation Officer Service", page);
    await waitForSpinner(page);

    // Verify filter pill exists
    const filterPill = page.locator("#case-agency-filter-pill");
    await expect(filterPill).toBeVisible();

    // Click the filter pill to clear it
    await filterPill.click();
    await waitForSpinner(page);

    // Verify filter pill is removed
    await expect(filterPill).not.toBeVisible();
  });
  */

  test("it closes filter panel when clicking close button", async ({ page }) => {
    await page.locator("#case-filter-btn").click();

    const filterPanel = page.locator(".comp-data-filters");
    await expect(filterPanel).toBeVisible();

    const closeButton = filterPanel.locator(".comp-data-filters-header button, .btn-close").first();
    await closeButton.click();

    await expect(filterPanel).not.toBeVisible();
  });
});
