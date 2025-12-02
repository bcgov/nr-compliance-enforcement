import { test, expect, Page } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Case History Tab functionality
 */
async function createHistoryData(page: Page): Promise<string> {
  await page.goto("/cases");
  await waitForSpinner(page);

  const rows = page.locator("#case-list tbody tr");
  expect(await rows.count(), "No cases found.").toBeGreaterThan(0);

  // Get the first case link and its href
  const caseLink = rows.first().locator("a.comp-cell-link").first();
  await expect(caseLink).toBeVisible({ timeout: 10000 });
  const href = await caseLink.getAttribute("href");
  const caseGuid = href?.replace("/case/", "") || "";

  await caseLink.click();
  await waitForSpinner(page);

  // Wait for case data to load
  const header = page.locator("h1.comp-box-complaint-id");
  await expect(header).not.toContainText("Unknown", { timeout: 15000 });

  // Edit the case to create history
  const editButton = page.locator("#details-screen-edit-button");
  await expect(editButton).toBeVisible({ timeout: 10000 });
  await editButton.click();
  await waitForSpinner(page);

  // Change status to generate history entry
  const statusSelect = page.locator("#case-status-select");
  await expect(statusSelect).toBeVisible({ timeout: 10000 });
  await statusSelect.click();

  // Get current status and toggle it
  const currentStatus = await statusSelect.textContent();
  const newStatus = currentStatus?.includes("Open") ? "Closed" : "Open";
  const statusOption = page.locator(".comp-select__option", { hasText: newStatus });
  await expect(statusOption).toBeVisible({ timeout: 5000 });
  await statusOption.click();

  // Save changes
  const saveButton = page.locator("#details-screen-save-button-top");
  await expect(saveButton).toBeEnabled({ timeout: 5000 });
  await saveButton.click();
  await waitForSpinner(page);

  // Wait for navigation back to case view
  await expect(page).toHaveURL(/\/case\/[^/]+$/, { timeout: 15000 });
  return caseGuid;
}

/**
 * Tests for Case History Tab functionality
 * Creates its own history data to ensure tests are self-contained
 */
test.describe("Case History Tab", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  let caseGuid: string;

  test.beforeAll(async ({ browser }) => {
    // Create history data once before all tests in this describe block
    const context = await browser.newContext({ storageState: STORAGE_STATE_BY_ROLE.COS });
    const page = await context.newPage();
    caseGuid = await createHistoryData(page);
    await context.close();
  });

  test.beforeEach(async ({ page }) => {
    // Navigate directly to the case's history tab
    await page.goto(`/case/${caseGuid}/history`);
    await waitForSpinner(page);

    // Wait for history tab to be active
    const historyTab = page.locator("#history");
    await expect(historyTab).toHaveClass(/active/, { timeout: 10000 });
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
