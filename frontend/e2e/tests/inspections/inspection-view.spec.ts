import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Inspection Details View (Summary Tab)
 * Verifies header, summary information, and navigation
 */
test.describe("Inspection Details", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/inspections");
    await waitForSpinner(page);

    const rows = page.locator("#inspection-list tbody tr");
    const rowCount = await rows.count();

    expect(rowCount, "No inspections found.").toBeGreaterThan(0);

    const firstLink = rows.first().locator("a.comp-cell-link").first();
    await firstLink.click();
    await waitForSpinner(page);

    // Wait for inspection data to load - header should not show "Unknown"
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });
  });

  test("it displays inspection header", async ({ page }) => {
    // Verify the inspection header is displayed
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).toBeVisible();
    await expect(header).toContainText(/Inspection/i);

    // Verify breadcrumb is displayed
    const breadcrumb = page.locator(".breadcrumb");
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.locator("a")).toContainText("Inspections");
  });

  test("it displays summary information", async ({ page }) => {
    const leadAgency = page.locator("#comp-details-lead-agency-text-id");
    await expect(leadAgency).toBeVisible();

    const dateLoggedSection = page.locator("dt", { hasText: "Date logged" });
    await expect(dateLoggedSection).toBeVisible();

    const lastUpdatedSection = page.locator("dt", { hasText: "Last updated" });
    await expect(lastUpdatedSection).toBeVisible();

    const officerSection = page.locator("dt", { hasText: "Officer assigned" });
    await expect(officerSection).toBeVisible();

    const createdBySection = page.locator("dt", { hasText: "Created by" });
    await expect(createdBySection).toBeVisible();
  });

  test("it displays inspection details section", async ({ page }) => {
    await expect(page.locator("h3", { hasText: "Inspection details" })).toBeVisible();

    const inspectionIdLabel = page.locator("strong", { hasText: "Inspection ID" });
    await expect(inspectionIdLabel).toBeVisible();

    const caseIdLabel = page.locator("strong", { hasText: "Case ID" });
    await expect(caseIdLabel).toBeVisible();
  });

  test("it navigates to linked case", async ({ page }) => {
    const caseIdLink = page.locator("a", { hasText: "CASE" }).first();

    if (await caseIdLink.isVisible()) {
      await caseIdLink.click();
      await waitForSpinner(page);

      await expect(page).toHaveURL(/\/case\//);
    }
  });

  test("it shows Edit button", async ({ page }) => {
    const editButton = page.locator("#details-screen-edit-button");
    await expect(editButton).toBeVisible();
    await expect(editButton).toContainText("Edit");

    await editButton.click();
    await waitForSpinner(page);

    await expect(page).toHaveURL(/\/inspection\/[^/]+\/edit$/);
  });
});
