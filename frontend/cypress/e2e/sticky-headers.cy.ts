import COMPLAINT_TYPES from "@apptypes/app/complaint-types";

/*
Tests to verify complaint list specification functionality
*/
describe("Sticky Headers", () => {
  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("Verifies that the Create Header is sticky", { scrollBehavior: false }, () => {
    cy.visit("/");
    cy.waitForSpinner();

    cy.navigateToCreateScreen();

    //scroll to the bottom of the page
    cy.get(".comp-main-content").scrollTo("bottom"); // Scroll 'sidebar' to its bottom

    cy.get(".comp-details-header").isInViewport();
  });

  it("Verifies that the Details Header is sticky", { scrollBehavior: false }, () => {
    cy.visit("/");
    cy.waitForSpinner();

    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", true);

    //scroll to the bottom of the page
    cy.get(".comp-main-content").scrollTo("bottom"); // Scroll 'sidebar' to its bottom

    cy.get(".comp-details-header").isInViewport();
  });

  it("Verifies that the Edit Header is sticky", { scrollBehavior: false }, () => {
    cy.visit("/");
    cy.waitForSpinner();

    cy.navigateToEditScreen(COMPLAINT_TYPES.ERS, "23-006888", true);

    //scroll to the bottom of the page
    cy.get(".comp-main-content").scrollTo("bottom"); // Scroll 'sidebar' to its bottom

    cy.get(".comp-details-header").isInViewport();
  });
});
