import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { navigateToCaseWithActivities, waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Case History Tab functionality
 * Creates its own history data to ensure tests are self-contained
 */
test.describe("Case History Tab", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  let caseUrl: string;

  test.beforeAll(async ({ browser }) => {
    // Create history data once before all tests in this describe block
    const context = await browser.newContext({ storageState: STORAGE_STATE_BY_ROLE.COS });
    const page = await context.newPage();
    const success = await navigateToCaseWithActivities(page);
    expect(success, "Could not navigate to case.").toBe(true);
    caseUrl = page.url();
    await context.close();
  });

  test.beforeEach(async ({ page }) => {
    // Navigate to case
    await page.goto(caseUrl);
    await waitForSpinner(page);

    // Navigate directly to the case's history tab
    await page.locator("#history").click();
    await waitForSpinner(page);

    // Wait for history tab to be active
    const historyTab = page.locator("#history");
    await expect(historyTab).toHaveClass(/active/, { timeout: 10000 });

    // Wait for data to load
    await expect(page.getByText("Loading case history")).toBeHidden({ timeout: 15000 });
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
