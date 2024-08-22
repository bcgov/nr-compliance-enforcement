describe("sidebar open close spec", () => {
  beforeEach(function () {
    cy.kcLogout().kcLogin();
  });

  it("agency-banner should show COS branding", () => {});

  it("agency-banner should show CEEB branding", () => {});

  it("passes", () => {
    cy.visit("/");
  });
});
