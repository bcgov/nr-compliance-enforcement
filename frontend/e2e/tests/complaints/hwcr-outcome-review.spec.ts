import { test, expect } from "@playwright/test";

import COMPLAINT_TYPES from "../../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import {
  fillInHWCSection,
  navigateToDetailsScreen,
  validateComplaint,
  validateHWCSection,
  waitForSpinner,
} from "../../utils/helpers";

// This will run the following in serial order:
// 1) Check the review required box
// 2) Start editing the review but cancel
// 3) Edit the review and uncheck the box
// At the end of the test the complaint should be in the same state it was at the beginning
test.describe("HWCR File Review - Review Required Basic Functionality", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  test.describe.configure({ mode: "serial" }); //Ensure tests run in order

  test("it can save review", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030851", true, page);
    await validateComplaint(page, "23-030851", "Black Bear");

    const $review = page.locator(".comp-outcome-report-file-review");

    //Reset the review if it's currently set as a result of a failed/flaky test
    if ((await $review.locator("#review-edit-button").count()) > 0) {
      await $review.locator("#review-edit-button").click();
      await $review.locator("#review-required").setChecked(false);
      await expect($review.locator("#review-required")).not.toBeChecked();
      await $review.locator("#file-review-save-button").click();
      await waitForSpinner(page);
      await expect($review.locator("#review-required")).not.toBeChecked();
    }

    await $review.locator("#review-required").check();
    await $review.locator("#file-review-save-button").click();
    await waitForSpinner(page);

    //validate the checkboxes
    await expect($review.locator("#review-required")).toBeChecked();

    //validate the toast (there might be 2 on the screen if we had to do some cleanup)
    const toasts = await page.locator(".Toastify__toast-body").allTextContents();
    const found = toasts.some((text) => text.includes("File review has been updated"));

    expect(found).toBe(true);
  });

  test("it can not change complaint status if review is required", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030851", true, page);
    await validateComplaint(page, "23-030851", "Black Bear");

    await page.locator("#details-screen-update-status-button").click();
    await expect(page.locator(".status-change-subtext")).toHaveText(/Complaint is pending review\./);
    await expect(page.locator("#complaint_status_dropdown input")).toBeDisabled();
  });

  test("it can cancel review edits", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030851", true, page);
    await validateComplaint(page, "23-030851", "Black Bear");

    const $review = page.locator(".comp-outcome-report-file-review");
    await $review.locator("#review-edit-button").click();
    await $review.locator("#review-required").uncheck();
    await $review.locator("#file-review-cancel-button").click();
    await page.locator(".modal-footer > .btn-primary").click();
    await expect($review.locator("#review-required")).toBeChecked();
  });

  test("it can edit an existing review", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030851", true, page);
    await validateComplaint(page, "23-030851", "Black Bear");

    const $review = page.locator(".comp-outcome-report-file-review");

    await $review.locator("#review-edit-button").click();
    await $review.locator("#review-required").uncheck();
    await $review.locator("#file-review-save-button").click();
    await expect($review.locator("#review-required")).not.toBeChecked();

    //validate the toast
    const toast = page.locator(".Toastify__toast-body");
    await expect(toast).toContainText("File review has been updated");
  });
});

// This will run the following in serial order:
// 1) Check the review required box and review complete box
// 2) Resets the complaint for the next time the test is run
test.describe("HWCR File Review - Complete Review", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  test.describe.configure({ mode: "serial" }); //Ensure tests run in order

  test("it can save a complete review", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-033066", true, page);
    await validateComplaint(page, "23-033066", "Coyote");

    const $review = page.locator(".comp-outcome-report-file-review");

    //Reset the review if it's currently set as a result of a failed/flaky test
    if ((await $review.locator("#review-edit-button").count()) > 0) {
      await $review.locator("#review-edit-button").click();
      await $review.locator("#review-required").setChecked(false);
      await expect($review.locator("#review-required")).not.toBeChecked();
      await $review.locator("#file-review-save-button").click();
      await waitForSpinner(page);
      await expect($review.locator("#review-required")).not.toBeChecked();
    }

    await $review.locator("#review-required").check();
    await $review.locator("#review-complete").check();

    //validate the officer appeared
    await expect(async () => {
      const $div = $review.locator("#file-review-officer-id");
      await expect($div).toContainText("OfficerCE Test Acct 1, ENV");
    }).toPass();
    await $review.locator("#file-review-save-button").click();

    //validate the checkboxes
    await expect($review.locator("#review-required")).toBeChecked();
    await expect($review.locator("#review-complete")).toBeChecked();

    //validate the toast (there might be 2 on the screen if we had to do some cleanup)
    const toasts = await page.locator(".Toastify__toast-body").allTextContents();
    const found = toasts.some((text) => text.includes("File review has been updated"));

    expect(found).toBe(true);
  });

  test("it can change complaint status if review is complete", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-033066", true, page);
    await validateComplaint(page, "23-033066", "Coyote");

    // Ensure there is an assessment so the complaint can be closed.
    const $assessmentSection = page.locator("#outcome-assessments");
    if (await $assessmentSection.locator("#outcome-report-add-assessment").count()) {
      await $assessmentSection.locator("#outcome-report-add-assessment").click();
    }
    if (await $assessmentSection.locator("#outcome-save-button").count()) {
      let sectionParams = {
        section: "ASSESSMENT",
        checkboxes: ["#SGHTNGS"],
        officer: "TestAcct, ENV",
        date: "01",
        actionRequired: "Yes",
        toastText: "Assessment has been saved",
      };
      await fillInHWCSection($assessmentSection, page, sectionParams);
      sectionParams.checkboxes = ["Sighting"];
      const $addedAssessment = page.locator("#outcome-assessments #outcome-assessment").last();
      await validateHWCSection($addedAssessment, page, sectionParams);
    }

    const $review = page.locator(".comp-outcome-report-file-review");

    await $review.locator("#review-edit-button").click();
    await $review.locator("#review-complete").check();
    await $review.locator("#file-review-save-button").click();
    await waitForSpinner(page);

    await page.locator("#details-screen-assign-button").click();
    await page.locator("#self_assign_button").click();
    await waitForSpinner(page);

    await page.locator("#details-screen-update-status-button").click();
    await expect(page.locator("#complaint_status_dropdown input")).not.toBeDisabled();
    await page.locator("#complaint_status_dropdown").click();
    await page
      .getByText(/Closed/)
      .first()
      .click();
    await expect(page.locator(".modal-footer .btn-primary")).toBeVisible();
    await page.locator(".modal-footer .btn-primary").click();

    // Reopen the complaint to ensure it can be re-run
    await page.locator("#details-screen-update-status-button").click();
    await expect(page.locator("#complaint_status_dropdown input")).not.toBeDisabled();
    await page.locator("#complaint_status_dropdown").click();
    await page.getByText(/Open/).first().click();
    await expect(page.locator(".modal-footer .btn-primary")).toBeVisible();
    await page.locator(".modal-footer .btn-primary").click();
  });

  test("it can rollback a complete review", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-033066", true, page);
    await validateComplaint(page, "23-033066", "Coyote");

    const $review = page.locator(".comp-outcome-report-file-review");

    await $review.locator("#review-edit-button").click();
    await $review.locator("#review-required").uncheck();
    await $review.locator("#file-review-save-button").click();
    await expect($review.locator("#review-required")).not.toBeChecked();

    //validate the toast
    const toast = page.locator(".Toastify__toast-body");
    await expect(toast).toContainText("File review has been updated");
  });
});
