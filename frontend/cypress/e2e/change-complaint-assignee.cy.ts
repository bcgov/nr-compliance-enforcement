/*
Test to verify that the status and assignment popover displays when clicking the vertical ellipsis on both the
HWLC and Enforcement list screens
*/
describe('Complaint Assign Popover spec', () => {

  beforeEach(function() {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it('Changes assignee of complaint', () => {
    cy.visit("/");
    cy.get('.popover').should('not.exist');

    cy.get('td.comp-ellipsis-cell').first() // finds the buttons cell of that row
          .click({force: true});

    cy.get('.popover').should('exist');
    cy.get('.popover').get('div#assign_complaint_link').click();

    // self assign the complaint
    cy.get('#self_assign_button').click();

  });
})