import COMPLAINT_TYPES from "../../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import test, { expect } from "@playwright/test";
import {
  clearFilterById,
  enterDateTimeInDatePicker,
  navigateToDetailsScreen,
  selectItemById,
  waitForSpinner,
} from "../../utils/helpers";

/**
 * Test that CEEB specific search filters work
 */
test.describe("Verify CEEB specific search filters work", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.CEEB });

  test("allows filtering of complaints by Action Taken", async function ({ page }) {
    // Navigate to the complaint list
    const complaintWithActionTakenID = "23-030990";
    const actionTaken = "Forward to lead agency";

    // Check if complaintWithActionTakenID already has a decision.
    await navigateToDetailsScreen(COMPLAINT_TYPES.ERS, complaintWithActionTakenID, true, page);
    await waitForSpinner(page);
    // If the action taken input is available then the complaint does not yet have a decision made on it.
    // Set an action taken so that the filter will have results to return.
    const decisionCount = await page.locator("#decision-edit-button").count();
    // If the edit button is on the page, a decision needs to be made
    if (decisionCount === 0) {
      await selectItemById("outcome-decision-schedule-sector", "Other", page);
      await selectItemById("outcome-decision-schedule-sector", "Other", page);
      await selectItemById("outcome-decision-sector-category", "None", page);
      await selectItemById("outcome-decision-discharge", "Pesticides", page);
      await selectItemById("outcome-decision-action-taken", actionTaken, page);
      await selectItemById("outcome-decision-lead-agency", "Other", page);
      await enterDateTimeInDatePicker(page, "outcome-decision-outcome-date", "01");
      await page
        .locator("#ceeb-decision > .card-body > .comp-details-form-buttons > #outcome-decision-save-button")
        .click();
      await page.locator("div", { hasText: /Decision added/ });
    }

    // Return to the complaints view
    await page.locator("#icon-complaints-link").click();

    // Filter by action taken
    await expect(await page.locator("#comp-filter-btn")).toBeVisible();
    await page.locator("#comp-filter-btn").click();
    await selectItemById("action-taken-select-id", actionTaken, page);
    await waitForSpinner(page);
    await clearFilterById("comp-officer-filter", page);
    await waitForSpinner(page);
    await expect(page.locator("a", { hasText: complaintWithActionTakenID })).toBeVisible();
  });
});
