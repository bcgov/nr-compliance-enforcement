import { test, expect } from "@playwright/test";
import COMPLAINT_TYPES from "../../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { navigateToDetailsScreen, waitForSpinner } from "../../utils/helpers";

/**
 * Tests for the Create/Add Case modal opened from a complaint.
 * Verifies the search-by-case-or-investigation behaviour and the default radio selection.
 */
test.describe("Create/Add Case Modal - Search", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test.beforeEach(async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-031165", true, page);
    await waitForSpinner(page);

    await page.getByRole("button", { name: "Actions Menu" }).click();
    await page.locator("#create-add-case-button").click();

    // Wait for the modal's radio group to render
    await expect(page.locator("#create-add-case-radiogroup-1")).toBeVisible();
  });

  test('defaults the radio selection to "Add to an existing case"', async ({ page }) => {
    const addRadio = page.locator('input[type="radio"][value="add"]');
    await expect(addRadio).toBeChecked();

    await expect(page.getByPlaceholder("Search for a case")).toBeVisible();
  });

  test("finds a case when searching by case identifier", async ({ page }) => {
    await page.getByPlaceholder("Search for a case").fill("CASE7");

    const dropdown = page.locator(".rbt-menu");
    await expect(dropdown).toBeVisible();
    await expect(dropdown).toContainText("CASE7");
  });

  test("captures the selected case in the search input", async ({ page }) => {
    await page.getByPlaceholder("Search for a case").fill("CASE7");

    const dropdown = page.locator(".rbt-menu");
    await expect(dropdown).toBeVisible();

    await dropdown.locator(".dropdown-item").filter({ hasText: "CASE7" }).first().click();

    await expect(page.getByPlaceholder("Search for a case")).toHaveValue(/CASE7/);
  });
});
