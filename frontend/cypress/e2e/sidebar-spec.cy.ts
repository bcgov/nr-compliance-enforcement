describe("sidebar open close spec", () => {
  beforeEach(function () {
    cy.kcLogin();
  });

  it("passes", () => {
    cy.visit("/");
  });
});
