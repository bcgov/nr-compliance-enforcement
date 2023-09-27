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
    incidentTime: "2022-12-19T08:51:00.000Z",
    attractants: ["Garbage", "Freezer", "Compost"],
    attractantCodes: ["GARBAGE", "FREEZER", "COMPOST"],
    community: "Kamloops",
    office: "Kamloops",
    zone: "Thompson Nicola",
    region: "Thompson Cariboo",
    communityCode: "KAMLOOPS",
    officeCode: "KMLPS",
    zoneCode: "TMPSNNCLA",
    regionCode: "TMPSNCRBO",
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
    referred: "Conservation Officer Service",
    referredCode: "COS",
    referredIndex: 3,
  };

  const editCallDetails = {
    description:
      "Calling to report a black bear getting into the garbage on a regular basis. Also wanted to confirm that residents of the trailer home park could call to report sightings themselves ---- testing",
    location: "644 Pine Street ---- testing",
    locationDescription: " ---- testing",
    incidentTime: "2022-12-21T08:51:00.000Z",
    attractants: ["Livestock", "BBQ", "Beehive"],
    attractantCodes: ["LIVESTCK", "BBQ", "BEEHIVE"],
    community: "Blaeberry",
    office: "Golden",
    zone: "Columbia/Kootenay",
    region: "Kootenay",
    communityCode: "Blaeberry",
    officeCode: "GLDN",
    zoneCode: "CLMBAKTNY",
    regionCode: "KTNY",
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
    referred: "BC Wildlife Federation",
    referredCode: "BCWF",
    referredIndex: 1,
  };

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("Navigate to the Complaint Edit page & check inputs", function() {
    cy.navigateToHWLCEditScreen("23-007023");

    // Note: if the layout of this page changes, these selectors that use classes may break
    // Check the First Section inputs
    // Nature of Complaint
    cy.get("#nature-of-complaint-pair-id label").should(($label) => {
      expect($label).to.contain.text("Nature of Complaint");
    });
    cy.get("#nature-of-complaint-pair-id .comp-details-input").should("exist");

    // Date / Time Logged
    cy.get("#date-time-pair-id label").should(($label) => {
      expect($label).to.contain.text("Date / Time Logged");
    });
    cy.get("#date-time-pair-id .comp-details-input").should("exist");

    // Species
    cy.get("#species-pair-id label").should(($label) => {
      expect($label).to.contain.text("Species");
    });
    cy.get("#species-pair-id .comp-details-input").should("exist");

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

    // Attractants
    cy.get("#attractants-pair-id label").should(($label) => {
      expect($label).to.contain.text("Attractants");
    });
    cy.get("#attractants-pair-id input").should("exist");

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
  });

  it("it has a map on screen with a marker at the correct location", () => {
    cy.navigateToHWLCEditScreen("23-007023");

    cy.verifyMapMarkerExists();

  });

  it("Navigate to the Complaint Edit page & change data, save, navigate to read-only, return to edit and reset data", function() {
    cy.navigateToHWLCEditScreen("23-000076");
    cy.get('#caller-name-id').clear().type(editCallerInformation.name);
    cy.get('#complaint-address-id').clear().type(editCallerInformation.address);
    cy.get('#complaint-email-id').clear().type(editCallerInformation.email);
    
    /*
    cy.get('#caller-primary-phone-id').click({force: true});
    cy.get('#caller-primary-phone-id').clear().type(editCallerInformation.phoneInput);
    cy.get('#caller-info-secondary-phone-id').click({force: true});
    cy.get('#caller-info-secondary-phone-id').clear().type(editCallerInformation.secondaryInput);
    cy.get('#caller-info-alternate-phone-id').click({force: true});
    cy.get('#caller-info-alternate-phone-id').clear().type(editCallerInformation.alternateInput);*/

    cy.task('log', 
     "is this working? " + cy.get('.comp-referred-select__control')    
      .click({force: true})
      .get('.comp-referred-select__menu')
      .find('.comp-referred-select__option').siblings()
    );

    cy.get('.comp-referred-select__control')    
      .click({force: true})
      .get('.comp-referred-select__menu')
      .find('.comp-referred-select__option')
      .first() //NOTE: based on index of code in table, not value - test will need to be updated if agency codes added before
      .next()
      .click({force: true});

    cy.get('#location-edit-id').click({force: true});
    cy.get('#location-edit-id').clear().type(editCallDetails.location);
    cy.get('#complaint-location-description-textarea-id').click({force: true});
    cy.get('#complaint-location-description-textarea-id').clear().type(editCallDetails.locationDescription);
    cy.get('#complaint-description-textarea-id').click({force: true});
    cy.get('#complaint-description-textarea-id').clear().type(editCallDetails.description);
    cy.get('#complaint-description-textarea-id').click({force: true});
    

    cy.get(".comp-attractants-select__multi-value__remove").first().click({force: true});
    cy.get(".comp-attractants-select__multi-value__remove").first().click({force: true});
    cy.get(".comp-attractants-select__multi-value__remove").first().click({force: true});
    cy.get('.comp-attractants-select__control')    
      .click({force: true})
      .get('.comp-attractants-select__menu')
      .find('.comp-attractants-select__option')
      .first() //NOTE: based on index of code in table, not value - test will need to be updated if agency codes added before
      .next()
      .next()
      .next()
      .next()
      .next()
      .next()
      .next()
      .next()
      .next()
      .click({force: true});
      cy.get('#complaint-description-textarea-id').click({force: true});
      cy.get('.comp-attractants-select__control')    
      .click({force: true})
      .get('.comp-attractants-select__menu')
      .find('.comp-attractants-select__option')
      .first() //NOTE: based on index of code in table, not value - test will need to be updated if agency codes added before
      .click({force: true});
      cy.get('#complaint-description-textarea-id').click({force: true});
      cy.get('.comp-attractants-select__control')    
      .click({force: true})
      .get('.comp-attractants-select__menu')
      .find('.comp-attractants-select__option')
      .first() //NOTE: based on index of code in table, not value - test will need to be updated if agency codes added before
      .click({force: true});

    cy.wait(1000);
    cy.get('#details-screen-cancel-save-button-top').click({force: true});
    cy.get(".comp-loader-overlay").should("not.exist");
    
    cy.get(
      'div[id="comp-details-name"]'
    ).contains(editCallerInformation.name);
    cy.get(
      'div[id="comp-details-address"]'
    ).contains(editCallerInformation.address);
    cy.get(
      'div[id="comp-details-email"]'
    ).contains(editCallerInformation.email);
    /*
    cy.get(
      'div[id="comp-details-phone"]'
    ).contains(editCallerInformation.phone);
    cy.get(
      'div[id="comp-details-phone-2"]'
    ).should(($el) => {
      expect($el.text().trim()).equal(editCallerInformation.secondary);
    });
    cy.get(
      'div[id="comp-details-phone-3"]'
    ).should(($el) => {
      expect($el.text().trim()).equal(editCallerInformation.alternate);
    });*/
    cy.get(
      'div[id="comp-details-referred"]'
    ).contains(editCallerInformation.referred);
    cy.get(
      'div[id="comp-details-email"]'
    ).contains(editCallerInformation.email);
    cy.get(
      'div[id="comp-details-location"]'
    ).contains(editCallDetails.location);
    cy.get(
      'p[id="comp-details-location-description"]'
    ).contains(editCallDetails.locationDescription);

    cy.get(
      'p[id="comp-details-description"]'
    ).contains(editCallDetails.description);

    cy.get(".comp-attactant-badge").then(function ($defaultValue) {
      expect($defaultValue.eq(0)).to.contain('Livestock');
      expect($defaultValue.eq(1)).to.contain('BBQ');
      expect($defaultValue.eq(2)).to.contain('Beehive');
    });


    cy.navigateToHWLCEditScreen("23-000076");
    cy.get('#caller-name-id').clear().type(originalCallerInformation.name);
    cy.get('#complaint-address-id').clear().type(originalCallerInformation.address);
    cy.get('#complaint-email-id').clear().type(originalCallerInformation.email);
    
    /*
    cy.get('#caller-primary-phone-id').clear().type(originalCallerInformation.phoneInput);
    //orignals are blank, can't type blank
    cy.get('#caller-info-secondary-phone-id').clear();
    cy.get('#caller-info-alternate-phone-id').clear();*/
    cy.get('.comp-referred-select__control')    
      .click({force: true})
      .get('.comp-referred-select__menu')
      .find('.comp-referred-select__option')
      .first() //NOTE: based on index of code in table, not value - test will need to be updated if agency codes added before
      .next()
      .next()
      .next()
      .click({force: true});

    cy.get('#location-edit-id').click({force: true});
    cy.get('#location-edit-id').clear().type(originalCallDetails.location);
    cy.get('#complaint-location-description-textarea-id').click({force: true});
    cy.get('#complaint-location-description-textarea-id').clear();//original blank
    cy.get('#complaint-description-textarea-id').click({force: true});
    cy.get('#complaint-description-textarea-id').clear().type(originalCallDetails.description);
    cy.get('#complaint-description-textarea-id').click({force: true});

    cy.get(".comp-attractants-select__multi-value__remove").first().click({force: true});
    cy.get(".comp-attractants-select__multi-value__remove").first().click({force: true});
    cy.get(".comp-attractants-select__multi-value__remove").first().click({force: true});

    cy.get('.comp-attractants-select__control')    
      .click({force: true})
      .get('.comp-attractants-select__menu')
      .find('.comp-attractants-select__option')
      .first() //NOTE: based on index of code in table, not value - test will need to be updated if agency codes added before
      .next()
      .next()
      .next()
      .next()
      .next()
      .next()
      .next()
      .click({force: true});
      cy.get('#complaint-description-textarea-id').click({force: true});

      cy.get('.comp-attractants-select__control')    
      .click({force: true})
      .get('.comp-attractants-select__menu')
      .find('.comp-attractants-select__option')
      .first() //NOTE: based on index of code in table, not value - test will need to be updated if agency codes added before
      .next()
      .next()
      .next()
      .next()
      .next()
      .next()
      .click({force: true});

      cy.get('#complaint-description-textarea-id').click({force: true});
      cy.get('.comp-attractants-select__control')    
      .click({force: true})
      .get('.comp-attractants-select__menu')
      .find('.comp-attractants-select__option')
      .first() //NOTE: based on index of code in table, not value - test will need to be updated if agency codes added before
      .next()
      .next()
      .next()
      .next()
      .click({force: true});

      cy.wait(1000);
    cy.get('#details-screen-cancel-save-button-top').click({force: true});
    cy.get(".comp-loader-overlay").should("not.exist");
    
    cy.get(
      'div[id="comp-details-name"]'
    ).contains(originalCallerInformation.name);
    cy.get(
      'div[id="comp-details-address"]'
    ).contains(originalCallerInformation.address);
    cy.get(
      'div[id="comp-details-email"]'
    ).contains(originalCallerInformation.email);
    /*
    cy.get(
      'div[id="comp-details-phone"]'
    ).contains(originalCallerInformation.phone);
    cy.get(
      'div[id="comp-details-phone-2"]'
    ).should(($el) => {
      expect($el.text().trim()).equal(originalCallerInformation.secondary);
    });
    cy.get(
      'div[id="comp-details-phone-3"]'
    ).should(($el) => {
      expect($el.text().trim()).equal(originalCallerInformation.alternate);
    });*/
    
    cy.get(
      'div[id="comp-details-referred"]'
    ).contains(originalCallerInformation.referred);

    cy.get(
      'div[id="comp-details-location"]'
    ).contains(originalCallDetails.location);
    cy.get(
      'p[id="comp-details-location-description"]'
    ).should('have.value',originalCallDetails.locationDescription);

    cy.get(
      'p[id="comp-details-description"]'
    ).contains(originalCallDetails.description);

    cy.get(".comp-attactant-badge").then(function ($defaultValue) {
      expect($defaultValue.eq(0)).to.contain('Garbage');
      expect($defaultValue.eq(1)).to.contain('Freezer');
      expect($defaultValue.eq(2)).to.contain('Compost');
    });
  });
});