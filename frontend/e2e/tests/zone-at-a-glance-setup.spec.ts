import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../utils/authConfig";
import { waitForSpinner } from "../utils/helpers";

test.describe("COMPENF-137 Zone at a Glance - Page Set Up", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("it should have more than one link", async ({ page }) => {
    //-- navigate to application root
    await page.goto("/");
    await waitForSpinner(page);

    //-- there should be more than one link in the side bar
    const links = page.locator(".comp-sidenav-list a");
    const count = await links.count();
    expect(count, "rows N").toBeGreaterThan(1);
  });

  test("it has link to zone at a glance", async ({ page }) => {
    await page.goto("/");
    await waitForSpinner(page);

    const links = page.locator(".comp-sidenav-list a");

    // Get all href attributes
    const hrefs = await links.evaluateAll((items) => items.map((item) => item.getAttribute("href")));

    expect(hrefs).toContain("/zone/at-a-glance");
  });

  test("it can navigate to zone at a glance", async ({ page }) => {
    //-- navigate to application root
    await page.goto("/");

    //-- navigate to the zone at a glance
    await page.locator("#icon-zone-at-a-glance-link").click();
    await waitForSpinner(page);

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
