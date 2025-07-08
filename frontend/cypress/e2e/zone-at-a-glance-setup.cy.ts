describe("COMPENF-137 Zone at a Glance - Page Set Up", () => {
  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("it should have more than one link", () => {
    //-- navigate to application root
    cy.visit("/");

    //-- there should be more than one link in the side bar
    cy.get(".comp-sidenav-list")
      .find("a")
      .then(({ length }) => {
        expect(length, "rows N").to.be.gt(1);
      });
  });

  it("it has link to zone at a glance", () => {
    //-- navigate to application root
    cy.visit("/");

    //-- sidebar should have link to zone at a glance
    cy.get(".comp-sidenav-list")
      .find("a")
      .then((items) => {
        const list = Array.from(items, (item) => {
          return item.getAttribute("href");
        });
        expect(list).to.include("/zone/at-a-glance");
      });
  });

  it("it can navigate to zone at a glance", () => {
    //-- navigate to application root
    cy.visit("/");

    //-- navigate to the zone at a glance
    cy.get("#icon-zone-at-a-glance-link").click();

    cy.waitForSpinner();

    //-- make sure we're on the zone at a glance page
    cy.get(".comp-main-content").contains("Zone at a glance");

    //-- navigate back to complaints
    cy.get("#icon-complaints-link").click();

    cy.waitForSpinner();

    cy.get(".comp-page-header").contains("Complaints");
  });
});
