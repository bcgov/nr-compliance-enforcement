import COMPLAINT_TYPES from "@apptypes/app/complaint-types";

describe("HWCR Outcome Notes", () => {
  //A function to try and reduce code duplication warnings

  function enterNote(note: string) {
    cy.get("#supporting-notes-textarea-id").click({ force: true });
    cy.get("#supporting-notes-textarea-id").clear().type(note, { delay: 0 });
  }

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("it requires valid user input", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032454", true);

    //This is required to make the tests re-runnable.  It's not great because it means it will only run the first time.
    //If we ever get the ability to remove an prevention and education this test suite should be rewritten to remove this conditional
    //and to add a test at the end to delete the prevention and education.
    cy.get(".comp-hwcr-outcome-report").then(function ($outcome) {
      if ($outcome.find("#outcome-report-add-note").length > 0) {
        cy.get("#outcome-report-add-note").click();
      } else {
        cy.log("Test was previously run. Skip the Test");
        this.skip();
      }
    });

    cy.get(".comp-outcome-supporting-notes").then(function () {
      cy.validateComplaint("23-032454", "Black Bear");

      //click Save Button
      cy.get("#supporting-notes-save-button").click();

      //validate error message
      cy.get(".error-message").then(($error) => {
        expect($error).to.contain.text("Additional notes required");
      });
    });
  });

  it("it can save note", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032454", true);

    //This is required to make the tests re-runnable.  It's not great because it means it will only run the first time.
    //If we ever get the ability to remove an assessment this test suite should be rewritten to remove this conditional
    //and to add a test at the end to delete the assessment.
    cy.get(".comp-hwcr-outcome-report").then(function ($outcome) {
      if ($outcome.find("#outcome-report-add-note").length > 0) {
        cy.get("#outcome-report-add-note").click();

        cy.validateComplaint("23-032454", "Black Bear");

        enterNote("This is test supporting note from Cypress");

        cy.get("#supporting-notes-save-button").click();

        //validate the note
        cy.get(".comp-outcome-supporting-notes").should(($div) => {
          expect($div).to.contain.text("This is test supporting note from Cypress");
        });

        //validate the officer
        cy.get("#comp-notes-officer").should(($div) => {
          expect($div).to.contain.text("TestAcct, ENV");
        });

        //validate the toast
        cy.get(".Toastify__toast-body").then(($toast) => {
          expect($toast).to.contain.text("Supplemental note created");
        });
      } else {
        cy.log("Test was previously run. Skip the Test");
        this.skip();
      }
    });
  });

  it("it can cancel note edits", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032454", true);

    cy.validateComplaint("23-032454", "Black Bear");

    cy.get(".comp-outcome-supporting-notes").then(function ($notes) {
      if ($notes.find("#notes-edit-button").length) {
        cy.get("#notes-edit-button").click();

        enterNote("This text will be cancelled by Cypress");

        cy.get("#supporting-notes-cancel-button").click();

        cy.get(".modal-footer > .btn-primary").click();

        cy.get(".comp-outcome-supporting-notes").should(($div) => {
          expect($div).to.not.contain.text("This text will be cancelled by Cypress");
        });
      } else {
        cy.log("Notes Edit Button Not Found, did a previous test fail? Skip the Test");
        this.skip();
      }
    });
  });

  it("it can edit an existing note", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032454", true);

    cy.validateComplaint("23-032454", "Black Bear");

    cy.get(".comp-outcome-supporting-notes").then(function ($notes) {
      if ($notes.find("#notes-edit-button").length) {
        cy.get("#notes-edit-button").click();

        enterNote("This note is edited by Cypress");

        cy.get("#supporting-notes-save-button").click();

        //Validate the text
        cy.get(".comp-outcome-supporting-notes").should(($div) => {
          expect($div).to.contain.text("This note is edited by Cypress");
        });

        //validate the toast
        cy.get(".Toastify__toast-body").then(($toast) => {
          expect($toast).to.contain.text("Supplemental note updated");
        });
      } else {
        cy.log("Note Edit Button Not Found, did a previous test fail? Skip the Test");
        this.skip();
      }
    });
  });

  it("it can delete an existing note", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032454", true);

    cy.get(".comp-outcome-supporting-notes").then(function ($notes) {
      if ($notes.find("#notes-delete-button").length) {
        cy.get("#notes-delete-button").click();

        cy.get(".modal-footer > .btn-primary").click();

        //validate the toast
        cy.get(".Toastify__toast-body").then(($toast) => {
          expect($toast).to.contain.text("Supplemental note deleted");
        });

        cy.get("#outcome-report-add-note").should("exist");
      } else {
        cy.log("Note Delete Button Not Found, did a previous test fail? Skip the Test");
        this.skip();
      }
    });
  });
});
