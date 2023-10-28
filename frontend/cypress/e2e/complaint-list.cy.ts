/*
Tests to verify complaint list specification functionality
*/
describe("Complaint List Functionality", () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogin();
  });

  Cypress._.times(complaintTypes.length, (index) => {
    it("Verifies that the complaint tabs have specific text", () => {
      cy.visit("/");
      cy.waitForSpinner();

      cy.get(complaintTypes[index]).click({ force: true });

      if ("#hwcr-tab".includes(complaintTypes[index])) {
        cy.get("#hwcr-tab").should("contain.text", "Human Wildlife Conflicts");
      } else {
        cy.get("#ers-tab").should("contain.text", "Enforcement");
      }
    });

    it(
      "Verifies the complaint tabs, filter and table header are sticky",
      { scrollBehavior: false },
      () => {
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

        cy.get(".fixed-nav-header").isInViewport();
        cy.get(".fixed-filter-header").isInViewport();
        cy.get(".fixed-table-header").isInViewport();
      },
    );
    
    it("Verifies that the complaint link styles are applied correctly", () => {
      cy.visit("/");
      cy.waitForSpinner();

      cy.get(complaintTypes[index]).click({ force: true });

      // remove the open filter
      cy.get("#comp-status-filter").click({ force: true });
      cy.get("#comp-zone-filter").click({ force: true });


      cy.get(".comp-nav-item-name-underline > a").should('have.css', 'text-decoration').should('include', 'underline');
      cy.get(".comp-nav-item-name-underline > a").should('have.css', 'color').should('include', 'rgb(26, 90, 150)');

    });

  });
});
