describe("COMPENF-259 Zone at a Glance - View Complaint Stats", () => {
  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("it can navigate to zone at a glance", () => {
    //-- navigate to application root
    cy.visit("/");

    //-- navigate to the zone at a glance
    cy.get("#zone-at-a-glance-link").click({ force: true });

    //First ZAG test... might take a bit longer to spin up
    cy.get(".comp-loader-overlay", { timeout: 30000 }).should("exist");
    cy.get(".comp-loader-overlay", { timeout: 30000 }).should("not.exist");

    //-- make sure we're on the zone at a glance page
    cy.get(".comp-main-content").contains("Zone at a glance");

    //-- navigate back to complaints
    cy.get("#complaints-link").click({ force: true });

    cy.waitForSpinner();

    cy.get(".comp-page-header").contains("Complaints");
  });

  it("it has correct banner image", () => {
    //-- navigate to application root
    cy.visit("/");
  });
});
