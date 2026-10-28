import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { selectItemById, waitForSpinner } from "../../utils/helpers";

/*
Tests to verify COS Filter logic
*/
test.describe("COS Filter Logic", () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  for (const type of complaintTypes) {
    test(`Verifies ${type} filters are available and defaults exist`, async ({ page }) => {
      await page.goto("/");
      await waitForSpinner(page);
      await page.locator(type).click();
      await waitForSpinner(page);

      //-- check to make sure there are items in the table
      const rows = page.locator("#complaint-list tbody tr");
      expect(await rows.count()).toBeGreaterThanOrEqual(1);
      await page.locator("#comp-filter-btn:visible, #comp-filter-btn-mobile:visible").click();
      await expect(page.locator(".comp-filter-container:visible")).toBeVisible();
      await expect(page.locator("#comp-filter-region-id:visible")).toBeVisible();
      await expect(page.locator("#comp-filter-zone-id:visible")).toBeVisible();
      await expect(page.locator("#comp-filter-community-id:visible")).toBeVisible();
      await expect(page.locator("#comp-park-filter")).not.toBeVisible();
      await expect(page.locator("#comp-filter-officer-id:visible")).toBeVisible();
      if ("#hwcr-tab" === type) {
        await expect(page.locator("#comp-filter-nature-of-complaint-id:visible")).toBeVisible(); //only hwrc
        await expect(page.locator("#comp-filter-violation-id")).not.toBeVisible(); //only ers
        await expect(page.locator("#comp-species-filter-id:visible")).toBeVisible(); //only hwrc
      } else {
        await expect(page.locator("#comp-nature-of-complaint-filter")).not.toBeVisible(); //only hwrc
        await expect(page.locator("#comp-filter-violation-id:visible")).toBeVisible(); //only ers
        await expect(page.locator("comp-species-filter-id")).not.toBeVisible(); //only hwrc
      }
      await expect(page.locator("#comp-filter-date-id:visible")).toBeVisible();
      await expect(page.locator("#comp-filter-status-id:visible")).toBeVisible();
      await expect(page.locator("#comp-zone-filter:visible")).toBeVisible();
      await expect(page.locator("#comp-status-filter:visible")).toBeVisible();
      await expect(page.locator("#comp-zone-filter:visible").getByText("Cariboo Thompson").first()).toBeVisible(); //assumes e2e user's office roles up to Cariboo Thompson zone
      await expect(page.locator("#comp-status-filter:visible").getByText("Open").first()).toBeVisible();
    });

    test(`Can filter ${type} on Unassigned`, async ({ page }) => {
      await page.goto("/");
      await waitForSpinner(page);
      await page.locator(type).click();
      await waitForSpinner(page);

      //-- check to make sure there are items in the table
      const rows = page.locator("#complaint-list tbody tr");
      expect(await rows.count()).toBeGreaterThanOrEqual(1);
      await page.locator("#comp-filter-btn:visible, #comp-filter-btn-mobile:visible").click();
      await expect(page.locator(".comp-filter-container:visible")).toBeVisible();
      await selectItemById("officer-select-id:visible", "Unassigned", page);
      await expect(page.locator("#comp-officer-filter")).toBeVisible();
      await expect(page.locator("#comp-officer-filter").getByText("Unassigned").first()).toBeVisible();
    });
  }
});
