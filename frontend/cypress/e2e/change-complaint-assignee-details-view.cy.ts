

/*
Test to verify that the user is able to change the assignee both the
HWLC and Enforcement details screens
*/
describe('Complaint Change Assignee spec - Details View', () => {
  
  const complaintTypes = ['#hwcr-tab', '#ers-tab'];

  beforeEach(function() {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  Cypress._.times(complaintTypes.length, ((index) => {

    it('Changes assignee of a complaint', () => {
      //-- navigate to application root
      cy.visit("/");

      //-- click on Tab tab
      cy.get(complaintTypes[index]).click({ force: true });

      cy.get('.comp-loader-overlay').should('not.exist');

      cy.get("#comp-table > tbody > tr:nth-child(1) td.comp-location-cell.comp-cell").click({ force: true });
      cy.get('.comp-loader-overlay').should('not.exist');
      cy.get('#details-screen-assign-button').click({ force: true });
      cy.get('.comp-loader-overlay').should('not.exist');
      // self assign the complaint
      cy.get('#self_assign_button').click({force: true});
      cy.get('.comp-loader-overlay').should('not.exist');
      cy.get('#comp-details-assigned-officer-name-text-id').contains('ENV TestAcct').should('exist');
    });
  }));
});