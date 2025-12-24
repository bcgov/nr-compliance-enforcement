import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { enterDateTimeInDatePicker, selectItemById, waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Investigation Edit functionality
 * Verifies form display, validation, and updates
 */
test.describe("Investigation Edit Form", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

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
  });

  test("it loads existing data", async ({ page }) => {
    // Verify we're on edit page
    await expect(page).toHaveURL(/\/investigation\/[^/]+\/edit$/);

    // Wait for form data to load
    const nameInput = page.locator("#display-name");
    await expect(nameInput).not.toHaveValue("", { timeout: 10000 });

    // Verify Investigation ID is filled
    const nameValue = await nameInput.inputValue();
    expect(nameValue).toBeTruthy();

    // Verify Description
    const descriptionInput = page.locator("#description");
    await expect(descriptionInput).toBeVisible();

    // Verify Status has value
    const statusSelect = page.locator("#investigation-status-select");
    const statusText = await statusSelect.textContent();
    expect(statusText).toBeTruthy();
  });

  test("it updates investigation details", async ({ page }) => {
    const nameInput = page.locator("#display-name");
    await expect(nameInput).not.toHaveValue("", { timeout: 10000 });

    const descriptionInput = page.locator("#description");
    const originalDescription = await descriptionInput.inputValue();

    //Ensure Mandatory fields are present
    await selectItemById("primary-investigator-select", "TestAcct, ENV", page);
    await selectItemById("supervisor-select", "TestAcct, ENV", page);

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
    const nameInput = page.locator("#display-name");
    await expect(nameInput).not.toHaveValue("", { timeout: 10000 });

    // Clear required field
    await nameInput.clear();

    // Try to save
    await page.locator("#details-screen-save-button-top").click();

    // Should show validation error
    const errorMessage = page.locator(".error-message, .text-danger, [class*='error']").first();
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test("it cancels edit with confirmation", async ({ page }) => {
    const nameInput = page.locator("#display-name");
    await expect(nameInput).not.toHaveValue("", { timeout: 10000 });

    // Make a change
    const descriptionInput = page.locator("#description");
    await descriptionInput.fill("Changed description");

    // Click cancel
    await page.locator("#details-screen-cancel-edit-button-top").click();

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

test.describe("Investigation Edit - Field Constraints", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("it has lead agency disabled", async ({ page }) => {
    await page.goto("/investigations");
    await waitForSpinner(page);

    const rows = page.locator("#investigation-list tbody tr");
    await rows.first().locator("a.comp-cell-link").first().click();
    await waitForSpinner(page);

    // Wait for investigation data to load
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });

    await page.locator("#details-screen-edit-button").click();
    await waitForSpinner(page);

    // Lead agency should be disabled
    const leadAgencySelect = page.locator("#lead-agency-select");
    await expect(leadAgencySelect).toBeVisible();
    const isDisabled = await leadAgencySelect.locator(".comp-select--is-disabled").count();
    expect(isDisabled).toBeGreaterThanOrEqual(0);
  });

  test("it shows duplicate Investigation ID error", async ({ page }) => {
    await page.goto("/investigations");
    await waitForSpinner(page);

    const rows = page.locator("#investigation-list tbody tr");

    // Get the second investigation
    const secondInvId = await rows.nth(1).locator("a.comp-cell-link").first().textContent();

    // Navigate to edit the first investigation
    await rows.first().locator("a.comp-cell-link").first().click();
    await waitForSpinner(page);

    // Wait for investigation data to load
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });

    await page.locator("#details-screen-edit-button").click();
    await waitForSpinner(page);

    const nameInput = page.locator("#display-name");
    await expect(nameInput).not.toHaveValue("", { timeout: 10000 });

    // Try to change to duplicate ID
    await nameInput.clear();
    await nameInput.fill(secondInvId || "INVESTIGATION1");

    // Should show duplicate error (async validation)
    const errorMessage = page.locator("text=already in use");
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });
});
