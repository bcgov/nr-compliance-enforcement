/*
Tests to verify COS Filter logic
*/
describe("COS Filter Logic", () => {
  const complaintTypes = ["#hwcr-tab", "#ers-tab"];

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  Cypress._.times(complaintTypes.length, (index) => {
    it("Verifies filters are available and defaults exist", () => {
      cy.visit("/");
      cy.waitForSpinner();

      cy.get(complaintTypes[index]).click({ force: true });

      //-- check to make sure there are items in the table
      cy.get("#complaint-list")
        .find("tr")
        .then(({ length }) => {
          expect(length, "rows N").to.be.gt(0);
        });

      cy.get("#comp-filter-btn").click({ force: true });

      cy.get("#comp-filter-region-id").should("exist");
      cy.get("#comp-filter-zone-id").should("exist");
      cy.get("#comp-filter-community-id").should("exist");
      cy.get("#comp-park-filter").should("not.exist");
      cy.get("#comp-filter-officer-id").should("exist");
      if ("#hwcr-tab" === complaintTypes[index]) {
        cy.get("#comp-filter-nature-of-complaint-id").should("exist"); //only hwrc
        cy.get("#comp-filter-violation-id").should("not.exist"); //only ers
        cy.get("#comp-species-filter-id").should("exist"); //only hwrc
      } else {
        cy.get("#comp-nature-of-complaint-filter").should("not.exist"); //only hwrc
        cy.get("#comp-filter-violation-id").should("exist"); //only ers
        cy.get("comp-species-filter-id").should("not.exist"); //only hwrc
      }
      cy.get("#comp-filter-date-id").should("exist");
      cy.get("#comp-filter-status-id").should("exist");

      cy.get("#comp-zone-filter").should("exist");
      cy.get("#comp-status-filter").should("exist");

      cy.get("#comp-zone-filter").contains("Cariboo Thompson"); //assumes cypress user's office roles up to Cariboo Thompson zone
      cy.get("#comp-status-filter").contains("Open");

      cy.get("#comp-filter-btn").click({ force: true });
    });

    it("Can filter on Unassigned", () => {
      cy.visit("/");
      cy.waitForSpinner();

      cy.get(complaintTypes[index]).click({ force: true });

      //-- check to make sure there are items in the table
      cy.get("#complaint-list")
        .find("tr")
        .then(({ length }) => {
          expect(length, "rows N").to.be.gt(0);
        });

      cy.get("#comp-filter-btn").click({ force: true });
      cy.selectItemById("officer-select-id", "Unassigned");
      cy.get("#comp-officer-filter").should("exist");
      cy.get("#comp-officer-filter").contains("Unassigned");
    });
  });
});
