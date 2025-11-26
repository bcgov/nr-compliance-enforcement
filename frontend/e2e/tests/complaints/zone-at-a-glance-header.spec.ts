import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { waitForSpinner } from "../../utils/helpers";

test.describe("COMPENF-259 Zone at a Glance - View Complaint Stats", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("it can navigate to zone at a glance", async ({ page }) => {
    //-- navigate to application root
    await page.goto("/");
    await waitForSpinner(page);

    //-- navigate to the zone at a glance
    await page.locator("#icon-zone-at-a-glance-link").click();

    //-- make sure we're on the zone at a glance page
    await expect(
      page
        .locator(".comp-main-content")
        .getByText(/Zone at a glance/)
        .first(),
    ).toBeVisible();

    //-- navigate back to complaints
    await page.locator("#icon-complaints-link").click();
    await waitForSpinner(page);
    await expect(
      page
        .locator(".comp-page-header")
        .getByText(/Complaints/)
        .first(),
    ).toBeVisible();
  });
});
