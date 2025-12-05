import { test, expect } from "@playwright/test";
import { waitForSpinner } from "../../utils/helpers";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";

/*
Test to verify that the status and assignment popover displays when clicking the vertical ellipsis on both the
HWLC and Enforcement list screens
*/
test.describe("Complaint Assign Popover spec", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  for (let complaintType of complaintTypes) {
    test(`Changes assignee of a ${complaintType} complaint`, async ({ page }) => {
      await page.goto("/");

      //Need to make sure the filters are loaded before switching tabs.
      await waitForSpinner(page);
      await page.locator(complaintType).click();
      await waitForSpinner(page);
      await page.locator("#comp-zone-filter").click(); //clear zone filter so we have some complaint is in the list view
      await waitForSpinner(page);
      await page.locator("#quick-action-button").first().locator("button").first().click();
      await expect(await page.locator("#update-assignee-menu-item")).toBeVisible(); //Wait for the options to show
      await page.locator("#update-assignee-menu-item").click();

      // self assign the complaint
      await page.locator("#self_assign_button").click();
    });
  }
});
