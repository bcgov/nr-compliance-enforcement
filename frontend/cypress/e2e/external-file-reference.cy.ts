import { truncateSync } from "fs";
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

  //Core tests - try these on both complaint types

  Cypress._.times(complaintTypes.length, (index) => {
    it(`Can enter an external reference number: ${complaintTypes[index]}`, () => {
      //navigatetoComplaint
      navigateToComplaint(index);

      //make sure that there isn't an old one there from a failed run
      deleteReferenceNumber();

      //enter the number
      enterReferenceNumber("111111", true);

      //validate the number
      cy.get("#external-file-reference-number-div").should(($div) => {
        expect($div).to.contain.text("111111");
      });
    });

    it(`Can edit an external reference number: ${complaintTypes[index]}`, () => {
      //navigatetoComplaint
      navigateToComplaint(index);

      //press Edit
      cy.get("#external-file-reference-edit-button").click();

      //enter the number
      enterReferenceNumber("222222", true);

      //validate the number
      cy.get("#external-file-reference-number-div").should(($div) => {
        expect($div).to.contain.text("222222");
      });
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

  it("Will not accept a reference file number with letters", () => {
    //navigatetoComplaint
    navigateToComplaint(1);

    //make sure that there isn't an old one there from a failed run
    deleteReferenceNumber();

    //enter the number
    enterReferenceNumber("444BADNUMBER44", true);

    //validate the error message
    cy.hasErrorMessage(["#external-file-reference-number-div"]);
  });
});
