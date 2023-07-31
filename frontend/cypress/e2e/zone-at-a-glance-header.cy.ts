describe("COMPENF-259 Zone at a Glance - View Complaint Stats", () => {
    beforeEach(function () {
      cy.viewport("macbook-16");
      cy.kcLogout().kcLogin();
    });
  
    it("it can navigate to zone at a glance", () => {
      //-- navigate to application root
      cy.visit("/");
  
      //-- navigate to the zone at a glance
      cy.get("#zone-at-a-glance-link").click({ force: true });
      cy.get('.comp-loader-overlay').should('not.exist');
      //-- make sure we're on the zone at a glance page
      cy.get('.comp-main-content').contains("Zone At a Glance")
  
      //-- navigate back to complaints
      cy.get('#complaints-link').click({ force: true });
      cy.get('.comp-loader-overlay').should('not.exist');
      cy.get("#root > div > div.comp-main-content > div.comp-sub-header").contains("Complaints")
    });

    it("it has correct banner image", () => {
        //-- navigate to application root
        cy.visit("/");

      });
  });
  