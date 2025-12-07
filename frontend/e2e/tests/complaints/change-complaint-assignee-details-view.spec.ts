import { test, expect } from "@playwright/test";

import COMPLAINT_TYPES from "../../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { navigateToDetailsScreen, waitForSpinner } from "../../utils/helpers";

/*
Test to verify that the user is able to change the assignee both the
HWLC and Enforcement details screens
*/
test.describe("Complaint Change Assignee spec - Details View", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  for (let complaintType of complaintTypes) {
    test(`Changes assignee of a ${complaintType} complaint`, async ({ page }) => {
      if ("#hwcr-tab".includes(complaintType)) {
        await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", true, page);
      } else {
        await navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-006888", true, page);
      }
      await page.locator("#details-screen-assign-button").click();

      // self assign the complaint
      await page.locator("#self_assign_button").click();
      await waitForSpinner(page);
      await expect(
        page
          .locator("#comp-details-assigned-officer-name-text-id")
          .getByText(/TestAcct, ENV/)
          .first(),
      ).toBeVisible();
    });
  }
});
