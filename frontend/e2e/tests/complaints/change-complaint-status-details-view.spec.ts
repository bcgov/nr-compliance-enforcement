import COMPLAINT_TYPES from "../../../src/app/types/app/complaint-types";
import { test, expect, Page } from "@playwright/test";
import {
  assignSelfToComplaint,
  fillInHWCSection,
  navigateToDetailsScreen,
  validateHWCSection,
  waitForSpinner,
} from "../../utils/helpers";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";

async function fillInAssessmentSection(page: Page) {
  let sectionParams = {
    section: "ASSESSMENT",
    checkboxes: ["#SGHTNGS"],
    officer: "TestAcct, ENV",
    date: "01",
    actionRequired: "Yes",
    toastText: "Assessment has been saved",
  };

  // If assessment edit button exists, click it
  const $assessments = page.locator("#outcome-assessments");
  if (await $assessments.locator("#assessment-edit-button").count()) {
    sectionParams.toastText = "Assessment has been updated";
    await $assessments.locator("#assessment-edit-button").first().click();
  } else if (await $assessments.locator("#outcome-report-add-assessment").count()) {
    await $assessments.locator("#outcome-report-add-assessment").click();
  }
  const $assessment = page.locator(".comp-outcome-report-complaint-assessment");
  if (await $assessment.locator("#outcome-save-button").count()) {
    await fillInHWCSection($assessment, page, sectionParams);
    sectionParams.checkboxes = ["Sighting"];
  }
  const $completedAssessment = page.locator("#outcome-assessment").first();
  await validateHWCSection($completedAssessment, page, sectionParams);
}

/*
Test to verify that the user is able to change the status both the
HWC and Enforcement details screens
*/
test.describe("Complaint Change Status spec - Details View", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  for (let complaintType of complaintTypes) {
    test(`Changes status of closeable ${complaintType} complaint to open, closed, and back to open`, async ({
      page,
    }) => {
      if ("#hwcr-tab".includes(complaintType)) {
        await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-031664", true, page);
        await assignSelfToComplaint(page);

        await fillInAssessmentSection(page);
        await waitForSpinner(page);
      } else {
        await navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-028706", true, page);
        await assignSelfToComplaint(page);
        await waitForSpinner(page);
      }
      await page.locator("#details-screen-update-status-button").click();
      await page.locator("#complaint_status_dropdown").click();

      // Select the option with value "Closed"
      await page
        .locator(".comp-select__option")
        .getByText(/Closed/)
        .first()
        .click();
      await page.locator("#update_complaint_status_button").click();
      await waitForSpinner(page);
      await expect(page.locator("#update_complaint_status_button")).not.toBeVisible();
      await expect(
        await page
          .locator("#comp-details-status-text-id")
          .getByText(/Closed/)
          .first(),
      ).toBeVisible();
      await page.locator("#details-screen-update-status-button").click();
      await page.locator("#complaint_status_dropdown").click();

      // Select the option with value "Opened"
      await page.locator(".comp-select__option").getByText(/Open/).first().click();
      await page.locator("#update_complaint_status_button").click();
      await waitForSpinner(page);
      await expect(page.locator("#comp-details-status-text-id").getByText(/Open/).first()).toBeVisible();
    });
  }

  test("Changes status of unclosable hwcr complaint from open to closed", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000078", true, page);
    await assignSelfToComplaint(page);
    await page.locator("#details-screen-update-status-button").click();
    await page.locator("#complaint_status_dropdown").click();

    // Select the option with value "Closed"
    await page
      .locator(".comp-select__option")
      .getByText(/Closed/)
      .first()
      .click();
    await page.locator("#update_complaint_status_button").click();

    //validate error message
    await expect(page.locator("#outcome-assessment").locator(".section-error-message")).toBeVisible();
    await expect(async () => {
      const $error = await page.locator(".section-error-message");
      expect($error).toHaveText("Complete section before closing the complaint.");
    }).toPass();
  });
});
