import Roles from "../../src/app/types/app/roles";
import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

/**
 * Test that CEEB specific search filters work
 */
describe("Verify CEEB specific search filters work", () => {
  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin(Roles.CEEB);
  });

  function needsDecision() {
    let needsDecision = false;
    cy.get("#ceeb-decision").then((decisionWrapper) => {
      // If the action taken input is on the page, a decision needs to be made
      if (decisionWrapper.find("#outcome-decision-action-taken").length > 0) {
        needsDecision = true;
      }
    });
    return needsDecision;
  }

  it.only("allows filtering of complaints by Action Taken", function () {
    // Navigate to the complaint list
    const complaintWithActionTakenID = "23-030990";
    const actionTaken = "Forward to lead agency";

    // Check if complaintWithActionTakenID already has a decision.
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.ERS, complaintWithActionTakenID, true);
    // If the action taken input is available then the complaint does not yet have a decision made on it.
    // Set an action taken so that the filter will have results to return.
    if (needsDecision()) {
      cy.selectItemById("outcome-decision-schedule-sector", "Other");
      cy.selectItemById("outcome-decision-sector-category", "None");
      cy.selectItemById("outcome-decision-discharge", "Pesticides");
      cy.selectItemById("outcome-decision-action-taken", actionTaken);
      cy.selectItemById("outcome-decision-lead-agency", "Other");
      cy.enterDateTimeInDatePicker("outcome-decision-outcome-date", "01");
      // If the complaint is not assigned to anyone, assign it to self
      if (cy.get("#comp-details-assigned-officer-name-text-id").contains("Not Assigned")) {
        cy.get("#details-screen-assign-button").should("exist").click();
        cy.get("#self_assign_button").should("exist").click();
      }
      cy.get(".modal").should("not.exist"); // Ensure that the quick assign modal has closed
      cy.get("#ceeb-decision > .card-body > .comp-details-form-buttons > #outcome-decision-save-button").click();
      cy.contains("div", "Decision added").should("exist");
    }

    // Return to the complaints view
    cy.get("#complaints-link").click();

    // Clear filters
    cy.get("#comp-status-filter").click({ force: true });
    cy.get("#comp-officer-filter").click({ force: true });

    // Filter by action taken
    cy.get("#comp-filter-btn").should("exist").click({ force: true });
    cy.selectItemById("action-taken-select-id", actionTaken);
    cy.waitForSpinner();
    cy.get(`#${complaintWithActionTakenID}`).should("exist");
  });
});
