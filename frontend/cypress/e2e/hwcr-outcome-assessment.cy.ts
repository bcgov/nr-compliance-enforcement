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
    cy.get("#outcome-report-add-assessment").click({ force: true });
    cy.get(".comp-outcome-report-complaint-assessment").then(function ($assessment) {
      if ($assessment.find("#outcome-save-button").length) {
        cy.validateComplaint("23-033066", "Coyote");

        //click Save Button
        cy.get("#outcome-save-button").click();

        //validate error message
        cy.get(".error-message").should(($error) => {
          expect($error).to.contain.text("Required");
        });

        let inputs = ["#action-required-div", "#outcome-officer-div", "#assessment-checkbox-div"];
        cy.hasErrorMessage(inputs, "Errors in form");
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
    cy.get("#outcome-report-add-assessment").click({ force: true });
    cy.get(".comp-outcome-report-complaint-assessment").then(function ($assessment) {
      if ($assessment.find("#outcome-save-button").length) {
        cy.validateComplaint("23-033066", "Coyote");

        let sectionParams = {
          section: "ASSESSMENT",
          checkboxes: ["#SGHTNGS"],
          officer: "TestAcct, ENV",
          date: "01",
          actionRequired: "Yes",
          toastText: "Assessment has been saved",
        };

        cy.fillInHWCSection(sectionParams).then(() => {
          sectionParams.checkboxes = ["Sighting"];

          cy.validateHWCSection(sectionParams);
        });
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

        cy.get("#action-required-div")
          .invoke("text")
          .then((actionRequired) => {
            if (actionRequired === "Yes") {
              const newCheckboxForEdit = "#FOODCOND";
              cy.get(newCheckboxForEdit).should("exist");
              cy.get(newCheckboxForEdit).check();

              cy.get("#outcome-cancel-button").click();

              cy.get(".modal-footer > .btn-primary").click();

              cy.get("#assessment-checkbox-div").should(($div) => {
                expect($div).to.contain.text("Sighting");
              });

              cy.get("#assessment-checkbox-div").should(($div) => {
                expect($div).to.not.contain.text("Food conditioned");
              });
            }
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

    cy.get("#outcome-report-add-assessment").click({ force: true });
    cy.get(".comp-outcome-report-complaint-assessment").then(function ($assessment) {
      if ($assessment.find("#assessment-edit-button").length) {
        cy.get("#assessment-edit-button").click();

        let sectionParams = {
          section: "ASSESSMENT",
          checkboxes: ["#DAMGPROP"],
          officer: "TestAcct, ENV",
          date: "01",
          actionRequired: "No",
          justification: "No public safety concern",
          toastText: "Assessment has been updated",
        };

        cy.fillInHWCSection(sectionParams).then(() => {
          cy.validateHWCSection(sectionParams);
        });
      } else {
        cy.log("Assessment Not Found, did a previous test fail? Skip the Test");
        this.skip();
      }
    });
  });
});
