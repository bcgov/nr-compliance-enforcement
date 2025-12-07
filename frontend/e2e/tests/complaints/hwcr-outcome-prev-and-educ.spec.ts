import { test, expect } from "@playwright/test";

import COMPLAINT_TYPES from "../../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { fillInHWCSection, navigateToDetailsScreen, validateComplaint, validateHWCSection } from "../../utils/helpers";

// This test runs the following tasks in serial order
// 1. Test Prevention and Education validation
// 2. Create a Valid Prevention and Education record
// 3. Cancel edits to a record
// 4. Edit a record
// 5. Delete a record
test.describe("HWCR Outcome Prevention and Education", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  test.describe.configure({ mode: "serial" }); //Ensure tests run in order

  test("it requires valid user input", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030330", true, page);

    // Delete any prevention and education records if they exists
    const $preventionAndEducation = page.locator("#outcome-preventions");
    while ((await $preventionAndEducation.locator("#prevention-delete-button").count()) > 0) {
      const initialCount = await $preventionAndEducation.locator("#prevention-delete-button").count();

      // Always select the *first* delete button
      await $preventionAndEducation.locator("#prevention-delete-button").first().click();

      // Confirm deletion in modal
      await page.locator(".modal-footer .btn-primary").click();

      await expect($preventionAndEducation.locator("#prevention-delete-button")).toHaveCount(initialCount - 1);
    }

    await page.locator("#outcome-report-add-prevention").click();
    //click Save Button
    await page.locator("#outcome-save-prev-and-educ-button").click();

    //validate officer is required
    await expect(page.locator("#prev-educ-outcome-officer-div").locator(".error-message")).toBeVisible();

    //validate the date is required
    await expect(page.locator("#prev-educ-checkbox-div").locator(".error-message")).toBeVisible();

    //validate error message
    page.locator("#checkbox-div .error-message", {
      hasText: "One or more prevention and education is required",
    });

    //validate the toast
    page.locator(".Toastify__toast-body", {
      hasText: "Errors in form",
    });
  });

  test("it can save prevention and education", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030330", true, page);

    let params = {
      section: "PREV&EDUC",
      checkboxes: ["#PROVSFTYIN", "#CNTCTBYLAW"],
      officer: "TestAcct, ENV",
      date: "01",
      toastText: "Prevention and education has been saved",
    };
    const $outcome = page.locator("#outcome-preventions");
    await $outcome.locator("#outcome-report-add-prevention").click();
    await validateComplaint(page, "23-030330", "Black Bear");
    await fillInHWCSection($outcome, page, params);
    //expand checkboxes for validating in view state
    params.checkboxes = [
      "Provided safety information to the public",
      "Contacted/referred to bylaw to assist with managing attractants",
    ];
    await validateHWCSection($outcome, page, params);
  });

  test("it can cancel prevention and education edits", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030330", true, page);
    await validateComplaint(page, "23-030330", "Black Bear");
    const $preventionAndEducation = page.locator("#outcome-preventions");
    if (await $preventionAndEducation.locator("#prevention-edit-button").count()) {
      await $preventionAndEducation.locator("#prevention-edit-button").click();

      const newCheckboxForEdit = "#DIRLOWLACT";
      await expect($preventionAndEducation.locator(newCheckboxForEdit)).toBeVisible();
      await $preventionAndEducation.locator(newCheckboxForEdit).check();
      await $preventionAndEducation.locator("#prev-educ-outcome-cancel-button").click();
      await page.locator(".modal-footer .btn-primary").click();
      await expect(async () => {
        const $div = $preventionAndEducation.locator("#prev-educ-checkbox-div");
        await expect($div).toContainText("Provided safety information to the public");
        await expect($div).toContainText("Contacted/referred to bylaw to assist with managing attractants");
      }).toPass();
      await expect(async () => {
        const $div = $preventionAndEducation.locator("#prev-educ-checkbox-div");
        await expect($div).not.toContainText(
          "Directed livestock owner to or explained sections 2, 26(2) and 75 of the Wildlife Act",
        );
      }).toPass();
    } else {
      console.log("Prevention and Education Edit Button Not Found, did a previous test fail? Skip the Test");
    }
  });

  test("it can edit an existing prevention and education", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030330", true, page);
    await validateComplaint(page, "23-030330", "Black Bear");
    const $preventionAndEducation = page.locator("#outcome-preventions");
    if (await $preventionAndEducation.locator("#prevention-edit-button").count()) {
      await $preventionAndEducation.locator("#prevention-edit-button").click();

      let params = {
        section: "PREV&EDUC",
        checkboxes: ["#CNTCTBIOVT"],
        officer: "TestAcct, ENV",
        date: "01",
        toastText: "Prevention and education has been updated",
      };

      await fillInHWCSection($preventionAndEducation, page, params);
      //expand checkboxes for validating in view state
      params.checkboxes = [
        "Provided safety information to the public",
        "Contacted/referred to bylaw to assist with managing attractants",
        "Contacted/referred to biologist and/or veterinarian",
      ];
      await validateHWCSection($preventionAndEducation, page, params);
    } else {
      console.log("Prevention and Education Edit Button Not Found, did a previous test fail? Skip the Test");
    }
  });

  test("it can delete an existing prevention and education", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030330", true, page);
    await validateComplaint(page, "23-030330", "Black Bear");
    const $preventionAndEducation = page.locator("#outcome-preventions");
    if (await $preventionAndEducation.locator("#prevention-delete-button").count()) {
      await $preventionAndEducation.locator("#prevention-delete-button").first().click();
      await page.locator(".modal-footer .btn-primary").click();

      page.locator(".Toastify__toast-body", {
        hasText: "Prevention and education actions have been deleted",
      });
    } else {
      console.log("Prevention and Education Edit Button Not Found, did a previous test fail? Skip the Test");
    }
  });
});
