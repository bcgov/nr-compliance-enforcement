/*
Test to verify that the status and assignment popover displays when clicking the vertical ellipsis on both the
HWLC and Enforcement list screens
*/
describe("Complaint Assign Popover spec", { scrollBehavior: false }, () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  Cypress._.times(complaintTypes.length, (index) => {
    it("Changes assignee of complaint", () => {
      cy.visit("/");

      //Need to make sure the filters are loaded before switching tabs.
      cy.waitForSpinner();

      cy.get(complaintTypes[index]).click({ force: true });

      cy.get("#comp-zone-filter").click({ force: true }); //clear zone filter so we have some complaint is in the list view

      cy.waitForSpinner();

      cy.get("td").first().click({ force: true });

      cy.get("#quick-action-button").first().children("button").first().click({ force: true });
      cy.get("#update-assignee-menu-item").should("exist"); //Wait for the options to show
      cy.contains("Assign complaint").click({ force: true });

      // self assign the complaint
      cy.get("#self_assign_button").click();
    });
  });
});
