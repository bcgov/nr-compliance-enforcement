import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../utils/authConfig";
import { waitForSpinner } from "../utils/helpers";

test.describe("COMPENF-258 Zone at a Glance - View Office Stats", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("it should have an office with an officer", async ({ page }) => {
    await page.goto("/zone/at-a-glance");
    await waitForSpinner(page);

    await expect(page.locator('[id="Clearwater Office"]')).toBeVisible(); //assumes e2e user's office is Clearwater
    //Expand the Clearwater Box
    await page.locator(".comp-zag-office > div > img").nth(1).click(); //Assumes Clearwater is second office
    await expect(page.locator('[id="officerNameTestAcct, ENV"]')).toBeVisible();
  });
});
