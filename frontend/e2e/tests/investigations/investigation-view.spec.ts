import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Investigation Details View (Summary Tab)
 */
test.describe("Investigation Details", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/investigations");
    await waitForSpinner(page);

    const rows = page.locator("#investigation-list tbody tr");
    const rowCount = await rows.count();

    expect(rowCount, "No investigations found.").toBeGreaterThan(0);

    const firstLink = rows.first().locator("a.comp-cell-link").first();
    await firstLink.click();
    await waitForSpinner(page);

    // Wait for investigation data to load - header should not show "Unknown"
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });
  });

  test("it displays investigation header", async ({ page }) => {
    // Verify the investigation header is displayed
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).toBeVisible();
    await expect(header).toContainText(/Investigation/i);

    const leadAgency = page.locator("#comp-details-lead-agency-text-id");
    await expect(leadAgency).toBeVisible();

    // Verify breadcrumb is displayed
    const breadcrumb = page.locator(".breadcrumb");
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.locator("a")).toContainText("Investigations");
  });

  test("it displays summary information", async ({ page }) => {
    const dateLoggedSection = page.locator("dt", { hasText: "Date logged" });
    await expect(dateLoggedSection).toBeVisible();

    const lastUpdatedSection = page.locator("dt", { hasText: "Last updated" });
    await expect(lastUpdatedSection).toBeVisible();

    const primaryInvestigatorSection = page.locator("dt", { hasText: "Primary investigator" });
    await expect(primaryInvestigatorSection).toBeVisible();

    const supervisorSection = page.locator("dt", { hasText: "Supervisor" });
    await expect(supervisorSection).toBeVisible();

    const coordinatorSection = page.locator("dt", { hasText: "File coordinator" });
    await expect(coordinatorSection).toBeVisible();
  });

  test("it displays investigation details section", async ({ page }) => {
    await expect(page.locator("h3", { hasText: "Investigation summary" })).toBeVisible();

    const investigationIdLabel = page.locator("span", { hasText: "Investigation #" });
    await expect(investigationIdLabel).toBeVisible();

    const caseIdLabel = page.locator("dt", { hasText: "Case ID" });
    await expect(caseIdLabel).toBeVisible();
  });

  test("it navigates to linked case", async ({ page }) => {
    const caseIdLink = page.locator("a", { hasText: "CASE" }).first();

    if (await caseIdLink.isVisible()) {
      await caseIdLink.click();
      await waitForSpinner(page);

      // Should navigate to case page
      await expect(page).toHaveURL(/\/case\//);
    }
  });

  test("it can edit", async ({ page }) => {
    const editButton = page.locator("#details-screen-edit-button");
    await expect(editButton).toBeVisible();
    await expect(editButton).toContainText("Edit");

    // Click Edit
    await editButton.click();
    await waitForSpinner(page);

    // Click Cancel
    const cancelButton = page.locator("#investigation-cancel-button");
    await cancelButton.click();

    // Confirm Cancel
    await page.locator(".modal-footer .btn-primary").click();

    // Confirm save Button not present
    const saveButton = page.locator("#investigation-save-button");
    await expect(saveButton).not.toBeVisible();
  });
});
