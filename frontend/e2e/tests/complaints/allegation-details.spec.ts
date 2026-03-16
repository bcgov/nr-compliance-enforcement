import { test, expect } from "@playwright/test";
import { navigateToDetailsScreen, verifyMapMarkerExists, waitForSpinner } from "../../utils/helpers";
import COMPLAINT_TYPES from "../../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";

test.describe("COMPENF-37 Display ECR Details", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  const callDetails = {
    description:
      "Caller advised dealing with on going coyote problem from last year. Caller believes someone is feeding the coyotes again.  *** Caller is requesting a CO callback ***",
    location: "Turnoff to Underwood Rd",
    locationDescription: "tester call description 10",
    incidentTime: "2023-04-13T07:24:00.000Z",
    community: "108 Mile Ranch",
    office: "100 Mile House",
    zone: "Cariboo Thompson",
    region: "Thompson Cariboo",
    violationInProgress: false,
    violationObserved: false,
  };

  test("it has records in table view", async ({ page }) => {
    //-- navigate to application root
    await page.goto("/");

    //-- click on Allegation tab
    await page.locator("#ers-tab").click();
    await waitForSpinner(page);

    //-- check to make sure there are items in the table
    const tableLocator = await page.locator("#complaint-list");
    const tableRowsLocator = await tableLocator.locator("tr");
    await expect(await tableRowsLocator.count()).toBeGreaterThan(0);
  });

  test("it can select record", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-007890", false, page);

    //-- verify the right complaint identifier is selected and the animal type
    await expect(
      page
        .locator(".comp-box-complaint-id")
        .getByText(/23-007890/)
        .first(),
    ).toBeVisible();
  });

  test("it has correct call details", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-007890", true, page);
    await waitForSpinner(page);
    //-- verify the call details block
    await expect(
      await page.locator('pre[id="comp-details-description"]').getByText(callDetails.description).first(),
    ).toBeVisible();
    await expect(page.locator('dd[id="comp-details-location"]').getByText(callDetails.location).first()).toBeVisible();
    await expect(
      await page
        .locator('dd[id="comp-details-location-description"]')
        .getByText(callDetails.locationDescription)
        .first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-community"]').getByText(callDetails.community).first(),
    ).toBeVisible();
    await expect(
      await page
        .locator('dd[id="comp-details-violation-in-progress"]')
        .getByText(callDetails.violationInProgress ? "Yes" : "No")
        .first(),
    ).toBeVisible();
    await expect(page.locator('dd[id="comp-details-office"]').getByText(callDetails.office).first()).toBeVisible();
    await expect(
      await page
        .locator('dd[id="comp-details-violation-observed"]')
        .getByText(callDetails.violationObserved ? "Yes" : "No")
        .first(),
    ).toBeVisible();
    await expect(await page.locator('dd[id="comp-details-zone"]').getByText(callDetails.zone).first()).toBeVisible();
    await expect(
      await page.locator('dd[id="comp-details-region"]').getByText(callDetails.region).first(),
    ).toBeVisible();
  });

  test("it has a map on screen with no marker", async function ({ page }) {
    await navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-030303", true, page);
    await waitForSpinner(page);
    await verifyMapMarkerExists(false, page);
    await waitForSpinner(page);
    await expect(await page.locator(".comp-complaint-details-alert")).toBeVisible();
  });

  test("validates breadcrumb styles", async function ({ page }) {
    await navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-007890", true, page);
    await waitForSpinner(page);
    await expect(await page.locator(".comp-nav-item-name-inverted > a")).toHaveCSS("text-decoration", /.*/);
    await expect(await page.locator(".comp-nav-item-name-inverted > a")).toHaveCSS("text-decoration", "underline");
    await expect(await page.locator(".comp-nav-item-name-inverted > a")).toHaveCSS("color", /.*/);
    await expect(await page.locator(".comp-nav-item-name-inverted > a")).toHaveCSS("color", "rgb(255, 255, 255)");
  });
});
