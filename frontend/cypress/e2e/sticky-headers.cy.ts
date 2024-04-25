import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

/*
Tests to verify complaint list specification functionality
*/
describe("Sticky Headers", () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  Cypress._.times(complaintTypes.length, (index) => {
    it("Verifies the complaint tabs, filter and table header are sticky", { scrollBehavior: false }, () => {
      cy.visit("/");
      cy.waitForSpinner();

      cy.get(complaintTypes[index]).click({ force: true });

      // remove the open filter
      cy.get("#comp-status-filter").click({ force: true });
      cy.get("#comp-zone-filter").click({ force: true });

      //-- check to make sure there are enough rows to scroll
      cy.get(".pagination").should("exist");

      //scroll to the bottom of the page
      cy.scrollTo("bottom");

      cy.get(".comp-header").isInViewport();
      cy.get(".fixed-nav-header").isInViewport();
      cy.get(".fixed-filter-header").isInViewport();
      cy.get(".fixed-table-header").isInViewport();
    });
  });

  it("Verifies that the Create Header is sticky", { scrollBehavior: false }, () => {
    cy.visit("/");
    cy.waitForSpinner();

    cy.navigateToCreateScreen();

    //scroll to the bottom of the page
    cy.scrollTo("bottom");

    cy.get(".comp-header").isInViewport();
    cy.get(".comp-create-header").isInViewport();
  });

  it("Verifies that the Details Header is sticky", { scrollBehavior: false }, () => {
    cy.visit("/");
    cy.waitForSpinner();

    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", true);

    //scroll to the bottom of the page
    cy.scrollTo("bottom");

    cy.get(".comp-header").isInViewport();
    cy.get(".comp-details-header").isInViewport();
  });

  it("Verifies that the Edit Header is sticky", { scrollBehavior: false }, () => {
    cy.visit("/");
    cy.waitForSpinner();

    cy.navigateToEditScreen(COMPLAINT_TYPES.ERS, "23-006888", true);

    //scroll to the bottom of the page
    cy.scrollTo("bottom");

    cy.get(".comp-header").isInViewport();
    cy.get(".comp-details-header").isInViewport();
  });
});
