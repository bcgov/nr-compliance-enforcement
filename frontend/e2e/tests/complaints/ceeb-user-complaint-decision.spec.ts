import test, { expect } from "@playwright/test";
import COMPLAINT_TYPES from "../../../src/app/types/app/complaint-types";

import {
  enterDateTimeInDatePicker,
  navigateToDetailsScreen,
  navigateToEditScreen,
  selectItemById,
  waitForSpinner,
} from "../../utils/helpers";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";

test.describe("CEEB Complaints can be created and outcome decisions set ", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.CEEB });
  // These tests need to be run sequentially, they create and subsequently edit a complaint
  test.describe.configure({ mode: "serial" });

  const createCallDetails = {
    description: "testing complaint description ---- testing",
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
  let complaintId;
  complaintId = null;

  test("can create a complaint with a violation type of Waste", async function ({ page }) {
    //start create changes
    await page.goto("/complaint/createComplaint", {
      waitUntil: "commit",
    });
    await waitForSpinner(page);
    await selectItemById("violation-type-select-id", "Waste", page);
    await page.locator("#complaint-description-textarea-id").click();
    await page.locator("#complaint-description-textarea-id").clear();
    await page
      .locator("#complaint-description-textarea-id")
      .pressSequentially(createCallDetails.description, { delay: 0 });
    await page.locator("#complaint-description-textarea-id").click();
    await selectItemById("community-select-id", createCallDetails.community, page);
    await page.locator("#caller-name-id").click();
    await page.locator("#caller-name-id").clear();
    await page.locator("#caller-name-id").fill(createCallerInformation.name);
    await page.locator("#complaint-address-id").click();
    await page.locator("#complaint-address-id").clear();
    await page.locator("#complaint-address-id").fill(createCallerInformation.address);
    await page.locator("#complaint-email-id").click();
    await page.locator("#complaint-email-id").clear();
    await page.locator("#complaint-email-id").fill(createCallerInformation.email);
    await page.locator("#details-screen-cancel-save-button-top").click();
    //end create changes

    //start verifying changes are created
    await waitForSpinner(page);

    //-- verify call details
    await expect(page.locator('pre[id="comp-details-description"]')).toHaveText(createCallDetails.description);

    //-- verify caller information
    await expect(
      page.locator('dd[id="comp-details-name"]').getByText(createCallerInformation.name).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-address"]').getByText(createCallerInformation.address).first(),
    ).toBeVisible();
    await expect(
      page.locator('dd[id="comp-details-email"]').getByText(createCallerInformation.email).first(),
    ).toBeVisible();

    //save complaint id for later use
    const url = page.url();
    complaintId = url.split("/").pop();

    //end verifying changes are created
  });

  test("can edit a complaint with a violation type of Waste", async function ({ page }) {
    await navigateToEditScreen(COMPLAINT_TYPES.ERS, complaintId, true, page);
    await page.locator("#complaint-description-textarea-id").click();
    await page.locator("#complaint-description-textarea-id").clear();
    await page
      .locator("#complaint-description-textarea-id")
      .pressSequentially(createCallDetails.description + " EDITED", { delay: 0 });
    await page.locator("#complaint-description-textarea-id").click();
    await page.locator("#details-screen-cancel-save-button-top").click();
    //end edit

    //start checking edit changes saved
    await waitForSpinner(page);
    await expect(page.locator('pre[id="comp-details-description"]')).toHaveText(
      createCallDetails.description + " EDITED",
    );

    //end verifying edit changes are saved
  });

  test("can save a authorization id on a complaint with a violation type of Waste", async function ({ page }) {
    await navigateToDetailsScreen(COMPLAINT_TYPES.ERS, complaintId, true, page);
    //delete authorization if it exists
    if (await page.locator("#ceeb-authorization-delete-btn").isVisible()) {
      await page.locator("#ceeb-authorization-delete-btn").click();
      await page.getByRole("button", { name: "Yes, delete authorization" }).first().click();
    } else {
      console.log("The delete button is not visible, skipping the click actions.");
    }
    await waitForSpinner(page);
    await page.locator("#outcome-authroization-authroized-site").click();
    await page.locator("#outcome-authroization-authroized-site").clear();
    await page.locator("#outcome-authroization-authroized-site").fill("0000001");
    await page.locator("#outcome-authorization-save-button").click();
    await waitForSpinner(page);
    await expect(
      page
        .locator('dd[id="authorization-id"]')
        .getByText(/0000001/)
        .first(),
    ).toBeVisible();
  });

  test("can save or edit a decision on a complaint with a violation type of Waste", async function ({ page }) {
    await navigateToDetailsScreen(COMPLAINT_TYPES.ERS, complaintId, true, page);

    //Determine if we need to save or edit
    const $decision = await page.locator("#ceeb-decision");
    const editBtnLocator = await $decision.locator("#decision-edit-button").all();
    // Check if the button was found
    if ((await editBtnLocator.length) > 0) {
      await $decision.locator("#decision-edit-button").click();
    } else {
      console.log("The edit button is not visible, skipping the click actions.");
    }

    // Verify that IPM Sector Type rules are applied when not selected
    await selectItemById("outcome-decision-schedule-sector", "WDR schedule 1", page);
    await expect(page.locator("#decision-ipm-auth-category")).not.toBeVisible();
    await page.locator("#outcome-decision-sector-category").locator("div").first().click();
    await expect(
      page
        .locator(".comp-select__menu-list")
        .getByText(/Aerial/)
        .first(),
    ).not.toBeVisible();
    await expect(
      page
        .locator(".comp-select__menu-list")
        .getByText(/Abrasives industry/)
        .first(),
    ).toBeVisible();
    await page.click("body"); // ensure dropdown is closed before continuing
    // Verify that IPM Sector Type rules are applied when selected
    await selectItemById("outcome-decision-schedule-sector", "IPM sector type", page);
    await expect(page.locator("#decision-ipm-auth-category")).toBeVisible();
    await page.locator("#outcome-decision-sector-category").locator("div").first().click();
    await expect(
      page
        .locator(".comp-select__menu-list")
        .getByText(/Aerial/)
        .first(),
    ).toBeVisible();
    await expect(
      page
        .locator(".comp-select__menu-list")
        .getByText(/Abrasives industry/)
        .first(),
    ).not.toBeVisible();
    await page.click("body"); // ensure dropdown is closed before continuing
    await selectItemById("outcome-decision-ipm-auth-category", "Other", page);
    await selectItemById("outcome-decision-sector-category", "Agriculture", page);
    await selectItemById("outcome-decision-action-taken", "No action", page);
    await enterDateTimeInDatePicker(page, "outcome-decision-outcome-date", "01");

    // save decision
    await page.locator("#outcome-decision-save-button").click();
    await waitForSpinner(page);

    // verify decision saved
    await expect(
      page
        .locator('dd[id="decision-schedule"]')
        .getByText(/IPM sector type/)
        .first(),
    ).toBeVisible();
    await expect(page.locator('dd[id="decision-authorization"]').getByText(/Other/).first()).toBeVisible();
    await expect(
      page
        .locator('dd[id="decision-sector"]')
        .getByText(/Agriculture/)
        .first(),
    ).toBeVisible();
    await expect(
      page
        .locator('dd[id="decision-discharge"]')
        .getByText(/Pesticides/)
        .first(),
    ).toBeVisible();
    await expect(
      page
        .locator('dd[id="decision-action"]')
        .getByText(/No action/)
        .first(),
    ).toBeVisible();

    //end verifying edit changes are saved
  });
});
