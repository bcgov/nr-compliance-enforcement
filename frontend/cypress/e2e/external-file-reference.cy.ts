import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

const complaintTypes = [COMPLAINT_TYPES.HWCR, COMPLAINT_TYPES.ERS];

describe("External File Reference", () => {
  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  //Core tests - try these on both complaint types
  Cypress._.times(complaintTypes.length, (index) => {
    it(`Can enter an external reference number: ${complaintTypes[index]}`, () => {});

    it(`Can edit an external reference number: ${complaintTypes[index]}`, () => {});

    it(`Can delete an external reference number: ${complaintTypes[index]}`, () => {});
  });

  //Secondary tests - only need to try these on one complaint type
  it("Can cancel pending changes to a reference file number", () => {});

  it("Will not accept a reference file number with letters", () => {});
});
