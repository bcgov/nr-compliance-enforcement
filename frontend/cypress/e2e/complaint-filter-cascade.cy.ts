//This is probably only useful for this test, so it's not a command.
function verifyFilters(expectedZones: number, expectedRegions: number, expectedCommunities: number) {
  cy.get(
    "#region-select-filter-id > .comp-select__control > .comp-select__value-container > .comp-select__input-container",
  ).click({ force: true });
  cy.get(".comp-select__menu-list")
    .find("div")
    .then(({ length }) => {
      expect(length, "rows N").to.be.eq(expectedZones);
    });
  cy.get(
    "#region-select-filter-id > .comp-select__control > .comp-select__value-container > .comp-select__input-container",
  ).click({ force: true });

  cy.get(
    "#zone-select-id > .comp-select__control > .comp-select__value-container > .comp-select__input-container",
  ).click({ force: true });
  cy.get(".comp-select__menu-list")
    .find("div")
    .then(({ length }) => {
      expect(length, "rows N").to.be.eq(expectedRegions);
    });
  cy.get(
    "#zone-select-id > .comp-select__control > .comp-select__value-container > .comp-select__input-container",
  ).click({ force: true });

  cy.get(
    "#community-select-id > .comp-select__control > .comp-select__value-container > .comp-select__input-container",
  ).click({ force: true });
  cy.get(".comp-select__menu-list")
    .find("div")
    .then(({ length }) => {
      expect(length, "rows N").to.be.eq(expectedCommunities);
    });
  cy.get(
    "#community-select-id > .comp-select__control > .comp-select__value-container > .comp-select__input-container",
  ).click({ force: true });
}

/*
Test to verify that the filter types: region, zone, and communities cascade based
on what is and isn't selected. ie when the region is selected, the zone and 
communities filter options are filtered to only display options associated with 
the selected region
*/
describe("Complaint Filter Cascading spec", () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];
  const maxRegions = 8;
  const maxZones = 22;
  const maxCommunities = 971;

  beforeEach(function () {
    cy.viewport(1700, 960);
    cy.kcLogout().kcLogin();
  });

  it("Verifies filters are not cascaded", () => {
    //-- load the page and remove existing default filters
    cy.visit("/");
    cy.waitForSpinner();

    cy.navigateToTab(complaintTypes[0], true);

    cy.get("#comp-filter-btn").click({ force: true });

    verifyFilters(maxRegions, maxZones, maxCommunities);
  });

  it("Verifies zone and communities are cascaded when selecting a region", () => {
    //-- arrange
    const _selected = "West Coast";

    const _totalRegions = 1;
    const _totalZones = 3;
    const _totalCommunities = 127;

    //-- load the page and remove existing default filters
    cy.visit("/");
    cy.waitForSpinner();

    cy.navigateToTab(complaintTypes[0], true);

    cy.get("#comp-filter-btn").click({ force: true });

    //-- select region
    cy.selectItemById("region-select-filter-id", _selected);

    verifyFilters(_totalRegions, _totalZones, _totalCommunities);
  });

  it("Verifies communities are cascaded when selecting a zone", () => {
    //-- arrange
    const _selected = "Fraser North";

    const _totalRegions = 1;
    const _totalZones = 1;
    const _totalCommunities = 27;

    //-- load the page and remove existing default filters
    cy.visit("/");
    cy.waitForSpinner();

    cy.navigateToTab(complaintTypes[0], true);

    cy.get("#comp-filter-btn").click({ force: true });

    //-- select region
    cy.selectItemById("zone-select-id", _selected);

    verifyFilters(_totalRegions, _totalZones, _totalCommunities);
  });

  it("Verifies regions and zones are cascaded when selecting a community", () => {
    //-- arrange
    const _selected = "Cluculz Lake";

    const _totalRegions = 1;
    const _totalZones = 1;
    const _totalCommunities = 971;

    //-- load the page and remove existing default filters
    cy.visit("/");
    cy.waitForSpinner();

    cy.navigateToTab(complaintTypes[0], true);

    cy.get("#comp-filter-btn").click({ force: true });

    //-- select region
    cy.selectItemById("community-select-id", _selected);

    verifyFilters(_totalRegions, _totalZones, _totalCommunities);
  });
});
