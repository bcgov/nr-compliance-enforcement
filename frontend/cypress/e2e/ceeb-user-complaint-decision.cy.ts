import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";
import { Roles } from "../../src/app/types/app/roles";

describe("CEEB Complaints can be created and outcome decisions set ", () => {
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

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin(Roles.CEEB);
  });

  let complaintId = null;

  it("can create a complaint with a violation type of Waste", function () {
    //start create changes
    cy.navigateToCreateScreen();

    cy.selectItemById("violation-type-select-id", "Waste");

    cy.get("#complaint-description-textarea-id").click({ force: true });
    cy.get("#complaint-description-textarea-id").clear().type(createCallDetails.description, { delay: 0 });
    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.selectItemById("community-select-id", createCallDetails.community);

    cy.get("#caller-name-id").click({ force: true }).clear().type(createCallerInformation.name);
    cy.get("#complaint-address-id").click({ force: true }).clear().type(createCallerInformation.address);
    cy.get("#complaint-email-id").click({ force: true }).clear().type(createCallerInformation.email);

    cy.get("#details-screen-cancel-save-button-top").click({ force: true });
    //end create changes

    //start verifying changes are created
    cy.waitForSpinner();

    //-- verify call details
    cy.get('pre[id="comp-details-description"]').should("have.text", createCallDetails.description);

    //-- verify caller information
    cy.get('dd[id="comp-details-name"]').contains(createCallerInformation.name);
    cy.get('dd[id="comp-details-address"]').contains(createCallerInformation.address);
    cy.get('dd[id="comp-details-email"]').contains(createCallerInformation.email);

    //save complaint id for later use
    cy.url().then((url) => {
      complaintId = url.split("/").pop();
    });

    //end verifying changes are created
  });

  it("can edit a complaint with a violation type of Waste", function () {
    cy.navigateToEditScreen(COMPLAINT_TYPES.ERS, complaintId, true);

    cy.get("#complaint-description-textarea-id").click({ force: true });
    cy.get("#complaint-description-textarea-id")
      .clear()
      .type(createCallDetails.description + " EDITED", { delay: 0 });
    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.get("#details-screen-cancel-save-button-top").click({ force: true });
    //end edit

    //start checking edit changes saved
    cy.waitForSpinner();

    cy.get('pre[id="comp-details-description"]').should("have.text", createCallDetails.description + " EDITED");

    //end verifying edit changes are saved
  });

  it("can save a authorization id on a complaint with a violation type of Waste", function () {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.ERS, complaintId, true);
    //delete authorization if it exists
    cy.get("#ceeb-authorization").then(function ($authorization) {
      const deleteBtn = $authorization.find("#ceeb-authorization-delete-btn");
      // Check if the button was found
      if (deleteBtn.length) {
        cy.get("#ceeb-authorization-delete-btn").click();
        cy.get(".modal-footer > .btn-primary").click();
      } else {
        cy.log("The delete button is not visible, skipping the click actions.");
      }
    });
    cy.get("#outcome-authroization-authroized-site").click({ force: true }).clear().type("0000001");
    cy.get("#outcome-authorization-save-button").click({ force: true });
    cy.waitForSpinner();
    cy.get('dd[id="authorization-id"]').contains("0000001");
  });

  it("can save or edit a decision on a complaint with a violation type of Waste", function () {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.ERS, complaintId, true);

    //Determine if we need to save or edit
    cy.get("#ceeb-decision").then(function ($decision) {
      const editBtn = $decision.find("#decision-edit-button");
      // Check if the button was found
      if (editBtn.length) {
        cy.get("#decision-edit-button").click();
      } else {
        cy.log("The edit button is not visible, skipping the click actions.");
      }
    });

    // Verify that IPM Sector Type rules are applied when not selected
    cy.selectItemById("outcome-decision-schedule-sector", "WDR schedule 1");
    cy.get("#decision-ipm-auth-category").should("not.exist");
    cy.get("#outcome-decision-sector-category").find("div").first().click({ force: true });
    cy.get(".comp-select__menu-list").contains("Aerial").should("not.exist");
    cy.get(".comp-select__menu-list").contains("Abrasives industry").should("exist");

    // Verify that IPM Sector Type rules are applied when selected
    cy.selectItemById("outcome-decision-schedule-sector", "IPM sector type");
    cy.get("#decision-ipm-auth-category").should("exist");
    cy.get("#outcome-decision-sector-category").find("div").first().click({ force: true });
    cy.get(".comp-select__menu-list").contains("Aerial").should("exist");
    cy.get(".comp-select__menu-list").contains("Abrasives industry").should("not.exist");

    cy.selectItemById("outcome-decision-ipm-auth-category", "Other");
    cy.selectItemById("outcome-decision-sector-category", "Agriculture");
    cy.selectItemById("outcome-decision-action-taken", "No action");
    cy.enterDateTimeInDatePicker("outcome-decision-outcome-date", "01");

    // save decision
    cy.get("#outcome-decision-save-button").click({ force: true });
    cy.waitForSpinner();

    // verify decision saved
    cy.get('dd[id="decision-schedule"]').contains("IPM sector type");
    cy.get('dd[id="decision-authorization"]').contains("Other");
    cy.get('dd[id="decision-sector"]').contains("Agriculture");
    cy.get('dd[id="decision-discharge"]').contains("Pesticides");
    cy.get('dd[id="decision-action"]').contains("No action");

    //end verifying edit changes are saved
  });
});
