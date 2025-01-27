//--
//-- complaint export tests, verify that user can export complaint
//-- to a pdf document

import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";
const fns = require("date-fns");
//--
describe("Export Complaint Functionality", () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  afterEach(() => {
    cy.deleteDownloadsFolder();
  });

  Cypress._.times(complaintTypes.length, (index) => {
    it(`Can export complaint: ${index === 0 ? "HWCR" : "ERS"}`, () => {
      let fileName = "";

      if ("#hwcr-tab".includes(complaintTypes[index])) {
        cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", true);
        const date = cy.get("div#complaint-date-logged");
        date.invoke("text").then((dateText) => {
          const formattedDate = fns.format(new Date(dateText), "yyMMdd");
          fileName = `HWC_23-000076_${formattedDate}.pdf`;
        });
      } else {
        cy.navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-006888", true);
        const date = cy.get("div#complaint-date-logged");
        date.invoke("text").then((dateText) => {
          const formattedDate = fns.format(new Date(dateText), "yyMMdd");
          fileName = `EC_23-006888_${formattedDate}.pdf`;
        });
      }
      cy.get("#details-screen-export-complaint-button").click({ force: true });
      cy.verifyDownload(fileName, { timeout: 10000 });
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
