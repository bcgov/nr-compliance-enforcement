

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
      cy.visit("/");
      cy.get(complaintTypes[index]).click({ force: true });
      //-- check to make sure there are items in the table
      cy.get("#comp-table")
      .find("tr")
      .then(({ length }) => {
        expect(length, "rows N").to.be.gt(0);
      });
    
      cy.get("#comp-table > tbody > tr:nth-child(2)  > td.comp-last-updated-cell.comp-cell").click({ force: true });

      cy.window().scrollTo('top')
      cy.wait(2000);
      cy.get('#details_screen_assign_button').click({ force: true });

      // self assign the complaint
      cy.get('#self_assign_button').click();
    });
  }));
});