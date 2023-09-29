/*
Tests to verify complaint list specification functionality
*/
describe('Complaint List Functionality', () => {

    const complaintTypes = ['#hwcr-tab', '#ers-tab'];
  
    beforeEach(function() {
      cy.viewport("macbook-16");
      cy.kcLogout().kcLogin();
    });
  
    Cypress._.times(complaintTypes.length, ((index) => {
  
      it('Verifies the complaint tabs, filter and table header are sticky', {scrollBehavior: false}, () => {
        cy.visit("/");
        cy.get('.comp-loader-overlay').should('exist');
        cy.get('.comp-loader-overlay').should('not.exist');
        
        cy.get(complaintTypes[index]).click({ force: true });

        // remove the open filter
        cy.get('#comp-status-filter').click({ force: true });
        cy.get('#comp-zone-filter').click({ force: true });
        

        //-- check to make sure there are enough rows to scroll
        cy.get('.pagination').should('exist');

        //scroll to the bottom of the page
        cy.scrollTo('bottom');
        
        cy.get('.fixed-nav-header').isInViewport();
        cy.get('.fixed-filter-header').isInViewport();
        cy.get('.fixed-table-header').isInViewport();

      });
    }));
  });