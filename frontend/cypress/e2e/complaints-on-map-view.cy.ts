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
        cy.wait(3000);
        cy.get(complaintTypes[index]).click({ force: true });

        cy.get(".comp-loader-overlay").should("exist");
        cy.get(".comp-loader-overlay").should("not.exist");

        cy.get("#comp-status-filter").should("exist");
        cy.get("#comp-status-filter").click({ force: true }); //clear status filter in list view
        cy.get("#comp-status-filter").should("not.exist");

        cy.get("#comp-zone-filter").should("exist");
        cy.get("#comp-zone-filter").click({ force: true }); //clear zone filter in list view
        cy.get("#comp-zone-filter").should("not.exist");

        cy.get(".comp-loader-overlay").should("exist");
        cy.get(".comp-loader-overlay").should("not.exist");

        cy.get("#map_toggle_id").click({ force: true });

        // wait for the map to load
        cy.get(".comp-loader-overlay").should("exist");
        cy.get(".comp-loader-overlay").should("not.exist");

        // verify the status filter is still removed
        cy.get("#comp-status-filter").should("not.exist");

        // find how many markers there are, we'll compare this to the count after another filter is applied
        cy.get(".leaflet-marker-icon")
          .its("length")
          .as("complaintCountInZone");

        cy.get('#complaint-filter-image-id').click({ force: true });

        // add the region filter
        cy.get(".comp-select__control ").first()
        .click({ force: true })
        .get(".comp-select__menu")
        .find(".comp-select__option")
        .each(($el, index, $list) => {
          if (index === 1) {
            cy.wrap($el).click({ force: true });
          }
        });

      // count the filters again, they should now have a different count
      cy.get(".leaflet-marker-icon")
        .its("length")
        .as("complaintCountInZoneAndRegion");

      cy.wrap("@complaintCountInZone").should(
        "not.eq",
        "@complaintCountInZoneAndRegion"
      );

      // switch back to map view to verify filter is still applied
      cy.get("#list_toggle_id").click({ force: true });

      cy.get("#comp-region-filter").should("exist");
      
    });

    it("Switch to map view", () => {
      cy.visit("/");
      cy.wait(3000);
      cy.get(complaintTypes[index]).click({ force: true });

      cy.get(".comp-loader-overlay").should("exist");
      cy.get(".comp-loader-overlay").should("not.exist");

      cy.get("#comp-status-filter").click({ force: true }); //clear status filter so this complaint is in the list view

      cy.get(".comp-loader-overlay").should("exist");
      cy.get(".comp-loader-overlay").should("not.exist");

      cy.get("#list_toggle_id").should("exist");
      cy.get("#map_toggle_id").should("exist"); //verifies that the list/map toggle button appears.  Click the map view
      cy.get("#map_toggle_id").click({ force: true });

      // wait for the map to load
      cy.get(".comp-loader-overlay").should("exist");
      cy.get(".comp-loader-overlay").should("not.exist");

      cy.get("div.leaflet-container").should("exist");

      cy.get(".leaflet-popup").should("not.exist");
      cy.wait(1000);

      cy.get(".leaflet-marker-icon").each(($marker, index) => {
        // Click the first marker (index 0)
        if (index === 0) {
          cy.wrap($marker).click({ force: true });
        }
      });

      // wait for the popup to load
      cy.get(".comp-loader-overlay").should("exist");
      cy.get(".comp-loader-overlay").should("not.exist");

      cy.get(".leaflet-popup").should("exist");

      // click the "view details" button to navigate to the complaint
      cy.get("#view-complaint-details-button-id").click({ force: true });

      cy.get(".comp-loader-overlay").should("exist");
      cy.get(".comp-loader-overlay").should("not.exist");
    });
  });
});
