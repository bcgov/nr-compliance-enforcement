import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

const originalCallDetails = {
  description:
    "Caller was involved in an altercation yesterday with a person who was exceeding the Callers understanding of the limit.  SUBs were attempting to catch 5 fish, of each type, each person (total 20.) SUBs male and their wife.  Caller requesting CO clarification regarding fish quotas for region 3.  Caller has contacted front counter BC, who reported the answer to COS.",
  location: "Keefes Landing Rd and Danskin Rd",
  locationDescription: "tester call description 8",
  incidentDateDay: "11",
  xCoord: "-127.4810142",
  yCoord: "50.4217838",
  community: "Danskin",
  office: "Burns Lake",
  zone: "Nechako-Lakes",
  region: "Omineca",
  communityIndex: 252,
  communityCode: "DANSKIN",
  officeCode: "BURNSLK",
  zoneCode: "NCHKOLKS",
  regionCode: "OMINECA",
  methodComplaintReceived: "Observed in field",
  status: "Open",
  statusIndex: 0,
  assigned: "None",
  assignedIndex: 0,
  violationType: "Other",
  violationIndex: 6,
  violationInProgressIndex: 0,
  violationInProgressString: "Yes",
  violationObservedIndex: 1,
  violationObservedString: "No",
};

const originalCallerInformation = {
  name: "Kelsey",
  phone: "",
  phoneInput: "",
  secondary: "",
  secondaryInput: "",
  alternate: "",
  alternateInput: "",
  address: "135 fake st",
  email: "",
  reported: "Department of Fisheries and Oceans",
  reportedCode: "DFO",
  reportedIndex: 2,
  witnessDetails: "",
};

const editCallDetails = {
  description:
    "Caller was involved in an altercation yesterday with a person who was exceeding the Callers understanding of the limit.  SUBs were attempting to catch 5 fish, of each type, each person (total 20.) SUBs male and their wife.  Caller requesting CO clarification regarding fish quotas for region 3.  Caller has contacted front counter BC, who reported the answer to COS. ---- testing",
  location: "Keefes Landing Rd and Danskin Rd ---- testing",
  locationDescription: "tester call description 8 ---- testing",
  incidentDateDay: "01",
  xCoord: "-118",
  yCoord: "49",
  community: "Blaeberry",
  office: "Golden",
  zone: "Columbia/Kootenay",
  region: "Kootenay",
  methodComplaintReceived: "BC wildlife federation app",
  communityIndex: 0,
  communityCode: "Blaeberry",
  officeCode: "GLDN",
  zoneCode: "CLMBAKTNY",
  regionCode: "KTNY",
  status: "Closed",
  statusIndex: 1,
  assigned: "Kot, Steve",
  assignedIndex: 1,
  violationInProgressIndex: 1,
  violationInProgressString: "No",
  violationObservedIndex: 0,
  violationObservedString: "Yes",
  violationType: "Boating",
  violationIndex: 1,
};

const editCallerInformation = {
  name: "Phoebe ---- testing",
  phone: "(250) 555-5555",
  phoneInput: "2505555555",
  secondary: "(250) 666-6666",
  secondaryInput: "2506666666",
  alternate: "(250) 666-8888",
  alternateInput: "2506668888",
  address: "135 fake st ---- testing",
  email: "tester512@gmail.com",
  reported: "Conservation Officer Service",
  reportedCode: "COS",
  reportedIndex: 1,
  witnessDetails: "----- testing",
};

/*
Test to verify that the user is able to click the edit button
on the wildlife contacts details page and see all the inputs
*/
describe("Complaint Edit Page spec - Edit Allegation View", () => {
  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("Navigate to the Complaint Edit page & change data, save, navigate to read-only, return to edit and reset data", function () {
    //start edit
    cy.navigateToEditScreen(COMPLAINT_TYPES.ERS, "23-006888", false);
    cy.get("#caller-name-id").click({ force: true }).click({ force: true }).clear().type(editCallerInformation.name);
    cy.get("#complaint-address-id").click({ force: true }).clear().type(editCallerInformation.address);
    cy.get("#complaint-email-id").click({ force: true }).clear().type(editCallerInformation.email);

    cy.get("#caller-primary-phone-id").click({ force: true }).click({ force: true });

    cy.get("#caller-primary-phone-id").click({ force: true }).clear();
    cy.get("#caller-primary-phone-id")
      .click({ force: true })
      .clear()
      .typeAndTriggerChange(editCallerInformation.phoneInput);

    cy.get("#caller-info-secondary-phone-id")
      .click({ force: true })
      .clear()
      .typeAndTriggerChange(editCallerInformation.secondaryInput);
    cy.get("#caller-info-alternate-phone-id")
      .click({ force: true })
      .clear()
      .typeAndTriggerChange(editCallerInformation.alternateInput);

    cy.selectItemById("reported-select-id", editCallerInformation.reported);

    cy.get("#complaint-witness-details-textarea-id")
      .click({ force: true })
      .clear()
      .type(editCallerInformation.witnessDetails, { delay: 0 });

    cy.get("#location-edit-id").click({ force: true });
    cy.get("#location-edit-id").click({ force: true }).clear().type(editCallDetails.location);
    cy.get("#complaint-location-description-textarea-id").click({
      force: true,
    });
    cy.get("#complaint-location-description-textarea-id")
      .click({ force: true })
      .clear()
      .type(editCallDetails.locationDescription, { delay: 0 });
    cy.get("#complaint-description-textarea-id").click({ force: true });
    cy.get("#complaint-description-textarea-id")
      .click({ force: true })
      .clear()
      .type(editCallDetails.description, { delay: 0 });
    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.enterDateTimeInDatePicker("complaint-incident-time", "01", "13", "45");

    cy.selectItemById("community-select-id", editCallDetails.community);

    cy.selectItemById("complaint-received-method-select-id", editCallDetails.methodComplaintReceived);

    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.selectItemById("violation-in-progress-select-id", editCallDetails.violationInProgressString);

    cy.selectItemById("violation-observed-select-id", editCallDetails.violationObservedString);

    cy.get("#officer-assigned-select-id").scrollIntoView();
    cy.selectItemById("officer-assigned-select-id", editCallDetails.assigned);

    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.selectItemById("violation-type-select-id", editCallDetails.violationType);

    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.get("#details-screen-cancel-save-button-top").click({ force: true });
    //end edit

    //start checking edit changes saved
    cy.waitForSpinner();

    cy.get('dd[id="comp-details-name"]').contains(editCallerInformation.name);
    cy.get('dd[id="comp-details-address"]').contains(editCallerInformation.address);
    cy.get('dd[id="comp-details-email"]').contains(editCallerInformation.email);
    cy.get('dd[id="comp-details-phone"]').should(($el) => {
      expect($el.text().trim()).equal(editCallerInformation.phone);
    });
    cy.get('dd[id="comp-details-phone-1"]').should(($el) => {
      expect($el.text().trim()).equal(editCallerInformation.secondary);
    });
    cy.get('dd[id="comp-details-phone-2"]').should(($el) => {
      expect($el.text().trim()).equal(editCallerInformation.alternate);
    });
    cy.get('dd[id="comp-details-reported"]').contains(editCallerInformation.reported);
    cy.get('dd[id="comp-details-email"]').contains(editCallerInformation.email);

    cy.get('pre[id="comp-details-witness-details"]').should(($el) => {
      expect($el.text().trim()).equal(editCallerInformation.witnessDetails);
    });

    cy.get('dd[id="comp-details-location"]').contains(editCallDetails.location);
    cy.get('dd[id="comp-details-location-description"]').contains(editCallDetails.locationDescription);

    cy.get('dd[id="complaint-incident-date-time"]').contains(editCallDetails.incidentDateDay);

    cy.get('pre[id="comp-details-description"]').should(($el) => {
      expect($el.text().trim()).equal(editCallDetails.description);
    });

    cy.get('dd[id="comp-details-community"]').contains(editCallDetails.community);

    cy.get('dd[id="comp-method-complaint-received"]').contains(editCallDetails.methodComplaintReceived);

    cy.get('dd[id="comp-details-violation-in-progress"]').contains(editCallDetails.violationInProgressString);

    cy.get('dd[id="comp-details-violation-observed"]').contains(editCallDetails.violationObservedString);

    cy.get('div[id="comp-nature-of-complaint"]').contains(editCallDetails.violationType);

    cy.get('dd[id="comp-details-office"]').contains(editCallDetails.office);

    cy.get('dd[id="comp-details-zone"]').contains(editCallDetails.zone);

    cy.get('dd[id="comp-details-region"]').contains(editCallDetails.region);

    //end checking edit changes saved
  });

  it("Puts everything back to the original details", () => {
    //start reverting changes
    cy.navigateToEditScreen(COMPLAINT_TYPES.ERS, "23-006888", true);
    cy.get("#caller-name-id")
      .click({ force: true })
      .click({ force: true })
      .clear()
      .type(originalCallerInformation.name);
    cy.get("#complaint-address-id").click({ force: true }).clear().type(originalCallerInformation.address);
    cy.get("#complaint-email-id").click({ force: true }).clear(); //blank to start

    cy.get("#caller-primary-phone-id").click({ force: true });
    cy.get("#caller-primary-phone-id")
      .click({ force: true })
      .clear()
      .typeAndTriggerChange(originalCallerInformation.phoneInput);

    cy.get("#caller-info-secondary-phone-id")
      .click({ force: true })
      .clear()
      .typeAndTriggerChange(originalCallerInformation.secondaryInput);
    cy.get("#caller-info-alternate-phone-id")
      .click({ force: true })
      .clear()
      .typeAndTriggerChange(originalCallerInformation.alternateInput);

    cy.selectItemById("reported-select-id", originalCallerInformation.reported);

    cy.get("#complaint-witness-details-textarea-id").click({ force: true }).clear();

    cy.get("#location-edit-id").click({ force: true });
    cy.get("#location-edit-id").clear().type(originalCallDetails.location);
    cy.get("#complaint-location-description-textarea-id").click({
      force: true,
    });
    cy.get("#complaint-location-description-textarea-id")
      .click({ force: true })
      .clear()
      .type(originalCallDetails.locationDescription, { delay: 0 });
    cy.get("#complaint-description-textarea-id").click({ force: true });
    cy.get("#complaint-description-textarea-id")
      .click({ force: true })
      .clear()
      .type(originalCallDetails.description, { delay: 0 });
    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.enterDateTimeInDatePicker("complaint-incident-time", "11", "13", "45");

    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.selectItemById("community-select-id", originalCallDetails.community);

    cy.selectItemById("complaint-received-method-select-id", originalCallDetails.methodComplaintReceived);

    cy.selectItemById("violation-in-progress-select-id", originalCallDetails.violationInProgressString);

    cy.selectItemById("violation-observed-select-id", originalCallDetails.violationObservedString);

    cy.selectItemById("officer-assigned-select-id", originalCallDetails.assigned);

    cy.selectItemById("violation-type-select-id", originalCallDetails.violationType);

    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.get("#details-screen-cancel-save-button-top").click({ force: true });
    //end reverting changes
    //start verifying changes are reverted
    cy.waitForSpinner();

    cy.get('dd[id="comp-details-name"]').contains(originalCallerInformation.name);
    cy.get('dd[id="comp-details-address"]').contains(originalCallerInformation.address);

    cy.get('dd[id="comp-details-email"]').should(($el) => {
      expect($el.text().trim()).equal(originalCallerInformation.email);
    });

    cy.get('dd[id="comp-details-witness-details"]').should(($el) => {
      expect($el.text().trim()).equal(originalCallerInformation.witnessDetails);
    });

    cy.get('dd[id="comp-details-phone"]').should(($el) => {
      expect($el.text().trim()).equal(originalCallerInformation.phone);
    });
    cy.get('dd[id="comp-details-phone-2"]').should(($el) => {
      expect($el.text().trim()).equal(originalCallerInformation.secondary);
    });
    cy.get('dd[id="comp-details-phone-3"]').should(($el) => {
      expect($el.text().trim()).equal(originalCallerInformation.alternate);
    });

    cy.get('dd[id="comp-details-reported"]').contains(originalCallerInformation.reported);

    cy.get('dd[id="comp-details-location"]').contains(originalCallDetails.location);
    cy.get('dd[id="comp-details-location-description"]').contains(originalCallDetails.locationDescription);

    cy.get('dd[id="complaint-incident-date-time"]').contains(originalCallDetails.incidentDateDay);

    cy.get('pre[id="comp-details-description"]').should(($el) => {
      expect($el.text().trim()).equal(originalCallDetails.description);
    });

    cy.get('dd[id="comp-details-community"]').contains(originalCallDetails.community);

    cy.get('dd[id="comp-method-complaint-received"]').contains(originalCallDetails.methodComplaintReceived);

    cy.get('dd[id="comp-details-violation-in-progress"]').contains(originalCallDetails.violationInProgressString);

    cy.get('dd[id="comp-details-violation-observed"]').contains(originalCallDetails.violationObservedString);

    cy.get('div[id="comp-nature-of-complaint"]').contains(originalCallDetails.violationType);

    cy.get('dd[id="comp-details-office"]').contains(originalCallDetails.office);

    cy.get('dd[id="comp-details-zone"]').contains(originalCallDetails.zone);

    cy.get('dd[id="comp-details-region"]').contains(originalCallDetails.region);

    //end verifying changes are reverted
  });

  it("Navigate to the Complaint Edit page & check inputs", () => {
    cy.navigateToEditScreen(COMPLAINT_TYPES.ERS, "23-006888", true);

    // Note: if the layout of this page changes, these selectors that use classes may break
    // Check the First Section inputs
    // Nature of Complaint - not on ERS tab
    cy.get("#nature-of-complaint-pair-id").should("not.exist");

    // Species - not on ERS tab
    cy.get("#species-pair-id").should("not.exist");

    // Violation Type
    cy.get("#violation-type-pair-id label").should(($label) => {
      expect($label).to.contain.text("Violation Type");
    });
    cy.get("#violation-type-pair-id .comp-details-input").should("exist");

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
    cy.get('[for="comp-details-edit-x-coordinate-input"]').should(($label) => {
      expect($label).to.contain.text("Longitude");
    });
    cy.get("#comp-details-edit-x-coordinate-input-div").should("exist");

    // Y Coordinate
    cy.get('[for="comp-details-edit-y-coordinate-input"]').should(($label) => {
      expect($label).to.contain.text("Latitude");
    });
    cy.get("#comp-details-edit-y-coordinate-input-div").should("exist");

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

    cy.get("#subject-of-complaint-pair-id label").should(($label) => {
      expect($label).to.contain.text("Description");
    });
    cy.get("#subject-of-complaint-pair-id textarea").should("exist");
  });

  it("it has a map on screen with a marker at the correct location", function () {
    cy.navigateToEditScreen(COMPLAINT_TYPES.ERS, "23-006888", true);
    cy.verifyMapMarkerExists(true);
    cy.get(".comp-complaint-details-alert").should("not.exist");
  });

  it("it has a map on screen with no marker", function () {
    cy.navigateToEditScreen(COMPLAINT_TYPES.ERS, "23-032528", true);
    cy.verifyMapMarkerExists(false);
    cy.get(".comp-complaint-details-alert").should("exist");
  });
});
