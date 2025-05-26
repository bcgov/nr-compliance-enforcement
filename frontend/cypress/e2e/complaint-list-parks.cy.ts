/*
Tests to verify complaint list specification functionality
*/

import { Roles } from "../../src/app/types/app/roles";

describe("Complaint List Functionality", () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab", "#gir-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin(Roles.PARKS);
  });

  Cypress._.times(complaintTypes.length, (index) => {
    it(`Verifies that the ${complaintTypes[index]} is correct`, () => {
      cy.visit("/");
      cy.waitForSpinner();

      cy.get(complaintTypes[index]).click({ force: true });

      if ("#hwcr-tab".includes(complaintTypes[index])) {
        cy.get("#hwcr-tab").should("contain.text", "Human Wildlife Conflicts");
        cy.get("table thead").should("contain.text", "Complaint #");
        cy.get("table thead").should("contain.text", "Date logged");
        cy.get("table thead").should("contain.text", "Nature of complaint");
        cy.get("table thead").should("contain.text", "Species");
        cy.get("table thead").should("contain.text", "Community");
        cy.get("table thead").should("not.contain.text", "Location/address");
        cy.get("table thead").should("contain.text", "Park");
        cy.get("table thead").should("contain.text", "Status");
        cy.get("table thead").should("contain.text", "Officer assigned");
        cy.get("table thead").should("contain.text", "Last updated");
        cy.get("table thead").should("contain.text", "Actions");
        cy.get("#complaint_pagination_container_id").should("exist");
        cy.get('[id^="pagination_page_"]').should("exist");
      }
      if ("#ers-tab".includes(complaintTypes[index])) {
        cy.get("#ers-tab").should("contain.text", "Enforcement");
        cy.get("table thead").should("contain.text", "Complaint #");
        cy.get("table thead").should("contain.text", "Date logged");
        cy.get("table thead").should("not.contain.text", "Authorization");
        cy.get("table thead").should("contain.text", "Violation type");
        cy.get("table thead").should("contain.text", "Community");
        cy.get("table thead").should("not.contain.text", "Location/address");
        cy.get("table thead").should("contain.text", "Park");
        cy.get("table thead").should("contain.text", "Status");
        cy.get("table thead").should("contain.text", "Officer assigned");
        cy.get("table thead").should("contain.text", "Last updated");
        cy.get("table thead").should("contain.text", "Actions");
        cy.get("#complaint_pagination_container_id").should("exist");
        cy.get('[id^="pagination_page_"]').should("exist");
      }
      if ("#gir-tab".includes(complaintTypes[index])) {
        cy.get("#gir-tab").should("contain.text", "General Incident");
        cy.get("table thead").should("contain.text", "Complaint #");
        cy.get("table thead").should("contain.text", "Date logged");
        cy.get("table thead").should("contain.text", "GIR type");
        cy.get("table thead").should("contain.text", "Community");
        cy.get("table thead").should("not.contain.text", "Location/address");
        cy.get("table thead").should("contain.text", "Park");
        cy.get("table thead").should("contain.text", "Status");
        cy.get("table thead").should("contain.text", "Officer assigned");
        cy.get("table thead").should("contain.text", "Last updated");
        cy.get("table thead").should("contain.text", "Actions");
        cy.get("#complaint_pagination_container_id").should("exist");
        cy.get('[id^="pagination_page_"]').should("exist");
      }
    });
  });
});
