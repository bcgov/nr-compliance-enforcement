import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import {
  enterDateTimeInCompDateTimePicker,
  navigateToCreateScreen,
  selectItemById,
  waitForSpinner,
} from "../../utils/helpers";

/*
Test to verify that the user is able to click the edit button
on the wildlife contacts details page and see all the inputs
*/
test.describe("Complaint Create Page spec - Create View", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  const createCallDetails = {
    description:
      "Caller was involved in an altercation yesterday with a person who was exceeding the Callers understanding of the limit.  SUBs were attempting to catch 5 fish, of each type, each person (total 20.) SUBs male and their wife.  Caller requesting CO clarification regarding fish quotas for region 3.  Caller has contacted front counter BC, who reported the answer to COS. ---- testing",
    location: "2975 Jutland Rd.",
    locationDescription: "tester call description 8 ---- testing",
    xCoord: "-123.377",
    yCoord: "48.440",
    incidentDateDay: "01",
    incidentTime: "13:45",
    community: "Victoria",
    office: "Victoria",
    zone: "South Island",
    region: "West Coast",
    methodComplaintReceived: "RAPP",
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

  const createCallerInformation = {
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
    reportedCode: "BCWF",
    reportedIndex: 1,
    witnessDetails: "----- testing",
  };

  test("Navigate to the Complaint Create page & create and verify data", async function ({ page }) {
    //start create
    await navigateToCreateScreen(page);
    await selectItemById("complaint-type-select-id", "Enforcement", page);
    await page.locator("#caller-name-id").click();
    await page.locator("#caller-name-id").clear();
    await page.locator("#caller-name-id").fill(createCallerInformation.name);
    await page.locator("#complaint-address-id").click();
    await page.locator("#complaint-address-id").clear();
    await page.locator("#complaint-address-id").fill(createCallerInformation.address);
    await page.locator("#complaint-email-id").click();
    await page.locator("#complaint-email-id").clear();
    await page.locator("#complaint-email-id").fill(createCallerInformation.email);
    await page.locator("#caller-primary-phone-id").click();
    await page.locator("#caller-primary-phone-id").clear();
    const callerPrimaryPhoneLocator = await page.locator("#caller-primary-phone-id");
    await callerPrimaryPhoneLocator.fill(createCallerInformation.phoneInput);
    await page.locator("#caller-info-secondary-phone-id").click();
    await page.locator("#caller-info-secondary-phone-id").clear();
    const callerSecondaryPhoneLocator = await page.locator("#caller-info-secondary-phone-id");
    await callerSecondaryPhoneLocator.fill(createCallerInformation.secondaryInput);
    await page.locator("#caller-info-alternate-phone-id").click();
    await page.locator("#caller-info-alternate-phone-id").clear();
    const callerAlternatePhoneLocator = await page.locator("#caller-info-alternate-phone-id");
    await callerAlternatePhoneLocator.fill(createCallerInformation.alternateInput);
    await selectItemById("reported-select-id", createCallerInformation.reported, page);
    await page.locator("#location-edit-id").click();
    await page.locator("#location-edit-id").clear();
    await page.locator("#location-edit-id").fill(createCallDetails.location);
    await page.locator("#complaint-location-description-textarea-id").click();
    await page.locator("#complaint-location-description-textarea-id").click();
    await page.locator("#complaint-location-description-textarea-id").clear();
    await page.locator("#complaint-location-description-textarea-id").fill(createCallDetails.locationDescription);
    await page.locator("#complaint-description-textarea-id").click();
    await page.locator("#complaint-description-textarea-id").clear();
    await page.locator("#complaint-description-textarea-id").fill(createCallDetails.description);
    await page.locator("#complaint-description-textarea-id").click();
    await enterDateTimeInCompDateTimePicker(page, "01", "13", "45");
    await selectItemById("violation-in-progress-select-id", createCallDetails.violationInProgressString, page);
    await selectItemById("violation-observed-select-id", createCallDetails.violationObservedString, page);
    await selectItemById("community-select-id", createCallDetails.community, page);
    await selectItemById("complaint-received-method-select-id", createCallDetails.methodComplaintReceived, page);
    await selectItemById("violation-type-select-id", createCallDetails.violationType, page);
    await selectItemById("officer-assigned-select-id", createCallDetails.assigned, page);
    await page.locator("#details-screen-cancel-save-button-top").click();
    //end create changes

    //start verifying changes are created
    await waitForSpinner(page);

    //-- verify call details
    await expect(await page.locator('pre[id="comp-details-description"]')).toHaveText(createCallDetails.description);
    await expect(
      await page.locator('dd[id="complaint-incident-date-time"]').getByText(createCallDetails.incidentDateDay).first(),
    ).toBeVisible();
    await expect(
      await page.locator('dd[id="complaint-incident-date-time"]').getByText(createCallDetails.incidentTime).first(),
    ).toBeVisible();
    await expect(
      await page
        .locator('dd[id="comp-details-violation-in-progress"]')
        .getByText(createCallDetails.violationInProgressString)
        .first(),
    ).toBeVisible();
    await expect(
      await page
        .locator('dd[id="comp-details-violation-observed"]')
        .getByText(createCallDetails.violationObservedString)
        .first(),
    ).toBeVisible();
    await expect(
      await page.locator('dd[id="comp-details-location"]').getByText(createCallDetails.location).first(),
    ).toBeVisible();
    await expect(await page.locator('dd[id="comp-details-location-description"]')).toHaveText(
      createCallDetails.locationDescription,
    );
    await expect(
      await page.locator('span[id="geo-details-x-coordinate"]').getByText(createCallDetails.xCoord).first(),
    ).toBeVisible();
    await expect(
      await page.locator('span[id="geo-details-y-coordinate"]').getByText(createCallDetails.yCoord).first(),
    ).toBeVisible();
    await expect(
      await page.locator('dd[id="comp-details-community"]').getByText(createCallDetails.community).first(),
    ).toBeVisible();
    await expect(
      await page.locator('dd[id="comp-details-office"]').getByText(createCallDetails.office).first(),
    ).toBeVisible();
    await expect(
      await page.locator('dd[id="comp-details-zone"]').getByText(createCallDetails.zone).first(),
    ).toBeVisible();
    await expect(
      await page.locator('dd[id="comp-details-region"]').getByText(createCallDetails.region).first(),
    ).toBeVisible();
    await expect(
      await page
        .locator('dd[id="comp-method-complaint-received"]')
        .getByText(createCallDetails.methodComplaintReceived)
        .first(),
    ).toBeVisible();
    await expect(
      await page.locator('dd[id="comp-details-reported"]').getByText(createCallerInformation.reported).first(),
    ).toBeVisible();

    //-- verify caller information
    await expect(
      await page.locator('dd[id="comp-details-name"]').getByText(createCallerInformation.name).first(),
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
    await expect(async () => {
      const $el = await page.locator('dd[id="comp-details-phone-1"]');
      await expect((await $el.textContent())!.trim()).toBe(createCallerInformation.secondary);
    }).toPass();
    await expect(async () => {
      const $el = await page.locator('dd[id="comp-details-phone-2"]');
      await expect((await $el.textContent())!.trim()).toBe(createCallerInformation.alternate);
    }).toPass();

    //end verifying changes are created
  });
});
