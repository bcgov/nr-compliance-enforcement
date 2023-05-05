describe('template spec', () => {

  beforeEach(function() {
    cy.kcLogout().kcLogin();
  });

  it('passes', () => {

      cy.visit("/");

      cy.contains('Add Amount').click();

      cy.get('#counter').should('contain', '2');

      /* ==== Generated with Cypress Studio ==== */
      cy.get('.Counter_asyncButton__hwwx\\+').click();
      /* ==== End Cypress Studio ==== */

      cy.get('#counter').should('contain', '4');

      /* ==== Generated with Cypress Studio ==== */
      cy.contains('Add If Odd').click();
      /* ==== End Cypress Studio ==== */

      cy.get('#counter').should('contain', '4');
})
})