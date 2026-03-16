import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner } from "../../utils/helpers";

/**
 * Tests for Case Create functionality
 * Verifies form display, validation, and case creation
 */
test.describe("Case Create Form", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await page.goto("/case/create");
    await waitForSpinner(page);
  });

  test("it displays the create case form", async ({ page }) => {
    await expect(page.locator("#display-name")).toBeVisible();
    await expect(page.locator("#case-status-select")).toBeVisible();
    await expect(page.locator("#lead-agency-select")).toBeVisible();
    await expect(page.locator("#description")).toBeVisible();
  });

  test("it shows breadcrumb navigation", async ({ page }) => {
    const breadcrumb = page.locator(".breadcrumb");
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.locator("a")).toContainText("Cases");
    await expect(breadcrumb).toContainText("Create case");
  });

  test("it shows Cancel and Save buttons in header", async ({ page }) => {
    const cancelButton = page.locator("#details-screen-cancel-edit-button-top");
    const saveButton = page.locator("#details-screen-save-button-top");

    await expect(cancelButton).toBeVisible();
    await expect(cancelButton).toContainText("Cancel");

    await expect(saveButton).toBeVisible();
    await expect(saveButton).toContainText("Save");
  });

  test("it defaults case status to Open", async ({ page }) => {
    const statusSelect = page.locator("#case-status-select");
    await expect(statusSelect).toContainText("Open");
  });

  test("it sets the default lead agency based on the users agency", async ({ page }) => {
    const agencySelect = page.locator("#lead-agency-select");
    await expect(agencySelect).toBeVisible();

    // Lead agency should not be empty
    const agencyText = await agencySelect.textContent();
    expect(agencyText).toBeTruthy();
  });

  test("it shows validation error for empty Case ID", async ({ page }) => {
    await page.locator("#details-screen-save-button-top").click();
    const caseIdError = page.locator("#display-name-value .error-message, .comp-error-message").first();
    await expect(caseIdError).toBeVisible({ timeout: 5000 });
  });

  test("it navigates back to cases list on cancel", async ({ page }) => {
    await page.locator("#details-screen-cancel-edit-button-top").click();

    const modal = page.locator(".modal");
    await expect(modal).toBeVisible();

    const confirmButton = modal
      .locator("button")
      .filter({ hasText: /confirm|yes|cancel/i })
      .first();
    await confirmButton.click();
    await waitForSpinner(page);

    await expect(page).toHaveURL("/cases");
  });

  test("it creates a case successfully", async ({ page }) => {
    const uniqueId = `TEST-CASE-${Date.now()}`;

    await page.locator("#display-name").fill(uniqueId);
    await page.locator("#description").fill("This is a test case");

    const saveButton = page.locator("#details-screen-save-button-top");
    await expect(saveButton).toBeEnabled({ timeout: 5000 });

    await saveButton.click();
    await waitForSpinner(page);

    await expect(page).toHaveURL(/\/case\/[^/]+$/, { timeout: 15000 });
  });

  test("it shows duplicate Case ID error", async ({ page }) => {
    await page.locator("#display-name").fill("CASE1");

    const errorMessage = page.locator("text=already in use");
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Case Create - Navigation", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("it navigates to create from cases list", async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const createButton = page.locator("button", { hasText: "Create case" });
    await createButton.click();
    await waitForSpinner(page);

    await expect(page).toHaveURL("/case/create");
    await expect(page.locator("h1")).toContainText("Create case");
  });

  test("it can navigate via breadcrumb", async ({ page }) => {
    await page.goto("/case/create");
    await waitForSpinner(page);

    const breadcrumbLink = page.locator(".breadcrumb a", { hasText: "Cases" });
    await breadcrumbLink.click();
    await waitForSpinner(page);

    await expect(page).toHaveURL("/cases");
  });
});
