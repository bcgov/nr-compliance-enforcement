import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

describe("HWCR Outcome Prevention and Education", () => {

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });
  
  it("it can save prevention and education", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030330", true);

    //This is required to make the tests re-runnable.  It's not great because it means it will only run the first time.
    //If we ever get the ability to remove an assessment this test suite should be rewritten to remove this conditional
    //and to add a test at the end to delete the assessment.
    cy.get('.comp-hwcr-outcome-report').then(function($outcome)  {
      if ($outcome.find('#outcome-report-add-prevention-outcome').length > 0) {
        cy.get('#outcome-report-add-prevention-outcome').click();
        cy.validateComplaint("23-030330", "Black Bear");
        cy.fillInHWCSection ("PREV&EDUC", ["#PROVSFTYIN", "#CNTCTBYLAW"], "Olivia Benson", "01")
        cy.validateHWCSection ("PREV&EDUC", ["Provided safety information to the public", "Contacted bylaw to assist with managing attractants"], "Olivia Benson", "01");
      } else {
        cy.log('Test was previously run. Skip the Test');
        this.skip();
      }
    });
  });

  it("it can edit an existing prevention and education", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030330", true);

    cy.validateComplaint("23-030330", "Black Bear");

    cy.get('.comp-outcome-report-complaint-prev-and-educ')
    .then(function($preventionAndEducation) {
      if ($preventionAndEducation.find('#prevention-edit-button').length) {
        cy.get("#prevention-edit-button").click();

        cy.fillInHWCSection ("PREV&EDUC", ["#CNTCTBIOVT"], "Jake Peralta", "01");

        cy.validateHWCSection ("PREV&EDUC", ["Provided safety information to the public", 
          "Contacted bylaw to assist with managing attractants", 
          "Contacted biologist and/or veterinarian"], "Jake Peralta", "01");
      } else {
        cy.log('Prevention and Education Edit Button Not Found, did a previous test fail? Skip the Test')
        this.skip()
      }
    }); 
  });

  it("it can cancel prevention and education edits", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030330", true);

    cy.validateComplaint("23-030330", "Black Bear");

    cy.get('.comp-outcome-report-complaint-prev-and-educ')
    .then(function($preventionAndEducation) {
      if ($preventionAndEducation.find('#prevention-edit-button').length) {
        cy.get("#prevention-edit-button").click();

        const newCheckboxForEdit = "#DIRLOWLACT"
        cy.get(newCheckboxForEdit).should("exist");
        cy.get(newCheckboxForEdit).check();

        cy.get("#prev-educ-outcome-cancel-button").click();

        cy.get('.modal-footer > .btn-primary').click();

        cy.get("#prev-educ-checkbox-div").should(($div) => {
            expect($div).to.contain.text("Provided safety information to the public");
            expect($div).to.contain.text("Contacted bylaw to assist with managing attractants");
        });

        cy.get("#prev-educ-checkbox-div").should(($div) => {
            expect($div).to.not.contain.text("Directed livestock owner to or explained sections 2, 26(2) and 75 of the Wildlife Act");
        });
      } else {
        cy.log('Prevention and Education Edit Button Not Found, did a previous test fail? Skip the Test')
        this.skip()
      }
    });
  });

  it("it requires valid user input", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-030330" , true);

    //This is required to make the tests re-runnable.  It's not great because it means it will only run the first time.
    //If we ever get the ability to remove an prevention and education this test suite should be rewritten to remove this conditional
    //and to add a test at the end to delete the prevention and education.
    cy.get('.comp-hwcr-outcome-report').then(function($outcome) {
      if ($outcome.find('#outcome-report-add-prevention-outcome').length > 0) {
          cy.get('#outcome-report-add-prevention-outcome').click();
          cy.validateComplaint("23-030330", "Black Bear");
      } else {
        cy.log('Test was previously run. Skip the Test');
        this.skip();
      }
    });

    cy.get('.comp-outcome-report-complaint-prev-and-educ')
    .then(function() {
      
      //click Save Button
      cy.get("#outcome-save-prev-and-educ-button").click();

      //validate officer is required
      cy.get("#prev-educ-outcome-officer-div").find(".error-message").should("exist");

      //validate the date is required
      cy.get("#prev-educ-outcome-date-div").find(".error-message").should("exist");

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


});





