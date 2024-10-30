/*
Test to verify that the user is able to click the edit button
on the wildlife contacts details page and see all the inputs
*/
describe("Complaint Create Page spec - Create View", () => {
  const createCallDetails = {
    description:
      "Caller was involved in an altercation yesterday with a person who was exceeding the Callers understanding of the limit.  SUBs were attempting to catch 5 fish, of each type, each person (total 20.) SUBs male and their wife.  Caller requesting CO clarification regarding fish quotas for region 3.  Caller has contacted front counter BC, who reported the answer to COS. ---- testing",
    location: "2975 Jutland Rd.",
    locationDescription: "tester call description 8 ---- testing",
    xCoord: "-123.377",
    yCoord: "48.440",
    incidentDateDay: "01",
    incidentTime: "13:45",
    community: "Victoria",
    office: "Victoria",
    zone: "South Island",
    region: "West Coast",
    methodComplaintReceived: "RAPP",
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

  const createCallerInformation = {
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
    reportedCode: "BCWF",
    reportedIndex: 1,
    witnessDetails: "----- testing",
  };

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("Navigate to the Complaint Create page & create and verify data", function () {
    //start create
    cy.navigateToCreateScreen();

    cy.selectItemById("complaint-type-select-id", "Enforcement");
    cy.get("#caller-name-id").click({ force: true }).clear().type(createCallerInformation.name);
    cy.get("#complaint-address-id").click({ force: true }).clear().type(createCallerInformation.address);
    cy.get("#complaint-email-id").click({ force: true }).clear().type(createCallerInformation.email);

    cy.get("#caller-primary-phone-id").click({ force: true });
    cy.get("#caller-primary-phone-id").clear();
    cy.get("#caller-primary-phone-id").typeAndTriggerChange(createCallerInformation.phoneInput);

    cy.get("#caller-info-secondary-phone-id")
      .click({ force: true })
      .clear()
      .typeAndTriggerChange(createCallerInformation.secondaryInput);
    cy.get("#caller-info-alternate-phone-id")
      .click({ force: true })
      .clear()
      .typeAndTriggerChange(createCallerInformation.alternateInput);

    cy.selectItemById("reported-select-id", createCallerInformation.reported);

    cy.get("#location-edit-id").click({ force: true });
    cy.get("#location-edit-id").clear().type(createCallDetails.location);
    cy.get("#complaint-location-description-textarea-id").click({
      force: true,
    });
    cy.get("#complaint-location-description-textarea-id")
      .click({ force: true })
      .clear()
      .type(createCallDetails.locationDescription, { delay: 0 });
    cy.get("#complaint-description-textarea-id").click({ force: true });
    cy.get("#complaint-description-textarea-id").clear().type(createCallDetails.description, { delay: 0 });
    cy.get("#complaint-description-textarea-id").click({ force: true });

    cy.enterDateTimeInDatePicker("complaint-incident-time", "01", "13", "45");

    cy.selectItemById("violation-in-progress-select-id", createCallDetails.violationInProgressString);

    cy.selectItemById("violation-observed-select-id", createCallDetails.violationObservedString);

    cy.selectItemById("community-select-id", createCallDetails.community);

    cy.selectItemById("complaint-received-method-select-id", createCallDetails.methodComplaintReceived);

    cy.selectItemById("violation-type-select-id", createCallDetails.violationType);

    cy.selectItemById("officer-assigned-select-id", createCallDetails.assigned);

    cy.get("#details-screen-cancel-save-button-top").click({ force: true });
    //end create changes

    //start verifying changes are created
    cy.waitForSpinner();

    //-- verify call details
    cy.get('pre[id="comp-details-description"]').should("have.text", createCallDetails.description);
    cy.get('dd[id="complaint-incident-date-time"]').contains(createCallDetails.incidentDateDay);
    cy.get('dd[id="complaint-incident-date-time"]').contains(createCallDetails.incidentTime);
    cy.get('dd[id="comp-details-violation-in-progress"]').contains(createCallDetails.violationInProgressString);
    cy.get('dd[id="comp-details-violation-observed"]').contains(createCallDetails.violationObservedString);
    cy.get('dd[id="comp-details-location"]').contains(createCallDetails.location);
    cy.get('dd[id="comp-details-location-description"]').should("have.text", createCallDetails.locationDescription);
    cy.get('span[id="geo-details-x-coordinate"]').contains(createCallDetails.xCoord);
    cy.get('span[id="geo-details-y-coordinate"]').contains(createCallDetails.yCoord);
    cy.get('dd[id="comp-details-community"]').contains(createCallDetails.community);
    cy.get('dd[id="comp-details-office"]').contains(createCallDetails.office);
    cy.get('dd[id="comp-details-zone"]').contains(createCallDetails.zone);
    cy.get('dd[id="comp-details-region"]').contains(createCallDetails.region);
    cy.get('dd[id="comp-method-complaint-received"]').contains(createCallDetails.methodComplaintReceived);
    cy.get('dd[id="comp-details-reported"]').contains(createCallerInformation.reported);

    //-- verify caller information
    cy.get('dd[id="comp-details-name"]').contains(createCallerInformation.name);
    cy.get('dd[id="comp-details-address"]').contains(createCallerInformation.address);
    cy.get('dd[id="comp-details-email"]').contains(createCallerInformation.email);

    cy.get('dd[id="comp-details-phone"]').contains(createCallerInformation.phone);
    cy.get('dd[id="comp-details-phone-1"]').should(($el) => {
      expect($el.text().trim()).equal(createCallerInformation.secondary);
    });
    cy.get('dd[id="comp-details-phone-2"]').should(($el) => {
      expect($el.text().trim()).equal(createCallerInformation.alternate);
    });

    //end verifying changes are created
  });
});
