/*
Test to verify that the status and assignment popover displays when clicking the vertical ellipsis on both the
HWLC and Enforcement list screens
*/
describe("Complaint Assign Popover spec", { scrollBehavior: false }, () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogin();
  });

  Cypress._.times(complaintTypes.length, (index) => {
    it("Changes assignee of complaint", () => {
      cy.visit("/");

      //Need to make sure the filters are loaded before switching tabs.
      cy.waitForSpinner();

      cy.get(complaintTypes[index]).click({ force: true });

      cy.waitForSpinner();

      cy.get(".popover").should("not.exist");

      cy.get("#comp-zone-filter").click({ force: true }); //clear zone filter so we have some complaint is in the list view

      cy.waitForSpinner();

      cy.get("td.comp-ellipsis-cell")
        .first() // finds the buttons cell of that row
        .click({ force: true });

      cy.get(".popover").should("exist");
      cy.get(".popover").get("div#assign_complaint_link").click();

      // self assign the complaint
      cy.get("#self_assign_button").click();
    });
  });
});
