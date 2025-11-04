import { test, expect } from "@playwright/test";

import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../utils/authConfig";
import { navigateToDetailsScreen, navigateToEditScreen, verifyMapMarkerExists, waitForSpinner } from "../utils/helpers";

test.describe("COMPENF-35 Display HWCR Details", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  const callDetails = {
    description:
      "Calling to report a black bear getting into the garbage on a regular basis. Also wanted to confirm that residents of the trailer home park could call to report sightings themselves",
    location: "644 Pine Street",
    locationDescription: "",
    incidentTime: "2022-12-19T08:51:00.000Z",
    attractants: ["Garbage", "Freezer", "Compost"],
    community: "Kamloops",
    office: "Kamloops",
    zone: "Thompson Nicola",
    region: "Thompson Cariboo",
  };

  const callerInformation = {
    name: "Phoebe",
    phone: "(250) 556-1234",
    secondary: "",
    alternate: "",
    address: "437 Fake St",
    email: "tester@gmail.com",
    reported: "Conservation Officer Service",
  };

  test("it has records in table view", async ({ page }) => {
    //-- navigate to application root
    await page.goto("/");

    //-- click on HWCR tab
    await page.locator("#hwcr-tab").click();
    await waitForSpinner(page);

    //-- check to make sure there are items in the table
    const rows = page.locator("#complaint-list tr");
    const rowCount = await rows.count();

    expect(rowCount).toBeGreaterThan(0);
  });

  test("it can select record", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", false, page);

    //-- verify the right complaint identifier is selected and the animal type
    await expect(
      page
        .locator(".comp-box-complaint-id")
        .getByText(/23-000076/)
        .first(),
    ).toBeVisible();
    await expect(
      page
        .locator(".comp-box-species-type")
        .getByText(/Black Bear/)
        .first(),
    ).toBeVisible();
  });

  test("it has correct call details", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", true, page);

    //-- verify the call details block
    await expect(
      page.locator('pre[id="comp-details-description"]').getByText(callDetails.description).first(),
    ).toBeVisible();
    await expect(page.locator('dd[id="comp-details-location"]').getByText(callDetails.location).first()).toBeVisible();
    await expect(page.locator('dd[id="comp-details-location-description"]')).toHaveText("");
    await expect(
      page.locator('dd[id="comp-details-community"]').getByText(callDetails.community).first(),
    ).toBeVisible();
    await expect(page.locator('dd[id="comp-details-office"]').getByText(callDetails.office).first()).toBeVisible();
    await expect(page.locator('dd[id="comp-details-zone"]').getByText(callDetails.zone).first()).toBeVisible();
    await expect(page.locator('dd[id="comp-details-region"]').getByText(callDetails.region).first()).toBeVisible();
  });

  test("it has correct call information details", async ({ page }) => {
    //-- navigate to application root
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", true, page);

    //-- verify the call details block
    await expect(page.locator('dd[id="comp-details-name"]').getByText(callerInformation.name).first()).toBeVisible();
    await expect(page.locator('dd[id="comp-details-phone"]').getByText(callerInformation.phone).first()).toBeVisible();
    const phone2text = await page.locator("#comp-details-phone-1").innerText();
    expect(phone2text.trim()).toBe(callerInformation.secondary);
    const phone3text = await page.locator("#comp-details-phone-2").innerText();
    expect(phone3text.trim()).toBe(callerInformation.alternate);
    await expect(
      page.locator('dd[id="comp-details-address"]').getByText(callerInformation.address).first(),
    ).toBeVisible();
    await expect(page.locator('dd[id="comp-details-email"]').getByText(callerInformation.email).first()).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-reported"]').getByText(callerInformation.reported).first(),
    ).toBeVisible();
  });

  test("it has a map on screen with a marker at the correct location", async function ({ page }) {
    await navigateToEditScreen(COMPLAINT_TYPES.HWCR, "23-031180", true, page);
    await verifyMapMarkerExists(true, page);
    await expect(page.locator(".comp-complaint-details-alert")).not.toBeVisible();
  });

  test("it has a map on screen with no marker", async function ({ page }) {
    await navigateToEditScreen(COMPLAINT_TYPES.HWCR, "23-032527", true, page);
    await verifyMapMarkerExists(false, page);
    await expect(page.locator(".comp-complaint-details-alert")).toBeVisible();
  });

  test("validates breadcrumb styles", async function ({ page }) {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-007023", true, page);
    const link = page.locator(".comp-nav-item-name-inverted > a");

    const textDecoration = await link.evaluate((el) => getComputedStyle(el).textDecoration);
    expect(textDecoration).toContain("underline");

    const color = await link.evaluate((el) => getComputedStyle(el).color);
    expect(color).toContain("rgb(255, 255, 255)");
  });
});
