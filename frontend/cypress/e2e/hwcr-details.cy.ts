import COMPLAINT_TYPES from "@apptypes/app/complaint-types";

describe("COMPENF-35 Display HWCR Details", () => {
  const callDetails = {
    description:
      "Calling to report a black bear getting into the garbage on a regular basis. Also wanted to confirm that residents of the trailer home park could call to report sightings themselves",
    location: "644 Pine Street",
    locationDescription: "",
    incidentTime: "2022-12-19T08:51:00.000Z",
    attractants: ["Garbage", "Freezer", "Compost"],
    community: "Kamloops",
    office: "Kamloops",
    zone: "Thompson Nicola",
    region: "Thompson Cariboo",
  };

  const callerInformation = {
    name: "Phoebe",
    phone: "(250) 556-1234",
    secondary: "",
    alternate: "",
    address: "437 Fake St",
    email: "tester@gmail.com",
    reported: "Conservation Officer Service",
  };

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("it has records in table view", () => {
    //-- navigate to application root
    cy.visit("/");

    //-- click on HWCR tab
    cy.get("#hwcr-tab").click({ force: true });

    cy.waitForSpinner();

    //-- check to make sure there are items in the table
    cy.get("#complaint-list")
      .find("tr")
      .then(({ length }) => {
        expect(length, "rows N").to.be.gt(0);
      });
  });

  it("it can select record", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", false);

    //-- verify the right complaint identifier is selected and the animal type
    cy.get(".comp-box-complaint-id").contains("23-000076");
    cy.get(".comp-box-species-type").contains("Black Bear");
  });

  it("it has correct call details", () => {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", true);

    //-- verify the call details block
    cy.get('pre[id="comp-details-description"]').contains(callDetails.description);
    cy.get('dd[id="comp-details-location"]').contains(callDetails.location);
    cy.get('dd[id="comp-details-location-description"]').should("have.value", "");
    cy.get('dd[id="comp-details-community"]').contains(callDetails.community);
    cy.get('dd[id="comp-details-office"]').contains(callDetails.office);
    cy.get('dd[id="comp-details-zone"]').contains(callDetails.zone);
    cy.get('dd[id="comp-details-region"]').contains(callDetails.region);
  });

  it("it has correct call information details", () => {
    //-- navigate to application root
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-000076", true);

    //-- verify the call details block
    cy.get('dd[id="comp-details-name"]').contains(callerInformation.name);
    cy.get('dd[id="comp-details-phone"]').contains(callerInformation.phone);
    cy.get('dd[id="comp-details-phone-2"]').should(($el) => {
      expect($el.text().trim()).equal(callerInformation.secondary);
    });
    cy.get('div[id="comp-details-phone-3"]').should(($el) => {
      expect($el.text().trim()).equal(callerInformation.alternate);
    });

    cy.get('dd[id="comp-details-address"]').contains(callerInformation.address);
    cy.get('dd[id="comp-details-email"]').contains(callerInformation.email);
    cy.get('dd[id="comp-details-reported"]').contains(callerInformation.reported);
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

  it("validates breadcrumb styles", function () {
    cy.navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-007023", true);

    cy.get(".comp-nav-item-name-inverted > a").should("have.css", "text-decoration").should("include", "underline");
    cy.get(".comp-nav-item-name-inverted > a").should("have.css", "color").should("include", "rgb(255, 255, 255)");
  });
});
