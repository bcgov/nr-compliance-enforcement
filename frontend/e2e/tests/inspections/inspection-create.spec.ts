import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Inspection Creation functionality
 */
async function navigateToCreateInspection(page: any): Promise<string | null> {
  await page.goto("/cases");
  await waitForSpinner(page);

  const caseRows = page.locator("#case-list tbody tr");

  const firstCaseLink = caseRows.first().locator("a.comp-cell-link").first();
  const caseId = await firstCaseLink.textContent();

  const caseGuidLink = firstCaseLink.getAttribute("href");
  const caseGuid = (await caseGuidLink)?.replace("/case/", "");

  if (caseGuid) {
    await page.goto(`/case/${caseGuid}/createInspection`);
    await waitForSpinner(page);
  }

  return caseId;
}
test.describe("Inspection Creation", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("it creates inspection from case", async ({ page }) => {
    await navigateToCreateInspection(page);
    await expect(page).toHaveURL(/\/case\/.*\/createInspection/);
    const formHeader = page.locator("h2", { hasText: /Inspection Details/i });
    await expect(formHeader).toBeVisible();
  });

  test("it validates required fields", async ({ page }) => {
    await navigateToCreateInspection(page);

    // Try to save without filling required fields
    const saveButton = page.locator("button", { hasText: /Save|Create/i }).first();
    await saveButton.click();

    // Check for validation errors
    const errorMessages = page.locator(".error-message, .invalid-feedback, .text-danger");
    await expect(errorMessages.locator("visible=true")).not.toHaveCount(0, { timeout: 10000 });
  });

  test("it saves inspection with all fields", async ({ page }) => {
    await navigateToCreateInspection(page);
    await expect(page.locator("h2", { hasText: /Inspection Details/i })).toBeVisible();

    const descriptionInput = page.locator("#description");
    await descriptionInput.fill("Test Description");

    // Wait for the createInspection mutation
    const createMutationPromise = page.waitForResponse(
      (response) =>
        response.url().includes("/graphql") && (response.request().postData()?.includes("CreateInspection") ?? false),
      { timeout: 15000 },
    );

    const saveButton = page.locator("#details-screen-save-button-top");
    await expect(saveButton).toBeVisible({ timeout: 10000 });
    await saveButton.click({ force: true });

    await createMutationPromise;
    await expect(page).toHaveURL(/\/inspection\/[a-f0-9-]+$/i, { timeout: 30000 });
  });

  test("it handles coordinate input", async ({ page }) => {
    await navigateToCreateInspection(page);

    const coordinateSection = page.locator("#inspection-coordinates");
    if (await coordinateSection.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Enter latitude
      const latInput = page.locator("#input-y-coordinate");
      await latInput.fill("49.2827");

      // Enter longitude
      const lngInput = page.locator("#input-x-coordinate");
      await lngInput.fill("-123.1207");

      // Verify values are set
      await expect(latInput).toHaveValue("49.2827");
      await expect(lngInput).toHaveValue("-123.1207");
    }
  });

  test("it cancels with confirmation", async ({ page }) => {
    await navigateToCreateInspection(page);

    const descriptionInput = page.locator("#description");
    await descriptionInput.fill("Test Inspection");

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
  });
});
