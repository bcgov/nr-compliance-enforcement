describe("template spec", () => {
  beforeEach(function () {
    cy.kcLogin();
  });

  it("passes", () => {
    cy.visit("/");
    cy.contains("Complaints");
  });
});
