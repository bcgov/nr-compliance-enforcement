// cy.kcLogout().kcLogin(Roles.CEEB);
import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";
import { Roles } from "../../src/app/types/app/roles";

/**
 * Test to verify that collaborators can be added to a complaint,
 * and that the correct permissions are applied to the collaborator.
 */
const COMPLAINT_ID = "23-031396";
describe("Complaint collaborators", () => {
  before(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("Add a collaborator from Parks to an HWCR complaint", function () {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, COMPLAINT_ID, true);

    cy.get("#details-screen-manage-collaborators-button").click({ force: true });
    cy.selectItemById("select-agency", "Parks");
    cy.selectItemById("select-officer", "TestAcct 3, ENV");
    cy.contains("button", "Add collaborator").click({ force: true });
    cy.contains("button", "Close").click({ force: true });
    cy.get("#comp-header-collaborator-cout").should("contain", "+1");
  });
});
describe("Complaint collaborators have the correct permissions", () => {
  before(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin(Roles.PARKS);
  });
  it("Verifies collaborators have the correct permissions", function () {
    cy.get(`.pagination_total`).should("exist");
    cy.visit(`${Cypress.config().baseUrl}/complaint/HWCR/${COMPLAINT_ID}`);
    cy.contains("COS added you to this complaint as a collaborator").should("exist");
    cy.get("#details-screen-update-status-button").should("be.disabled");
  });
});

describe("Complaint collaborators have the correct permissions", () => {
  before(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });
  it("Verifies collaborators have the correct permissions", function () {
    // Logout and login as regular user
    cy.kcLogout().kcLogin();

    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, COMPLAINT_ID, true);
    cy.get("#details-screen-manage-collaborators-button").click({ force: true });
    cy.contains("button", "Remove user").click({ force: true });
    cy.contains("button", "Close").click({ force: true });
  });
});
