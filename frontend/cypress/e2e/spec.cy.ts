describe('template spec', () => {

  beforeEach(function() {
    cy.kcLogout().kcLogin();
  });

  it('passes', () => {
    cy.visit("/");
    cy.contains("Complaints");
  })
})