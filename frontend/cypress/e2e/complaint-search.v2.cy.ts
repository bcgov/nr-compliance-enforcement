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
    cy.get(complaintTypes[0]).click({ force: true });

    //-- verify correct tab
    cy.get("#hwcr-tab").should("contain.text", "Human Wildlife Conflicts");

    //-- remove filters
    cy.get("#comp-status-filter").click({ force: true });
    cy.get("#comp-zone-filter").click({ force: true });

    cy.get("#comp-status-filter").should("not.exist");
    cy.get("#comp-zone-filter").should("not.exist");

    //-- open the filter tab
    cy.get("#complaint-filter-image-id").click({ force: true });

    //-- select 70 mile house community
    cy.selectItemById("community-select-id", "70 Mile House");
    cy.get("#comp-community-filter").should("exist");

    //-- close the filter
    cy.get("#complaint-filter-image-id").click({ force: true });

    //-- there should be 3 complaints
    cy.get("#complaint-list tbody").find("tr").should("have.length", 3);

    //-- search for sibling and verify there's one complaint
    cy.get("#complaint-search").click({ force: true });
    cy.get("#complaint-search").clear().type("sibling{enter}"); //-- {enter} will perform an enter keypress

    //-- verify one complaint, and verify complaint-id
    cy.get("#complaint-list tbody").find("tr").should("have.length", 1);
    cy.contains("td", "23-029788");
  });

  it("Can search Allegations for 'RAPP'", () => {
   cy.visit("/");
   cy.waitForSpinner();

   //-- load the Enforcement conflicts
   cy.get(complaintTypes[1]).click({ force: true });

   //-- verify correct tab
   cy.get("#ers-tab").should("contain.text", "Enforcement");

   //-- remove filters
   cy.get("#comp-status-filter").click({ force: true });
   cy.get("#comp-status-filter").should("not.exist");

   //-- there should be 33 complaints
   cy.get("#complaint-list tbody").find("tr").should("have.length", 33);

   //-- search for RAPP and verify there's siz complaints
   cy.get("#complaint-search").click({ force: true });
   cy.get("#complaint-search").clear().type("RAPP{enter}"); //-- {enter} will perform an enter keypress

   //-- verify one complaint, and verify complaint-id
   cy.get("#complaint-list tbody").find("tr").should("have.length", 6);
 });

 it("Search should clear when switching tabs", () => {
   cy.visit("/");
   cy.waitForSpinner();

   //-- load the Enforcement conflicts
   cy.get(complaintTypes[1]).click({ force: true });

   //-- verify correct tab
   cy.get("#ers-tab").should("contain.text", "Enforcement");

   //-- remove filters
   cy.get("#comp-status-filter").click({ force: true });
   cy.get("#comp-status-filter").should("not.exist");

   //-- there should be 33 complaints
   cy.get("#complaint-list tbody").find("tr").should("have.length", 33);

   //-- search for RAPP and verify there's siz complaints
   cy.get("#complaint-search").click({ force: true });
   cy.get("#complaint-search").clear().type("RAPP{enter}"); //-- {enter} will perform an enter keypress

   //-- verify one complaint, and verify complaint-id
   cy.get("#complaint-list tbody").find("tr").should("have.length", 6);

   //-- switch tabs
   cy.get(complaintTypes[0]).click({ force: true });

   //-- verify empty search
   cy.get("#complaint-search").should('have.value', '');
 });

 it("Can't search Wildlife complaints for 'Zebra'", () => {
   cy.visit("/");
   cy.waitForSpinner();

   //-- load the human wildlife conflicts
   cy.get(complaintTypes[0]).click({ force: true });

   //-- verify correct tab
   cy.get("#hwcr-tab").should("contain.text", "Human Wildlife Conflicts");

   //-- remove filters
   cy.get("#comp-status-filter").click({ force: true });
   cy.get("#comp-zone-filter").click({ force: true });

   cy.get("#comp-status-filter").should("not.exist");
   cy.get("#comp-zone-filter").should("not.exist");

   //-- open the filter tab
   cy.get("#complaint-filter-image-id").click({ force: true });

   //-- select 70 mile house community
   cy.selectItemById("community-select-id", "70 Mile House");
   
   cy.get("#comp-community-filter").should("exist");

   //-- close the filter
   cy.get("#complaint-filter-image-id").click({ force: true });

   //-- there should be 3 complaints
  //  cy.get("#complaint-list tbody").find("tr").should("have.length", 3);

   //-- search for sibling and verify there's one complaint
   cy.get("#complaint-search").click({ force: true });
   cy.get("#complaint-search").clear().type("Zebra{enter}"); //-- {enter} will perform an enter keypress

  //  cy.waitForSpinner();

   //-- verify no complaints
   cy.get("#complaint-list tbody").find("tr").should("have.length", 0);
 });

});
