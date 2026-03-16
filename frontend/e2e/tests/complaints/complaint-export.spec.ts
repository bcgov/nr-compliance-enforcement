import { test, expect } from "@playwright/test";
import COMPLAINT_TYPES from "../../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { navigateToDetailsScreen, waitForSpinner } from "../../utils/helpers";
import { format } from "date-fns";

//--
test.describe("Export Complaint Functionality", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  for (let complaintType of complaintTypes) {
    test(`Can export complaint: ${complaintType}`, async ({ page }) => {
      let fileName = "";

      if ("#hwcr-tab".includes(complaintType)) {
        await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", true, page);
        await waitForSpinner(page);
        const dateText = await page.locator("div#complaint-date-logged").textContent();
        let formattedDateObject = new Date(dateText as string);
        // The date is converting timezones, giving it a different day of month.
        // Add the offset back to it to get to the displayed date.
        formattedDateObject.setMinutes(formattedDateObject.getMinutes() + formattedDateObject.getTimezoneOffset());
        let dateString = formattedDateObject.toDateString();
        const formattedDate = format(dateString, "yyMMdd");
        fileName = `HWC_23-000076_${formattedDate}.pdf`;
      } else {
        await navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-006888", true, page);
        await waitForSpinner(page);
        const dateText = await page.locator("div#complaint-date-logged").textContent();
        let formattedDateObject = new Date(dateText as string);
        // The date is converting timezones, giving it a different day of month.
        // Add the offset back to it to get to the displayed date.
        formattedDateObject.setMinutes(formattedDateObject.getMinutes() + formattedDateObject.getTimezoneOffset());
        let dateString = formattedDateObject.toDateString();
        const formattedDate = format(dateString, "yyMMdd");
        fileName = `EC_23-006888_${formattedDate}.pdf`;
      }
      // Start waiting for download before clicking. Note no await.
      const downloadPromise = page.waitForEvent("download");
      await page.getByRole("button", { name: "Actions Menu" }).click();
      await page.locator("#export-pdf-button").click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe(fileName);
      // To actually save the file:
      // await download.saveAs('/path/to/save/at/' + download.suggestedFilename());
      // Be sure to delete the files after every run by modifying this test if saving the file.
      await download.delete();
    });
  }
});
