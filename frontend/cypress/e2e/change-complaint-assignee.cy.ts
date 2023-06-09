/*
Test to verify that the status and assignment popover displays when clicking the vertical ellipsis on both the
HWLC and Enforcement list screens
*/
describe('Complaint Assign Popover spec', () => {

  const complaintTypes = ['#hwcr-tab', '#ers-tab'];

  beforeEach(function() {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  Cypress._.times(complaintTypes.length, ((index) => {
  
    it('Changes assignee of complaint', () => {
      cy.visit("/");
      cy.get(complaintTypes[index]).click({ force: true });
      cy.wait(5000);
      cy.get('.popover').should('not.exist');

      cy.get('td.comp-ellipsis-cell').first() // finds the buttons cell of that row
            .click({force: true});

      cy.get('.popover').should('exist');
      cy.get('.popover').get('div#assign_complaint_link').click();

      // self assign the complaint
      cy.get('#self_assign_button').click();

    });
  }));
})