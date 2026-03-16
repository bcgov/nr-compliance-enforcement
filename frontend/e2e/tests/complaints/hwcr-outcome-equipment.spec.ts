import { test, expect, Page } from "@playwright/test";

import COMPLAINT_TYPES from "../../../src/app/types/app/complaint-types";
import {
  fillInHWCSection,
  hasErrorMessage,
  navigateToDetailsScreen,
  validateComplaint,
  validateHWCSection,
  waitForSpinner,
} from "../../utils/helpers";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";

async function deleteAllEquipments(page: Page) {
  const $equipment = page.locator("#outcome-equipment");
  while ((await $equipment.locator("#equipment-delete-button").count()) > 0) {
    // Always select the *first* delete button
    await $equipment.locator("#equipment-delete-button").first().click();

    // Confirm deletion in modal
    await page.locator(".modal-footer .btn-primary").click();

    page.locator(".Toastify__toast-body", {
      hasText: "Equipment has been deleted",
    });
  }
}

// Executes the following tests in order
// 1. Test the validation on the equipment component (also attempts to clean up any equipment on the complaint)
// 2. Saves an equipment
// 3. Cancels an edit to a equipment
// 4. Edits a equipment
// 5. Deletes a equipment
test.describe("HWCR Outcome Equipment", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  test.describe.configure({ mode: "serial" }); //Ensure tests run in order

  test("it requires valid user input", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032456", true, page);
    await validateComplaint(page, "23-032456", "Racoon");

    //Run before exery test in order to make re-runnable.
    await deleteAllEquipments(page);

    const $equipment = page.locator(".comp-outcome-equipment");
    await $equipment.locator("#outcome-report-add-equipment").click();

    //click Save Button
    await $equipment.locator("#equipment-save-button").click();

    //validate
    let inputs = ["#equipment-type-div", "#equipment-officer-set-div"];

    await hasErrorMessage(page, inputs, "Errors creating equipment");
  });

  test("it can save equipment", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032456", true, page);
    await validateComplaint(page, "23-032456", "Racoon");

    //Run before exery test in order to make re-runnable.
    await deleteAllEquipments(page);

    const $equipment = page.locator(".comp-outcome-equipment");
    await $equipment.locator("#outcome-report-add-equipment").click();

    let sectionParams = {
      section: "EQUIPMENT",
      officer: "TestAcct, ENV",
      date: "01",
      toastText: "Equipment has been updated",
      equipmentType: "Snare",
    };
    await $equipment.locator("#equipment-copy-address-button").click();
    await fillInHWCSection($equipment, page, sectionParams);
    await waitForSpinner(page);
    await validateHWCSection($equipment, page, sectionParams);
  });

  test("it can edit an existing equipment", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032456", true, page);
    await validateComplaint(page, "23-032456", "Racoon");

    const $equipment = await page.locator(".comp-outcome-equipment");

    await page.locator("#equipment-edit-button").click();

    let sectionParams = {
      section: "EQUIPMENT",
      officer: "TestAcct, ENV",
      date: "02",
      toastText: "Equipment has been updated",
      equipmentType: "Live trap",
    };
    await fillInHWCSection($equipment, page, sectionParams);
    await validateHWCSection($equipment, page, sectionParams);
  });

  test("it can delete an existing equipment", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032456", true, page);
    await validateComplaint(page, "23-032456", "Racoon");

    const $equipment = page.locator(".comp-outcome-equipment");
    await $equipment.locator("#equipment-delete-button").click();
    await page.locator(".modal-footer > .btn-primary").click();

    //validate the toast
    page.locator(".Toastify__toast-body", {
      hasText: "Equipment has been deleted",
    });

    await expect($equipment.locator("#outcome-report-add-equipment")).toBeVisible();
  });
});
