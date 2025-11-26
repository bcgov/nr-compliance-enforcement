import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Investigation Creation functionality=
 */
test.describe("Investigation Create Form", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("it creates investigation from case", async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    // Find CASE1 which has test data
    const caseLink = page.locator("#case-list tbody tr a.comp-cell-link", { hasText: "CASE1" });

    expect(await caseLink.count(), "CASE1 not found.").toBeGreaterThan(0);

    await caseLink.first().click();
    await waitForSpinner(page);

    // Click Create investigation button
    const createInvestigationBtn = page.locator("button", { hasText: "Create investigation" });
    await createInvestigationBtn.click();
    await waitForSpinner(page);

    // Verify we're on the create investigation page
    await expect(page).toHaveURL(/\/case\/[^/]+\/createInvestigation$/);
    await expect(page.locator("h2")).toContainText("Investigation details");

    // Fill in the form
    const uniqueId = `INV-${Date.now()}`;
    await page.locator("#display-name").fill(uniqueId);
    await page.locator("#description").fill("Test investigation");

    // Save
    const saveButton = page.locator("#details-screen-save-button-top");
    await expect(saveButton).toBeEnabled({ timeout: 5000 });
    await saveButton.click();
    await waitForSpinner(page);

    // Should navigate to investigation detail
    await expect(page).toHaveURL(/\/investigation\/[^/]+$/, { timeout: 15000 });
  });

  test("it validates required fields", async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const caseLink = page.locator("#case-list tbody tr a.comp-cell-link").first();
    await caseLink.click();
    await waitForSpinner(page);

    const createBtn = page.locator("button", { hasText: "Create investigation" });
    await createBtn.click();
    await waitForSpinner(page);

    // Try to save without filling required fields
    await page.locator("#details-screen-save-button-top").click();

    // Should show validation errors
    const errorMessages = page.locator(".error-message, .text-danger, [class*='error']");
    await expect(errorMessages.first()).toBeVisible({ timeout: 5000 });
  });

  test("it validates Investigation ID uniqueness", async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const caseLink = page.locator("#case-list tbody tr a.comp-cell-link").first();
    await caseLink.click();
    await waitForSpinner(page);

    const createBtn = page.locator("button", { hasText: "Create investigation" });
    await createBtn.click();
    await waitForSpinner(page);

    // Use an existing investigation ID
    await page.locator("#display-name").fill("INVESTIGATION1");

    // Should show duplicate error
    const errorMessage = page.locator("text=already in use");
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });

  test("it saves investigation with all fields", async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const caseLink = page.locator("#case-list tbody tr a.comp-cell-link").first();
    await caseLink.click();
    await waitForSpinner(page);

    const createBtn = page.locator("button", { hasText: "Create investigation" });
    await createBtn.click();
    await waitForSpinner(page);

    // Fill all fields
    const uniqueId = `INV-TEST-${Date.now()}`;
    await page.locator("#display-name").fill(uniqueId);
    await page.locator("#description").fill("Full test investigation with all fields");
    await page.locator("#locationAddress").fill("123 Test Street, Victoria, BC");
    await page.locator("#locationDescription").fill("Near the park entrance");

    // Save
    const saveButton = page.locator("#details-screen-save-button-top");
    await expect(saveButton).toBeEnabled({ timeout: 5000 });
    await saveButton.click();
    await waitForSpinner(page);

    // Should navigate to investigation detail
    await expect(page).toHaveURL(/\/investigation\/[^/]+$/, { timeout: 15000 });
    await expect(page.locator("h1")).toContainText(uniqueId);
  });

  test("it cancels creation with confirmation", async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const caseLink = page.locator("#case-list tbody tr a.comp-cell-link").first();
    await caseLink.click();
    await waitForSpinner(page);

    const createBtn = page.locator("button", { hasText: "Create investigation" });
    await createBtn.click();
    await waitForSpinner(page);

    // Fill some data
    await page.locator("#display-name").fill("TEST-CANCEL");

    // Click cancel
    await page.locator("#details-screen-cancel-edit-button-top").click();

    // Confirmation modal should appear
    const modal = page.locator(".modal");
    await expect(modal).toBeVisible();

    // Confirm
    const confirmButton = modal
      .locator("button")
      .filter({ hasText: /confirm|yes|cancel/i })
      .first();
    await confirmButton.click();
    await waitForSpinner(page);

    // Should navigate away from create
    expect(page.url()).not.toContain("/createInvestigation");
  });
});
