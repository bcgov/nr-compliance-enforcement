/*
Test to verify that the user can see the pagination and interact with it
*/
describe('Complaint Paginate from list view', () => {

  const complaintTypes = ['#hwcr-tab', '#ers-tab'];

  beforeEach(function() {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  // test all types of complaints
  Cypress._.times(complaintTypes.length, ((index) => {

    it('Verifies pagination exists', () => {


      cy.visit("/");
      cy.get('.comp-loader-overlay').should('exist');
      cy.get('.comp-loader-overlay').should('not.exist');
      
      cy.get(complaintTypes[index]).click({ force: true });
      

      cy.get(".comp-loader-overlay").should("exist");
      cy.get(".comp-loader-overlay").should("not.exist");
    
      cy.get("#comp-zone-close").click({ force: true }); //clear zone filter so this complaint is in the list view
      
      cy.get("#complaint_pagination_container_id").should("exist");

    });
  }));
});