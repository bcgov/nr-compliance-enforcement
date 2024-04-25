import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

describe("HWCR Outcome Assessments", () => {
  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("it requires at least one assessment action on create", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-033066", true);

    //This is required to make the tests re-runnable.  It's not great because it means it will only run the first time.
    //If we ever get the ability to remove an assessment this test suite should be rewritten to remove this conditional
    //and to add a test at the end to delete the assessment.
    cy.get(".comp-outcome-report-complaint-assessment").then(function ($assessment) {
      if ($assessment.find("#outcome-save-button").length) {
        cy.validateComplaint("23-033066", "Coyote");

        //click Save Button
        cy.get("#outcome-save-button").click();

        //validate error message
        cy.get(".error-message").should(($error) => {
          expect($error).to.contain.text("One or more assessment is required");
        });

        //validate Action Required is required
        cy.get("#action-required-div").find(".error-message").should("exist");

        //validate officer is required
        cy.get("#outcome-officer-div").find(".error-message").should("exist");

        //validate the date is required
        cy.get("#complaint-outcome-date-div").find(".error-message").should("exist");

        //validate the toast
        cy.get(".Toastify__toast-body").then(($toast) => {
          expect($toast).to.contain.text("Errors in form");
        });
      } else {
        cy.log("Test was previously run. Skip the Test");
        this.skip();
      }
    });
  });

  it("it can save assessment where action is required", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-033066", true);

    //This is required to make the tests re-runnable.  It's not great because it means it will only run the first time.
    //If we ever get the ability to remove an assessment this test suite should be rewritten to remove this conditional
    //and to add a test at the end to delete the assessment.
    cy.get(".comp-outcome-report-complaint-assessment").then(function ($assessment) {
      if ($assessment.find("#outcome-save-button").length) {
        cy.validateComplaint("23-033066", "Coyote");
        cy.fillInHWCSection("ASSESSMENT", ["#ASSESSRISK"], "Olivia Benson", "01", "Yes");
        cy.validateHWCSection("ASSESSMENT", ["Assessed public safety risk"], "Olivia Benson", "01", "Yes");
      } else {
        cy.log("Test was previously run. Skip the Test");
        this.skip();
      }
    });
  });

  it("it can cancel assessment edits", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-033066", true);

    cy.validateComplaint("23-033066", "Coyote");

    cy.get(".comp-outcome-report-complaint-assessment").then(function ($assessment) {
      if ($assessment.find("#assessment-edit-button").length) {
        cy.get("#assessment-edit-button").click();

        const newCheckboxForEdit = "#ASSESSHLTH";
        cy.get(newCheckboxForEdit).should("exist");
        cy.get(newCheckboxForEdit).check();

        cy.get("#outcome-cancel-button").click();

        cy.get(".modal-footer > .btn-primary").click();

        cy.get("#assessment-checkbox-div").should(($div) => {
          expect($div).to.contain.text("Assessed public safety risk");
        });

        cy.get("#assessment-checkbox-div").should(($div) => {
          expect($div).to.not.contain.text("Assessed health as per animal welfare guidelines");
        });
      } else {
        cy.log("Assessment Not Found, did a previous test fail? Skip the Test");
        this.skip();
      }
    });
  });

  it("it can edit an existing assessment", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-033066", true);

    cy.validateComplaint("23-033066", "Coyote");

    cy.get(".comp-outcome-report-complaint-assessment").then(function ($assessment) {
      if ($assessment.find("#assessment-edit-button").length) {
        cy.get("#assessment-edit-button").click();

        cy.fillInHWCSection("ASSESSMENT", ["#ASSESSHIST"], "Jake Peralta", "01", "No", "No public safety concern");

        cy.validateHWCSection(
          "ASSESSMENT",
          ["Assessed public safety risk", "Assessed known conflict history"],
          "Jake Peralta",
          "01",
          "No",
          "No public safety concern",
        );
      } else {
        cy.log("Assessment Not Found, did a previous test fail? Skip the Test");
        this.skip();
      }
    });
  });
});
