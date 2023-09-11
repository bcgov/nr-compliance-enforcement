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
    phone: "250-556-1234",
    cell: "",
    alternate: "",
    address: "437 Fake St",
    email: "tester@gmail.com",
    referred: "Conservation Officer Service",
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

    cy.get(".comp-loader-overlay").should("not.exist");

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
    cy.get("#hwcr-tab").click({ force: true });
    cy.get(".comp-loader-overlay").should("not.exist");
    cy.get("#comp-zone-close").click({ force: true }); //clear zone filter so this complaint is in the list view
    cy.get(".comp-loader-overlay").should("not.exist");
    //-- check to make sure there are items in the table
    cy.get("#comp-table")
      .find("tr")
      .then(({ length }) => {
        expect(length, "rows N").to.be.gt(0);
      });

    cy.get("#comp-table > tbody > tr > td.comp-small-cell")
      .contains("23-000076")
      .click({ force: true });

    //-- verify the right complaint identifier is selected and the animal type
    cy.get(".comp-box-complaint-id").contains("23-000076");
    cy.get(".comp-box-species-type").contains("Black Bear");
  });

  it("it has correct call details", () => {
    //-- navigate to application root
    cy.visit("/");

    //-- click on HWCR tab
    cy.get("#hwcr-tab").click({ force: true });

    cy.get(".comp-loader-overlay").should("exist");
    cy.get(".comp-loader-overlay").should("not.exist");

    cy.get("#comp-zone-close").click({ force: true }); //clear zone filter so this complaint is in the list view

    cy.get(".comp-loader-overlay").should("exist");
    cy.get(".comp-loader-overlay").should("not.exist");

    //-- check to make sure there are items in the table
    cy.get("#comp-table")
      .find("tr")
      .then(({ length }) => {
        expect(length, "rows N").to.be.gt(0);
      });

    cy.get("#comp-table > tbody > tr > td.comp-small-cell")
      .contains("23-000076")
      .click({ force: true });

    //-- verify the call details block
    cy.get(
      "comp-description"
    ).contains(callDetails.description);
    cy.get(
      "#root > div > div.comp-main-content > div > div:nth-child(4) > div > div > div.comp-padding-left-28.col-md-6 > div:nth-child(1) > div.comp-details-content"
    ).contains(callDetails.location);
    cy.get(
      "#root > div > div.comp-main-content > div > div:nth-child(4) > div > div > div.comp-padding-left-28.col-md-6 > div:nth-child(4) > span.comp-details-content"
    ).contains(callDetails.community);
    cy.get(
      "#root > div > div.comp-main-content > div > div:nth-child(4) > div > div > div.comp-padding-left-28.col-md-6 > div:nth-child(5) > span.comp-details-content"
    ).contains(callDetails.office);
    cy.get(
      "#root > div > div.comp-main-content > div > div:nth-child(4) > div > div > div.comp-padding-left-28.col-md-6 > div:nth-child(6) > span.comp-details-content"
    ).contains(callDetails.zone);
    cy.get(
      "#root > div > div.comp-main-content > div > div:nth-child(4) > div > div > div.comp-padding-left-28.col-md-6 > div:nth-child(7) > span.comp-details-content"
    ).contains(callDetails.region);
  });

  it("it has correct call information details", () => {
    //-- navigate to application root
    cy.visit("/");

    //-- click on HWCR tab
    cy.get("#hwcr-tab").click({ force: true });

    cy.get(".comp-loader-overlay").should("exist");
    cy.get(".comp-loader-overlay").should("not.exist");

    cy.get("#comp-zone-close").click({ force: true }); //clear zone filter so this complaint is in the list view

    cy.get(".comp-loader-overlay").should("exist");
    cy.get(".comp-loader-overlay").should("not.exist");

    //-- check to make sure there are items in the table
    cy.get("#comp-table")
      .find("tr")
      .then(({ length }) => {
        expect(length, "rows N").to.be.gt(0);
      });

    cy.get("#comp-table > tbody > tr > td.comp-small-cell")
      .contains("23-000076")
      .click({ force: true });

    //-- verify the call details block
    cy.get(
      "#root > div > div.comp-main-content > div > div:nth-child(6) > div > div > div:nth-child(1) > div:nth-child(1) > div.comp-details-content"
    ).contains(callerInformation.name);
    cy.get(
      "#root > div > div.comp-main-content > div > div:nth-child(6) > div > div > div:nth-child(1) > div:nth-child(2) > div.comp-details-content"
    ).contains(callerInformation.phone);
    cy.get(
      "#root > div > div.comp-main-content > div > div:nth-child(6) > div > div > div:nth-child(1) > div:nth-child(3) > div.comp-details-content"
    ).should(($el) => {
      expect($el.text().trim()).equal(callerInformation.cell);
    });
    cy.get(
      "#root > div > div.comp-main-content > div > div:nth-child(6) > div > div > div:nth-child(1) > div:nth-child(4) > div.comp-details-content"
    ).should(($el) => {
      expect($el.text().trim()).equal(callerInformation.alternate);
    });

    cy.get(
      "#root > div > div.comp-main-content > div > div:nth-child(6) > div > div > div:nth-child(2) > div:nth-child(1) > div.comp-details-content"
    ).contains(callerInformation.address);
    cy.get(
      "#root > div > div.comp-main-content > div > div:nth-child(6) > div > div > div:nth-child(2) > div:nth-child(2) > div.comp-details-content"
    ).contains(callerInformation.email);
    cy.get(
      "#root > div > div.comp-main-content > div > div:nth-child(6) > div > div > div:nth-child(2) > div:nth-child(3) > div.comp-details-content"
    ).contains(callerInformation.referred);
  });

  it("it has a map on screen with a marker at the correct location", function () {
    cy.navigateToHWLCDetailsScreen("23-007023");

    // get the x and y coordinates
    cy.get("#call-details-x-coordinate-div")
      .invoke("text")
      .as("xCoordinateDivContent")
      .should("exist");

    cy.get("#call-details-y-coordinate-div")
      .invoke("text")
      .as("yCoordinateDivContent")
      .should("exist");

    cy.verifyMapMarkerExists();

  });
});
