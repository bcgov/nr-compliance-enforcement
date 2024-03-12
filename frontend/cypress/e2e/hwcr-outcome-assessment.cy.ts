import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

describe("HWCR Outcome Assessments", () => {

//A couple of functions that are probably only ever going to be used here used here.  Could be promoted to commands.
  function validateComplaint (complaintIdentifier: string, species: string) {
    //-- verify the right complaint identifier is selected and the animal type
    cy.get(".comp-box-complaint-id").contains(complaintIdentifier);
    cy.get(".comp-box-species-type").contains(species);

    //validate that all the checkboxes are there
    cy.get("#Assessed\\ public\\ safety\\ risk").should("exist");
    cy.get("#Assessed\\ health\\ as\\ per\\ animal\\ welfare\\ guidelines").should("exist");
    cy.get("#Assessed\\ known\\ conflict\\ history").should("exist");
    cy.get("#Confirmed\\ idenfication\\ of\\ offending\\ animals").should("exist");

    //validate that dropdowns exist
    cy.get("#action-required").should("exist");
    cy.get("#outcome-officer").should("exist");

    //validate the date picker exists
    cy.get("#complaint-outcome-date").should("exist");
  };

  function fillInAssessment (assessment: string[], actionRequired: string, officer: string, date: string, justification?: string) {

    Cypress._.times(assessment.length, (index) => {
        cy.get(assessment[index]).check(); 
    });

    cy.selectItemById(
          "action-required",
          actionRequired,
    );

    if(justification) {
      cy.selectItemById(
            "justification",
            justification,
      );
    }

    cy.selectItemById(
          "outcome-officer",
          officer,
    );

    cy.enterDateTimeInDatePicker("complaint-outcome-date", date);
      
    //click Save Button
    cy.get("#outcome-save-button").click();
  };

  function validateAssessment (assessment: string[], actionRequired: string, officer: string, date: string, justification?: string) {
    //Verify Fields exist
    Cypress._.times(assessment.length, (index) => {
      cy.get("#assessment-checkbox-div").should(($div) => {
        expect($div).to.contain.text(assessment[index]);
      });
    });

    cy.get("#action-required-div").should(($div) => {
        expect($div).to.contain.text(actionRequired);
    });

    if(justification) {
      cy.get("#justification-div").should(($div) => {
        expect($div).to.contain.text(justification);
      });
    }

    cy.get("#outcome-officer-div").should(($div) => {
        expect($div).to.contain.text(officer);
    });

    cy.get("#complaint-outcome-date-div").should(($div) => {
        expect($div).to.contain.text(date); //Don't know the month... could maybe make this a bit smarter but this is probably good enough.
    });
  };

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("it requires at least one assessment action on create", () => {
      cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-033066" , true);

      validateComplaint("23-033066", "Coyote");

      //click Save Button
      cy.get("#outcome-save-button").click();

      //validate error message
      cy.get(".error-message").should(($error) => {
          expect($error).to.contain.text("One or more assessment is required");
      });
  });

  it("it can save assessment where action is required", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-033066", true);

    validateComplaint("23-033066", "Coyote");

    //This is required to make the tests re-runnable.  It's not great because it means it will only run the first time.
    //If we ever get the ability to remove an assessment this test suite should be rewritten to remove this conditional
    //and to add a test at the end to delete the assessment.
    cy.get('.comp-outcome-report-complaint-assessment')
    .then(function($assessment) {
      if ($assessment.find('#outcome-save-button').length) {
        fillInAssessment (["#Assessed\\ public\\ safety\\ risk"], "Yes", "Olivia Benson", "01")
        validateAssessment (["Assessed public safety risk"], "Yes", "Olivia Benson", "01");
      } else {
        cy.log('Test was previously run. Skip the Test')
        this.skip()
      }
    })
  });

  it("it can cancel assessment edits", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-033066", true);

    validateComplaint("23-033066", "Coyote");

    //Remove this once the backend persistence is working.
    fillInAssessment (["#Assessed\\ public\\ safety\\ risk"], "Yes", "Olivia Benson", "01");

    cy.get("#assessment-edit-button").click();

    const newCheckboxForEdit = "#Assessed\\ health\\ as\\ per\\ animal\\ welfare\\ guidelines"
    cy.get(newCheckboxForEdit).should("exist");
    cy.get(newCheckboxForEdit).check();

    cy.get("#outcome-cancel-button").click();

    cy.get('.modal-footer > .btn-primary').click();

    cy.get("#assessment-checkbox-div").should(($div) => {
        expect($div).to.contain.text("Assessed public safety risk");
    });

    cy.get("#assessment-checkbox-div").should(($div) => {
        expect($div).to.not.contain.text("Assessed health as per animal welfare guidelines");
    });
  });

  it("it can edit an existing assessment", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-033066", true);

    validateComplaint("23-033066", "Coyote");

    //Remove this once the backend persistence is working.
    fillInAssessment (["#Assessed\\ public\\ safety\\ risk"], "Yes", "Olivia Benson", "01");

    cy.get("#assessment-edit-button").click();

    fillInAssessment (["#Assessed\\ health\\ as\\ per\\ animal\\ welfare\\ guidelines"], "No", "Jake Peralta", "01", "No public safety concern");

    validateAssessment (["Assessed public safety risk", "Assessed health as per animal welfare guidelines"], "No", "Jake Peralta", "01", "No public safety concern");
  });
});





