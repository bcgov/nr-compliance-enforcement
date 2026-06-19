import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Investigation List View functionality
 */
test.describe("Investigation List View", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/investigations");
    await waitForSpinner(page);
  });

  test("it displays investigations list", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Investigations");

    const table = page.locator("#investigation-list");
    await expect(table).toBeVisible();

    // The table is expandable, so thead has a leading empty th for the chevron toggle.
    const tableHeaders = table.locator("thead tr th");
    await expect(tableHeaders.nth(1)).toContainText("Investigation ID");
    await expect(tableHeaders.nth(2)).toContainText("Date Opened");
    await expect(tableHeaders.nth(3)).toContainText("Community");
    await expect(tableHeaders.nth(4)).toContainText("Location/address");
    await expect(tableHeaders.nth(5)).toContainText("Status");
    await expect(tableHeaders.nth(6)).toContainText("Primary investigator");
    await expect(tableHeaders.nth(7)).toContainText("File coordinator");
    await expect(tableHeaders.nth(8)).toContainText("Last updated");
  });

  test("it navigates to investigation details", async ({ page }) => {
    const rows = page.locator("#investigation-list tbody tr");
    const rowCount = await rows.count();
    expect(rowCount, "No investigations found.").toBeGreaterThan(0);

    const firstLink = rows.first().locator("a.comp-cell-link").first();
    await expect(firstLink).toBeVisible();

    const investigationId = await firstLink.textContent();
    await firstLink.click();
    await waitForSpinner(page);

    // Verify navigation to investigation detail page
    await expect(page).toHaveURL(/\/investigation\//);
    // Verify the header shows the correct investigation
    await expect(page.locator("h1")).toContainText(investigationId || "");
  });

  test("it expands a row to show the investigation description", async ({ page }) => {
    const rows = page.locator("#investigation-list tbody tr");
    const rowCount = await rows.count();
    expect(rowCount, "No investigations found.").toBeGreaterThan(0);

    const chevronButton = rows.first().locator("td").first().locator("button");
    await chevronButton.click();

    await expect(page.locator("#investigation-list tbody dt", { hasText: "Investigation description" })).toBeVisible();
  });
});

test.describe("Investigation List Pagination", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/investigations");
    await waitForSpinner(page);
  });

  test("it paginates through results", async ({ page }) => {
    // Get initial first row content
    const rows = page.locator("#investigation-list tbody tr");
    await expect(rows.locator("a.comp-cell-link").first()).toBeVisible({ timeout: 30000 });

    // With more than one page of seeded investigations the paginator must be present.
    const paginator = page.locator(".pagination, .comp-paginator");
    await expect(paginator, "No paginator located, ensure enough test data exists for pagination.").toBeVisible();

    // Click next page button
    const nextButton = paginator
      .locator("button, a")
      .filter({ hasText: /next|›|»/i })
      .first();
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await waitForSpinner(page);

      // Verify different investigation id on new page
      const newFirstRowId = await rows.first().locator("a.comp-cell-link").first().textContent();
      expect(newFirstRowId).toBeTruthy();
    }
  });
});
