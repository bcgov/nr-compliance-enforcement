/*
Tests to verify complaint list specification functionality
*/
/*describe("Complaint List Functionality", () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab", "#gir-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  Cypress._.times(complaintTypes.length, (index) => {
    it("Verifies that the complaint tabs have specific text", () => {
      cy.visit("/");
      cy.waitForSpinner();

      cy.get(complaintTypes[index]).click({ force: true });

      if ("#hwcr-tab".includes(complaintTypes[index])) {
        cy.get("#hwcr-tab").should("contain.text", "Human Wildlife Conflicts");
      }
      if ("#ers-tab".includes(complaintTypes[index])) {
        cy.get("#ers-tab").should("contain.text", "Enforcement");
      }
      if ("#gir-tab".includes(complaintTypes[index])) {
        cy.get("#gir-tab").should("contain.text", "General Incident");
      }
    });

    it("Verifies that the complaint link styles are applied correctly", () => {
      cy.visit("/");
      cy.waitForSpinner();

      cy.get(complaintTypes[index]).click({ force: true });

      // remove the open filter
      cy.get("#comp-status-filter").click({ force: true });
      cy.get("#comp-zone-filter").click({ force: true });

      cy.get(".incident-col > a").should("have.css", "text-decoration").should("include", "underline");
      cy.get(".incident-col > a").should("have.css", "color").should("include", "rgb(26, 90, 150)");
    });
  });
}); */

describe("CEEB User Stuff?", () => {
  const roles = ["CEEB"];
  // const roles = ["CEEB", "CEEB Compliance Coordinator"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
    cy.applyRoles(roles);
  });

  afterEach(function () {
    cy.resetRoles();
  });

  Cypress._.times(roles.length, (index) => {
    it("Verifies something", () => {
      cy.visit("/");
      cy.waitForSpinner();
    });
  });
});
