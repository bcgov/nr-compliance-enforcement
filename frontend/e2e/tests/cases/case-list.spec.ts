import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Case List View functionality
 */
test.describe("Case List View", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);
  });

  test("it displays cases list with table headers", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Cases");

    const table = page.locator("#case-list");
    await expect(table).toBeVisible();

    const tableHeaders = table.locator("thead tr th");
    await expect(tableHeaders.nth(0)).toContainText("Case ID");
    await expect(tableHeaders.nth(1)).toContainText("Date Opened");
    await expect(tableHeaders.nth(2)).toContainText("Status");
    await expect(tableHeaders.nth(3)).toContainText("Agency");
    await expect(tableHeaders.nth(4)).toContainText("Actions");
  });

  test("it shows Create case button", async ({ page }) => {
    const createButton = page.locator("button", { hasText: "Create case" });
    await expect(createButton).toBeVisible();
    await expect(createButton).toBeEnabled();
  });

  test("it navigates to case details on row click", async ({ page }) => {
    const rows = page.locator("#case-list tbody tr");

    // Get the first case and click it
    const firstCaseLink = rows.first().locator("a.comp-cell-link").first();
    await expect(firstCaseLink).toBeVisible();

    const caseId = await firstCaseLink.textContent();
    await firstCaseLink.click();
    await waitForSpinner(page);

    // Verify navigation to case detail page
    await expect(page).toHaveURL(/\/case\//);
    // Verify the case header shows the correct case
    await expect(page.locator("h1.comp-box-complaint-id")).toContainText(caseId || "");
  });

  test("it opens actions dropdown with view and edit options", async ({ page }) => {
    const rows = page.locator("#case-list tbody tr");

    const actionsButton = rows.first().locator(".comp-action-dropdown button");
    await actionsButton.click();

    // Verify dropdown menu appears with View and Edit options
    const dropdownMenu = page.locator(".dropdown-menu.show");
    await expect(dropdownMenu).toBeVisible();

    await expect(dropdownMenu.locator("a", { hasText: "View Case" })).toBeVisible();
    await expect(dropdownMenu.locator("a", { hasText: "Edit Case" })).toBeVisible();
  });

  test("it navigates to case via View Case action", async ({ page }) => {
    const rows = page.locator("#case-list tbody tr");

    // Click Actions and then View Case
    const actionsButton = rows.first().locator(".comp-action-dropdown button");
    await actionsButton.click();

    const viewCaseLink = page.locator(".dropdown-menu.show a", { hasText: "View Case" });
    await viewCaseLink.click();
    await waitForSpinner(page);

    // Verify navigation to case view page
    await expect(page).toHaveURL(/\/case\/[^/]+$/);
  });

  test("it navigates to edit via Edit Case action", async ({ page }) => {
    const rows = page.locator("#case-list tbody tr");

    // Click Actions and then Edit Case
    const actionsButton = rows.first().locator(".comp-action-dropdown button");
    await actionsButton.click();

    const editCaseLink = page.locator(".dropdown-menu.show a", { hasText: "Edit Case" });
    await editCaseLink.click();
    await waitForSpinner(page);

    // Verify navigation to case edit page
    await expect(page).toHaveURL(/\/case\/[^/]+\/edit$/);
  });

  test("it navigates to create case form on button click", async ({ page }) => {
    const createButton = page.locator("button", { hasText: "Create case" });
    await createButton.click();
    await waitForSpinner(page);

    // Verify navigation to create case page
    await expect(page).toHaveURL("/case/create");
  });
});

/**
 * Tests for Case Search functionality
 * Verifies searching cases by various criteria
 */
test.describe("Case List Search", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);
  });

  test("it displays search input field", async ({ page }) => {
    const searchInput = page.locator("#complaint-search");
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute("placeholder", /search/i);
  });

  test("it displays search button", async ({ page }) => {
    const searchButton = page.locator("#search-button");
    await expect(searchButton).toBeVisible();
  });

  test("it searches cases by entering text and pressing Enter", async ({ page }) => {
    const searchInput = page.locator("#complaint-search");
    await searchInput.click();
    await searchInput.clear();
    // Use pressSequentially to properly trigger onChange events for React controlled input
    await searchInput.pressSequentially("CASE1");
    await searchInput.press("Enter");
    await waitForSpinner(page);

    // Verify at least one result contains CASE1 (results may be sorted by date, not ID)
    const matchingRow = page.locator("#case-list tbody tr", { hasText: "CASE1" });
    await expect(matchingRow.first()).toBeVisible({ timeout: 10000 });
  });

  test("it searches cases by clicking search button", async ({ page }) => {
    const searchInput = page.locator("#complaint-search");
    await searchInput.click();
    await searchInput.clear();
    // Use pressSequentially to properly trigger onChange events for React controlled input
    await searchInput.pressSequentially("CASE1");

    const searchButton = page.locator("#search-button");
    await searchButton.click();
    await waitForSpinner(page);

    // Verify at least one result contains CASE1 (results may be sorted by date, not ID)
    const matchingRow = page.locator("#case-list tbody tr", { hasText: "CASE1" });
    await expect(matchingRow.first()).toBeVisible({ timeout: 10000 });
  });

  test("it clears search when clicking clear button", async ({ page }) => {
    const searchInput = page.locator("#complaint-search");
    await searchInput.click();
    // Use pressSequentially to properly trigger onChange events for React controlled input
    await searchInput.pressSequentially("test search");
    await searchInput.press("Enter");
    await waitForSpinner(page);

    const clearButton = page.locator("#clear-search");
    await expect(clearButton).toBeVisible();

    await clearButton.click();
    await waitForSpinner(page);

    await expect(searchInput).toHaveValue("");
  });
});
