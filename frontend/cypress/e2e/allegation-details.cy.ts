describe("COMPENF-37 Display ECR Details", () => {

  const callDetails = { 
    description: "Caller advised dealing with on going coyote problem from last year. Caller believes someone is feeding the coyotes again. *** Caller is requesting a CO callback ***",
    location: "Turnoff to Underwood Rd",
    locationDescription: "tester call description 10", 
    incidentTime: "2023-04-13T07:24:00.000Z",
    community: "108 Mile Ranch",
    office: "100 Mile House",
    zone: "Cariboo Thompson",
    region: "Thompson Cariboo",
    violationInProgress: false,
    violationObserved: false
  }

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("it has records in table view", () => {
    //-- navigate to application root
    cy.visit("/");
    
    //-- click on Allegation tab
    cy.get("#ers-tab").click({ force: true });

    cy.get('.comp-loader-overlay').should('exist');
    cy.get('.comp-loader-overlay').should('not.exist');

    //-- check to make sure there are items in the table
    cy.get("#comp-table")
      .find("tr")
      .then(({ length }) => {
        expect(length, "rows N").to.be.gt(0);
      });
  });

  it("it can select record", () => {
    //-- navigate to application root
    cy.visit("/");

    //-- click on HWCR tab
    cy.get("#ers-tab").click({ force: true });
    cy.get('.comp-loader-overlay').should('exist');
    cy.get('.comp-loader-overlay').should('not.exist');

    cy.get("#comp-zone-close").click({ force: true }); //clear zone filter so this complaint is in the list view
    cy.get('.comp-loader-overlay').should('exist');
    cy.get('.comp-loader-overlay').should('not.exist');

    //-- check to make sure there are items in the table
    cy.get("#comp-table")
      .find("tr")
      .then(({ length }) => {
        expect(length, "rows N").to.be.gt(0);
      });

    cy.get("#comp-table > tbody > tr > td.comp-small-cell").contains("23-007890").click({ force: true });

    //-- verify the right complaint identifier is selected and the animal type
    cy.get(".comp-box-complaint-id").contains("23-007890")
    cy.get("#root > div > div.comp-main-content > div > div.comp-details-header > div.comp-nature-of-complaint").contains("Wildlife")
  });

  it("it has correct call details", () => {
    //-- navigate to application root
    cy.visit("/");

    //-- click on HWCR tab
    cy.get("#ers-tab").click({ force: true });
    cy.get('.comp-loader-overlay').should('exist');
    cy.get('.comp-loader-overlay').should('not.exist');
    cy.get("#comp-zone-close").click({ force: true }); //clear zone filter so this complaint is in the list view
    cy.get('.comp-loader-overlay').should('exist');
    cy.get('.comp-loader-overlay').should('not.exist');

    //-- check to make sure there are items in the table
    cy.get("#comp-table")
      .find("tr")
      .then(({ length }) => {
        expect(length, "rows N").to.be.gt(0);
      });

      cy.get("#comp-table > tbody > tr > td.comp-small-cell").contains("23-007890").click({ force: true });

    //-- verify the call details block
    cy.get("#root > div > div.comp-main-content > div > div:nth-child(4) > div > div > div.comp-padding-right-28.col-md-6 > div:nth-child(1) > p").contains(callDetails.description)
    cy.get("#root > div > div.comp-main-content > div > div:nth-child(4) > div > div > div.comp-padding-left-28.col-md-6 > div:nth-child(1) > div.comp-details-content").contains(callDetails.location)
    cy.get("#root > div > div.comp-main-content > div > div:nth-child(4) > div > div > div.comp-padding-left-28.col-md-6 > div:nth-child(2) > p").contains(callDetails.locationDescription)
    cy.get("#root > div > div.comp-main-content > div > div:nth-child(4) > div > div > div.comp-padding-left-28.col-md-6 > div:nth-child(4) > span.comp-details-content").contains(callDetails.community)
    cy.get("#root > div > div.comp-main-content > div > div:nth-child(4) > div > div > div.comp-padding-right-28.col-md-6 > div:nth-child(3) > span.comp-details-content").contains(callDetails.violationInProgress ? "Yes" : "No")
    cy.get("#root > div > div.comp-main-content > div > div:nth-child(4) > div > div > div.comp-padding-left-28.col-md-6 > div:nth-child(5) > span.comp-details-content").contains(callDetails.office)
    cy.get("#root > div > div.comp-main-content > div > div:nth-child(4) > div > div > div.comp-padding-right-28.col-md-6 > div:nth-child(4) > span.comp-details-content").contains(callDetails.violationObserved ? "Yes" : "No")
    cy.get("#root > div > div.comp-main-content > div > div:nth-child(4) > div > div > div.comp-padding-left-28.col-md-6 > div:nth-child(6) > span.comp-details-content").contains(callDetails.zone)
    cy.get("#root > div > div.comp-main-content > div > div:nth-child(4) > div > div > div.comp-padding-left-28.col-md-6 > div:nth-child(7) > span.comp-details-content").contains(callDetails.region)
  });


});
