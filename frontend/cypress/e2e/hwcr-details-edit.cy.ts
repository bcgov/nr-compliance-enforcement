/*
Test to verify that the user is able to click the edit button
on the wildlife contacts details page and see all the inputs
*/
describe("Complaint Edit Page spec - Edit View", () => {
  before(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("Navigate to the Complaint Edit page & check inputs", () => {
    cy.visit("/");

    //-- click on HWCR tab
    cy.get("#hwcr-tab").click({ force: true });

    cy.wait(5000);

    //-- check to make sure there are items in the table
    cy.get("#comp-table")
      .find("tr")
      .then(({ length }) => {
        expect(length, "rows N").to.be.gt(0);
      });
    cy.wait(2000);
    cy.get(
      "#comp-table > tbody > tr:nth-child(2) td.comp-location-cell.comp-cell"
    ).click({ force: true });

    cy.window().scrollTo("top");

    cy.wait(3000);
    cy.get("#details_screen_edit_button").click({ force: true });
    cy.wait(3000);

    // Note: if the layout of this page changes, these selectors that use classes may break
    // Check the First Section inputs
    // Nature of Complaint
    cy.get(
      "#nature-of-complaint-label-id"
    )
      .should(($label) => {
        expect($label).to.have.text("Nature of Complaint");
      });

    // Date / Time Logged
    cy.get(
      "#date-time-logged-label-id"
    )
      .should(($label) => {
        expect($label).to.have.text("Date / Time Logged");
      });

    // Species
    cy.get(
      "#species-label-id"
    )
      .should(($label) => {
        expect($label).to.have.text("Species");
      });

    // Last Updated
    cy.get(
      "#last-updated-label-id"
    )
      .should(($label) => {
        expect($label).to.have.text("Last Updated");
      });

    // Status
    cy.get(
      "#status-label-id"
    )
      .should(($label) => {
        expect($label).to.have.text("Status");
      });

    // Created By
    cy.get(
      "#created-by-label-id"
    )
      .should(($label) => {
        expect($label).to.have.text("Created By");
      });


  });
});
