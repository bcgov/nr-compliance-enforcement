import { Roles } from "../../src/app/types/app/roles";
import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

/**
 * Test that CEEB specific search filters work
 */
describe("Verify CEEB specific search filters work", () => {
  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin(Roles.CEEB);
  });

  it.only("allows filtering of complaints by Action Taken", function () {
    // Navigate to the complaint list
    const complaintWithActionTakenID = "23-030990";
    const actionTaken = "Forward to lead agency";

    // Check if complaintWithActionTakenID already has a decision.
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.ERS, complaintWithActionTakenID, true);
    // If the action taken input is available then the complaint does not yet have a decision made on it.
    // Set an action taken so that the filter will have results to return.
    cy.get("#ceeb-decision").then((decisionWrapper) => {
      // If the edit button is on the page, a decision needs to be made
      if (!decisionWrapper.find("#decision-edit-button").length) {
        cy.selectItemById("outcome-decision-schedule-sector", "Other");
        cy.selectItemById("outcome-decision-sector-category", "None");
        cy.selectItemById("outcome-decision-discharge", "Pesticides");
        cy.selectItemById("outcome-decision-action-taken", actionTaken);
        cy.selectItemById("outcome-decision-lead-agency", "Other");
        cy.enterDateTimeInDatePicker("outcome-decision-outcome-date", "01");
        cy.get("#ceeb-decision > .card-body > .comp-details-form-buttons > #outcome-decision-save-button").click();
        cy.contains("div", "Decision added").should("exist");
      }
    });

    // Return to the complaints view
    cy.get("#icon-complaints-link").click();

    // Filter by action taken
    cy.get("#comp-filter-btn").should("exist").click({ force: true });
    cy.selectItemById("action-taken-select-id", actionTaken);
    cy.waitForSpinner();
    cy.clearFilterById("comp-officer-filter");
    cy.waitForSpinner();
    cy.get(`#${complaintWithActionTakenID}`).should("exist");
  });
});
