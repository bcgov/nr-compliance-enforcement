//--
//-- complaint export tests, verify that user can export complaint
//-- to a pdf document

import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";
const fns = require("date-fns");
//--
describe("Complaint List Functionality", () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  afterEach(() => {
    cy.deleteDownloadsFolder();
  });

  Cypress._.times(complaintTypes.length, (index) => {
    it("Can export complaint", () => {
      let fileName = "";

      const date = fns.format(new Date(), "yyyy-MM-dd");

      if ("#hwcr-tab".includes(complaintTypes[index])) {
        fileName = `Complaint-23-000076-HWCR-${date}.pdf`;
        cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", true);
      } else {
        fileName = `Complaint-23-006888-ERS-${date}.pdf`;
        cy.navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-006888", true);
      }

      cy.get("#details-screen-export-complaint-button").click({ force: true });
      cy.verifyDownload(fileName, { timeout: 5000 });
    });
  });
});

/*
describe("Complaint Change Assignee spec - Details View", () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  Cypress._.times(complaintTypes.length, (index) => {
    it("Changes assignee of a complaint", () => {
      if ("#hwcr-tab".includes(complaintTypes[index])) {
        cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", true);
      } else {
        cy.navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-006888", true);
      }

      cy.get("#details-screen-assign-button").click({ force: true });

      // self assign the complaint
      cy.get("#self_assign_button").click({ force: true });
      cy.waitForSpinner();
      cy.get("#comp-details-assigned-officer-name-text-id").contains("ENV TestAcct").should("exist");
    });
  });
});
*/
