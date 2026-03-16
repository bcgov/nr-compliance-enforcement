import { test, expect, Page } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { enterDateTimeInDatePicker, selectItemById, waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Investigation Creation functionality
 */
async function navigateToCreateInvestigation(page: Page): Promise<string | null> {
  await page.goto("/cases");
  await waitForSpinner(page);

  const caseRows = page.locator("#case-list tbody tr");
  const firstCaseLink = caseRows.first().locator("a.comp-cell-link").first();
  const caseId = await firstCaseLink.textContent();

  const caseGuidLink = firstCaseLink.getAttribute("href");
  const caseGuid = (await caseGuidLink)?.replace("/case/", "");

  if (caseGuid) {
    await page.goto(`/case/${caseGuid}/createInvestigation`);
    await waitForSpinner(page);
  }

  return caseId;
}

test.describe("Investigation Create Form", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("it creates investigation from case", async ({ page }) => {
    await navigateToCreateInvestigation(page);
    await expect(page).toHaveURL(/\/case\/.*\/createInvestigation/);
    const formHeader = page.locator("h2", { hasText: /Investigation details/i });
    await expect(formHeader).toBeVisible();
  });

  test("it validates required fields", async ({ page }) => {
    await navigateToCreateInvestigation(page);

    // Try to save without filling required fields
    const saveButton = page.locator("button", { hasText: /Save/i }).first();
    await saveButton.click();

    // Check for validation errors
    const errorMessages = page.locator(".error-message", { hasText: "Discovery date is required" });
    await expect(errorMessages).toBeVisible({ timeout: 10000 });
  });

  test("it validates Investigation ID uniqueness", async ({ page }) => {
    await navigateToCreateInvestigation(page);

    // Enter an investigation ID that already exists
    const investigationIdInput = page.locator("#display-name");
    await investigationIdInput.fill("INVESTIGATION1");

    const validationError = page.locator("text=/already in use/i");
    await expect(validationError).toBeVisible({ timeout: 10000 });
  });

  test("it saves investigation with all fields", async ({ page }) => {
    await navigateToCreateInvestigation(page);
    await expect(page.locator("h2", { hasText: /Investigation details/i })).toBeVisible();

    const uniqueId = `INV-${Date.now()}`;

    // Set up listener for async validation response before filling the input
    const validationResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/graphql") &&
        (response.request().postData()?.includes("checkInvestigationNameExists") ?? false),
      { timeout: 15000 },
    );

    const investigationIdInput = page.locator("#display-name");
    await investigationIdInput.fill(uniqueId);

    await selectItemById("primary-investigator-select", "TestAcct, ENV", page);
    await selectItemById("supervisor-select", "TestAcct, ENV", page);

    await enterDateTimeInDatePicker(page, "investigation-discovery-date", "01", "13", "45");

    // Wait for async validation to complete
    await validationResponsePromise;

    const descriptionInput = page.locator("#description");
    await descriptionInput.fill("Test investigation description");

    const locationAddressInput = page.locator("#locationAddress");
    if (await locationAddressInput.isVisible()) {
      await locationAddressInput.fill("123 Test Street, Victoria, BC");
    }

    const locationDescInput = page.locator("#locationDescription");
    if (await locationDescInput.isVisible()) {
      await locationDescInput.fill("Near the park entrance");
    }

    const saveButton = page.locator("button", { hasText: /Save/i }).first();
    await expect(saveButton).toBeEnabled({ timeout: 10000 });
    await saveButton.click({ force: true });
    await expect(page).toHaveURL(/\/investigation\/[a-f0-9-]+$/i, { timeout: 30000 });
  });

  test("it cancels with confirmation", async ({ page }) => {
    await navigateToCreateInvestigation(page);

    const investigationIdInput = page.locator("#display-name");
    await investigationIdInput.fill("Test Investigation");

    const cancelButton = page.locator("button", { hasText: /Cancel/i });
    await cancelButton.click();

    // Verify modal appears
    const confirmModal = page.locator(".modal, [role='dialog']");
    await expect(confirmModal).toBeVisible({ timeout: 5000 });

    // Confirm
    const confirmButton = confirmModal.locator("button", { hasText: /Yes|Confirm|Cancel/i }).first();
    await confirmButton.click();

    // Should navigate away from create page
    await waitForSpinner(page);
    expect(page.url()).not.toContain("/createInvestigation");
  });
});
