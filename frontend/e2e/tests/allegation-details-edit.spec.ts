import { test, expect } from "@playwright/test";

import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../utils/authConfig";
import {
  enterDateTimeInDatePicker,
  navigateToEditScreen,
  selectItemById,
  typeAndTriggerChange,
  verifyMapMarkerExists,
  waitForSpinner,
} from "../utils/helpers";

const originalCallDetails = {
  description:
    "Caller was involved in an altercation yesterday with a person who was exceeding the Callers understanding of the limit.  SUBs were attempting to catch 5 fish, of each type, each person (total 20.) SUBs male and their wife.  Caller requesting CO clarification regarding fish quotas for region 3.  Caller has contacted front counter BC, who reported the answer to COS.",
  location: "Keefes Landing Rd and Danskin Rd",
  locationDescription: "tester call description 8",
  incidentDateDay: "11",
  xCoord: "-127.4810142",
  yCoord: "50.4217838",
  community: "Danskin",
  office: "Burns Lake",
  zone: "Nechako-Lakes",
  region: "Omineca",
  communityIndex: 252,
  communityCode: "DANSKIN",
  officeCode: "BURNSLK",
  zoneCode: "NCHKOLKS",
  regionCode: "OMINECA",
  methodComplaintReceived: "Observed in field",
  status: "Open",
  statusIndex: 0,
  assigned: "TestAcct, ENV",
  assignedIndex: 0,
  violationType: "Other",
  violationIndex: 6,
  violationInProgressIndex: 0,
  violationInProgressString: "Yes",
  violationObservedIndex: 1,
  violationObservedString: "No",
};

const originalCallerInformation = {
  name: "Kelsey",
  phone: "",
  phoneInput: "",
  secondary: "",
  secondaryInput: "",
  alternate: "",
  alternateInput: "",
  address: "135 fake st",
  email: "",
  reported: "Department of Fisheries and Oceans",
  reportedCode: "DFO",
  reportedIndex: 2,
  witnessDetails: "",
};

const editCallDetails = {
  description:
    "Caller was involved in an altercation yesterday with a person who was exceeding the Callers understanding of the limit.  SUBs were attempting to catch 5 fish, of each type, each person (total 20.) SUBs male and their wife.  Caller requesting CO clarification regarding fish quotas for region 3.  Caller has contacted front counter BC, who reported the answer to COS. ---- testing",
  location: "Keefes Landing Rd and Danskin Rd ---- testing",
  locationDescription: "tester call description 8 ---- testing",
  incidentDateDay: "01",
  xCoord: "-118",
  yCoord: "49",
  community: "Blaeberry",
  office: "Golden",
  zone: "Columbia/Kootenay",
  region: "Kootenay",
  methodComplaintReceived: "BC wildlife federation app",
  communityIndex: 0,
  communityCode: "Blaeberry",
  officeCode: "GLDN",
  zoneCode: "CLMBAKTNY",
  regionCode: "KTNY",
  status: "Closed",
  statusIndex: 1,
  assigned: "TestAcct, ENV",
  assignedIndex: 1,
  violationInProgressIndex: 1,
  violationInProgressString: "No",
  violationObservedIndex: 0,
  violationObservedString: "Yes",
  violationType: "Boating",
  violationIndex: 1,
};

const editCallerInformation = {
  name: "Phoebe ---- testing",
  phone: "(250) 555-5555",
  phoneInput: "2505555555",
  secondary: "(250) 666-6666",
  secondaryInput: "2506666666",
  alternate: "(250) 666-8888",
  alternateInput: "2506668888",
  address: "135 fake st ---- testing",
  email: "tester512@gmail.com",
  reported: "Conservation Officer Service",
  reportedCode: "COS",
  reportedIndex: 1,
  witnessDetails: "----- testing",
};

/*
Test to verify that the user is able to click the edit button
on the wildlife contacts details page and see all the inputs
*/
test.describe("Complaint Edit Page spec - Edit Allegation View", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  test.describe.configure({ mode: "serial" }); //Ensure tests run in order

  test("Navigate to the Complaint Edit page & change data, save, navigate to read-only, return to edit and reset data", async function ({
    page,
  }) {
    //start edit
    await navigateToEditScreen(COMPLAINT_TYPES.ERS, "23-006888", false, page);
    await page.locator("#caller-name-id").click();
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
    await page.locator("#caller-primary-phone-id").click();
    await page.locator("#caller-primary-phone-id").click();
    await page.locator("#caller-primary-phone-id").clear();
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
    await page.locator("#complaint-witness-details-textarea-id").click();
    await page.locator("#complaint-witness-details-textarea-id").clear();
    await page
      .locator("#complaint-witness-details-textarea-id")
      .pressSequentially(editCallerInformation.witnessDetails, { delay: 0 });
    await page.locator("#location-edit-id").click();
    await page.locator("#location-edit-id").click();
    await page.locator("#location-edit-id").clear();
    await page.locator("#location-edit-id").fill(editCallDetails.location);
    await page.locator("#complaint-location-description-textarea-id").click();
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
    await selectItemById("community-select-id", editCallDetails.community, page);
    await selectItemById("complaint-received-method-select-id", editCallDetails.methodComplaintReceived, page);
    await page.locator("#complaint-description-textarea-id").click();
    await selectItemById("violation-in-progress-select-id", editCallDetails.violationInProgressString, page);
    await selectItemById("violation-observed-select-id", editCallDetails.violationObservedString, page);
    await page.locator("#officer-assigned-select-id").scrollIntoViewIfNeeded();
    await selectItemById("officer-assigned-select-id", editCallDetails.assigned, page);
    await page.locator("#complaint-description-textarea-id").click();
    await selectItemById("violation-type-select-id", editCallDetails.violationType, page);
    await page.locator("#complaint-description-textarea-id").click();
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
    const phoneText = await page.locator("#comp-details-phone").innerText();
    expect(phoneText.trim()).toBe(editCallerInformation.phone);
    const phone1Text = await page.locator("#comp-details-phone-1").innerText();
    expect(phone1Text.trim()).toBe(editCallerInformation.secondary);
    const phone2Text = await page.locator("#comp-details-phone-2").innerText();
    expect(phone2Text.trim()).toBe(editCallerInformation.alternate);
    await expect(
      page.locator('dd[id="comp-details-reported"]').getByText(editCallerInformation.reported).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-email"]').getByText(editCallerInformation.email).first(),
    ).toBeVisible();
    const witness = await page.locator("#comp-details-witness-details").innerText();
    expect(witness.trim()).toBe(editCallerInformation.witnessDetails);
    await expect(
      page.locator('dd[id="comp-details-location"]').getByText(editCallDetails.location).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-location-description"]').getByText(editCallDetails.locationDescription).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="complaint-incident-date-time"]').getByText(editCallDetails.incidentDateDay).first(),
    ).toBeVisible();
    const callDetails = await page.locator("#comp-details-description").innerText();
    expect(callDetails.trim()).toBe(editCallDetails.description);
    await expect(
      page.locator('dd[id="comp-details-community"]').getByText(editCallDetails.community).first(),
    ).toBeVisible();
    await expect(
      page
        .locator('dd[id="comp-method-complaint-received"]')
        .getByText(editCallDetails.methodComplaintReceived)
        .first(),
    ).toBeVisible();
    await expect(
      page
        .locator('dd[id="comp-details-violation-in-progress"]')
        .getByText(editCallDetails.violationInProgressString)
        .first(),
    ).toBeVisible();
    await expect(
      page
        .locator('dd[id="comp-details-violation-observed"]')
        .getByText(editCallDetails.violationObservedString)
        .first(),
    ).toBeVisible();
    await expect(
      page.locator('div[id="comp-nature-of-complaint"]').getByText(editCallDetails.violationType).first(),
    ).toBeVisible();
    await expect(page.locator('dd[id="comp-details-office"]').getByText(editCallDetails.office).first()).toBeVisible();
    await expect(page.locator('dd[id="comp-details-zone"]').getByText(editCallDetails.zone).first()).toBeVisible();
    await expect(page.locator('dd[id="comp-details-region"]').getByText(editCallDetails.region).first()).toBeVisible();

    //end checking edit changes saved
  });

  test("Puts everything back to the original details", async ({ page }) => {
    //start reverting changes
    await navigateToEditScreen(COMPLAINT_TYPES.ERS, "23-006888", true, page);
    await page.locator("#caller-name-id").click();
    await page.locator("#caller-name-id").click();
    await page.locator("#caller-name-id").clear();
    await page.locator("#caller-name-id").fill(originalCallerInformation.name);
    await page.locator("#complaint-address-id").click();
    await page.locator("#complaint-address-id").clear();
    await page.locator("#complaint-address-id").fill(originalCallerInformation.address);
    await page.locator("#complaint-email-id").click();
    await page.locator("#complaint-email-id").clear(); //blank to start
    await page.locator("#caller-primary-phone-id").click();
    await page.locator("#caller-primary-phone-id").click();
    await page.locator("#caller-primary-phone-id").clear();
    await typeAndTriggerChange("#caller-primary-phone-id", originalCallerInformation.phoneInput, page);
    await page.locator("#caller-info-secondary-phone-id").click();
    await page.locator("#caller-info-secondary-phone-id").clear();
    await typeAndTriggerChange("#caller-info-secondary-phone-id", originalCallerInformation.secondaryInput, page);
    await page.locator("#caller-info-alternate-phone-id").click();
    await page.locator("#caller-info-alternate-phone-id").clear();
    await typeAndTriggerChange("#caller-info-alternate-phone-id", originalCallerInformation.alternateInput, page);
    await page.locator("#complaint-witness-details-textarea-id").click();
    await page.locator("#complaint-witness-details-textarea-id").clear();
    await selectItemById("reported-select-id", originalCallerInformation.reported, page);
    await page.locator("#location-edit-id").click();
    await page.locator("#location-edit-id").clear();
    await page.locator("#location-edit-id").fill(originalCallDetails.location);
    await page.locator("#complaint-location-description-textarea-id").click();
    await page.locator("#complaint-location-description-textarea-id").click();
    await page.locator("#complaint-location-description-textarea-id").clear();
    await page
      .locator("#complaint-location-description-textarea-id")
      .pressSequentially(originalCallDetails.locationDescription, { delay: 0 });
    await page.locator("#complaint-description-textarea-id").click();
    await page.locator("#complaint-description-textarea-id").click();
    await page.locator("#complaint-description-textarea-id").clear();
    await page
      .locator("#complaint-description-textarea-id")
      .pressSequentially(originalCallDetails.description, { delay: 0 });
    await page.locator("#complaint-description-textarea-id").click();
    await enterDateTimeInDatePicker(page, "complaint-incident-time", "11", "13", "45");
    await page.locator("#complaint-description-textarea-id").click();
    await selectItemById("community-select-id", originalCallDetails.community, page);
    await selectItemById("complaint-received-method-select-id", originalCallDetails.methodComplaintReceived, page);
    await selectItemById("violation-in-progress-select-id", originalCallDetails.violationInProgressString, page);
    await selectItemById("violation-observed-select-id", originalCallDetails.violationObservedString, page);
    await selectItemById("officer-assigned-select-id", originalCallDetails.assigned, page);
    await selectItemById("violation-type-select-id", originalCallDetails.violationType, page);
    await page.locator("#complaint-description-textarea-id").click();
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
    const email = await page.locator("#comp-details-email").innerText();
    expect(email.trim()).toBe(originalCallerInformation.email);
    const witness = await page.locator("#comp-details-witness-details").innerText();
    expect(witness.trim()).toBe(originalCallerInformation.witnessDetails);
    const phoneText = await page.locator("#comp-details-phone").innerText();
    expect(phoneText.trim()).toBe(originalCallerInformation.phone);
    const phone1Text = await page.locator("#comp-details-phone-1").innerText();
    expect(phone1Text.trim()).toBe(originalCallerInformation.secondary);
    const phone2Text = await page.locator("#comp-details-phone-2").innerText();
    expect(phone2Text.trim()).toBe(originalCallerInformation.alternate);
    await expect(
      page.locator('dd[id="comp-details-reported"]').getByText(originalCallerInformation.reported).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-location"]').getByText(originalCallDetails.location).first(),
    ).toBeVisible();
    await expect(
      page
        .locator('dd[id="comp-details-location-description"]')
        .getByText(originalCallDetails.locationDescription)
        .first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="complaint-incident-date-time"]').getByText(originalCallDetails.incidentDateDay).first(),
    ).toBeVisible();
    const callDetails = await page.locator("#comp-details-description").innerText();
    expect(callDetails.trim()).toBe(originalCallDetails.description);
    await expect(
      page.locator('dd[id="comp-details-community"]').getByText(originalCallDetails.community).first(),
    ).toBeVisible();
    await expect(
      page
        .locator('dd[id="comp-method-complaint-received"]')
        .getByText(originalCallDetails.methodComplaintReceived)
        .first(),
    ).toBeVisible();
    await expect(
      page
        .locator('dd[id="comp-details-violation-in-progress"]')
        .getByText(originalCallDetails.violationInProgressString)
        .first(),
    ).toBeVisible();
    await expect(
      page
        .locator('dd[id="comp-details-violation-observed"]')
        .getByText(originalCallDetails.violationObservedString)
        .first(),
    ).toBeVisible();
    await expect(
      page.locator('div[id="comp-nature-of-complaint"]').getByText(originalCallDetails.violationType).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-office"]').getByText(originalCallDetails.office).first(),
    ).toBeVisible();
    await expect(page.locator('dd[id="comp-details-zone"]').getByText(originalCallDetails.zone).first()).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-region"]').getByText(originalCallDetails.region).first(),
    ).toBeVisible();

    //end verifying changes are reverted
  });

  test("Navigate to the Complaint Edit page & check inputs", async ({ page }) => {
    await navigateToEditScreen(COMPLAINT_TYPES.ERS, "23-006888", true, page);

    // Note: if the layout of this page changes, these selectors that use classes may break
    // Check the First Section inputs
    // Nature of Complaint - not on ERS tab
    await expect(page.locator("#nature-of-complaint-pair-id")).not.toBeVisible();

    // Species - not on ERS tab
    await expect(page.locator("#species-pair-id")).not.toBeVisible();

    // Violation type
    await expect(page.locator("#violation-type-pair-id label")).toContainText("Violation type");
    await expect(page.locator("#violation-type-pair-id input")).toBeVisible();

    // Officer assigned
    await expect(page.locator("#officer-assigned-pair-id label")).toContainText("Officer assigned");
    await expect(page.locator("#officer-assigned-pair-id input")).toBeVisible();

    // Check the Call Details inputs
    // Complaint Location
    await expect(page.locator("#complaint-location-pair-id label")).toContainText("Location/address");
    await expect(page.locator("#complaint-location-pair-id input")).toBeVisible();

    // Incident Time
    await expect(page.locator("#incident-time-pair-id label")).toContainText("Incident date/time");
    await expect(page.locator("#incident-time-pair-id input")).toBeVisible();

    // Location Description
    await expect(page.locator("#location-description-pair-id label")).toContainText("Location description");
    await expect(page.locator("#location-description-pair-id textarea")).toBeVisible();

    // Violation In Progress
    await expect(page.locator("#violation-in-progress-pair-id label")).toContainText("Violation in progress");
    await expect(page.locator("#violation-in-progress-pair-id input")).toBeVisible();

    // Violation observed
    await expect(page.locator("#violation-observed-pair-id label")).toContainText("Violation observed");
    await expect(page.locator("#violation-observed-pair-id input")).toBeVisible();

    // Attractants - not on ERS
    await expect(page.locator("#attractants-pair-id input")).not.toBeVisible();

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

    //Method Complaint Received
    await expect(page.locator('[for="complaint-received-method-label-id"]')).toContainText(
      "Method complaint was received",
    );
    await expect(page.locator("#complaint-received-method-pair-id")).toBeVisible();

    // Check the Caller Information inputs
    // Name
    await expect(page.locator("#complaint-caller-info-name-label-id")).toContainText("Name");
    await expect(page.locator("#name-pair-id input")).toBeVisible();

    // Primary Phone
    await expect(page.locator("#primary-phone-pair-id label")).toContainText("Primary phone");
    await expect(page.locator("#primary-phone-pair-id input")).toBeVisible();

    // Alternative 1 Phone
    await expect(page.locator("#secondary-phone-pair-id label")).toContainText("Alternate phone 1");
    await expect(page.locator("#secondary-phone-pair-id input")).toBeVisible();

    // Alternative 2 Phone
    await expect(page.locator("#alternate-phone-pair-id label")).toContainText("Alternate phone 2");
    await expect(page.locator("#alternate-phone-pair-id input")).toBeVisible();

    // Address
    await expect(page.locator("#address-pair-id label")).toContainText("Address");
    await expect(page.locator("#address-pair-id input")).toBeVisible();

    // Email
    await expect(page.locator("#email-pair-id label")).toContainText("Email");
    await expect(page.locator("#email-pair-id input")).toBeVisible();

    // Reffered by / Complaint Agency
    await expect(page.locator("#reported-pair-id label")).toContainText("Organization reporting the complaint");
    await expect(page.locator("#reported-pair-id input")).toBeVisible();

    await expect(page.locator("#subject-of-complaint-pair-id label")).toContainText("Description");
    await expect(page.locator("#subject-of-complaint-pair-id textarea")).toBeVisible();
  });

  test("it has a map on screen with a marker at the correct location", async function ({ page }) {
    await navigateToEditScreen(COMPLAINT_TYPES.ERS, "23-006888", true, page);
    await verifyMapMarkerExists(true, page);
    await expect(page.locator(".comp-complaint-details-alert")).not.toBeVisible();
  });

  test("it has a map on screen with no marker", async function ({ page }) {
    await navigateToEditScreen(COMPLAINT_TYPES.ERS, "23-030303", true, page);
    await verifyMapMarkerExists(false, page);
    await expect(page.locator(".comp-complaint-details-alert")).toBeVisible();
  });
});
