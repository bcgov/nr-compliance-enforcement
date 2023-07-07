

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

      cy.wait(7000);

      cy.get("#comp-table > tbody > tr:nth-child(2) td.comp-location-cell.comp-cell").click({ force: true });
      cy.wait(5000);
      cy.get('#details-screen-assign-button').click({ force: true });
      cy.wait(1000);
      // self assign the complaint
      cy.get('#self_assign_button').click({force: true});
      cy.wait(5000);
      cy.get('#comp-details-assigned-officer-name-text-id').contains('ENV TestAcct').should('exist');
    });
  }));
});