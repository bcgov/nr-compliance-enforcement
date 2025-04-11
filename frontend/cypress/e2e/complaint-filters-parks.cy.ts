import { Roles } from "../../src/app/types/app/roles";
import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

/**
 * Test that PARKS specific search filters work
 */
describe("Verify Parks specific search filters work", () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab", "#gir-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin(Roles.PARKS);
  });

  Cypress._.times(complaintTypes.length, (index) => {
    it("Park filter exists for {index}", function () {
      cy.visit("/");

      //Need to make sure the filters are loaded before switching tabs.
      cy.waitForSpinner();

      cy.get(complaintTypes[index]).click({ force: true });
      cy.waitForSpinner();

      cy.get("#comp-filter-btn").should("exist").click({ force: true });
      cy.get("#comp-filter-park-id").should("exist");
    });
  });

  it("can filter based on Park", function () {
    // Navigate to the complaint list
    const complaintWithPark = "23-032032";
    const expectedPark = "Inonoaklin Park";

    // Check if the Park is already on a case (e.g. this test is being run for a second time)
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, complaintWithPark, true);
    // Get the element that displays the park name
    cy.get("#comp-details-park").then(($el) => {
      const actualText = $el.text().trim();

      if (!actualText.includes(expectedPark)) {
        cy.get("#details-screen-edit-button").click({ force: true });
        cy.selectTypeAheadItemByText("park-select-id", expectedPark);
        cy.get("#details-screen-cancel-save-button-top").click({ force: true });
      }
    });

    // Return to the complaints view
    cy.get("#complaints-link").click();

    // Filter by park
    cy.get("#comp-filter-btn").should("exist").click({ force: true });
    cy.selectTypeAheadItemByText("park-select-id", expectedPark);
    cy.get("#comp-park-filter").should("exist");
    cy.get(`#${complaintWithPark}`).should("exist");
  });
});
