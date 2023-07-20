describe("COMPENF-258 Zone at a Glance - View Office Stats", () => {
    beforeEach(function () {
      cy.viewport("macbook-16");
      cy.kcLogout().kcLogin();

        //-- navigate to zag
        cy.visit("/zone/at-a-glance");
        
        cy.get('#Clearwater Office').contains('Clearwater Office'); //assumes cypress user's office is Clearwater
        cy.get('#officerName ENV TestAcct').contains('ENV TestAcct');

    });

  });
  