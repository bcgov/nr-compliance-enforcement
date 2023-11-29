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

      // verify the attachments section exists
      cy.contains("h6", "Attachments").should("exist");

      // verify the carousel exists (since 23-000076 is known to have attachments)
      cy.get('div.carousel.coms-carousel')
      .should('exist')
      .and('be.visible');

      // verify that the previous/next buttons exist (but not visibe)
      cy.get('button[aria-label="previous"]')
      .should('exist')
      .and('not.be.visible');

      cy.get('button[aria-label="next"]')
      .should('exist')
      .and('not.be.visible');

      cy.get(".coms-carousel-actions").first().invoke('attr', 'style', 'display: block');
      cy.get(".download-icon").should("exist");

    });

  });
});
