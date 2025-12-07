import { test, expect, Page } from "@playwright/test";

import COMPLAINT_TYPES from "../../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { navigateToCreateScreen, navigateToEditScreen } from "../../utils/helpers";

/*
Test that confirms that CEEB Users see different values in the Method Complaint Received field.
*/
async function validateMethodReceivedOptions(page: Page) {
  //Check for CEEB values
  await expect(
    page
      .locator(".comp-select__menu-list")
      .getByText(/DGIR forward/)
      .first(),
  ).toBeVisible();
  await expect(
    page
      .locator(".comp-select__menu-list")
      .getByText(/Direct contact/)
      .first(),
  ).toBeVisible();
  await expect(
    page
      .locator(".comp-select__menu-list")
      .getByText(/Minister's office/)
      .first(),
  ).toBeVisible();
  await expect(page.locator(".comp-select__menu-list").getByText(/RAPP/).first()).toBeVisible();
  await expect(
    page
      .locator(".comp-select__menu-list")
      .getByText(/Referral/)
      .first(),
  ).toBeVisible();

  //Check that COS values aren't there
  await expect(
    page
      .locator(".comp-select__menu-list")
      .getByText(/BC wildlife federation app/)
      .first(),
  ).not.toBeVisible();
  await expect(
    page
      .locator(".comp-select__menu-list")
      .getByText(/Observed in field/)
      .first(),
  ).not.toBeVisible();
}
test.describe("Validate CEEB method complaint received options", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.CEEB });

  test("only has CEEB values on create", async function ({ page }) {
    //Access dropdown from create screen
    await navigateToCreateScreen(page);
    await page.locator("#complaint-received-method-select-id").locator("div").first().click();

    await validateMethodReceivedOptions(page);
  });

  test("only has CEEB values on edit", async function ({ page }) {
    //Access dropdown from create screen
    await navigateToEditScreen(COMPLAINT_TYPES.ERS, "23-030990", true, page);
    await page.locator("#complaint-received-method-select-id").locator("div").first().click();

    await validateMethodReceivedOptions(page);
  });
});
