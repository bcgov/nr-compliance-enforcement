describe("sidebar open close spec", () => {
  beforeEach(function () {
    cy.kcLogout().kcLogin();
  });

  it("passes", () => {
    cy.visit("/");
  });
});
