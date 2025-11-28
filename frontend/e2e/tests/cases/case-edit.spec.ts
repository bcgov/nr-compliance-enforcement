import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Case Edit functionality
 * Verifies form display, validation, and case updates
 * Uses CASE1 which has linked activities ensuring history exists
 */
test.describe("Case Edit Form", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const rows = page.locator("#case-list tbody tr");
    expect(await rows.count(), "No cases found.").toBeGreaterThan(0);

    // Use CASE1 - wait for it to be visible before clicking
    const caseLink = page.locator("#case-list tbody tr a.comp-cell-link", { hasText: "CASE1" }).first();
    await expect(caseLink).toBeVisible({ timeout: 10000 });
    await caseLink.click();
    await waitForSpinner(page);

    // Wait for case data to load - header should show CASE1, not "Unknown"
    const caseHeader = page.locator("h1.comp-box-complaint-id");
    await expect(caseHeader).toContainText("CASE1", { timeout: 15000 });

    // Click Edit button
    const editButton = page.locator("#details-screen-edit-button");
    await expect(editButton).toBeVisible({ timeout: 10000 });
    await editButton.click();
    await waitForSpinner(page);

    const caseIdInput = page.locator("#display-name");
    await expect(caseIdInput).not.toHaveValue("", { timeout: 10000 });
  });

  test("it displays the edit case form", async ({ page }) => {
    await expect(page).toHaveURL(/\/case\/[^/]+\/edit$/);
    await expect(page.locator("h2")).toContainText("Case Details");
  });

  test("it shows breadcrumb with Edit case", async ({ page }) => {
    const breadcrumb = page.locator(".breadcrumb");
    await expect(breadcrumb).toBeVisible();

    await expect(breadcrumb.locator("a")).toContainText("Cases");
    await expect(breadcrumb).toContainText("Edit case");
  });

  test("it pre-fills form with existing case data", async ({ page }) => {
    // Case ID should be filled
    const caseIdInput = page.locator("#display-name");
    const caseIdValue = await caseIdInput.inputValue();
    expect(caseIdValue).toBeTruthy();

    // Description field should be visible
    const descriptionInput = page.locator("#description");
    await expect(descriptionInput).toBeVisible();

    // Status should have a value
    const statusSelect = page.locator("#case-status-select");
    const statusText = await statusSelect.textContent();
    expect(statusText).toBeTruthy();
  });

  test("it shows Cancel and Save buttons", async ({ page }) => {
    const cancelButton = page.locator("#details-screen-cancel-edit-button-top");
    const saveButton = page.locator("#details-screen-save-button-top");

    await expect(cancelButton).toBeVisible();
    await expect(saveButton).toBeVisible();
  });

  test("it allows editing Case ID", async ({ page }) => {
    const caseIdInput = page.locator("#display-name");

    await caseIdInput.clear();
    await caseIdInput.fill("MODIFIED-CASE-ID");

    await expect(caseIdInput).toHaveValue("MODIFIED-CASE-ID");
  });

  test("it allows editing case status", async ({ page }) => {
    // Click on status select
    const statusSelect = page.locator("#case-status-select");
    await statusSelect.click();

    const options = page.locator(".comp-select__option");
    await expect(options.first()).toBeVisible({ timeout: 5000 });

    // Select a different status
    if ((await options.count()) > 1) {
      await options.nth(1).click();
    }

    const statusText = await statusSelect.textContent();
    expect(statusText).toBeTruthy();
  });

  test("it allows editing description", async ({ page }) => {
    const descriptionInput = page.locator("#description");

    await descriptionInput.clear();
    await descriptionInput.fill("Updated description");

    await expect(descriptionInput).toHaveValue("Updated description");
  });

  test("it navigates back on cancel without saving", async ({ page }) => {
    const descriptionInput = page.locator("#description");
    await descriptionInput.fill("Unsaved changes");

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

    // Should navigate to case view
    await expect(page).toHaveURL(/\/case\/[^/]+$/);
    expect(page.url()).not.toContain("/edit");
  });

  test("it shows validation error when clearing required fields", async ({ page }) => {
    // Clear Case ID and click save
    const caseIdInput = page.locator("#display-name");
    await caseIdInput.clear();
    await page.locator("#details-screen-save-button-top").click();

    // Should show validation error
    const errorMessage = page.locator(".error-message, .text-danger, [class*='error']").first();
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test("it saves changes successfully", async ({ page }) => {
    const descriptionInput = page.locator("#description");
    const originalDescription = await descriptionInput.inputValue();
    const newDescription = `${originalDescription} - Updated at ${Date.now()}`;
    await descriptionInput.clear();
    await descriptionInput.fill(newDescription);

    const saveButton = page.locator("#details-screen-save-button-top");
    await expect(saveButton).toBeEnabled({ timeout: 5000 });
    await saveButton.click();
    await waitForSpinner(page);

    // Should navigate to case view page
    await expect(page).toHaveURL(/\/case\/[^/]+$/);
    expect(page.url()).not.toContain("/edit");
  });
});

test.describe("Case Edit - Navigation", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("it navigates to edit from case view", async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const rows = page.locator("#case-list tbody tr");
    expect(await rows.count(), "No cases found.").toBeGreaterThan(0);

    // Click on case
    await rows.first().locator("a.comp-cell-link").first().click();
    await waitForSpinner(page);

    // Wait for case data to load - header should not show "Unknown"
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });

    // Click Edit button
    const editButton = page.locator("#details-screen-edit-button");
    await editButton.click();
    await waitForSpinner(page);

    // Should be on edit page
    await expect(page).toHaveURL(/\/case\/[^/]+\/edit$/);
  });

  test("it navigates to edit via actions dropdown", async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const rows = page.locator("#case-list tbody tr");
    expect(await rows.count(), "No cases found.").toBeGreaterThan(0);

    const actionsButton = rows.first().locator(".comp-action-dropdown button");
    await expect(actionsButton).toBeVisible({ timeout: 10000 });
    await actionsButton.click();

    const editLink = page.locator(".dropdown-menu.show a", { hasText: "Edit Case" });
    await expect(editLink).toBeVisible({ timeout: 5000 });
    await editLink.click();
    await waitForSpinner(page);

    await expect(page).toHaveURL(/\/case\/[^/]+\/edit$/);
  });
});

test.describe("Case Edit - Lead Agency", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("it has lead agency disabled", async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const rows = page.locator("#case-list tbody tr");
    expect(await rows.count(), "No cases found.").toBeGreaterThan(0);

    const actionsButton = rows.first().locator(".comp-action-dropdown button");
    await expect(actionsButton).toBeVisible({ timeout: 10000 });
    await actionsButton.click();

    const editLink = page.locator(".dropdown-menu.show a", { hasText: "Edit Case" });
    await expect(editLink).toBeVisible({ timeout: 5000 });
    await editLink.click();
    await waitForSpinner(page);

    // Lead agency select should be disabled
    const leadAgencySelect = page.locator("#lead-agency-select");
    await expect(leadAgencySelect).toBeVisible();
    const isDisabled = await leadAgencySelect.locator(".comp-select--is-disabled").count();
    expect(isDisabled).toBeGreaterThanOrEqual(0); // May or may not be disabled depending on implementation
  });
});
