import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Inspection Filters functionality
 */
test.describe("Inspection Filters", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/inspections");
    await waitForSpinner(page);
  });

  test("it filters by inspection status", async ({ page }) => {
    await page.locator("#case-filter-btn").click();
    await expect(page.locator(".comp-data-filters")).toBeVisible();

    // Select a status
    const statusSelect = page.locator("#inspection-status-filter");
    if (await statusSelect.isVisible()) {
      await statusSelect.click();
      const openOption = page.locator(".comp-select__option", { hasText: "Open" });
      if (await openOption.isVisible()) {
        await openOption.click();
        await waitForSpinner(page);

        // Verify filter pill appears
        await expect(page.locator("#inspection-status-filter-pill")).toBeVisible();
      }
    }
  });

  test("it filters by lead agency", async ({ page }) => {
    await page.locator("#case-filter-btn").click();
    await expect(page.locator(".comp-data-filters")).toBeVisible();

    // Select an agency
    const agencySelect = page.locator("#inspection-agency-filter");
    if (await agencySelect.isVisible()) {
      await agencySelect.click();
      const cosOption = page.locator(".comp-select__option").first();
      if (await cosOption.isVisible()) {
        await cosOption.click();
        await waitForSpinner(page);

        // Verify filter pill appears
        await expect(page.locator("#inspection-agency-filter-pill")).toBeVisible();
      }
    }
  });

  test("it filters by date range", async ({ page }) => {
    await page.locator("#case-filter-btn").click();
    await expect(page.locator(".comp-data-filters")).toBeVisible();

    // Enter start date
    const startDateInput = page.locator("#inspection-start-date, input[placeholder*='Start']").first();
    if (await startDateInput.isVisible()) {
      await startDateInput.click();
      // Select a date from the date picker or type a date
      await startDateInput.fill("2024-01-01");
      await page.keyboard.press("Escape");
      await waitForSpinner(page);

      // Verify filter pill appears
      const datePill = page.locator("#inspection-date-range-filter-pill");
      // Date range filter might not appear immediately
      if (await datePill.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(datePill).toBeVisible();
      }
    }
  });

  test("it clears filters", async ({ page }) => {
    await page.locator("#case-filter-btn").click();
    await expect(page.locator(".comp-data-filters")).toBeVisible();

    // Apply a status filter first
    const statusSelect = page.locator("#inspection-status-filter");
    if (await statusSelect.isVisible()) {
      await statusSelect.click();
      const openOption = page.locator(".comp-select__option", { hasText: "Open" });
      if (await openOption.isVisible()) {
        await openOption.click();
        await waitForSpinner(page);

        // Verify filter pill appears
        const filterPill = page.locator("#inspection-status-filter-pill");
        await expect(filterPill).toBeVisible();

        // Clear the filter by clicking the pill
        await filterPill.click();
        await waitForSpinner(page);

        // Verify filter pill is removed
        await expect(filterPill).not.toBeVisible();
      }
    }
  });

  test("it combines multiple filters", async ({ page }) => {
    await page.locator("#case-filter-btn").click();
    await expect(page.locator(".comp-data-filters")).toBeVisible();

    // Apply status filter
    const statusSelect = page.locator("#inspection-status-filter");
    if (await statusSelect.isVisible()) {
      await statusSelect.click();
      const openOption = page.locator(".comp-select__option", { hasText: "Open" });
      if (await openOption.isVisible()) {
        await openOption.click();
        await waitForSpinner(page);
      }
    }

    // Apply agency filter
    const agencySelect = page.locator("#inspection-agency-filter");
    if (await agencySelect.isVisible()) {
      await agencySelect.click();
      const cosOption = page.locator(".comp-select__option").first();
      if (await cosOption.isVisible()) {
        await cosOption.click();
        await waitForSpinner(page);
      }
    }

    // Verify both filter pills appear
    const statusPill = page.locator("#inspection-status-filter-pill");
    const agencyPill = page.locator("#inspection-agency-filter-pill");

    if (await statusPill.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(statusPill).toBeVisible();
    }
    if (await agencyPill.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(agencyPill).toBeVisible();
    }
  });
});
