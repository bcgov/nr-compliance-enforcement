
import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

const originalCallDetails = { 
  description: "Caller was involved in an altercation yesterday with a person who was exceeding the Callers understanding of the limit.  SUBs were attempting to catch 5 fish, of each type, each person (total 20.) SUBs male and their wife.  Caller requesting CO clarification regarding fish quotas for region 3.  Caller has contacted front counter BC, who referred the answer to COS.",
  location: "Keefes Landing Rd and Danskin Rd",
  locationDescription: "tester call description 8", 
  incidentDate: "2030-04-11",
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
}

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
  referred: "Bylaw Enforcement",
  referredCode: "BYLAW",
  referredIndex: 2,
  witnessDetails: "",
};

const editCallDetails = {
  description:
    "Caller was involved in an altercation yesterday with a person who was exceeding the Callers understanding of the limit.  SUBs were attempting to catch 5 fish, of each type, each person (total 20.) SUBs male and their wife.  Caller requesting CO clarification regarding fish quotas for region 3.  Caller has contacted front counter BC, who referred the answer to COS. ---- testing",
  location: "Keefes Landing Rd and Danskin Rd ---- testing",
  locationDescription: "tester call description 8 ---- testing",
  incidentDate: "2030-04-13",
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
  status: "Closed",
  statusIndex: 1,
  assigned: "Olivia Benson",
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
  referred: "BC Wildlife Federation",
  referredCode: "BCWF",
  referredIndex: 1,
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
    cy.navigateToEditScreen(COMPLAINT_TYPES.ERS,"23-006888");
    cy.get("#caller-name-id").clear().type(editCallerInformation.name);
    cy.get("#complaint-address-id").clear().type(editCallerInformation.address);
    cy.get("#complaint-email-id").clear().type(editCallerInformation.email);

    cy.get("#caller-primary-phone-id").click({ force: true });

    cy.get("#caller-primary-phone-id").clear()
    cy.get("#caller-primary-phone-id").typeAndTriggerChange(editCallerInformation.phoneInput);
    
    cy.get("#caller-info-secondary-phone-id")
      .clear()
      .typeAndTriggerChange(editCallerInformation.secondaryInput);
    cy.get("#caller-info-alternate-phone-id")
      .clear()
      .typeAndTriggerChange(editCallerInformation.alternateInput);

    cy.selectItemById("referred-select-id", editCallerInformation.referred);

    cy.get("#complaint-witness-details-textarea-id").clear().type(editCallerInformation.witnessDetails, {delay: 0});

    cy.get("#location-edit-id").click({ force: true });
    cy.get("#location-edit-id").clear().type(editCallDetails.location);
    cy.get("#complaint-location-description-textarea-id").click({
      force: true,
    });
    cy.get("#complaint-location-description-textarea-id")
      .clear()
      .type(editCallDetails.locationDescription, {delay: 0});
    cy.get("#complaint-description-textarea-id").click({ force: true });
    cy.get("#complaint-description-textarea-id")
      .clear()
      .type(editCallDetails.description, {delay: 0});
    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.get("#complaint-incident-time")
      .click({ force: true })
      .get(".react-datepicker__day--013")
      .should('exist')
      .click({ force: true });
    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.selectItemById("community-select-id", editCallDetails.community);

    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.selectItemById("violation-in-progress-select-id", editCallDetails.violationInProgressString);

    cy.selectItemById("violation-observed-select-id", editCallDetails.violationObservedString);

    cy.selectItemById("status-select-id", editCallDetails.status);

    cy.selectItemById("officer-assigned-select-id", editCallDetails.assigned);

    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.selectItemById("violation-type-select-id", editCallDetails.violationType);

    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.get("#details-screen-cancel-save-button-top").click({ force: true });
    //end edit

    //start checking edit changes saved
    cy.waitForSpinner();

    cy.get('div[id="comp-details-name"]').contains(editCallerInformation.name);
    cy.get('div[id="comp-details-address"]').contains(
      editCallerInformation.address
    );
    cy.get('div[id="comp-details-email"]').contains(
      editCallerInformation.email
    );
    cy.get('div[id="comp-details-phone"]').should(($el) => {
      expect($el.text().trim()).equal(editCallerInformation.phone);
   });
    cy.get('div[id="comp-details-phone-2"]').should(($el) => {
      expect($el.text().trim()).equal(editCallerInformation.secondary);
    });
    cy.get('div[id="comp-details-phone-3"]').should(($el) => {
      expect($el.text().trim()).equal(editCallerInformation.alternate);
    });
    cy.get('div[id="comp-details-referred"]').contains(
      editCallerInformation.referred
    );
    cy.get('div[id="comp-details-email"]').contains(
      editCallerInformation.email
    );

    cy.get('p[id="comp-details-witness-details"]').should(($el) => {
      expect($el.text().trim()).equal(editCallerInformation.witnessDetails);
   });

    cy.get('div[id="comp-details-location"]').contains(
      editCallDetails.location
    );
    cy.get('p[id="comp-details-location-description"]').contains(
      editCallDetails.locationDescription
    );

    //Commented out until COMPENF-843 is Fixed
    //cy.get('div[id="complaint-incident-date-time"]').contains(
    //  editCallDetails.incidentDate
    //);

    cy.get('p[id="comp-details-description"]').should(($el) => {
      expect($el.text().trim()).equal(editCallDetails.description);
   });

    cy.get('span[id="comp-details-community"]').contains(
      editCallDetails.community
    );

    cy.get('span[id="comp-details-violation-in-progress"]').contains(
      editCallDetails.violationInProgressString
    );

    cy.get('span[id="comp-details-violation-observed"]').contains(
      editCallDetails.violationObservedString
    );

    cy.get('div[id="comp-nature-of-complaint"]').contains(
      editCallDetails.violationType
    );

    cy.get('span[id="comp-details-office"]').contains(editCallDetails.office);

    cy.get('span[id="comp-details-zone"]').contains(editCallDetails.zone);

    cy.get('span[id="comp-details-region"]').contains(editCallDetails.region);


    //end checking edit changes saved
  });

  it("Puts everything back to the original details", () => {

    //start reverting changes
    cy.navigateToEditScreen(COMPLAINT_TYPES.ERS,"23-006888");
    cy.get("#caller-name-id").clear().type(originalCallerInformation.name);
    cy.get("#complaint-address-id")
      .clear()
      .type(originalCallerInformation.address);
    cy.get("#complaint-email-id").clear(); //blank to start

    cy.get("#caller-primary-phone-id").click({ force: true });
    cy.get("#caller-primary-phone-id")
    .clear()
    .typeAndTriggerChange(originalCallerInformation.phoneInput);
    
    cy.get("#caller-info-secondary-phone-id")
      .clear()
      .typeAndTriggerChange(originalCallerInformation.secondaryInput);
    cy.get("#caller-info-alternate-phone-id")
      .clear()
      .typeAndTriggerChange(originalCallerInformation.alternateInput);

    cy.selectItemById("referred-select-id", originalCallerInformation.referred);

    cy.get("#complaint-witness-details-textarea-id").clear();

    cy.get("#location-edit-id").click({ force: true });
    cy.get("#location-edit-id").clear().type(originalCallDetails.location);
    cy.get("#complaint-location-description-textarea-id").click({
      force: true,
    });
    cy.get("#complaint-location-description-textarea-id")
    .clear()
    .type(originalCallDetails.locationDescription, {delay: 0});
    cy.get("#complaint-description-textarea-id").click({ force: true });
    cy.get("#complaint-description-textarea-id")
      .clear()
      .type(originalCallDetails.description, {delay: 0});
    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.get("#complaint-incident-time")
      .click({ force: true })
      .get(".react-datepicker__day--011")
      .should('exist')
      .click({ force: true });

    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.selectItemById("community-select-id", originalCallDetails.community);

    cy.selectItemById("violation-in-progress-select-id", originalCallDetails.violationInProgressString);

    cy.selectItemById("violation-observed-select-id", originalCallDetails.violationObservedString);

    cy.selectItemById("status-select-id", originalCallDetails.status);

    cy.selectItemById("officer-assigned-select-id", originalCallDetails.assigned);

    cy.selectItemById("violation-type-select-id", originalCallDetails.violationType);

    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.get("#details-screen-cancel-save-button-top").click({ force: true });
    //end reverting changes
    //start verifying changes are reverted
    cy.waitForSpinner();

    cy.get('div[id="comp-details-name"]').contains(
      originalCallerInformation.name
    );
    cy.get('div[id="comp-details-address"]').contains(
      originalCallerInformation.address
    );

    cy.get('div[id="comp-details-email"]').should(($el) => {
      expect($el.text().trim()).equal(originalCallerInformation.email);
   });

   cy.get('p[id="comp-details-witness-details"]').should(($el) => {
    expect($el.text().trim()).equal(originalCallerInformation.witnessDetails);
 });

    cy.get('div[id="comp-details-phone"]').should(($el) => {
      expect($el.text().trim()).equal(originalCallerInformation.phone);
  });
    cy.get('div[id="comp-details-phone-2"]').should(($el) => {
      expect($el.text().trim()).equal(originalCallerInformation.secondary);
    });
    cy.get('div[id="comp-details-phone-3"]').should(($el) => {
      expect($el.text().trim()).equal(originalCallerInformation.alternate);
    });

    cy.get('div[id="comp-details-referred"]').contains(
      originalCallerInformation.referred
    );

    cy.get('div[id="comp-details-location"]').contains(
      originalCallDetails.location
    );
    cy.get('p[id="comp-details-location-description"]').contains(
      originalCallDetails.locationDescription
    );

    //Commented out until COMPENF-843 is Fixed
    //cy.get('div[id="complaint-incident-date-time"]').contains(
    //  originalCallDetails.incidentDate
    //);

    cy.get('p[id="comp-details-description"]').should(($el) => {
      expect($el.text().trim()).equal(originalCallDetails.description);
   });

    cy.get('span[id="comp-details-community"]').contains(
      originalCallDetails.community
    );

    cy.get('span[id="comp-details-violation-in-progress"]').contains(
      originalCallDetails.violationInProgressString
    );

    cy.get('span[id="comp-details-violation-observed"]').contains(
      originalCallDetails.violationObservedString
    );

    cy.get('div[id="comp-nature-of-complaint"]').contains(
      originalCallDetails.violationType
    );

    cy.get('span[id="comp-details-office"]').contains(
      originalCallDetails.office
    );

    cy.get('span[id="comp-details-zone"]').contains(originalCallDetails.zone);

    cy.get('span[id="comp-details-region"]').contains(
      originalCallDetails.region
    );
    //end verifying changes are reverted
  });

  it("Navigate to the Complaint Edit page & check inputs", () => {
    cy.navigateToEditScreen(COMPLAINT_TYPES.ERS,"23-006888");
    

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
    cy.get("#secondary-phone-pair-id label").should(($label) => {
      expect($label).to.contain.text("Alternate 1 Phone");
    });
    cy.get("#secondary-phone-pair-id input").should("exist");

    // Alternative 2 Phone
    cy.get("#alternate-phone-pair-id label").should(($label) => {
      expect($label).to.contain.text("Alternate 2 Phone");
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
    cy.navigateToEditScreen(COMPLAINT_TYPES.ERS,"23-006888");
    cy.verifyMapMarkerExists();
  });

});