import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

describe("HWCR Outcome Prevention and Education", () => {
  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("it requires valid user input", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030330", true);

    // Delete a prevention and education if it exists
    cy.get("#outcome-preventions").then(function ($preventionAndEducation) {
      if ($preventionAndEducation.find("#prevention-delete-button").length) {
        cy.get("#prevention-delete-button").click();
        cy.get(".btn-primary").contains("delete actions").click();
      }
    });

    cy.get("#outcome-preventions").then(function () {
      cy.get("#outcome-report-add-prevention").click();
      //click Save Button
      cy.get("#outcome-save-prev-and-educ-button").click();

      //validate officer is required
      cy.get("#prev-educ-outcome-officer-div").find(".error-message").should("exist");

      //validate the date is required
      cy.get("#prev-educ-checkbox-div").find(".error-message").should("exist");

      //validate error message
      cy.get(".error-message").then(($error) => {
        expect($error).to.contain.text("One or more prevention and education is required");
      });

      //validate the toast
      cy.get(".Toastify__toast-body").then(($toast) => {
        expect($toast).to.contain.text("Errors in form");
      });
    });
  });

  it("it can save prevention and education", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030330", true);

    let params = {
      section: "PREV&EDUC",
      checkboxes: ["#PROVSFTYIN", "#CNTCTBYLAW"],
      officer: "TestAcct, ENV",
      date: "01",
      toastText: "Prevention and education has been saved",
    };

    cy.get("#outcome-preventions").then(function ($outcome) {
      cy.get("#outcome-report-add-prevention").click();
      cy.validateComplaint("23-030330", "Black Bear");

      cy.fillInHWCSection(params).then(() => {
        //expand checkboxes for validating in view state
        params.checkboxes = [
          "Provided safety information to the public",
          "Contacted/referred to bylaw to assist with managing attractants",
        ];

        cy.validateHWCSection(params);
      });
    });
  });

  it("it can cancel prevention and education edits", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030330", true);

    cy.validateComplaint("23-030330", "Black Bear");

    cy.get("#outcome-preventions").then(function ($preventionAndEducation) {
      if ($preventionAndEducation.find("#prevention-edit-button").length) {
        cy.get("#prevention-edit-button").click();

        const newCheckboxForEdit = "#DIRLOWLACT";
        cy.get(newCheckboxForEdit).should("exist");
        cy.get(newCheckboxForEdit).check();

        cy.get("#prev-educ-outcome-cancel-button").click();

        cy.get(".modal-footer > .btn-primary").click();

        cy.get("#prev-educ-checkbox-div").should(($div) => {
          expect($div).to.contain.text("Provided safety information to the public");
          expect($div).to.contain.text("Contacted/referred to bylaw to assist with managing attractants");
        });

        cy.get("#prev-educ-checkbox-div").should(($div) => {
          expect($div).to.not.contain.text(
            "Directed livestock owner to or explained sections 2, 26(2) and 75 of the Wildlife Act",
          );
        });
      } else {
        cy.log("Prevention and Education Edit Button Not Found, did a previous test fail? Skip the Test");
        this.skip();
      }
    });
  });

  it("it can edit an existing prevention and education", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030330", true);

    cy.validateComplaint("23-030330", "Black Bear");

    cy.get("#outcome-preventions").then(function ($preventionAndEducation) {
      if ($preventionAndEducation.find("#prevention-edit-button").length) {
        cy.get("#prevention-edit-button").click();

        let params = {
          section: "PREV&EDUC",
          checkboxes: ["#CNTCTBIOVT"],
          officer: "TestAcct, ENV",
          date: "01",
          toastText: "Prevention and education has been updated",
        };

        cy.fillInHWCSection(params).then(() => {
          //expand checkboxes for validating in view state
          params.checkboxes = [
            "Provided safety information to the public",
            "Contacted/referred to bylaw to assist with managing attractants",
            "Contacted/referred to biologist and/or veterinarian",
          ];

          cy.validateHWCSection(params);
        });
      } else {
        cy.log("Prevention and Education Edit Button Not Found, did a previous test fail? Skip the Test");
        this.skip();
      }
    });
  });

  it("it can delete an existing prevention and education", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030330", true);

    cy.validateComplaint("23-030330", "Black Bear");

    cy.get("#outcome-preventions").then(function ($preventionAndEducation) {
      if ($preventionAndEducation.find("#prevention-delete-button").length) {
        cy.get("#prevention-delete-button").click();
        cy.get(".btn-primary").contains("delete actions").click();
      } else {
        cy.log("Prevention and Education Edit Button Not Found, did a previous test fail? Skip the Test");
        this.skip();
      }
    });
  });
});
