import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../utils/authConfig";
import {
  enterDateTimeInCompDateTimePicker,
  navigateToCreateScreen,
  selectItemById,
  typeAndTriggerChange,
  waitForSpinner,
} from "../utils/helpers";

/*
Test to verify that the user is able to click the edit button
on the wildlife contacts details page and see all the inputs
*/
test.describe("Complaint Create Page spec - Enter Coordinates - Create View", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  const createCallDetails = {
    description:
      "Calling to report a black bear getting into the garbage on a regular basis. Also wanted to confirm that residents of the trailer home park could call to report sightings themselves ---- testing",
    location: "2975 Jutland Rd.",
    locationDescription: "---- testing",
    incidentDateDay: "01",
    attractants: ["Livestock", "BBQ", "Beehive"],
    attractantCodes: ["LIVESTCK", "BEEHIVE", "BBQ"],
    attratantsIndex: [9, 0, 0],
    xCoord: "-123.3776552",
    yCoord: "48.4406837",
    community: "Victoria",
    office: "Victoria",
    zone: "South Island",
    region: "West Coast",
    natureOfComplaint: "Dead wildlife - no violation suspected",
    natureOfComplaintIndex: 5,
    species: "Coyote",
    speciesIndex: 3,
    status: "Closed",
    statusIndex: 1,
    assigned: "TestAcct, ENV",
    assignedIndex: 1,
  };

  const createCallerInformation = {
    name: "Phoebe ---- testing",
    phone: "(250) 555-5555",
    phoneInput: "2505555555",
    secondary: "(250) 666-6666",
    secondaryInput: "2506666666",
    alternate: "(250) 666-8888",
    alternateInput: "2506668888",
    address: "437 Fake St ---- testing",
    email: "tester512@gmail.com",
    reported: "Conservation Officer Service",
    reportedCode: "BCWF",
    reportedIndex: 1,
  };

  test("Navigate to the Complaint Create page & create and verify data", async function ({ page }) {
    //start create
    await navigateToCreateScreen(page);

    // select complaint type
    await selectItemById("complaint-type-select-id", "Human Wildlife Conflict", page);
    await page.locator("#caller-name-id").clear();
    await page.locator("#caller-name-id").fill(createCallerInformation.name);
    await page.locator("#complaint-address-id").clear();
    await page.locator("#complaint-address-id").fill(createCallerInformation.address);
    await page.locator("#complaint-email-id").clear();
    await page.locator("#complaint-email-id").fill(createCallerInformation.email);
    await page.locator("#caller-primary-phone-id").click();
    await page.locator("#caller-primary-phone-id").clear();
    await typeAndTriggerChange("#caller-primary-phone-id", createCallerInformation.phoneInput, page);
    await page.locator("#caller-info-secondary-phone-id").clear();
    await typeAndTriggerChange("#caller-info-secondary-phone-id", createCallerInformation.secondaryInput, page);
    await page.locator("#caller-info-alternate-phone-id").clear();
    await typeAndTriggerChange("#caller-info-alternate-phone-id", createCallerInformation.alternateInput, page);
    await selectItemById("reported-select-id", createCallerInformation.reported, page);
    await page.locator("#input-x-coordinate").click();
    await page.locator("#input-x-coordinate").clear();
    await page.locator("#input-x-coordinate").fill(createCallDetails.xCoord);
    await page.locator("#input-y-coordinate").click();
    await page.locator("#input-y-coordinate").clear();
    await page.locator("#input-y-coordinate").fill(createCallDetails.yCoord);
    await page.locator("#complaint-location-description-textarea-id").click();
    await page.locator("#complaint-location-description-textarea-id").clear();
    await page.locator("#complaint-location-description-textarea-id").fill(createCallDetails.locationDescription);
    await page.locator("#complaint-description-textarea-id").click();
    await page.locator("#complaint-description-textarea-id").clear();
    await page.locator("#complaint-description-textarea-id").fill(createCallDetails.description);
    await page.locator("#complaint-description-textarea-id").click();
    await enterDateTimeInCompDateTimePicker(page, "01", "13", "45");
    await page.locator("#attractants-select-id").locator("div").first().click();
    await page
      .locator("#attractants-pair-id")
      .locator(".comp-details-edit-input")
      .getByText(createCallDetails.attractants[0], { exact: true })
      .first()
      .click();
    await page.locator("#attractants-select-id").locator("div").first().click();
    await page
      .locator("#attractants-pair-id")
      .locator(".comp-details-edit-input")
      .getByText(createCallDetails.attractants[1], { exact: true })
      .first()
      .click();
    await page.locator("#attractants-select-id").locator("div").first().click();
    await page
      .locator("#attractants-pair-id")
      .locator(".comp-details-edit-input")
      .getByText(createCallDetails.attractants[2], { exact: true })
      .first()
      .click();
    await selectItemById("community-select-id", createCallDetails.community, page);
    await selectItemById("nature-of-complaint-select-id", createCallDetails.natureOfComplaint, page);
    await selectItemById("species-select-id", createCallDetails.species, page);
    await selectItemById("officer-assigned-select-id", createCallDetails.assigned, page);
    await page.locator("#details-screen-cancel-save-button-top").click();
    //end create changes

    //start verifying changes are created
    await waitForSpinner(page);

    //-- verify call details
    await expect(
      page.locator('pre[id="comp-details-description"]').getByText(createCallDetails.description).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="complaint-incident-date-time"]').getByText(createCallDetails.incidentDateDay).first(),
    ).toBeVisible();
    const $defaultValue = page.locator(".comp-attractant-badge");
    await expect($defaultValue.first()).toHaveText("Livestock");
    await expect($defaultValue.nth(1)).toHaveText("BBQ");
    await expect($defaultValue.nth(2)).toHaveText("Beehive");
    await expect(page.locator('dd[id="comp-details-location-description"]')).toHaveText(
      createCallDetails.locationDescription,
    );
    await expect(
      page.locator('span[id="geo-details-x-coordinate"]').getByText(createCallDetails.xCoord).first(),
    ).toBeVisible();
    await expect(
      page.locator('span[id="geo-details-y-coordinate"]').getByText(createCallDetails.yCoord).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-community"]').getByText(createCallDetails.community).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-office"]').getByText(createCallDetails.office).first(),
    ).toBeVisible();
    await expect(page.locator('dd[id="comp-details-zone"]').getByText(createCallDetails.zone).first()).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-region"]').getByText(createCallDetails.region).first(),
    ).toBeVisible();

    //-- verify caller information
    await expect(
      await page.locator('dd[id="comp-details-name"]').getByText(createCallerInformation.name).first(),
    ).toBeVisible();
    await expect(
      await page.locator('dd[id="comp-details-reported"]').getByText(createCallerInformation.reported).first(),
    ).toBeVisible();
    await expect(
      await page.locator('dd[id="comp-details-address"]').getByText(createCallerInformation.address).first(),
    ).toBeVisible();
    await expect(
      await page.locator('dd[id="comp-details-email"]').getByText(createCallerInformation.email).first(),
    ).toBeVisible();
    await expect(
      await page.locator('dd[id="comp-details-phone"]').getByText(createCallerInformation.phone).first(),
    ).toBeVisible();
    await expect(await page.locator('dd[id="comp-details-phone-1"]').textContent()).toBe(
      createCallerInformation.secondary,
    );
    await expect(await page.locator('dd[id="comp-details-phone-2"]').textContent()).toBe(
      createCallerInformation.alternate,
    );

    //end verifying changes are created
  });
});
