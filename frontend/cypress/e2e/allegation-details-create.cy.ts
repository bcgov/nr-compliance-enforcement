/*
Test to verify that the user is able to click the edit button
on the wildlife contacts details page and see all the inputs
*/
describe("Complaint Create Page spec - Create View", () => {
    const createCallDetails = {
        description:
          "Caller was involved in an altercation yesterday with a person who was exceeding the Callers understanding of the limit.  SUBs were attempting to catch 5 fish, of each type, each person (total 20.) SUBs male and their wife.  Caller requesting CO clarification regarding fish quotas for region 3.  Caller has contacted front counter BC, who referred the answer to COS. ---- testing",
        location: "Keefes Landing Rd and Danskin Rd ---- testing",
        locationDescription: "tester call description 8 ---- testing",
        incidentDateDay: "19",
        incidentTime: "13:45",
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
        referred: "BC Wildlife Federation",
        referredCode: "BCWF",
        referredIndex: 1,
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
      cy.get("#caller-name-id").clear().type(createCallerInformation.name);
      cy.get("#complaint-address-id")
        .clear()
        .type(createCallerInformation.address);
      cy.get("#complaint-email-id").clear().type(createCallerInformation.email);
  
      cy.get("#caller-primary-phone-id").click({ force: true });
      cy.get("#caller-primary-phone-id").clear();
      cy.get("#caller-primary-phone-id").typeAndTriggerChange(
        createCallerInformation.phoneInput,
      );
  
      cy.get("#caller-info-secondary-phone-id")
        .clear()
        .typeAndTriggerChange(createCallerInformation.secondaryInput);
      cy.get("#caller-info-alternate-phone-id")
        .clear()
        .typeAndTriggerChange(createCallerInformation.alternateInput);
  
      cy.selectItemById("referred-select-id", createCallerInformation.referred);
  
      cy.get("#location-edit-id").click({ force: true });
      cy.get("#location-edit-id").clear().type(createCallDetails.location);
      cy.get("#complaint-location-description-textarea-id").click({
        force: true,
      });
      cy.get("#complaint-location-description-textarea-id")
        .clear()
        .type(createCallDetails.locationDescription, { delay: 0 });
      cy.get("#complaint-description-textarea-id").click({ force: true });
      cy.get("#complaint-description-textarea-id")
        .clear()
        .type(createCallDetails.description, { delay: 0 });
      cy.get("#complaint-description-textarea-id").click({ force: true });
  
      cy.enterDateTimeInDatePicker("complaint-incident-time","19","13","45");

      cy.selectItemById("violation-in-progress-select-id", createCallDetails.violationInProgressString);

      cy.selectItemById("violation-observed-select-id", createCallDetails.violationObservedString);
  
      cy.selectItemById("community-select-id", createCallDetails.community);
  
      cy.selectItemById(
        "violation-type-select-id",
        createCallDetails.violationType,
      );
  
      cy.selectItemById("officer-assigned-select-id", createCallDetails.assigned);
  
      cy.get("#details-screen-cancel-save-button-top").click({ force: true });
      //end create changes
      //start verifying changes are created
      cy.waitForSpinner();
  
      cy.get('div[id="comp-details-name"]').contains(
        createCallerInformation.name,
      );
      cy.get('div[id="comp-details-address"]').contains(
        createCallerInformation.address,
      );
      cy.get('div[id="comp-details-email"]').contains(
        createCallerInformation.email,
      );
  
      cy.get('div[id="comp-details-phone"]').contains(
        createCallerInformation.phone,
      );
      cy.get('div[id="comp-details-phone-2"]').should(($el) => {
        expect($el.text().trim()).equal(createCallerInformation.secondary);
      });
      cy.get('div[id="comp-details-phone-3"]').should(($el) => {
        expect($el.text().trim()).equal(createCallerInformation.alternate);
      });
  
      cy.get('div[id="comp-details-referred"]').contains(
        createCallerInformation.referred,
      );
  
      cy.get('div[id="comp-details-location"]').contains(
        createCallDetails.location,
      );
  
      cy.get('p[id="comp-details-location-description"]').should(
        "have.text",
        createCallDetails.locationDescription,
      );
  
      cy.get('div[id="complaint-incident-date-time"]').contains(
        createCallDetails.incidentDateDay
      );

      cy.get('div[id="complaint-incident-date-time"]').contains(
        createCallDetails.incidentTime
      );
  
      cy.get('p[id="comp-details-description"]').should(
        "have.text",
        createCallDetails.description,
      );
  
      cy.get('span[id="comp-details-community"]').contains(
        createCallDetails.community,
      );

      cy.get('span[id="comp-details-violation-in-progress"]').contains(
        createCallDetails.violationInProgressString,
      );

      cy.get('span[id="comp-details-violation-observed"]').contains(
        createCallDetails.violationObservedString,
      );
  
      cy.get('span[id="comp-details-office"]').contains(createCallDetails.office);
  
      cy.get('span[id="comp-details-zone"]').contains(createCallDetails.zone);
  
      cy.get('span[id="comp-details-region"]').contains(createCallDetails.region);
  
      //Commented out until COMPENF-987 is Fixed
      //cy.get(".comp-attactant-badge").then(function ($defaultValue) {
      //  expect($defaultValue.eq(0)).to.contain("Garbage");
      //  expect($defaultValue.eq(1)).to.contain("Freezer");
      //  expect($defaultValue.eq(2)).to.contain("Compost");
      //});
      //end verifying changes are created
    });
  });
  