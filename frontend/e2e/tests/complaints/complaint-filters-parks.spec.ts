import { test, expect } from "@playwright/test";

import COMPLAINT_TYPES from "../../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { navigateToDetailsScreen, selectTypeAheadItemByText, waitForSpinner } from "../../utils/helpers";

/**
 * Test that PARKS specific search filters work
 */
test.describe("Verify Parks specific search filters work", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.PARKS });
  const complaintTypes = ["#hwcr-tab", "#ers-tab", "#gir-tab"];

  for (let complaintType of complaintTypes) {
    test(`Park filter exists for ${complaintType}`, async function ({ page }) {
      await page.goto("/");

      //Need to make sure the filters are loaded before switching tabs.
      await waitForSpinner(page);
      await page.locator(complaintType).click();
      await expect(page.locator("#comp-filter-btn")).toBeVisible();
      await page.locator("#comp-filter-btn").click();
      await expect(page.locator("#comp-filter-park-id")).toBeVisible();
    });
  }

  test("can filter based on Park", async function ({ page }) {
    // Navigate to the complaint list
    const complaintWithPark = "23-032032";
    const expectedPark = "Inonoaklin Park";

    // Check if the Park is already on a case (e.g. this test is being run for a second time)
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, complaintWithPark, true, page);
    // Get the element that displays the park name
    const rawText = await page.locator("#comp-details-park").textContent();
    const actualText = rawText!.trim();

    if (!actualText.includes(expectedPark)) {
      await page.locator("#details-screen-edit-button").click();
      await selectTypeAheadItemByText("park-select-id", expectedPark, page);
      await page.locator("#details-screen-cancel-save-button-top").click();
    }

    // Return to the complaints view
    await page.locator("#icon-complaints-link").click();

    // Filter by park
    await expect(page.locator("#comp-filter-btn")).toBeVisible();
    await page.locator("#comp-filter-btn").click();
    await selectTypeAheadItemByText("park-select-id", expectedPark, page);
    await expect(page.locator("#comp-park-filter")).toBeVisible();
    await expect(await page.getByRole("link", { name: complaintWithPark })).toBeVisible();
  });
});
