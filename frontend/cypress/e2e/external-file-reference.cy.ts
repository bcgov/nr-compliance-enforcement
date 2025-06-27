import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

const complaintTypes = [COMPLAINT_TYPES.HWCR, COMPLAINT_TYPES.ERS];

describe("External File Reference", () => {
  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  function enterReferenceNumber(number: string, shouldSave: boolean) {
    cy.get("#external-file-reference-number-input").click({ force: true });
    cy.get("#external-file-reference-number-input").clear().type(number, { delay: 0 });
    if (shouldSave) {
      cy.get("#external-file-reference-save-button").click();
    }
  }

  function navigateToComplaint(index: number) {
    if (COMPLAINT_TYPES.HWCR.includes(complaintTypes[index])) {
      cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-031226", true);
    } else {
      cy.navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-027918", true);
    }
  }

  function deleteReferenceNumber() {
    cy.get("#external-file-reference").then(function ($externalref) {
      if ($externalref.find("#external-file-reference-delete-button").length) {
        cy.get("#external-file-reference-delete-button").click();
        cy.get(".modal-footer > .btn-primary").click();
      } else {
        cy.log("No reference number to delete");
      }
    });
  }

  function validateFormIsEmpty() {
    cy.get("#external-file-reference-number-input").should("exist");
    cy.get("#external-file-reference-number-div").should(($div) => {
      expect($div).to.not.contain.text("111111");
      expect($div).to.not.contain.text("222222");
      expect($div).to.not.contain.text("333333");
    });
  }

  function setStatusOpen() {
    cy.get("#details-screen-update-status-button").filter(":visible").click({ force: true });
    cy.get("#complaint_status_dropdown").click();
    cy.get(".comp-select__option").contains("Open").click();
    cy.get("#update_complaint_status_button").click();
    cy.waitForSpinner();
  }

  //Core tests - try these on both complaint types

  Cypress._.times(complaintTypes.length, (index) => {
    it(`Can enter an external reference number: ${complaintTypes[index]}`, () => {
      //navigatetoComplaint
      navigateToComplaint(index);

      // ERS for COS need to be assigned before a COORS number can be saved
      if (complaintTypes[index] === COMPLAINT_TYPES.ERS) {
        setStatusOpen();
        cy.assignSelfToComplaint();
      }

      //make sure that there isn't an old one there from a failed run
      deleteReferenceNumber();

      //enter the number
      enterReferenceNumber("111111", true);

      //validate the number
      cy.get("#external-file-reference-number").should("have.text", "111111");

      // ERS for COS close when saved, so needs to be reopened for the next tests tests
      if (complaintTypes[index] === COMPLAINT_TYPES.ERS) {
        setStatusOpen();
      }
    });

    it(`Can edit an external reference number: ${complaintTypes[index]}`, () => {
      //navigatetoComplaint
      navigateToComplaint(index);

      //press Edit
      cy.get("#external-file-reference-edit-button").click();

      //enter the number
      enterReferenceNumber("222222", true);

      //validate the number
      cy.get("#external-file-reference-number").should("have.text", "222222");

      // ERS for COS close when saved, so needs to be reopened for the next tests tests
      if (complaintTypes[index] === COMPLAINT_TYPES.ERS) {
        setStatusOpen();
      }
    });

    it(`Can delete an external reference number: ${complaintTypes[index]}`, () => {
      //navigatetoComplaint
      navigateToComplaint(index);

      //press Delete
      deleteReferenceNumber();

      //validate the toast
      cy.get(".Toastify__toast-body").then(($toast) => {
        expect($toast).to.contain.text("Updates have been saved");
      });

      //validate that the empty input is showing
      validateFormIsEmpty();
    });
  });

  //Secondary tests - only need to try these on one complaint type
  it("Can cancel pending changes to a reference file number (new)", () => {
    //navigatetoComplaint
    navigateToComplaint(0);

    //attempt to delete if there is old data
    deleteReferenceNumber();

    //enter the number
    enterReferenceNumber("333333", false);

    cy.get("#external-file-reference").then(function ($externalref) {
      cy.get("#external-file-reference-cancel-button").click();
      cy.get(".modal-footer > .btn-primary").click();
    });

    //validate that the empty input is showing
    validateFormIsEmpty();
  });

  it("Will accept a alphanumeric reference file number with dashes", () => {
    //navigatetoComplaint
    navigateToComplaint(1);

    //make sure that there isn't an old one there from a failed run
    deleteReferenceNumber();

    //enter the number
    enterReferenceNumber("ABC-123-DEF", true);

    //validate the number
    cy.get("#external-file-reference-number").should("have.text", "ABC-123-DEF");

    // ERS for COS close when saved, so needs to be reopened for the next tests tests
    setStatusOpen();
  });

  it("Will not accept a reference file number with other special characters", () => {
    //navigatetoComplaint
    navigateToComplaint(1);

    //make sure that there isn't an old one there from a failed run
    deleteReferenceNumber();

    //enter the number
    enterReferenceNumber("444@BAD#NUMBER$44", false);

    //click save to trigger validation
    cy.get("#external-file-reference-save-button").click({ force: true });

    //validate the error message appears
    cy.hasErrorMessage(["#external-file-reference-number-div"]);
  });
});
