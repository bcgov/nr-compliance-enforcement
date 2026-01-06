import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Case View functionality
 */
test.describe("Case View", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const rows = page.locator("#case-list tbody tr");

    const firstCaseLink = rows.first().locator("a.comp-cell-link").first();
    await firstCaseLink.click();
    await waitForSpinner(page);

    // Wait for case data to load - header should not show "Unknown"
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });
  });

  test("it displays case header with case ID and status badge", async ({ page }) => {
    const caseHeader = page.locator("h1.comp-box-complaint-id");
    await expect(caseHeader).toBeVisible();
    await expect(caseHeader).toContainText("Case");

    // Verify the case status badge is displayed
    const statusBadge = page.locator("#comp-details-status-text-id");
    await expect(statusBadge).toBeVisible();

    // Status should be Open or Closed
    const statusText = await statusBadge.textContent();
    expect(statusText?.toLowerCase()).toMatch(/open|closed/);
  });

  test("it displays breadcrumb navigation", async ({ page }) => {
    const breadcrumb = page.locator(".breadcrumb");
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.locator("a", { hasText: "Cases" })).toBeVisible();
  });

  test("it displays lead agency", async ({ page }) => {
    const leadAgency = page.locator("#comp-details-lead-agency-text-id");
    await expect(leadAgency).toBeVisible();

    const agencyText = await leadAgency.textContent();
    expect(agencyText).toBeTruthy();
  });

  test("it displays date logged", async ({ page }) => {
    const dateSection = page.locator("dt", { hasText: "Date logged" });
    await expect(dateSection).toBeVisible();
  });

  test("it displays case description", async ({ page }) => {
    const descriptionSection = page.locator("h5", { hasText: "Case description" });
    await expect(descriptionSection).toBeVisible();

    const descriptionContent = descriptionSection.locator("..").locator("p, .comp-details-content");
    await expect(descriptionContent.first()).toBeVisible();
  });

  test("it displays Edit case button", async ({ page }) => {
    const editButton = page.locator("#details-screen-edit-button");
    await expect(editButton).toBeVisible();
    await expect(editButton).toContainText("Edit case");
  });

  test("it navigates to edit page on Edit button click", async ({ page }) => {
    const editButton = page.locator("#details-screen-edit-button");
    await editButton.click();
    await waitForSpinner(page);
    await expect(page).toHaveURL(/\/case\/[^/]+\/edit$/);
  });
});

test.describe("Case View - Tabs", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  let caseUrl: string;

  test.beforeEach(async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const rows = page.locator("#case-list tbody tr");
    const firstCaseLink = rows.first().locator("a.comp-cell-link").first();
    await firstCaseLink.click();
    await waitForSpinner(page);

    // Wait for case data to load - header should not show "Unknown"
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });
  });

  test("it displays all case tabs", async ({ page }) => {
    const tabNav = page.locator(".case-nav-tabs, .nav-tabs");
    await expect(tabNav).toBeVisible();

    await expect(tabNav.locator("#summary")).toBeVisible();
    await expect(tabNav.locator("#records")).toBeVisible();
    await expect(tabNav.locator("#history")).toBeVisible();
    await expect(tabNav.locator("#map")).toBeVisible();
  });

  test("it defaults to Summary tab", async ({ page }) => {
    const summaryTab = page.locator("#summary");
    await expect(summaryTab).toHaveClass(/active/);
  });
});

test.describe("Case View - Summary Tab Content", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const rows = page.locator("#case-list tbody tr");

    const firstCaseLink = rows.first().locator("a.comp-cell-link").first();
    await firstCaseLink.click();
    await waitForSpinner(page);

    // Wait for case data to load - header should not show "Unknown"
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });
  });

  test("it displays complaints column", async ({ page }) => {
    const complaintsSection = page.locator("text=Complaints").first();
    await expect(complaintsSection).toBeVisible();
  });

  test("it displays inspections column", async ({ page }) => {
    const inspectionsSection = page.locator("text=Inspections").first();
    await expect(inspectionsSection).toBeVisible();
  });

  test("it displays investigations column", async ({ page }) => {
    const investigationsSection = page.locator("text=Investigations").first();
    await expect(investigationsSection).toBeVisible();
  });

  test("it shows Create investigation button", async ({ page }) => {
    const createInvestigationBtn = page.locator("button", { hasText: "Create investigation" });
    await expect(createInvestigationBtn).toBeVisible();
  });

  test("it shows Create inspection button", async ({ page }) => {
    const createInspectionBtn = page.locator("button", { hasText: "Create inspection" });
    await expect(createInspectionBtn).toBeVisible();
  });
});

test.describe("Case View - Navigation", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("it navigates back to cases via breadcrumb", async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const rows = page.locator("#case-list tbody tr");
    await rows.first().locator("a.comp-cell-link").first().click();
    await waitForSpinner(page);

    // Wait for case data to load
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });

    const breadcrumbLink = page.locator(".breadcrumb a", { hasText: "Cases" });
    await breadcrumbLink.click();
    await waitForSpinner(page);

    // Should navigate to cases list
    await expect(page).toHaveURL("/cases");
  });

  test("it shows error message for invalid case guid", async ({ page }) => {
    await page.goto("/case/invalid-case-id-12345");
    await waitForSpinner(page);

    // Should show "No data found" message
    const noDataMessage = page.locator("text=No data found");
    await expect(noDataMessage).toBeVisible();
  });
});
