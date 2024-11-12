import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import Roles from "@apptypes/app/roles";

/*
Test that confirms that CEEB Users see different values in the Method Complaint Received field.
*/
describe("Validate CEEB method complaint received options", () => {
  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin(Roles.CEEB);
  });

  function validateMethodReceivedOptions() {
    //Check for CEEB values
    cy.get(".comp-select__menu-list").contains("DGIR forward").should("exist");
    cy.get(".comp-select__menu-list").contains("Direct contact").should("exist");
    cy.get(".comp-select__menu-list").contains("Minister's office").should("exist");
    cy.get(".comp-select__menu-list").contains("RAPP").should("exist");
    cy.get(".comp-select__menu-list").contains("Referral").should("exist");

    //Check that COS values aren't there
    cy.get(".comp-select__menu-list").contains("BC wildlife federation app").should("not.exist");
    cy.get(".comp-select__menu-list").contains("Observed in field").should("not.exist");
  }

  it("only has CEEB values on create", function () {
    //Access dropdown from create screen
    cy.navigateToCreateScreen();

    cy.get("#complaint-received-method-select-id").find("div").first().click({ force: true });

    validateMethodReceivedOptions();
  });

  it("only has CEEB values on edit", function () {
    //Access dropdown from create screen
    cy.navigateToEditScreen(COMPLAINT_TYPES.ERS, "23-006888", true);

    cy.get("#complaint-received-method-select-id").find("div").first().click({ force: true });

    validateMethodReceivedOptions();
  });
});
