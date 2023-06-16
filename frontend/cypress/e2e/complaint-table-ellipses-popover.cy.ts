/*
Test to verify that the status and assignment popover displays when clicking the vertical ellipsis on both the
HWLC and Enforcement list screens
*/
describe('Complaint Assign and Status Popover spec', () => {

  beforeEach(function() {
    cy.kcLogout().kcLogin();
  });

  it('Changes status of closed complaint to open', () => {
    cy.visit("/");
    cy.get('.popover').should('not.exist');
    // Trigger the popover
    cy.scrollTo('right');//scroll over so we can watch the popover appear

    // Find the number of closed complaints
    // This number should change if a complaint is changed from closed to open
    let closedCount = cy.contains('td.comp-status-cell', 'Closed').its.length;

    // Find the first open complaint and click the ellipsis
    cy.contains('td.comp-status-cell', 'Closed')
      .first()
      .parent()
      .within(($tr) => { // filters just that row
        cy.get('td.comp-ellipsis-cell') // finds the buttons cell of that row
          .click({force: true});
      });
    cy.get('.popover').should('exist');
    cy.get('.popover').contains('Update Status').click();

    let closedCountAfterStatusChange = cy.contains('td.comp-status-cell', 'Closed').its.length;

    // the count of closed items should have changed
    expect(closedCount).to.not.equal(closedCountAfterStatusChange);
  });

  it('Changes status of open complaint to closed', () => {
    cy.visit("/");
    cy.get('.popover').should('not.exist');
    // Trigger the popover
    cy.scrollTo('right');//scroll over so we can watch the popover appear

    // Find the first open complaint and click the ellipsis
    cy.contains('td.comp-status-cell', 'Open')
      .first()
      .parent()
      .within(($tr) => { // filters just that row
        cy.get('td.comp-ellipsis-cell') // finds the buttons cell of that row
          .click({force: true});
      });
    cy.get('.popover').should('exist');
    cy.get('.popover').contains('Update Status').should('exist');    
  });
})