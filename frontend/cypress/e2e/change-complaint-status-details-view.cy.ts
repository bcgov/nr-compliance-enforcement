import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

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
    it("Changes status of closeable complaint to open, closed, and back to open", () => {
      let sectionParams = {
        section: "ASSESSMENT",
        checkboxes: ["#ASSESSRISK"],
        officer: "TestAcct, ENV",
        date: "01",
        actionRequired: "Yes",
        toastText: "Assessment has been saved",
      };

      if ("#hwcr-tab".includes(complaintTypes[index])) {
        cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", true);
        cy.get(".comp-outcome-report-complaint-assessment").then(function ($assessment) {
          if ($assessment.find("#outcome-save-button").length) {
            cy.fillInHWCSection(sectionParams).then(() => {
              sectionParams.checkboxes = ["Assessed public safety risk"];
              cy.validateHWCSection(sectionParams);
            });
          }
        });
      } else {
        cy.navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-006888", true);
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

  it("Changes status of unclosable hwcr complaint from open to closed", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000078", true);

    cy.get("#details-screen-update-status-button").click({ force: true });

    cy.get("#complaint_status_dropdown").click();

    // Select the option with value "Closed"
    cy.get(".comp-select__option").contains("Closed").click();

    cy.get("#update_complaint_status_button").click();

    //validate error message
    cy.get("#outcome-assessment").find(".section-error-message").should("exist");
    cy.get(".section-error-message").should(($error) => {
      expect($error).to.contain.text("Complete section before closing the complaint.");
    });
  });
});
