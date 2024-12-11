/*
Test to verify that the status and assignment popover displays when clicking the vertical ellipsis on both the
HWLC and Enforcement list screens
*/
describe("Complaints on map tests", () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  // perform the same test on each of the tabs (HWCR and ERS)
  Cypress._.times(complaintTypes.length, (index) => {
    it("Verify filters work and are maintained between list and map view", () => {
      cy.visit("/");
      cy.waitForSpinner();

      cy.get(complaintTypes[index]).click({ force: true });

      // switch to map view
      cy.get("#map_toggle_id").should("exist").click({ force: true });

      // wait for the map to load
      cy.wait(1000);

      // verify default filters
      cy.get("#comp-status-filter").should("exist");
      cy.get("#comp-zone-filter").should("exist");

      cy.get("#comp-zone-filter").click({ force: true }); //clear zone filter so this complaint is in the list view

      // verify no other filters exist
      cy.get("#comp-officer-filter").should("not.exist");
      cy.get("#comp-community-filter").should("not.exist");
      cy.get("#comp-region-filter").should("not.exist");

      if ("#hwcr-tab".includes(complaintTypes[index])) {
        cy.get("#comp-species-filter").should("not.exist");
        cy.get("#comp-nature-of-complaint-filter").should("not.exist");
      } else {
        cy.get("#comp-violation-filter").should("not.exist");
      }

      // find how many markers there are, we'll compare this to the count after another filter is applied
      cy.get(".leaflet-marker-icon").its("length").as("complaintCountWithoutFilters");

      cy.get("#comp-filter-btn").click({ force: true });

      if ("#hwcr-tab".includes(complaintTypes[index])) {
        // add the hwcr filters
        // add the region filter
        cy.selectItemById("region-select-filter-id", "Thompson Cariboo");
        cy.selectItemById("zone-select-id", "Cariboo Thompson");
        cy.selectItemById("community-select-id", "Blue River");

        cy.selectItemById("nature-of-complaint-select-id", "Food Conditioned");
        cy.selectItemById("species-select-id", "Black Bear");
      } else {
        // add the alegation filters
        // add the region filter
        cy.selectItemById("region-select-filter-id", "Okanagan");
        cy.selectItemById("zone-select-id", "North Okanagan");
        cy.selectItemById("community-select-id", "Grindrod");

        cy.selectItemById("violation-type-select-id", "Dumping");
      }

      // count the markers again, they should now have a different count
      cy.get(".leaflet-marker-icon").its("length").as("complaintCountWithFilters");

      cy.wrap("@complaintCountWithoutFilters").should("not.eq", "@complaintCountWithFilters");

      // switch back to list view to verify filters are still applied
      cy.get("#list_toggle_id").click({ force: true });

      // verify the filters still exits
      cy.get("#comp-status-filter").should("exist");
      cy.get("#comp-zone-filter").should("exist");
      cy.get("#comp-community-filter").should("exist");
      cy.get("#comp-region-filter").should("exist");

      if ("#hwcr-tab".includes(complaintTypes[index])) {
        // add the hwcr filters
        cy.get("#comp-species-filter").should("exist");
        cy.get("#comp-nature-of-complaint-filter").should("exist");
      } else {
        cy.get("#comp-violation-filter").should("exist");
      }
    });

    // test to verify that user can switch to map view and click a marker to see popup
    it("Switch to map view and click marker", () => {
      cy.visit("/");
      cy.waitForSpinner();
      cy.get(complaintTypes[index]).click({ force: true });

      cy.get("#comp-zone-filter").should("exist").click({ force: true }); //clear status filter so this complaint is in the list view
      cy.get("#list_toggle_id").should("exist");
      cy.get("#map_toggle_id").should("exist"); //verifies that the list/map toggle button appears.  Click the map view
      cy.get("#map_toggle_id").click({ force: true });

      // wait for the map to load
      cy.wait(1000);

      cy.get("#comp-filter-btn").click({ force: true });
      cy.selectItemById("community-select-id", "Kelowna");

      // wait for the map to load
      cy.wait(1000);

      cy.get("div.leaflet-container").should("exist");

      cy.get(".leaflet-popup").should("not.exist");
      cy.wait(1000);

      cy.get(".leaflet-marker-icon").each(($marker, index) => {
        // Click the first marker (index 0)
        if (index === 0) {
          cy.wrap($marker).should("exist").click({ force: true });
        }
      });

      // wait for the popup to load

      cy.get(".leaflet-popup").should("exist");

      if ("#hwcr-tab".includes(complaintTypes[index])) {
        cy.get("#popup-community-label").should("exist");
        cy.get("#popup-community-label").should("have.text", "Kelowna");
      }

      // click the "view details" button to navigate to the complaint
      cy.get("#view-complaint-details-button-id").click({ force: true });

      cy.waitForSpinner();
    });

    it("Verify banner is displayed when no results", () => {
      cy.visit("/");
      cy.waitForSpinner();

      cy.get(complaintTypes[index]).click({ force: true });

      // switch to map view
      cy.get("#map_toggle_id").should("exist").click({ force: true });

      // wait for the map to load
      cy.wait(1000);

      // verify default filters
      cy.get("#comp-status-filter").should("exist");
      cy.get("#comp-zone-filter").should("exist");

      cy.get("#comp-zone-filter").click({ force: true }); //clear zone filter so this complaint is in the list view

      // verify no other filters exist
      cy.get("#comp-officer-filter").should("not.exist");
      cy.get("#comp-community-filter").should("not.exist");
      cy.get("#comp-region-filter").should("not.exist");

      if ("#hwcr-tab".includes(complaintTypes[index])) {
        cy.get("#comp-species-filter").should("not.exist");
        cy.get("#comp-nature-of-complaint-filter").should("not.exist");
      } else {
        cy.get("#comp-violation-filter").should("not.exist");
      }

      //-- search for sibling and verify there's one complaint
      cy.get("#complaint-search").click({ force: true });
      cy.get("#complaint-search").clear().type("123456789qawsedrftg{enter}"); //-- {enter} will perform an enter keypress

      cy.get("#complaint-no-results-notification").should("exist");
    });
  });
});
