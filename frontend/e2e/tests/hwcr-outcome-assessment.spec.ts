import { test, expect } from "@playwright/test";

import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../utils/authConfig";
import {
  fillInHWCSection,
  hasErrorMessage,
  navigateToDetailsScreen,
  validateComplaint,
  validateHWCSection,
} from "../utils/helpers";

test.describe("HWCR Outcome Assessments", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  test.describe.configure({ mode: "serial" }); //Ensure tests run in order

  test("it requires at least one assessment action on create", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032063", true, page);
    await validateComplaint(page, "23-032063", "Black Bear");

    const $assessmentSection = page.locator("#outcome-assessments");
    if (await $assessmentSection.locator("#outcome-report-add-assessment").count()) {
      await $assessmentSection.locator("#outcome-report-add-assessment").click();
    }

    const $assessment = page.locator(".comp-outcome-report-complaint-assessment");

    //click Save Button
    await $assessment.locator("#outcome-save-button").click();

    //validate
    let inputs = ["#action-required-div"];

    await hasErrorMessage(page, inputs, "Errors in form");
  });

  test("it can save assessment where action is required", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032063", true, page);
    await validateComplaint(page, "23-032063", "Black Bear");

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
  });

  test("it can cancel assessment edits", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032063", true, page);
    await validateComplaint(page, "23-032063", "Black Bear");
    const $assessment = page.locator("#outcome-assessment").first();

    await $assessment.locator("#assessment-edit-button").click();
    const actionRequiredText = (await $assessment.locator("#action-required-div").innerText()).trim();

    if (actionRequiredText === "Yes") {
      const newCheckboxForEdit = $assessment.locator("#FOODCOND");

      await expect(newCheckboxForEdit).toBeVisible();
      await newCheckboxForEdit.check();

      await $assessment.locator("#outcome-cancel-button").click();
      await page.locator(".modal-footer .btn-primary").click();

      const assessmentDiv = $assessment.locator("#assessment-checkbox-div");

      await expect(assessmentDiv).toContainText("Sighting");
      await expect(assessmentDiv).not.toContainText("Food conditioned");
    }
  });

  test("it can edit an existing assessment", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032063", true, page);
    await validateComplaint(page, "23-032063", "Black Bear");
    const $assessment = page.locator("#outcome-assessment").first();
    await $assessment.locator("#assessment-edit-button").click();

    let sectionParams = {
      section: "ASSESSMENT",
      checkboxes: ["#DAMGPROP"],
      officer: "TestAcct, ENV",
      date: "01",
      actionRequired: "No",
      justification: "No public safety concern",
      toastText: "Assessment has been updated",
    };
    await fillInHWCSection($assessment, page, sectionParams);
    await validateHWCSection($assessment, page, sectionParams);
  });
});
