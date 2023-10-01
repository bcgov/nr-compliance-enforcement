/*
Test to verify that the user is able to change the status both the
HWLC and Enforcement details screens
*/
describe("Complaint Change Status spec - Details View", () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  Cypress._.times(complaintTypes.length, (index) => {
    it("Changes status of complaint to open, closed, and back to open", () => {
      if ("#hwcr-tab".includes(complaintTypes[index])) {
        cy.navigateToHWLCDetailsScreen("23-000076");
      } else {
        cy.navigateToAllegationDetailsScreen("23-006888");
      }

      cy.get("#details-screen-update-status-button").click({ force: true });

      cy.get("#complaint_status_dropdown").click();

      // Select the option with value "Closed"
      cy.get(".comp-select__option").contains("Closed").click();

      cy.get("#update_complaint_status_button").click();

      cy.waitForSpinner();

      cy.get("#comp-details-status-text-id").contains("Closed").should("exist");

      cy.get("#details-screen-update-status-button").click({ force: true });

      cy.get("#complaint_status_dropdown").click();

      // Select the option with value "Opened"
      cy.get(".comp-select__option").contains("Open").click();

      cy.get("#update_complaint_status_button").click();

      cy.waitForSpinner();

      cy.get("#comp-details-status-text-id").contains("Open").should("exist");
    });
  });
});
