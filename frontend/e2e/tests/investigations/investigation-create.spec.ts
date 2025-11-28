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

    // Find CASE1 which has test data - wait for it to be visible
    const caseLink = page.locator("#case-list tbody tr a.comp-cell-link", { hasText: "CASE1" }).first();
    await expect(caseLink).toBeVisible({ timeout: 10000 });
    await caseLink.click();
    await waitForSpinner(page);

    // Wait for case data to load
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).toContainText("CASE1", { timeout: 15000 });

    // Click Create investigation button
    const createInvestigationBtn = page.locator("button", { hasText: "Create investigation" });
    await expect(createInvestigationBtn).toBeVisible({ timeout: 10000 });
    await createInvestigationBtn.click();
    await waitForSpinner(page);

    // Verify we're on the create investigation page
    await expect(page).toHaveURL(/\/case\/[^/]+\/createInvestigation$/);
    await expect(page.locator("h2")).toContainText("Investigation details");

    // Fill in the form
    const uniqueId = `INV-${Date.now()}`;
    const displayNameInput = page.locator("#display-name");
    await expect(displayNameInput).toBeVisible({ timeout: 10000 });
    await displayNameInput.fill(uniqueId);
    await page.locator("#description").fill("Test investigation");

    // Save - use Promise.all to capture navigation
    const saveButton = page.locator("#details-screen-save-button-top");
    await expect(saveButton).toBeEnabled({ timeout: 5000 });
    
    await Promise.all([
      page.waitForURL(/\/investigation\/[^/]+$/, { timeout: 30000 }),
      saveButton.click(),
    ]);
    
    await waitForSpinner(page);
  });

  test("it validates required fields", async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const caseLink = page.locator("#case-list tbody tr a.comp-cell-link").first();
    await caseLink.click();
    await waitForSpinner(page);

    // Wait for case data to load
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });

    const createBtn = page.locator("button", { hasText: "Create investigation" });
    await expect(createBtn).toBeVisible({ timeout: 10000 });
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

    // Wait for case data to load
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });

    const createBtn = page.locator("button", { hasText: "Create investigation" });
    await expect(createBtn).toBeVisible({ timeout: 10000 });
    await createBtn.click();
    await waitForSpinner(page);

    // Use an existing investigation ID
    const displayNameInput = page.locator("#display-name");
    await expect(displayNameInput).toBeVisible({ timeout: 10000 });
    await displayNameInput.fill("INVESTIGATION1");

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

    // Wait for case data to load
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });

    const createBtn = page.locator("button", { hasText: "Create investigation" });
    await expect(createBtn).toBeVisible({ timeout: 10000 });
    await createBtn.click();
    await waitForSpinner(page);

    // Fill all fields
    const uniqueId = `INV-TEST-${Date.now()}`;
    const displayNameInput = page.locator("#display-name");
    await expect(displayNameInput).toBeVisible({ timeout: 10000 });
    await displayNameInput.fill(uniqueId);
    await page.locator("#description").fill("Full test investigation with all fields");
    
    const locationAddressInput = page.locator("#locationAddress");
    if (await locationAddressInput.isVisible()) {
      await locationAddressInput.fill("123 Test Street, Victoria, BC");
    }
    
    const locationDescInput = page.locator("#locationDescription");
    if (await locationDescInput.isVisible()) {
      await locationDescInput.fill("Near the park entrance");
    }

    // Save - use Promise.all to capture navigation
    const saveButton = page.locator("#details-screen-save-button-top");
    await expect(saveButton).toBeEnabled({ timeout: 5000 });
    
    await Promise.all([
      page.waitForURL(/\/investigation\/[^/]+$/, { timeout: 30000 }),
      saveButton.click(),
    ]);
    
    await waitForSpinner(page);
    await expect(page.locator("h1")).toContainText(uniqueId);
  });

  test("it cancels creation with confirmation", async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const caseLink = page.locator("#case-list tbody tr a.comp-cell-link").first();
    await caseLink.click();
    await waitForSpinner(page);

    // Wait for case data to load
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });

    const createBtn = page.locator("button", { hasText: "Create investigation" });
    await expect(createBtn).toBeVisible({ timeout: 10000 });
    await createBtn.click();
    await waitForSpinner(page);

    // Fill some data
    const displayNameInput = page.locator("#display-name");
    await expect(displayNameInput).toBeVisible({ timeout: 10000 });
    await displayNameInput.fill("TEST-CANCEL");

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
