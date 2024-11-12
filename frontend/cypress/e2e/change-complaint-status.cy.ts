/*
Test to verify that the status and assignment popover displays when clicking the vertical ellipsis on both the
HWLC and Enforcement list screens
*/
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
describe("Complaint Assign and Status Popover spec", { scrollBehavior: false }, () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab", "#gir-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  Cypress._.times(complaintTypes.length, (index) => {
    //Skip this test as users are not allowed to close complaints from the list view for now
    it.skip("Changes status of open complaint to closed and back to open", () => {
      cy.visit("/");

      //Need to make sure the filters are loaded before switching tabs.
      cy.waitForSpinner();

      cy.get(complaintTypes[index]).click({ force: true });

      cy.waitForSpinner();

      cy.get(".popover").should("not.exist");

      cy.get("#comp-zone-filter").click({ force: true }); //clear zone filter so this complaint is in the list view

      cy.waitForSpinner();

      // Find the number of open complaints
      // This number should change if a complaint is changed from open to closed
      cy.get("table tr").filter(':contains("Open")').as("openRows");

      // Click the complaint
      cy.get("@openRows").get("td").first().click({ force: true });

      cy.get("#update-status-icon").filter(":visible").click({ force: true });

      cy.get("#complaint_status_dropdown").click();

      // Select the option with value "Closed"
      cy.get(".comp-select__option").contains("Closed").click();

      cy.get("#update_complaint_status_button").click();

      cy.waitForSpinner();

      //Uncomment all this when CE-263 is complete!!!

      //cy.get("table tr")
      //  .filter(':contains("Closed")')
      //  .should("have.length.at.least", 1);

      // Find the number of closed complaints
      // This number should change if a complaint is changed from closed to open
      //cy.get("table tr").filter(':contains("Closed")').as("closedRows");

      //cy.get("svg.tt-status-icon").filter(':visible').click({force:true});

      //cy.get("#complaint_status_dropdown").click();

      // Select the option with value "OPEN"
      //cy.get(".comp-select__option").contains("Open").click();

      //cy.get("#update_complaint_status_button").click();

      //cy.get("table tr")
      //  .filter(':contains("Open")')
      //  .should("have.length.at.least", 1);
    });
  });

  it.skip("User can not change the status when Review is not complete ", () => {
    canChangeStatus(false);
  });

  it.skip("User can change the status when Review is complete ", () => {
    canChangeStatus(true);
  });
});

const canChangeStatus = (reviewComplete: boolean) => {
  cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032441", true);

  cy.get(".comp-outcome-report-file-review").then(function ($review) {
    if ($review.find("#review-edit-button").length) {
      cy.get("#review-edit-button").click({ force: true });
    }
    cy.validateComplaint("23-032441", "Black Bear");

    cy.get("#review-required")
      .check({ force: true })
      .then(() => {
        reviewComplete
          ? cy.get("#review-complete").check({ force: true })
          : cy.get("#review-complete").uncheck({ force: true });
      });

    cy.get("#file-review-save-button").click({ force: true });
  });

  cy.visit("/");

  cy.waitForSpinner();

  cy.get("#hwcr-tab").click({ force: true });

  cy.waitForSpinner();

  cy.get(".popover").should("not.exist");

  cy.get("#comp-zone-filter").click({ force: true });

  cy.waitForSpinner();

  cy.get("#comp-status-filter").click({ force: true });

  cy.get("#complaint-search").click({ force: true });

  cy.get("#complaint-search").clear().type("23-032441{enter}");

  cy.waitForSpinner();

  cy.get("#update-status-icon").filter(":visible").click({ force: true });

  cy.get(".change_status_modal")
    .should("contain", reviewComplete ? "" : "Complaint is pending review.")
    .find("#complaint_status_dropdown input")
    .should(reviewComplete ? "be.enabled" : "be.disabled");
};
