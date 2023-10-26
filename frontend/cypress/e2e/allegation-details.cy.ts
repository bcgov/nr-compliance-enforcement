import COMPLAINT_TYPES from "../../src/app/types/app/complaint-types";

describe("COMPENF-37 Display ECR Details", () => {
  const callDetails = {
    description:
      "Caller advised dealing with on going coyote problem from last year. Caller believes someone is feeding the coyotes again. *** Caller is requesting a CO callback ***",
    location: "Turnoff to Underwood Rd",
    locationDescription: "tester call description 10",
    incidentTime: "2023-04-13T07:24:00.000Z",
    community: "108 Mile Ranch",
    office: "100 Mile House",
    zone: "Cariboo Thompson",
    region: "Thompson Cariboo",
    violationInProgress: false,
    violationObserved: false,
  };

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("it has records in table view", () => {
    //-- navigate to application root
    cy.visit("/");

    //-- click on Allegation tab
    cy.get("#ers-tab").click({ force: true });

    cy.waitForSpinner();

    //-- check to make sure there are items in the table
    cy.get("#complaint-list")
      .find("tr")
      .then(({ length }) => {
        expect(length, "rows N").to.be.gt(0);
      });
  });

  it("it can select record", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-007890");

    //-- verify the right complaint identifier is selected and the animal type
    cy.get(".comp-box-complaint-id").contains("23-007890");
  });

  it("it has correct call details", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-007890");

    //-- verify the call details block
    cy.get('p[id="comp-details-description"]').contains(
      callDetails.description,
    );
    cy.get('div[id="comp-details-location"]').contains(callDetails.location);
    cy.get('p[id="comp-details-location-description"]').contains(
      callDetails.locationDescription,
    );
    cy.get('span[id="comp-details-community"]').contains(callDetails.community);
    cy.get('span[id="comp-details-violation-in-progress"]').contains(
      callDetails.violationInProgress ? "Yes" : "No",
    );
    cy.get('span[id="comp-details-office"]').contains(callDetails.office);
    cy.get('span[id="comp-details-violation-observed"]').contains(
      callDetails.violationObserved ? "Yes" : "No",
    );
    cy.get('span[id="comp-details-zone"]').contains(callDetails.zone);
    cy.get('span[id="comp-details-region"]').contains(callDetails.region);
  });

  it("it has a map on screen with a marker at the correct location", function () {
    cy.navigateToEditScreen(COMPLAINT_TYPES.ERS,"23-006888");
    cy.verifyMapMarkerExists(true);
    cy.get(".comp-complaint-details-alert").should("not.exist");
  });

  it("it has a map on screen with no marker", function () {
    cy.navigateToEditScreen(COMPLAINT_TYPES.ERS,"23-032528");
    cy.verifyMapMarkerExists(false);
    cy.get(".comp-complaint-details-alert").should("exist");
  });

  it("validates breadcrumb styles", function () {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.ERS, "23-007890");

    cy.get(".comp-nav-item-name-inverted > a").should('have.css', 'text-decoration').should('include', 'underline');
    cy.get(".comp-nav-item-name-inverted > a").should('have.css', 'color').should('include', 'rgb(255, 255, 255)');
  });

});
