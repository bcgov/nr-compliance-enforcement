/*
Test to verify that the status and assignment popover displays when clicking the vertical ellipsis on both the
HWLC and Enforcement list screens
*/
describe('Complaint Assign and Status Popover spec', () => {

  const complaintTypes = ['#hwcr-tab', '#ers-tab'];

  beforeEach(function() {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  Cypress._.times(complaintTypes.length, ((index) => {
  
    it('Changes status of open complaint to closed and back to open', () => {
      cy.visit("/");
      cy.get(complaintTypes[index]).click({ force: true });

      cy.wait(5000);
      cy.get('.popover').should('not.exist');


      // Find the number of closed complaints
      // This number should change if a complaint is changed from closed to open
      cy.get('table tr').filter(':contains("Open")').as('openRows');

      // Find the first closed complaint and click the ellipsis
      cy.get("@openRows")
        .first()
        .within(($tr) => { // filters just that row
          cy.get('td.comp-ellipsis-cell') // finds the buttons cell of that row
            .click({force: true});
        });
      cy.get('.popover').should('exist');
      cy.get('.popover').get('div#update_status_link').click();

      cy.get('#complaint_status_dropdown').click();
      cy.wait(2000);
      // Select the option with value "Closed"
      cy.get('.react-select__option')
        .contains('Closed')
        .click();

      cy.get('#update_complaint_status_button').click();

      cy.wait(5000);

      cy.get('table tr').filter(':contains("Closed")').should('have.length.at.least', 1);


      // Find the number of closed complaints
      // This number should change if a complaint is changed from closed to open
      cy.get('table tr').filter(':contains("Closed")').as('closedRows');

      // Find the first closed complaint and click the ellipsis
      cy.get("@closedRows")
        .first()
        .within(($tr) => { // filters just that row
          cy.get('td.comp-ellipsis-cell') // finds the buttons cell of that row
            .click({force: true});
        });
      cy.get('.popover').should('exist');
      cy.get('.popover').get('div#update_status_link').click();

      cy.get('#complaint_status_dropdown').click()
      cy.wait(2000);
      // Select the option with value "OPEN"
      cy.get('.react-select__option')
        .contains('Open')
        .click();

      cy.get('#update_complaint_status_button').click();
      cy.get('table tr').filter(':contains("Open")').should('have.length.at.least', 1);
      cy.wait(5000);
    });
  }));
})