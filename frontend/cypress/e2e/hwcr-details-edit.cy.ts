import COMPLAINT_TYPES from "@apptypes/app/complaint-types";

/*
Test to verify that the user is able to click the edit button
on the wildlife contacts details page and see all the inputs
*/
describe("Complaint Edit Page spec - Edit View", () => {
  const originalCallDetails = {
    description:
      "Calling to report a black bear getting into the garbage on a regular basis. Also wanted to confirm that residents of the trailer home park could call to report sightings themselves",
    location: "644 Pine Street",
    locationDescription: "",
    incidentDateDay: "11",
    attractants: ["Garbage", "Freezer", "Compost"],
    attractantCodes: ["GARBAGE", "FREEZER", "COMPOST"],
    attratantsIndex: [7, 6, 4],
    xCoord: "",
    yCoord: "",
    community: "Kamloops",
    office: "Kamloops",
    zone: "Thompson Nicola",
    region: "Thompson Cariboo",
    communityIndex: 799,
    communityCode: "KAMLOOPS",
    officeCode: "KMLPS",
    zoneCode: "TMPSNNCLA",
    regionCode: "TMPSNCRBO",
    methodComplaintReceived: "Observed in field",
    natureOfComplaint: "Aggressive - present/recent",
    natureOfComplaintIndex: 1,
    species: "Black Bear",
    speciesIndex: 1,
    status: "Open",
    statusIndex: 0,
    assigned: "None",
    assignedIndex: 0,
  };

  const originalCallerInformation = {
    name: "Phoebe",
    phone: "(250) 556-1234",
    phoneInput: "2505561234",
    secondary: "",
    secondaryInput: "",
    alternate: "",
    alternateInput: "",
    address: "437 Fake St",
    email: "tester@gmail.com",
    reported: "Conservation Officer Service",
    reportedCode: "COS",
    reportedIndex: 3,
  };

  const editCallDetails = {
    description:
      "Calling to report a black bear getting into the garbage on a regular basis. Also wanted to confirm that residents of the trailer home park could call to report sightings themselves ---- testing",
    location: "644 Pine Street ---- testing",
    locationDescription: " ---- testing",
    incidentDateDay: "01",
    attractants: ["Livestock", "BBQ", "Beehive"],
    attractantCodes: ["LIVESTCK", "BBQ", "BEEHIVE"],
    attratantsIndex: [9, 0, 0],
    xCoord: "-118",
    yCoord: "49",
    community: "Blaeberry",
    office: "Golden",
    zone: "Columbia/Kootenay",
    region: "Kootenay",
    communityIndex: 0,
    communityCode: "Blaeberry",
    officeCode: "GLDN",
    zoneCode: "CLMBAKTNY",
    regionCode: "KTNY",
    methodComplaintReceived: "BC wildlife federation app",
    natureOfComplaint: "Dead wildlife - no violation suspected",
    natureOfComplaintIndex: 5,
    species: "Coyote",
    speciesIndex: 3,
    status: "Closed",
    statusIndex: 1,
    assigned: "Kot, Steve",
    assignedIndex: 1,
  };

  const editCallerInformation = {
    name: "Phoebe ---- testing",
    phone: "(250) 555-5555",
    phoneInput: "2505555555",
    secondary: "(250) 666-6666",
    secondaryInput: "2506666666",
    alternate: "(250) 666-8888",
    alternateInput: "2506668888",
    address: "437 Fake St ---- testing",
    email: "tester512@gmail.com",
    reported: "Department of Fisheries and Oceans",
    reportedCode: "DFO",
    reportedIndex: 1,
  };

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("Navigate to the Complaint Edit page & change data, save, navigate to read-only", function () {
    //start edit
    cy.navigateToEditScreen(COMPLAINT_TYPES.HWCR, "23-000076", true);
    cy.get("#caller-name-id").click({ force: true }).clear().type(editCallerInformation.name);
    cy.get("#complaint-address-id").click({ force: true }).clear().type(editCallerInformation.address);
    cy.get("#complaint-email-id").click({ force: true }).clear().type(editCallerInformation.email);

    cy.get("#caller-primary-phone-id").click({ force: true });
    cy.get("#caller-primary-phone-id").clear();
    cy.get("#caller-primary-phone-id").typeAndTriggerChange(editCallerInformation.phoneInput);

    cy.get("#caller-info-secondary-phone-id")
      .click({ force: true })
      .clear()
      .typeAndTriggerChange(editCallerInformation.secondaryInput);
    cy.get("#caller-info-alternate-phone-id")
      .click({ force: true })
      .clear()
      .typeAndTriggerChange(editCallerInformation.alternateInput);

    cy.selectItemById("reported-select-id", editCallerInformation.reported);

    cy.get("#location-edit-id").click({ force: true }).click({ force: true });
    cy.get("#location-edit-id").click({ force: true }).clear().type(editCallDetails.location);
    cy.get("#complaint-location-description-textarea-id").click({
      force: true,
    });
    cy.get("#complaint-location-description-textarea-id")
      .clear()
      .type(editCallDetails.locationDescription, { delay: 0 });
    cy.get("#complaint-description-textarea-id").click({ force: true });
    cy.get("#complaint-description-textarea-id")
      .click({ force: true })
      .clear()
      .type(editCallDetails.description, { delay: 0 });
    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.enterDateTimeInDatePicker("complaint-incident-time", "01", "13", "45");

    cy.get(".comp-select__multi-value__remove").first().click({ force: true });
    cy.get(".comp-select__multi-value__remove").first().click({ force: true });
    cy.get(".comp-select__multi-value__remove").first().click({ force: true });

    cy.selectItemById("attractants-select-id", editCallDetails.attractants[0]);
    cy.selectItemById("attractants-select-id", editCallDetails.attractants[1]);
    cy.selectItemById("attractants-select-id", editCallDetails.attractants[2]);

    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.selectItemById("community-select-id", editCallDetails.community);

    cy.selectItemById("complaint-received-method-select-id", editCallDetails.methodComplaintReceived);

    cy.selectItemById("nature-of-complaint-select-id", editCallDetails.natureOfComplaint);

    cy.selectItemById("species-select-id", editCallDetails.species);

    cy.get("#officer-assigned-select-id").scrollIntoView();
    cy.selectItemById("officer-assigned-select-id", editCallDetails.assigned);

    cy.get("#details-screen-cancel-save-button-top").click({ force: true });
    //end edit

    //start checking edit changes saved
    cy.waitForSpinner();

    cy.get('dd[id="comp-details-name"]').contains(editCallerInformation.name);
    cy.get('dd[id="comp-details-address"]').contains(editCallerInformation.address);
    cy.get('dd[id="comp-details-email"]').contains(editCallerInformation.email);
    cy.get('dd[id="comp-details-phone"]').contains(editCallerInformation.phone);
    cy.get('dd[id="comp-details-phone-1"]').should(($el) => {
      expect($el.text().trim()).equal(editCallerInformation.secondary);
    });
    cy.get('dd[id="comp-details-phone-2"]').should(($el) => {
      expect($el.text().trim()).equal(editCallerInformation.alternate);
    });
    cy.get('dd[id="comp-details-reported"]').contains(editCallerInformation.reported);
    cy.get('dd[id="comp-details-email"]').contains(editCallerInformation.email);
    cy.get('dd[id="comp-details-location"]').contains(editCallDetails.location);
    cy.get('dd[id="comp-details-location-description"]').contains(editCallDetails.locationDescription);

    cy.get('dd[id="complaint-incident-date-time"]').contains(editCallDetails.incidentDateDay);

    cy.get('pre[id="comp-details-description"]').contains(editCallDetails.description);

    cy.get('dd[id="comp-details-community"]').contains(editCallDetails.community);

    cy.get('dd[id="comp-details-office"]').contains(editCallDetails.office);

    cy.get('dd[id="comp-details-zone"]').contains(editCallDetails.zone);

    cy.get('dd[id="comp-details-region"]').contains(editCallDetails.region);

    cy.get('dd[id="comp-method-complaint-received"]').contains(editCallDetails.methodComplaintReceived);

    cy.get(".comp-attractant-badge").then(function ($defaultValue) {
      expect($defaultValue).to.contain("Livestock");
      expect($defaultValue).to.contain("BBQ");
      expect($defaultValue).to.contain("Beehive");
    });
    //end checking edit changes saved
  });

  it("Puts everything back to the original details", function () {
    //start reverting changes
    cy.navigateToEditScreen(COMPLAINT_TYPES.HWCR, "23-000076", true);
    cy.get("#caller-name-id").click({ force: true }).clear().type(originalCallerInformation.name);
    cy.get("#complaint-address-id").click({ force: true }).clear().type(originalCallerInformation.address);
    cy.get("#complaint-email-id").click({ force: true }).clear().type(originalCallerInformation.email);

    cy.get("#caller-primary-phone-id").click({ force: true });
    cy.get("#caller-primary-phone-id").clear();
    cy.get("#caller-primary-phone-id").typeAndTriggerChange(originalCallerInformation.phoneInput);

    cy.get("#caller-info-secondary-phone-id")
      .click({ force: true })
      .clear()
      .typeAndTriggerChange(originalCallerInformation.secondaryInput);
    cy.get("#caller-info-alternate-phone-id")
      .click({ force: true })
      .clear()
      .typeAndTriggerChange(originalCallerInformation.alternateInput);

    cy.selectItemById("reported-select-id", originalCallerInformation.reported);

    cy.get("#location-edit-id").click({ force: true });
    cy.get("#location-edit-id").clear().type(originalCallDetails.location);
    cy.get("#complaint-location-description-textarea-id").click({
      force: true,
    });
    cy.get("#complaint-location-description-textarea-id").click({ force: true }).clear(); //original blank
    cy.get("#complaint-description-textarea-id").click({ force: true });
    cy.get("#complaint-description-textarea-id").clear().type(originalCallDetails.description, { delay: 0 });
    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.enterDateTimeInDatePicker("complaint-incident-time", "11", "13", "45");

    cy.get(".comp-select__multi-value__remove").first().click({ force: true });
    cy.get(".comp-select__multi-value__remove").first().click({ force: true });
    cy.get(".comp-select__multi-value__remove").first().click({ force: true });

    cy.selectItemById("attractants-select-id", originalCallDetails.attractants[0]);
    cy.selectItemById("attractants-select-id", originalCallDetails.attractants[1]);
    cy.selectItemById("attractants-select-id", originalCallDetails.attractants[2]);

    cy.selectItemById("community-select-id", originalCallDetails.community);

    cy.selectItemById("complaint-received-method-select-id", originalCallDetails.methodComplaintReceived);

    cy.selectItemById("nature-of-complaint-select-id", originalCallDetails.natureOfComplaint);

    cy.selectItemById("species-select-id", originalCallDetails.species);

    cy.get("#officer-assigned-select-id").scrollIntoView();
    cy.selectItemById("officer-assigned-select-id", originalCallDetails.assigned);

    cy.get("#details-screen-cancel-save-button-top").click({ force: true });
    //end reverting changes
    //start verifying changes are reverted
    cy.waitForSpinner();

    cy.get('dd[id="comp-details-name"]').contains(originalCallerInformation.name);
    cy.get('dd[id="comp-details-address"]').contains(originalCallerInformation.address);
    cy.get('dd[id="comp-details-email"]').contains(originalCallerInformation.email);

    cy.get('dd[id="comp-details-phone"]').contains(originalCallerInformation.phone);
    cy.get('dd[id="comp-details-phone-2"]').should(($el) => {
      expect($el.text().trim()).equal(originalCallerInformation.secondary);
    });
    cy.get('dd[id="comp-details-phone-3"]').should(($el) => {
      expect($el.text().trim()).equal(originalCallerInformation.alternate);
    });

    cy.get('dd[id="comp-details-reported"]').contains(originalCallerInformation.reported);

    cy.get('dd[id="comp-details-location"]').contains(originalCallDetails.location);
    cy.get('dd[id="comp-details-location-description"]').should("have.value", originalCallDetails.locationDescription);

    cy.get('dd[id="complaint-incident-date-time"]').contains(originalCallDetails.incidentDateDay);

    cy.get('pre[id="comp-details-description"]').contains(originalCallDetails.description);

    cy.get('dd[id="comp-details-community"]').contains(originalCallDetails.community);

    cy.get('dd[id="comp-details-office"]').contains(originalCallDetails.office);

    cy.get('dd[id="comp-details-zone"]').contains(originalCallDetails.zone);

    cy.get('dd[id="comp-details-region"]').contains(originalCallDetails.region);

    cy.get('dd[id="comp-method-complaint-received"]').contains(originalCallDetails.methodComplaintReceived);

    cy.get(".comp-attractant-badge").then(function ($defaultValue) {
      expect($defaultValue).to.contain("Garbage");
      expect($defaultValue).to.contain("Freezer");
      expect($defaultValue).to.contain("Compost");
    });
    //end verifying changes are reverted
  });

  it("Navigate to the Complaint Edit page & check inputs", function () {
    cy.navigateToEditScreen(COMPLAINT_TYPES.HWCR, "23-007023", true);

    // Note: if the layout of this page changes, these selectors that use classes may break
    // Check the First Section inputs
    // Nature of Complaint
    cy.get("#nature-of-complaint-pair-id label").should(($label) => {
      expect($label).to.contain.text("Nature of Complaint");
    });
    cy.get("#nature-of-complaint-pair-id .comp-details-input").should("exist");

    // Species
    cy.get("#species-pair-id label").should(($label) => {
      expect($label).to.contain.text("Species");
    });
    cy.get("#species-pair-id .comp-details-input").should("exist");

    // Officer Assigned
    cy.get("#officer-assigned-pair-id label").should(($label) => {
      expect($label).to.contain.text("Officer Assigned");
    });
    cy.get("#officer-assigned-pair-id .comp-details-input").contains("None");

    // Check the Call Details inputs
    // Complaint Location
    cy.get("#complaint-location-pair-id label").should(($label) => {
      expect($label).to.contain.text("Complaint Location");
    });
    cy.get("#complaint-location-pair-id input").should("exist");

    // Incident Time
    cy.get("#incident-time-pair-id label").should(($label) => {
      expect($label).to.contain.text("Incident Date/Time");
    });
    cy.get("#incident-time-pair-id input").should("exist");

    // Location Description
    cy.get("#location-description-pair-id label").should(($label) => {
      expect($label).to.contain.text("Location Description");
    });
    cy.get("#location-description-pair-id textarea").should("exist");

    // Attractants
    cy.get("#attractants-pair-id label").should(($label) => {
      expect($label).to.contain.text("Attractants");
    });
    cy.get("#attractants-pair-id input").should("exist");

    // X Coordinate
    cy.get('[for="input-x-coordinate"]').should(($label) => {
      expect($label).to.contain.text("Longitude");
    });
    cy.get("#input-x-coordinate").should("exist");

    // Y Coordinate
    cy.get('[for="input-y-coordinate"]').should(($label) => {
      expect($label).to.contain.text("Latitude");
    });
    cy.get("#input-y-coordinate").should("exist");

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

    //Method Complaint Received
    cy.get('[for="complaint-received-method-label-id"]').should(($label) => {
      expect($label).to.contain.text("Method complaint was received");
    });
    cy.get("#complaint-received-method-pair-id").should("exist");

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
    cy.get("#secondary-phone-pair-id label").should(($label) => {
      expect($label).to.contain.text("Alternate Phone 1");
    });
    cy.get("#secondary-phone-pair-id input").should("exist");

    // Alternative 2 Phone
    cy.get("#alternate-phone-pair-id label").should(($label) => {
      expect($label).to.contain.text("Alternate Phone 2");
    });
    cy.get("#alternate-phone-pair-id input").should("exist");

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
    cy.get("#reported-pair-id label").should(($label) => {
      expect($label).to.contain.text("Organization Reporting the Complaint");
    });
    cy.get("#reported-pair-id input").should("exist");
  });

  it("it has a map on screen with a marker at the correct location", function () {
    cy.navigateToEditScreen(COMPLAINT_TYPES.HWCR, "23-032525", true);
    cy.verifyMapMarkerExists(true);
    cy.get(".comp-complaint-details-alert").should("not.exist");
  });

  it("it has a map on screen with no marker", function () {
    cy.navigateToEditScreen(COMPLAINT_TYPES.HWCR, "23-032527", true);
    cy.verifyMapMarkerExists(false);
    cy.get(".comp-complaint-details-alert").should("exist");
  });
});
