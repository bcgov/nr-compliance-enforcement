/*
Test to verify that the status and assignment popover displays when clicking the vertical ellipsis on both the
HWLC and Enforcement list screens
*/
describe("Complaints on map tests", () => {
  const complaintTypes = ["#hwcr-tab","#ers-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  // perform the same test on each of the tabs (HWCR and ERS)
  Cypress._.times(complaintTypes.length, (index) => {
    it("Switch to map view", () => {
      cy.visit("/");

      cy.get(complaintTypes[index]).click({ force: true });

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
