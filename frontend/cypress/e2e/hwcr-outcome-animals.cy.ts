import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

describe("HWCR Animal Outcomes", () => {
  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-031396", true);
  });

  it("it requires valid user input", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-031396", true);

    // //This is required to make the tests re-runnable.  It's not great because it means it will only run the first time.
    // //If we ever get the ability to remove an prevention and education this test suite should be rewritten to remove this conditional
    // //and to add a test at the end to delete the prevention and education.
    // cy.get(".comp-hwcr-outcome-report").then(function ($outcome) {
    //   if ($outcome.find("#outcome-report-add-note").length > 0) {
    //     cy.get("#outcome-report-add-note").click();
    //   } else {
    //     cy.log("Test was previously run. Skip the Test");
    //     this.skip();
    //   }
    // });

    // cy.get(".comp-outcome-notes").then(function () {
    //   cy.validateComplaint("23-032454", "Black Bear");

    //   //click Save Button
    //   cy.get("#supporting-notes-save-button").click();

    //   //validate error message
    //   cy.get(".error-message").then(($error) => {
    //     expect($error).to.contain.text("Additional notes required");
    //   });
    // });
  });
});
