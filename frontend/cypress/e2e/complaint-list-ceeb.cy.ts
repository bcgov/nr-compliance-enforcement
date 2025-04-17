/*
Tests to verify complaint list specification functionality
*/

import { Roles } from "../../src/app/types/app/roles";

describe("Complaint List Functionality", () => {
  const complaintTypes = ["#ers-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin(Roles.CEEB);
  });

  Cypress._.times(complaintTypes.length, (index) => {
    it(`Verifies that the ${complaintTypes[index]} is correct`, () => {
      cy.visit("/");
      cy.waitForSpinner();

      cy.get(complaintTypes[index]).click({ force: true });

      if ("#ers-tab".includes(complaintTypes[index])) {
        cy.get("#ers-tab").should("contain.text", "Waste and Pesticides");
        cy.get("table thead").should("contain.text", "Complaint #");
        cy.get("table thead").should("contain.text", "Date logged");
        cy.get("table thead").should("contain.text", "Violation type");
        cy.get("table thead").should("contain.text", "Community");
        cy.get("table thead").should("contain.text", "Location/address");
        cy.get("table thead").should("not.contain.text", "Park");
        cy.get("table thead").should("contain.text", "Status");
        cy.get("table thead").should("contain.text", "Officer assigned");
        cy.get("table thead").should("contain.text", "Last updated");
        cy.get("table thead").should("contain.text", "Actions");
      }
    });
  });
});
