describe("sidebar open close spec", () => {
  beforeEach(function () {
    cy.viewport("macbook-16");
  });

  // it("agency-banner should show COS branding", () => {
  //   cy.kcLogout().kcLogin();
  //   cy.visit("/");

  //   cy.waitForSpinner();
  // });

  // it("agency-banner should show CEEB branding", () => {
  //   cy.kcLogout().kcLogin("keycloak_user_02");
  //   cy.visit("/");

  //   cy.waitForSpinner();
  // });

  it("passes", () => {
    cy.visit("/");
  });
});
