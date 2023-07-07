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
    cy.get("#details-screen-edit-button").click({ force: true });
    cy.wait(3000);

    // Note: if the layout of this page changes, these selectors that use classes may break
    // Check the First Section inputs
    // Nature of Complaint
    cy.get("#nature-of-complaint-pair-id label").should(($label) => {
      expect($label).to.have.text("Nature of Complaint");
    });
    cy.get("#nature-of-complaint-pair-id .comp-details-input").should("exist");

    // Date / Time Logged
    cy.get("#date-time-pair-id label").should(($label) => {
      expect($label).to.have.text("Date / Time Logged");
    });
    cy.get("#date-time-pair-id .comp-details-input").should("exist");

    // Species
    cy.get("#species-pair-id label").should(($label) => {
      expect($label).to.have.text("Species");
    });
    cy.get("#species-pair-id .comp-details-input").should("exist");

    // Last Updated
    cy.get("#last-updated-pair-id label").should(($label) => {
      expect($label).to.have.text("Last Updated");
    });
    cy.get("#last-updated-pair-id .comp-details-input").should("exist");

    // Status
    cy.get("#status-pair-id label").should(($label) => {
      expect($label).to.have.text("Status");
    });
    cy.get("#status-pair-id .comp-details-input").should("exist");

    // Created By
    cy.get("#created-by-pair-id label").should(($label) => {
      expect($label).to.have.text("Created By");
    });
    cy.get("#created-by-pair-id div").should("exist");

    // Officer Assigned
    cy.get("#officer-assigned-pair-id label").should(($label) => {
      expect($label).to.have.text("Officer Assigned");
    });
    cy.get("#officer-assigned-pair-id .comp-details-input").should("exist");

    // Check the Call Details inputs
    // Complaint Location
    cy.get("#complaint-location-pair-id label").should(($label) => {
      expect($label).to.have.text("Complaint Location");
    });
    cy.get("#complaint-location-pair-id input").should("exist");

    // Incident Time
    cy.get("#incident-time-pair-id label").should(($label) => {
      expect($label).to.have.text("Incident Time");
    });
    cy.get("#incident-time-pair-id input").should("exist");

    // Location Description
    cy.get("#location-description-pair-id label").should(($label) => {
      expect($label).to.have.text("Location Description");
    });
    cy.get("#location-description-pair-id textarea").should("exist");

    // Attractants
    cy.get("#attractants-pair-id label").should(($label) => {
      expect($label).to.have.text("Attractants");
    });
    cy.get("#attractants-pair-id input").should("exist");

    // X Coordinate
    cy.get("#x-coordinate-pair-id label").should(($label) => {
      expect($label).to.have.text("X Coordinate");
    });
    cy.get("#x-coordinate-pair-id input").should("exist");

    // Y Coordinate
    cy.get("#y-coordinate-pair-id label").should(($label) => {
      expect($label).to.have.text("Y Coordinate");
    });
    cy.get("#y-coordinate-pair-id input").should("exist");

    // Area/Community
    cy.get("#area-community-pair-id label").should(($label) => {
      expect($label).to.have.text("Area/Community");
    });
    cy.get("#area-community-pair-id input").should("exist");

    // Office
    cy.get("#office-pair-id label").should(($label) => {
      expect($label).to.have.text("Office");
    });
    cy.get("#office-edit-readonly-id").should(($input) => {
      expect($input).to.have.prop("disabled", true);
    });

    // Zone
    cy.get("#zone-pair-id label").should(($label) => {
      expect($label).to.have.text("Zone");
    });
    cy.get("#zone-edit-readonly-id").should(($input) => {
      expect($input).to.have.prop("disabled", true);
    });

    // Region
    cy.get("#region-pair-id label").should(($label) => {
      expect($label).to.have.text("Region");
    });
    cy.get("#region-edit-readonly-id").should(($input) => {
      expect($input).to.have.prop("disabled", true);
    });

    // Check the Caller Information inputs
    // Name
    cy.get("#complaint-caller-info-name-label-id").should(($label) => {
      expect($label).to.have.text("Name");
    });
    cy.get("#name-pair-id input").should("exist");

    // Primary Phone
    cy.get("#primary-phone-pair-id label").should(($label) => {
      expect($label).to.have.text("Primary Phone");
    });
    cy.get("#primary-phone-pair-id input").should("exist");

    // Alternative 1 Phone
    cy.get("#alternate-1-phone-pair-id label").should(($label) => {
      expect($label).to.have.text("Alternate 1 Phone");
    });
    cy.get("#alternate-1-phone-pair-id input").should("exist");

    // Alternative 2 Phone
    cy.get("#alternate-2-phone-pair-id label").should(($label) => {
      expect($label).to.have.text("Alternate 2 Phone");
    });
    cy.get("#alternate-2-phone-pair-id input").should("exist");

    // Address
    cy.get("#address-pair-id label").should(($label) => {
      expect($label).to.have.text("Address");
    });
    cy.get("#address-pair-id input").should("exist");

    // Email
    cy.get("#email-pair-id label").should(($label) => {
      expect($label).to.have.text("Email");
    });
    cy.get("#email-pair-id input").should("exist");

    // Reffered by / Complaint Agency
    cy.get("#referred-pair-id label").should(($label) => {
      expect($label).to.have.text("Referred by / Complaint Agency");
    });
    cy.get("#referred-pair-id input").should("exist");
  });
});