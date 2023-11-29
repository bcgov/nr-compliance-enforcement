import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

/*
Tests to verify complaint attachments
*/
describe("Complaint Attachments", () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  Cypress._.times(complaintTypes.length, (index) => {
    it("Verifies that the attachments appear", () => {
      if ("#hwcr-tab".includes(complaintTypes[index])) {
        cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076");
      } else {
        cy.navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-006888");
      }

      cy.contains("h6", "Attachments").should("exist");

    });

  });
});
