describe('template spec', () => {

  beforeEach(function() {
      cy.kcLogout().kcLogin();
  });

  it('loads the header', () => {

      cy.visit("/");

      // This is required to suppress cross domain errors when running locally.  Not an issue on OpenShift.
      if (Cypress.config('baseUrl') == 'http://localhost:3000')
      {
        cy.origin('http://localhost:3000', () => {
          cy.on('uncaught:exception', (e) => {
              // we expected this error, so let's ignore it
              // and let the test continue
              return false
          })
          cy.contains('Human Wildlife Conflicts');

          cy.contains('Enforcement');
        })
      } else
      {
        cy.contains('Human Wildlife Conflicts');
        
        cy.contains('Enforcement');
      }
})
})

