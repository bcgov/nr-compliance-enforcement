import COMPLAINT_TYPES from "@apptypes/app/complaint-types";

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
        cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", true);
      } else {
        cy.navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-006888", true);
      }

      cy.verifyAttachmentsCarousel(false, "complaint_attachments_div_id");
    });
  });

  Cypress._.times(complaintTypes.length, (index) => {
    it("Verifies that upload option exists on edit page", () => {
      if ("#hwcr-tab".includes(complaintTypes[index])) {
        cy.navigateToEditScreen(COMPLAINT_TYPES.HWCR, "23-000076", true);
      } else {
        cy.navigateToEditScreen(COMPLAINT_TYPES.ERS, "23-006888", true);
      }

      // should be able to upload on details view
      cy.get("button.comp-attachment-upload-btn").should("exist");
    });
  });

  it("Verifies that upload option exists on the create page", () => {
    cy.navigateToCreateScreen();
    cy.get("button.comp-attachment-upload-btn").should("exist");
  });
});
