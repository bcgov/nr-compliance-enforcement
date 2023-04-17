describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()

    cy.url().should('include', '/commands/actions')

    /* ==== Generated with Cypress Studio ==== */
    cy.get('#email1').clear('f');
    cy.get('#email1').type('fake@email.com');
    /* ==== End Cypress Studio ==== */
  })
})