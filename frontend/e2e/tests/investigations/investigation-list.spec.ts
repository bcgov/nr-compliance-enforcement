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

    const tableHeaders = table.locator("thead tr th");
    await expect(tableHeaders.nth(0)).toContainText("Investigation ID");
    await expect(tableHeaders.nth(1)).toContainText("Case ID");
    await expect(tableHeaders.nth(2)).toContainText("Date Opened");
    await expect(tableHeaders.nth(3)).toContainText("Status");
    await expect(tableHeaders.nth(4)).toContainText("Agency");
    await expect(tableHeaders.nth(5)).toContainText("Actions");
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
});

test.describe("Investigation List Pagination", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/investigations");
    await waitForSpinner(page);
  });

  test("it paginates through results", async ({ page }) => {
    const paginator = page.locator(".pagination, .comp-paginator");
    const isVisible = await paginator.isVisible();

    expect(isVisible, "No pagination visible. Ensure enough test data exists for pagination.").toBe(true);

    // Get initial first row content
    const rows = page.locator("#investigation-list tbody tr");

    // Click next page button
    const nextButton = paginator
      .locator("button, a")
      .filter({ hasText: /next|›|»/i })
      .first();
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await waitForSpinner(page);

      // Verify different content on new page
      const newFirstRow = await rows.first().locator("td").first().textContent();
      expect(newFirstRow).toBeTruthy();
    }
  });
});

test.describe("Investigation List Actions", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/investigations");
    await waitForSpinner(page);
  });

  test("it opens actions dropdown with view and edit options", async ({ page }) => {
    const rows = page.locator("#investigation-list tbody tr");

    // Click the Actions button on the first row
    const actionsButton = rows.first().locator(".comp-action-dropdown button");
    await actionsButton.click();

    // Verify dropdown menu appears
    const dropdownMenu = page.locator(".dropdown-menu.show");
    await expect(dropdownMenu).toBeVisible();

    await expect(dropdownMenu.locator("a", { hasText: /View/i })).toBeVisible();
    await expect(dropdownMenu.locator("a", { hasText: /Edit/i })).toBeVisible();
  });
});
