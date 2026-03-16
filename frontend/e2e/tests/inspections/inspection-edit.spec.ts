import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Inspection Edit functionality
 */
test.describe("Inspection Edit", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/inspections");
    await waitForSpinner(page);

    const rows = page.locator("#inspection-list tbody tr");
    const rowCount = await rows.count();
    expect(rowCount, "No inspections found.").toBeGreaterThan(0);

    // Click on first inspection to view it
    const firstLink = rows.first().locator("a.comp-cell-link").first();
    await firstLink.click();
    await waitForSpinner(page);

    // Wait for inspection data to load - header should not show "Unknown"
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });

    // Click Edit button
    const editButton = page.locator("#details-screen-edit-button");
    await editButton.click();
    await waitForSpinner(page);
  });

  test("it loads existing data", async ({ page }) => {
    await expect(page).toHaveURL(/\/inspection\/[^/]+\/edit$/);

    // Verify form fields are pre-populated
    const inspectionIdInput = page.locator("#display-name");
    await expect(inspectionIdInput).not.toHaveValue("", { timeout: 10000 });

    // Verify status select has a value
    const statusSelect = page.locator("#inspection-status-select");
    await expect(statusSelect).toBeVisible();

    // Verify agency select has a value
    const agencySelect = page.locator("#lead-agency-select");
    await expect(agencySelect).toBeVisible();
  });

  test("it updates inspection details", async ({ page }) => {
    // Find and update description
    const descriptionInput = page.locator("#description");
    if (await descriptionInput.isVisible()) {
      const currentValue = await descriptionInput.inputValue();
      const newValue = currentValue + " - Updated by test";
      await descriptionInput.fill(newValue);

      // Verify the value was updated
      await expect(descriptionInput).toHaveValue(newValue);
    }

    // Update location address
    const locationInput = page.locator("#locationAddress");
    if (await locationInput.isVisible()) {
      await locationInput.fill("123 Test Street, Vancouver BC");
    }

    // Save changes
    const saveButton = page.locator("button", { hasText: /Save|Update/i }).first();
    await saveButton.click();
    await waitForSpinner(page);

    // Verify navigation back to details page
    await expect(page).toHaveURL(/\/inspection\/[^/]+$/, { timeout: 15000 });
  });

  test("it updates location coordinates", async ({ page }) => {
    // Find the coordinate input section
    const coordinateSection = page.locator("#inspection-coordinates");
    if (await coordinateSection.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Update latitude
      const latInput = page.locator("#input-y-coordinate");
      await latInput.clear();
      await latInput.fill("49.2849");

      // Update longitude
      const lngInput = page.locator("#input-x-coordinate");
      await lngInput.clear();
      await lngInput.fill("-123.1207");

      // Verify values are set
      await expect(latInput).toHaveValue("49.2849");
      await expect(lngInput).toHaveValue("-123.1207");
    }
  });

  test("it validates on edit", async ({ page }) => {
    // Clear a required field
    const inspectionIdInput = page.locator("#display-name");
    await inspectionIdInput.clear();

    // Try to save
    const saveButton = page.locator("button", { hasText: /Save|Update/i }).first();
    await saveButton.click();

    // Check for validation errors
    const errorMessages = page.locator(".error-message, .invalid-feedback, .text-danger");
    await expect(errorMessages.first()).toBeVisible({ timeout: 10000 });
  });

  test("it cancels with confirmation", async ({ page }) => {
    // Make a change to trigger dirty state
    const descriptionInput = page.locator("#description");
    if (await descriptionInput.isVisible()) {
      const currentValue = await descriptionInput.inputValue();
      await descriptionInput.fill(currentValue + " - Changed");
    }

    // Click cancel
    const cancelButton = page.locator("button", { hasText: /Cancel/i });
    await cancelButton.click();

    // Verify confirmation modal appears
    const confirmModal = page.locator(".modal, [role='dialog']");
    await expect(confirmModal).toBeVisible({ timeout: 5000 });

    // Confirm cancellation
    const confirmButton = confirmModal.locator("button", { hasText: /Yes|Confirm|Cancel/i }).first();
    await confirmButton.click();

    // Should navigate back to details page
    await waitForSpinner(page);
    await expect(page).toHaveURL(/\/inspection\/[^/]+$/, { timeout: 15000 });
  });

  test("it preserves data after edit and save", async ({ page }) => {
    await page.goto("/inspections");
    await waitForSpinner(page);

    const rows = page.locator("#inspection-list tbody tr");
    expect(await rows.count(), "No inspections found.").toBeGreaterThan(0);

    // Get first inspection ID
    const firstLink = rows.first().locator("a.comp-cell-link").first();
    const inspectionId = await firstLink.textContent();

    // Click to view
    await firstLink.click();
    await waitForSpinner(page);

    // Wait for inspection data to load
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });

    // Navigate to edit
    const editButton = page.locator("#details-screen-edit-button");
    await editButton.click();
    await waitForSpinner(page);

    // Verify inspection ID is preserved
    const inspectionIdInput = page.locator("#display-name");
    await expect(inspectionIdInput).toHaveValue(inspectionId || "");

    // Save without changes
    const saveButton = page.locator("button", { hasText: /Save|Update/i }).first();
    await saveButton.click();
    await waitForSpinner(page);

    // Verify ID is still correct after save
    await expect(page.locator("h1")).toContainText(inspectionId || "");
  });

  test("it validates ID uniqueness on edit", async ({ page }) => {
    await page.goto("/inspections");
    await waitForSpinner(page);

    // Click on second inspection (not INSPECTION1)
    const rows = page.locator("#inspection-list tbody tr");
    await rows.nth(1).locator("a.comp-cell-link").first().click();
    await waitForSpinner(page);

    // Wait for inspection data to load
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });

    // Navigate to edit
    await page.locator("#details-screen-edit-button").click();
    await waitForSpinner(page);

    // Try to change ID to INSPECTION1
    const inspectionIdInput = page.locator("#display-name");
    await inspectionIdInput.clear();
    await inspectionIdInput.fill("INSPECTION1");

    // Should show duplicate error
    const errorMessage = page.locator("text=already in use");
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });
});
