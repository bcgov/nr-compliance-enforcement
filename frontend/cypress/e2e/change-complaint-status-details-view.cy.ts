/*
Test to verify that the user is able to change the status both the
HWLC and Enforcement details screens
*/
describe('Complaint Change Status spec - Details View', () => {

  const complaintTypes = ['#hwcr-tab', '#ers-tab'];

  beforeEach(function() {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  Cypress._.times(complaintTypes.length, ((index) => {

    it('Changes status of complaint to open, closed, and back to open', () => {
      
      cy.visit("/");

      //-- click on HWCR tab
      cy.get(complaintTypes[index]).click({ force: true });

      cy.wait(5000);

      //-- check to make sure there are items in the table
      cy.get("#comp-table")
        .find("tr")
        .then(({ length }) => {
          expect(length, "rows N").to.be.gt(0);
        });
      cy.wait(2000);
      cy.get("#comp-table > tbody > tr:nth-child(1) td.comp-location-cell.comp-cell").click({ force: true });

      cy.window().scrollTo('top')

      cy.get('#details-screen-update-status-button').click({ force: true });

      cy.get('#complaint_status_dropdown').click();

      // Select the option with value "Closed"
      cy.get('.react-select__option')
        .contains('Closed')
        .click()

      cy.get('#update_complaint_status_button').click();

      cy.wait(5000);

      cy.get('#comp-details-status-text-id').contains('CLOSED').should('exist');

      cy.get('#details-screen-update-status-button').click({ force: true });

      cy.get('#complaint_status_dropdown').click()

      // Select the option with value "Opened"
      cy.get('.react-select__option')
        .contains('Open')
        .click()

      cy.get('#update_complaint_status_button').click();
      cy.wait(5000);

      cy.get('#comp-details-status-text-id').contains('OPEN').should('exist');

    });
  }));
});