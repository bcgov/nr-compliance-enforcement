/*
Test to verify that the user is able to click the edit button
on the wildlife contacts details page and see all the inputs
*/
describe("Complaint Edit Page spec - Edit Allegation View", () => {
  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("Navigate to the Complaint Edit page & check inputs", () => {
    cy.navigateToAllegationEditScreen("23-006888");
    

    // Note: if the layout of this page changes, these selectors that use classes may break
    // Check the First Section inputs
    // Nature of Complaint - not on ERS tab
    cy.get("#nature-of-complaint-pair-id").should("not.exist");

    // Date / Time Logged
    cy.get("#date-time-pair-id label").should(($label) => {
      expect($label).to.contain.text("Date / Time Logged");
    });
    cy.get("#date-time-pair-id .comp-details-input").should("exist");

    // Species - not on ERS tab
    cy.get("#species-pair-id").should("not.exist");

    // Violation Type
    cy.get("#violation-type-pair-id label").should(($label) => {
      expect($label).to.contain.text("Violation Type");
    });
    cy.get("#violation-type-pair-id .comp-details-input").should("exist");
    

    // Last Updated
    cy.get("#last-updated-pair-id label").should(($label) => {
      expect($label).to.contain.text("Last Updated");
    });
    cy.get("#last-updated-pair-id .comp-details-input").should("exist");

    // Status
    cy.get("#status-pair-id label").should(($label) => {
      expect($label).to.contain.text("Status");
    });
    cy.get("#status-pair-id .comp-details-input").should("exist");

    // Created By
    cy.get("#created-by-pair-id label").should(($label) => {
      expect($label).to.contain.text("Created By");
    });
    cy.get("#created-by-pair-id div").should("exist");

    // Officer Assigned
    cy.get("#officer-assigned-pair-id label").should(($label) => {
      expect($label).to.contain.text("Officer Assigned");
    });
    cy.get("#officer-assigned-pair-id .comp-details-input").should("exist");

    // Check the Call Details inputs
    // Complaint Location
    cy.get("#complaint-location-pair-id label").should(($label) => {
      expect($label).to.contain.text("Complaint Location");
    });
    cy.get("#complaint-location-pair-id input").should("exist");

    // Incident Time
    cy.get("#incident-time-pair-id label").should(($label) => {
      expect($label).to.contain.text("Incident Time");
    });
    cy.get("#incident-time-pair-id input").should("exist");

    // Location Description
    cy.get("#location-description-pair-id label").should(($label) => {
      expect($label).to.contain.text("Location Description");
    });
    cy.get("#location-description-pair-id textarea").should("exist");

    // Violation In Progress
    cy.get("#violation-in-progress-pair-id label").should(($label) => {
      expect($label).to.contain.text("Violation in Progress");
    });
    cy.get("#violation-in-progress-pair-id div").should("exist");

    // Violation observed
    cy.get("#violation-observed-pair-id label").should(($label) => {
      expect($label).to.contain.text("Violation Observed");
    });
    cy.get("#violation-observed-pair-id div").should("exist");
    

    // Attractants - not on ERS
    cy.get("#attractants-pair-id input").should("not.exist");

    // X Coordinate
    cy.get("#x-coordinate-pair-id label").should(($label) => {
      expect($label).to.contain.text("X Coordinate");
    });
    cy.get("#x-coordinate-pair-id input").should("exist");

    // Y Coordinate
    cy.get("#y-coordinate-pair-id label").should(($label) => {
      expect($label).to.contain.text("Y Coordinate");
    });
    cy.get("#y-coordinate-pair-id input").should("exist");

    // Area/Community
    cy.get("#area-community-pair-id label").should(($label) => {
      expect($label).to.contain.text("Community");
    });
    cy.get("#area-community-pair-id input").should("exist");

    // Office
    cy.get("#office-pair-id label").should(($label) => {
      expect($label).to.contain.text("Office");
    });
    cy.get("#office-edit-readonly-id").should(($input) => {
      expect($input).to.have.prop("disabled", true);
    });

    // Zone
    cy.get("#zone-pair-id label").should(($label) => {
      expect($label).to.contain.text("Zone");
    });
    cy.get("#zone-edit-readonly-id").should(($input) => {
      expect($input).to.have.prop("disabled", true);
    });

    // Region
    cy.get("#region-pair-id label").should(($label) => {
      expect($label).to.contain.text("Region");
    });
    cy.get("#region-edit-readonly-id").should(($input) => {
      expect($input).to.have.prop("disabled", true);
    });

    // Check the Caller Information inputs
    // Name
    cy.get("#complaint-caller-info-name-label-id").should(($label) => {
      expect($label).to.contain.text("Name");
    });
    cy.get("#name-pair-id input").should("exist");

    // Primary Phone
    cy.get("#primary-phone-pair-id label").should(($label) => {
      expect($label).to.contain.text("Primary Phone");
    });
    cy.get("#primary-phone-pair-id input").should("exist");

    // Alternative 1 Phone
    cy.get("#alternate-1-phone-pair-id label").should(($label) => {
      expect($label).to.contain.text("Alternate 1 Phone");
    });
    cy.get("#alternate-1-phone-pair-id input").should("exist");

    // Alternative 2 Phone
    cy.get("#alternate-2-phone-pair-id label").should(($label) => {
      expect($label).to.contain.text("Alternate 2 Phone");
    });
    cy.get("#alternate-2-phone-pair-id input").should("exist");

    // Address
    cy.get("#address-pair-id label").should(($label) => {
      expect($label).to.contain.text("Address");
    });
    cy.get("#address-pair-id input").should("exist");

    // Email
    cy.get("#email-pair-id label").should(($label) => {
      expect($label).to.contain.text("Email");
    });
    cy.get("#email-pair-id input").should("exist");

    // Reffered by / Complaint Agency
    cy.get("#referred-pair-id label").should(($label) => {
      expect($label).to.contain.text("Referred by / Complaint Agency");
    });
    cy.get("#referred-pair-id input").should("exist");


    cy.get("#subject-of-complaint-pair-id label").should(($label) => {
      expect($label).to.contain.text("Description");
    });
    cy.get("#subject-of-complaint-pair-id textarea").should("exist");
    
  });

  it("it has a map on screen with a marker at the correct location", function () {
    cy.navigateToAllegationEditScreen("23-006888");
    cy.verifyMapMarkerExists();
  });

});