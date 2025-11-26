import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Case History Tab functionality
 * Uses CASE1 which has linked activities ensuring history exists
 */
test.describe("Case History Tab", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const caseLink = page.locator("#case-list tbody tr a.comp-cell-link", { hasText: "CASE1" });

    if ((await caseLink.count()) === 0) {
      const rows = page.locator("#case-list tbody tr");
      expect(await rows.count(), "No cases found.").toBeGreaterThan(0);
      await rows.first().locator("a.comp-cell-link").first().click();
    } else {
      await caseLink.first().click();
    }

    await waitForSpinner(page);

    await page.locator("#history").click();
    await waitForSpinner(page);
  });

  test("it displays the history tab and is active", async ({ page }) => {
    await expect(page.locator("#history")).toHaveClass(/active/);
    await expect(page).toHaveURL(/\/history$/);
  });

  test("it shows sort order button", async ({ page }) => {
    const sortButton = page.locator("button", { hasText: /Newest|Oldest/i });
    await expect(sortButton).toBeVisible();
  });

  test("it defaults to newest first", async ({ page }) => {
    const sortButton = page.locator("button", { hasText: /Newest to Oldest/i });
    await expect(sortButton).toBeVisible();
  });

  test("it toggles sort order", async ({ page }) => {
    const sortButton = page.locator("button", { hasText: /Newest|Oldest/i });
    await sortButton.click();
    await waitForSpinner(page);

    await expect(sortButton).toContainText(/Oldest to Newest/i);

    await sortButton.click();
    await waitForSpinner(page);

    await expect(sortButton).toContainText(/Newest to Oldest/i);
  });

  test("it displays history items", async ({ page }) => {
    const historyItems = page.locator("ul li, .case-history-item");

    const hasHistory = (await historyItems.count()) > 0;
    expect(hasHistory).toBe(true);
  });

  test("it groups history by date", async ({ page }) => {
    const dateHeaders = page.locator("h6:has(.bi-calendar)");

    const hasDateHeaders = (await dateHeaders.count()) > 0;
    expect(hasDateHeaders).toBe(true);
  });
});

test.describe("Case History - Navigation", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("it navigates to history tab via URL", async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const rows = page.locator("#case-list tbody tr");
    const rowCount = await rows.count();

    expect(rowCount, "No cases found.").toBeGreaterThan(0);

    const caseLink = rows.first().locator("a.comp-cell-link").first();
    const href = await caseLink.getAttribute("href");

    expect(href, "Case link href not found.").toBeTruthy();

    await page.goto(`${href}/history`);
    await waitForSpinner(page);

    // History tab should be active
    await expect(page.locator("#history")).toHaveClass(/active/);
  });
});
