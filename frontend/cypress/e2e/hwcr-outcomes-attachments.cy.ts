import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

describe("Display HWCR Outcome Attachments", () => {
  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("outcomes attachments is displayed", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", true);

    cy.verifyAttachmentsCarousel(true, "outcome_attachments_div_id");
  });
});
