describe("COMPENF-138 - loading spinner", () => {
  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it("passes", () => {
    cy.visit("/");
  });
  
});
