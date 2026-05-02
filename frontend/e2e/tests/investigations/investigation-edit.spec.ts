import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { enterDateTimeInDatePicker, selectItemById, waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Investigation Edit functionality
 * Verifies form display, validation, and updates
 */
test.describe("Investigation Edit Form", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  test.describe.configure({ mode: "serial" }); // tests share the first investigation's data

  test.beforeEach(async ({ page }) => {
    // Navigate to investigations list
    await page.goto("/investigations");
    await waitForSpinner(page);

    const rows = page.locator("#investigation-list tbody tr");
    expect(await rows.count(), "No investigations found.").toBeGreaterThan(0);

    // Navigate to first investigation
    await rows.first().locator("a.comp-cell-link").first().click();
    await waitForSpinner(page);

    // Wait for investigation data to load - header should not show "Unknown"
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });

    // Click Edit button
    const editButton = page.locator("#details-screen-edit-button");
    await editButton.click();
    await waitForSpinner(page);
    await expect(page).toHaveURL(/\/investigation\/[^/]+\/edit$/);
  });

  test("it loads existing data", async ({ page }) => {
    // Verify we're on edit page
    const saveButton = page.locator("#details-screen-save-button-top");
    await expect(saveButton).toBeVisible();

    // Verify Description
    const descriptionInput = page.locator("#description");
    await expect(descriptionInput).toBeVisible();

    // Verify Status has value
    const statusSelect = page.locator("#investigation-status-select");
    const statusText = await statusSelect.textContent();
    expect(statusText).toBeTruthy();
  });

  test("it updates investigation details", async ({ page }) => {
    const descriptionInput = page.locator("#description");
    const originalDescription = await descriptionInput.inputValue();

    //Ensure Mandatory fields are present
    await selectItemById("primary-investigator-select", "TestAcct, ENV", page);
    await selectItemById("supervisor-select", "TestAcct, ENV", page);

    // Set community if not already set - test seed data is missing community
    const communityValue = page.locator("#community-select .comp-select__single-value");
    if ((await communityValue.count()) === 0) {
      await selectItemById("community-select", "100 Mile House", page);
    }

    await enterDateTimeInDatePicker(page, "investigation-discovery-date", "01", "13", "45");

    // Make a change
    const newDescription = `${originalDescription} - Updated at ${Date.now()}`;
    await descriptionInput.clear();
    await descriptionInput.fill(newDescription);

    // Save
    const saveButton = page.locator("#details-screen-save-button-top");
    await expect(saveButton).toBeEnabled({ timeout: 5000 });
    await saveButton.click();
    await waitForSpinner(page);

    // Should navigate to investigation view
    await expect(page).toHaveURL(/\/investigation\/[^/]+$/);
    expect(page.url()).not.toContain("/edit");
  });

  test("it validates on edit", async ({ page }) => {
    const descriptionInput = page.locator("#description");
    await expect(descriptionInput).not.toHaveValue("", { timeout: 10000 });

    // Clear required field
    await descriptionInput.clear();

    // Try to save
    const saveButton = page.locator("#details-screen-save-button-top");
    await expect(saveButton).toBeEnabled({ timeout: 5000 });
    await saveButton.click();

    // Should show validation error
    const errorMessage = page.locator(".error-message, .text-danger, [class*='error']").first();
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test("it cancels edit with confirmation", async ({ page }) => {
    // Make a change to trigger dirty state
    const descriptionInput = page.locator("#description");
    await descriptionInput.fill("Changed description");

    // Click cancel
    const cancelButton = page.locator("#details-screen-cancel-edit-button-top");
    await cancelButton.click();

    // Confirmation modal should appear
    const modal = page.locator(".modal");
    await expect(modal).toBeVisible();

    // Confirm cancel
    const confirmButton = modal
      .locator("button")
      .filter({ hasText: /confirm|yes|cancel/i })
      .first();
    await confirmButton.click();
    await waitForSpinner(page);

    // Should navigate to investigation detail
    await expect(page).toHaveURL(/\/investigation\/[^/]+$/);
    expect(page.url()).not.toContain("/edit");
  });
});
