/*
Tests to verify complaint list specification functionality
*/
describe("Complaint Search Functionality", () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("Can search Wildlife complaints for 'siblings '", () => {
    cy.visit("/");
    cy.waitForSpinner();

    //-- load the human wildlife conflicts
    cy.navigateToTab(complaintTypes[0], true);

    //-- open the filter tab
    cy.get("#comp-filter-btn").click({ force: true });

    //-- select 70 mile house community
    cy.selectItemById("community-select-id", "70 Mile House");
    cy.get("#comp-community-filter").should("exist");

    //-- close the filter
    cy.get("#comp-filter-btn").click({ force: true });

    //-- there should be 3 complaints
    cy.get("#complaint-list tbody").find("tr").should("have.length", 3);

    //-- search for sibling and verify there's one complaint
    cy.get("#complaint-search").click({ force: true });
    cy.get("#complaint-search").clear().type("sibling{enter}"); //-- {enter} will perform an enter keypress

    //-- verify one complaint, and verify complaint-id
    cy.get("#complaint-list tbody").find("tr").should("have.length", 1);
    cy.contains("td", "23-029788");
  });

  it("Can search Allegations for 'Oil' and clear search when done", () => {
    cy.visit("/");
    cy.waitForSpinner();

    //-- load the human wildlife conflicts
    cy.navigateToTab(complaintTypes[1], true);

    //-- there should be a whole page of complaints
    cy.get("#complaint-list tbody").find("tr").should("have.length.at.least", 10);

    //-- search for Oil and verify there's at least 23 complaints (this may increase as new complaints are added from WebEOC)
    cy.get("#complaint-search").click({ force: true });
    cy.get("#complaint-search").clear().type("Oil{enter}"); //-- {enter} will perform an enter keypress

    //-- verify one complaint, and verify complaint-id
    cy.get("#complaint-list tbody").find("tr").should("have.length.at.least", 23);

    //-- switch tabs
    cy.get(complaintTypes[0]).click({ force: true });

    //-- verify empty search
    cy.get("#complaint-search").should("have.value", "");
  });

  it("Can't search Wildlife complaints for 'Zebra'", () => {
    cy.visit("/");
    cy.waitForSpinner();

    //-- load the human wildlife conflicts
    cy.navigateToTab(complaintTypes[0], true);

    //-- open the filter tab
    cy.get("#comp-filter-btn").click({ force: true });

    //-- select 70 mile house community
    cy.selectItemById("community-select-id", "70 Mile House");

    cy.get("#comp-community-filter").should("exist");

    //-- close the filter
    cy.get("#comp-filter-btn").click({ force: true });

    //-- search for sibling and verify there's one complaint
    cy.get("#complaint-search").click({ force: true });
    cy.get("#complaint-search").clear().type("Zebra{enter}"); //-- {enter} will perform an enter keypress

    //-- verify no complaints
    cy.get("#complaint-list tbody").find("tr").should("have.length", 0);
  });

  it("Can search wildlife map complaints by complaint-id: 23-031562", () => {
    cy.visit("/");
    cy.waitForSpinner();

    //-- load the human wildlife conflicts
    cy.navigateToTab(complaintTypes[0], true);

    //-- search for sibling and verify there's one complaint
    cy.get("#complaint-search").click({ force: true });
    cy.get("#complaint-search").clear().type("23-031562{enter}"); //-- {enter} will perform an enter keypress

    //-- verify only one complaint
    cy.get("#complaint-list tbody").find("tr").should("have.length", 1);

    cy.get("#map_toggle_id").click({ force: true });
    cy.verifyMapMarkerExists(true);

    cy.get("#multi-point-map")
      .find(".leaflet-marker-icon")
      .should(({ length }) => {
        expect(length).to.eq(1);
      });
  });

  it("Can search multiple allegation map complaints: ", () => {
    cy.visit("/");
    cy.waitForSpinner();

    //-- load the human wildlife conflicts
    cy.navigateToTab(complaintTypes[1], false);

    //-- remove the zone filter
    cy.get("#comp-zone-filter").click({ force: true });
    cy.get("#comp-zone-filter").should("not.exist");

    //-- open the filter tab
    cy.get("#comp-filter-btn").click({ force: true });

    //-- select east kootenay zone
    cy.selectItemById("zone-select-id", "East Kootenay");
    cy.get("#comp-zone-filter").should("exist");

    cy.get("#comp-filter-btn").click({ force: true });

    //-- search for fire and verify there's multiple complaints
    cy.get("#complaint-search").click({ force: true });
    cy.get("#complaint-search").clear().type("fire{enter}"); //-- {enter} will perform an enter keypress

    cy.get("#map_toggle_id").click({ force: true });
    cy.verifyMapMarkerExists(true);

    cy.get("#multi-point-map")
      .find("div.leaflet-marker-icon")
      .should(({ length }) => {
        expect(length).to.eq(5);
      });
  });

  it.only("Can retains search parameters when navigating back to the search page", () => {
    cy.visit("/");
    cy.waitForSpinner();

    //-- load the ERS conflicts and set filters
    cy.navigateToTab(complaintTypes[1], false);
    cy.get("#comp-zone-filter").click({ force: true });
    cy.waitForSpinner();
    cy.get("#comp-zone-filter").should("not.exist");

    cy.get("#comp-filter-btn").click({ force: true });
    cy.selectItemById("region-select-filter-id", "Okanagan");
    cy.get("#comp-region-filter").should("exist");

    cy.get("#complaint-search").click({ force: true });
    cy.get("#complaint-search").clear().type("wildlife{enter}"); //-- {enter} will perform an enter keypress

    cy.get("#map_toggle_id").click({ force: true });
    cy.verifyMapMarkerExists(true);

    cy.get("#multi-point-map")
      .find("div.leaflet-marker-icon")
      .should(({ length }) => {
        expect(length).to.eq(2);
      });

    // Navigate to a different page, and return to then complaints page
    cy.get("#create-complaints-link").click({ force: true });
    cy.get("#details-screen-cancel-edit-button-top").should("exist");
    cy.get("#complaints-link").click({ force: true });

    // Verify that the search parameters set before leaving the page were retained
    cy.get("#complaint-search").should("have.value", "wildlife");
    cy.verifyMapMarkerExists(true);
    cy.get("#comp-region-filter").contains("Okanagan");

    cy.get("#multi-point-map")
      .find("div.leaflet-marker-icon")
      .should(({ length }) => {
        expect(length).to.eq(2);
      });
  });
});
