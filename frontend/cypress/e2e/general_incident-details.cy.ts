import COMPLAINT_TYPES from "@apptypes/app/complaint-types";

describe("COMPENF-37 Display ECR Details", () => {
  const callDetails = {
    description: "Test information on a CO Contact General Incident Type",
    location: "Cariboo Dr",
    locationDescription: "tester call description 8",
    incidentTime: "2024-07-11T14:18:00.000Z",
    community: "Victoria",
    office: "Victoria",
    zone: "South Island",
    region: "West Coast",
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

    //-- click on General Incident tab
    cy.get("#gir-tab").click({ force: true });

    cy.waitForSpinner();

    //-- check to make sure there are items in the table
    cy.get("#complaint-list")
      .find("tr")
      .then(({ length }) => {
        expect(length, "rows N").to.be.gt(0);
      });
  });

  it("it can select record", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.GIR, "23-900001", false);

    //-- verify the right complaint identifier is selected and the animal type
    cy.get(".comp-box-complaint-id").contains("23-900001");
  });

  it("it has correct call details", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.GIR, "23-900001", true);

    //-- verify the call details block
    cy.get('pre[id="comp-details-description"]').contains(callDetails.description);
    cy.get('dd[id="comp-details-location"]').contains(callDetails.location);
    cy.get('dd[id="comp-details-location-description"]').contains(callDetails.locationDescription);
    cy.get('dd[id="comp-details-community"]').contains(callDetails.community);
    cy.get('dd[id="comp-details-office"]').contains(callDetails.office);
    cy.get('dd[id="comp-details-zone"]').contains(callDetails.zone);
    cy.get('dd[id="comp-details-region"]').contains(callDetails.region);
  });

  it("it has a map on screen with no marker", function () {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.GIR, "23-900001", true);
    cy.verifyMapMarkerExists(false);
    cy.get(".comp-complaint-details-alert").should("exist");
  });

  it("validates breadcrumb styles", function () {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.GIR, "23-900001", true);

    cy.get(".comp-nav-item-name-inverted > a").should("have.css", "text-decoration").should("include", "underline");
    cy.get(".comp-nav-item-name-inverted > a").should("have.css", "color").should("include", "rgb(255, 255, 255)");
  });
});
