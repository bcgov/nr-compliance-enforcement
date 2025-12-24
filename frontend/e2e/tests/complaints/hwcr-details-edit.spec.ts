import { test, expect } from "@playwright/test";

import COMPLAINT_TYPES from "../../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import {
  enterDateTimeInDatePicker,
  navigateToEditScreen,
  selectItemById,
  typeAndTriggerChange,
  verifyMapMarkerExists,
  waitForSpinner,
} from "../../utils/helpers";

/*
Test to verify that the user is able to click the edit button
on the wildlife contacts details page and see all the inputs
*/
test.describe("Complaint Edit Page spec - Edit View", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  test.describe.configure({ mode: "serial" }); //Ensure tests run in order

  const originalCallDetails = {
    description:
      "Calling to report a black bear getting into the garbage on a regular basis. Also wanted to confirm that residents of the trailer home park could call to report sightings themselves",
    location: "644 Pine Street",
    locationDescription: "",
    incidentDateDay: "11",
    attractants: ["Garbage", "Freezer", "Compost"],
    attractantCodes: ["GARBAGE", "FREEZER", "COMPOST"],
    attratantsIndex: [7, 6, 4],
    xCoord: "",
    yCoord: "",
    community: "Kamloops",
    office: "Kamloops",
    zone: "Thompson Nicola",
    region: "Thompson Cariboo",
    communityIndex: 799,
    communityCode: "KAMLOOPS",
    officeCode: "KMLPS",
    zoneCode: "TMPSNNCLA",
    regionCode: "TMPSNCRBO",
    methodComplaintReceived: "Observed in field",
    natureOfComplaint: "Aggressive - present/recent",
    natureOfComplaintIndex: 1,
    species: "Black Bear",
    speciesIndex: 1,
    status: "Open",
    statusIndex: 0,
    assigned: "TestAcct, ENV",
    assignedIndex: 0,
  };

  const originalCallerInformation = {
    name: "Phoebe",
    phone: "(250) 556-1234",
    phoneInput: "2505561234",
    secondary: "",
    secondaryInput: "",
    alternate: "",
    alternateInput: "",
    address: "437 Fake St",
    email: "tester@gmail.com",
    reported: "Conservation Officer Service",
    reportedCode: "COS",
    reportedIndex: 3,
  };

  const editCallDetails = {
    description:
      "Calling to report a black bear getting into the garbage on a regular basis. Also wanted to confirm that residents of the trailer home park could call to report sightings themselves ---- testing",
    location: "644 Pine Street ---- testing",
    locationDescription: " ---- testing",
    incidentDateDay: "01",
    attractants: ["Livestock", "BBQ", "Beehive"],
    attractantCodes: ["LIVESTCK", "BBQ", "BEEHIVE"],
    attratantsIndex: [9, 0, 0],
    xCoord: "-118",
    yCoord: "49",
    community: "Blaeberry",
    office: "Golden",
    zone: "Columbia/Kootenay",
    region: "Kootenay",
    communityIndex: 0,
    communityCode: "Blaeberry",
    officeCode: "GLDN",
    zoneCode: "CLMBAKTNY",
    regionCode: "KTNY",
    methodComplaintReceived: "BC wildlife federation app",
    natureOfComplaint: "Dead wildlife - no violation suspected",
    natureOfComplaintIndex: 5,
    species: "Coyote",
    speciesIndex: 3,
    status: "Closed",
    statusIndex: 1,
    assigned: "TestAcct, ENV",
    assignedIndex: 1,
  };

  const editCallerInformation = {
    name: "Phoebe ---- testing",
    phone: "(250) 555-5555",
    phoneInput: "2505555555",
    secondary: "(250) 666-6666",
    secondaryInput: "2506666666",
    alternate: "(250) 666-8888",
    alternateInput: "2506668888",
    address: "437 Fake St ---- testing",
    email: "tester512@gmail.com",
    reported: "Department of Fisheries and Oceans",
    reportedCode: "DFO",
    reportedIndex: 1,
  };

  test("Navigate to the Complaint Edit page & change data, save, navigate to read-only", async function ({ page }) {
    //start edit
    await navigateToEditScreen(COMPLAINT_TYPES.HWCR, "23-000076", true, page);
    await page.locator("#caller-name-id").click();
    await page.locator("#caller-name-id").clear();
    await page.locator("#caller-name-id").fill(editCallerInformation.name);
    await page.locator("#complaint-address-id").click();
    await page.locator("#complaint-address-id").clear();
    await page.locator("#complaint-address-id").fill(editCallerInformation.address);
    await page.locator("#complaint-email-id").click();
    await page.locator("#complaint-email-id").clear();
    await page.locator("#complaint-email-id").fill(editCallerInformation.email);
    await page.locator("#caller-primary-phone-id").click();
    await page.locator("#caller-primary-phone-id").clear();
    await typeAndTriggerChange("#caller-primary-phone-id", editCallerInformation.phoneInput, page);
    await page.locator("#caller-info-secondary-phone-id").click();
    await page.locator("#caller-info-secondary-phone-id").clear();
    await typeAndTriggerChange("#caller-info-secondary-phone-id", editCallerInformation.secondaryInput, page);
    await page.locator("#caller-info-alternate-phone-id").click();
    await page.locator("#caller-info-alternate-phone-id").clear();
    await typeAndTriggerChange("#caller-info-alternate-phone-id", editCallerInformation.alternateInput, page);
    await selectItemById("reported-select-id", editCallerInformation.reported, page);
    await page.locator("#location-edit-id").click();
    await page.locator("#location-edit-id").click();
    await page.locator("#location-edit-id").click();
    await page.locator("#location-edit-id").clear();
    await page.locator("#location-edit-id").fill(editCallDetails.location);
    await page.locator("#complaint-location-description-textarea-id").click();
    await page.locator("#complaint-location-description-textarea-id").clear();
    await page
      .locator("#complaint-location-description-textarea-id")
      .pressSequentially(editCallDetails.locationDescription, { delay: 0 });
    await page.locator("#complaint-description-textarea-id").click();
    await page.locator("#complaint-description-textarea-id").click();
    await page.locator("#complaint-description-textarea-id").clear();
    await page
      .locator("#complaint-description-textarea-id")
      .pressSequentially(editCallDetails.description, { delay: 0 });
    await page.locator("#complaint-description-textarea-id").click();
    await enterDateTimeInDatePicker(page, "complaint-incident-time", "01", "13", "45");
    await page.locator(".comp-select__multi-value__remove").first().click();
    await page.locator(".comp-select__multi-value__remove").first().click();
    await page.locator(".comp-select__multi-value__remove").first().click();
    const dropdownTrigger = page.locator("#attractants-select-id").locator("div").first();
    await dropdownTrigger.click(); // open dropdown once

    for (const attractant of editCallDetails.attractants) {
      await page.getByText(attractant, { exact: true }).click();
      await dropdownTrigger.click(); // reopen dropdown if needed
    }
    await page.locator("#complaint-description-textarea-id").click();
    await page.locator("#complaint-description-textarea-id").click();
    await selectItemById("community-select-id", editCallDetails.community, page);
    await selectItemById("complaint-received-method-select-id", editCallDetails.methodComplaintReceived, page);
    await selectItemById("nature-of-complaint-select-id", editCallDetails.natureOfComplaint, page);
    await selectItemById("species-select-id", editCallDetails.species, page);
    await page.locator("#officer-assigned-select-id").scrollIntoViewIfNeeded();
    await selectItemById("officer-assigned-select-id", editCallDetails.assigned, page);
    await page.locator("#details-screen-cancel-save-button-top").click();
    //end edit

    //start checking edit changes saved
    await waitForSpinner(page);
    await expect(
      page.locator('dd[id="comp-details-name"]').getByText(editCallerInformation.name).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-address"]').getByText(editCallerInformation.address).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-email"]').getByText(editCallerInformation.email).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-phone"]').getByText(editCallerInformation.phone).first(),
    ).toBeVisible();
    const phone2text = await page.locator("#comp-details-phone-1").innerText();
    expect(phone2text.trim()).toBe(editCallerInformation.secondary);
    const phone3text = await page.locator("#comp-details-phone-2").innerText();
    expect(phone3text.trim()).toBe(editCallerInformation.alternate);
    await expect(
      page.locator('dd[id="comp-details-reported"]').getByText(editCallerInformation.reported).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-email"]').getByText(editCallerInformation.email).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-location"]').getByText(editCallDetails.location).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-location-description"]').getByText(editCallDetails.locationDescription).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="complaint-incident-date-time"]').getByText(editCallDetails.incidentDateDay).first(),
    ).toBeVisible();
    await expect(
      page.locator('pre[id="comp-details-description"]').getByText(editCallDetails.description).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-community"]').getByText(editCallDetails.community).first(),
    ).toBeVisible();
    await expect(page.locator('dd[id="comp-details-office"]').getByText(editCallDetails.office).first()).toBeVisible();
    await expect(page.locator('dd[id="comp-details-zone"]').getByText(editCallDetails.zone).first()).toBeVisible();
    await expect(page.locator('dd[id="comp-details-region"]').getByText(editCallDetails.region).first()).toBeVisible();
    await expect(
      page
        .locator('dd[id="comp-method-complaint-received"]')
        .getByText(editCallDetails.methodComplaintReceived)
        .first(),
    ).toBeVisible();
    const attractants = await page.locator(".comp-attractant-badge").allTextContents();
    expect(attractants).toEqual(expect.arrayContaining(["Livestock", "BBQ", "Beehive"]));

    //end checking edit changes saved
  });

  test("Puts everything back to the original details", async function ({ page }) {
    //start reverting changes
    await navigateToEditScreen(COMPLAINT_TYPES.HWCR, "23-000076", true, page);
    await page.locator("#caller-name-id").click();
    await page.locator("#caller-name-id").clear();
    await page.locator("#caller-name-id").fill(originalCallerInformation.name);
    await page.locator("#complaint-address-id").click();
    await page.locator("#complaint-address-id").clear();
    await page.locator("#complaint-address-id").fill(originalCallerInformation.address);
    await page.locator("#complaint-email-id").click();
    await page.locator("#complaint-email-id").clear();
    await page.locator("#complaint-email-id").fill(originalCallerInformation.email);
    await page.locator("#caller-primary-phone-id").click();
    await page.locator("#caller-primary-phone-id").clear();
    await typeAndTriggerChange("#caller-primary-phone-id", originalCallerInformation.phoneInput, page);
    await page.locator("#caller-info-secondary-phone-id").click();
    await page.locator("#caller-info-secondary-phone-id").clear();
    await typeAndTriggerChange("#caller-info-secondary-phone-id", originalCallerInformation.secondaryInput, page);
    await page.locator("#caller-info-alternate-phone-id").click();
    await page.locator("#caller-info-alternate-phone-id").clear();
    await typeAndTriggerChange("#caller-info-alternate-phone-id", originalCallerInformation.alternateInput, page);
    await selectItemById("reported-select-id", originalCallerInformation.reported, page);
    await page.locator("#location-edit-id").click();
    await page.locator("#location-edit-id").clear();
    await page.locator("#location-edit-id").fill(originalCallDetails.location);
    await page.locator("#complaint-location-description-textarea-id").click();
    await page.locator("#complaint-location-description-textarea-id").click();
    await page.locator("#complaint-location-description-textarea-id").clear(); //original blank
    await page.locator("#complaint-description-textarea-id").click();
    await page.locator("#complaint-description-textarea-id").clear();
    await page
      .locator("#complaint-description-textarea-id")
      .pressSequentially(originalCallDetails.description, { delay: 0 });
    await page.locator("#complaint-description-textarea-id").click();
    await enterDateTimeInDatePicker(page, "complaint-incident-time", "11", "13", "45");
    await page.locator(".comp-select__multi-value__remove").first().click();
    await page.locator(".comp-select__multi-value__remove").first().click();
    await page.locator(".comp-select__multi-value__remove").first().click();
    const dropdownTrigger = page.locator("#attractants-select-id").locator("div").first();
    await dropdownTrigger.click(); // open dropdown once

    for (const attractant of originalCallDetails.attractants) {
      await page.getByText(attractant, { exact: true }).click();
      await dropdownTrigger.click(); // reopen dropdown if needed
    }
    await selectItemById("community-select-id", originalCallDetails.community, page);
    await selectItemById("complaint-received-method-select-id", originalCallDetails.methodComplaintReceived, page);
    await selectItemById("nature-of-complaint-select-id", originalCallDetails.natureOfComplaint, page);
    await selectItemById("species-select-id", originalCallDetails.species, page);
    await page.locator("#officer-assigned-select-id").scrollIntoViewIfNeeded();
    await selectItemById("officer-assigned-select-id", originalCallDetails.assigned, page);
    await page.locator("#details-screen-cancel-save-button-top").click();
    //end reverting changes
    //start verifying changes are reverted
    await waitForSpinner(page);
    await expect(
      page.locator('dd[id="comp-details-name"]').getByText(originalCallerInformation.name).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-address"]').getByText(originalCallerInformation.address).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-email"]').getByText(originalCallerInformation.email).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-phone"]').getByText(originalCallerInformation.phone).first(),
    ).toBeVisible();
    const phone2text = await page.locator("#comp-details-phone-1").innerText();
    expect(phone2text.trim()).toBe(originalCallerInformation.secondary);
    const phone3text = await page.locator("#comp-details-phone-2").innerText();
    expect(phone3text.trim()).toBe(originalCallerInformation.alternate);
    await expect(
      page.locator('dd[id="comp-details-reported"]').getByText(originalCallerInformation.reported).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-location"]').getByText(originalCallDetails.location).first(),
    ).toBeVisible();
    await expect(page.locator('dd[id="comp-details-location-description"]')).toHaveText(
      originalCallDetails.locationDescription,
    );
    await expect(
      page.locator('dd[id="complaint-incident-date-time"]').getByText(originalCallDetails.incidentDateDay).first(),
    ).toBeVisible();
    await expect(
      page.locator('pre[id="comp-details-description"]').getByText(originalCallDetails.description).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-community"]').getByText(originalCallDetails.community).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-office"]').getByText(originalCallDetails.office).first(),
    ).toBeVisible();
    await expect(page.locator('dd[id="comp-details-zone"]').getByText(originalCallDetails.zone).first()).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-region"]').getByText(originalCallDetails.region).first(),
    ).toBeVisible();
    await expect(
      page
        .locator('dd[id="comp-method-complaint-received"]')
        .getByText(originalCallDetails.methodComplaintReceived)
        .first(),
    ).toBeVisible();
    const attractants = await page.locator(".comp-attractant-badge").allTextContents();
    expect(attractants).toEqual(expect.arrayContaining(["Garbage", "Freezer", "Compost"]));

    //end verifying changes are reverted
  });
});

test.describe("Complaint Edit Page spec - Additional Checks", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  test("Navigate to the Complaint Edit page & check inputs", async function ({ page }) {
    await navigateToEditScreen(COMPLAINT_TYPES.HWCR, "23-007023", true, page);

    // Note: if the layout of this page changes, these selectors that use classes may break
    // Check the First Section inputs
    // Nature of complaint
    await expect(page.locator("#nature-of-complaint-pair-id label")).toContainText("Nature of complaint");
    await expect(page.locator("#nature-of-complaint-pair-id input")).toBeVisible();

    // Species
    await expect(page.locator("#species-pair-id label")).toContainText("Species");
    await expect(page.locator("#species-pair-id input")).toBeVisible();

    // Officer assigned
    await expect(page.locator("#officer-assigned-pair-id label")).toContainText("Officer assigned");

    // Check the Call Details inputs
    // Complaint location/address
    await expect(page.locator("#complaint-location-pair-id label")).toContainText("Location/address");
    await expect(page.locator("#complaint-location-pair-id input")).toBeVisible();

    // Incident Time
    await expect(page.locator("#incident-time-pair-id label")).toContainText("Incident date/time");
    await expect(page.locator("#complaint-incident-time")).toBeVisible();
    // await expect(page.locator("#incident-date")).toBeVisible();
    // await expect(page.locator("#incident-time")).toBeVisible();

    // Location description
    await expect(page.locator("#location-description-pair-id label")).toContainText("Location description");
    await expect(page.locator("#location-description-pair-id textarea")).toBeVisible();

    // Attractants
    await expect(page.locator("#attractants-pair-id label")).toContainText("Attractants");
    await expect(page.locator("#attractants-pair-id input")).toBeVisible();

    // X Coordinate
    await expect(page.locator('[for="input-x-coordinate"]')).toContainText("Longitude");
    await expect(page.locator("#input-x-coordinate")).toBeVisible();

    // Y Coordinate
    await expect(page.locator('[for="input-y-coordinate"]')).toContainText("Latitude");
    await expect(page.locator("#input-y-coordinate")).toBeVisible();

    // Area/Community
    await expect(page.locator("#area-community-pair-id label")).toContainText("Community");
    await expect(page.locator("#area-community-pair-id input")).toBeVisible();

    // Office
    await expect(page.locator("#office-pair-id label")).toContainText("Office");
    await expect(page.locator("#office-edit-readonly-id")).toBeDisabled();

    // Zone
    await expect(page.locator("#zone-pair-id label")).toContainText("Zone");
    await expect(page.locator("#zone-edit-readonly-id")).toBeDisabled();

    // Region
    await expect(page.locator("#region-pair-id label")).toContainText("Region");
    await expect(page.locator("#region-edit-readonly-id")).toBeDisabled();

    // Method Complaint Received
    await expect(page.locator('[for="complaint-received-method-label-id"]')).toContainText(
      "Method complaint was received",
    );
    await expect(page.locator("#complaint-received-method-pair-id")).toBeVisible();

    // Caller Information - Name
    await expect(page.locator("#complaint-caller-info-name-label-id")).toContainText("Name");
    await expect(page.locator("#name-pair-id input")).toBeVisible();
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
});
