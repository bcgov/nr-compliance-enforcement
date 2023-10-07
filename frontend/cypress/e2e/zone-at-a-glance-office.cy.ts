describe("COMPENF-258 Zone at a Glance - View Office Stats", () => {
    beforeEach(function () {
      cy.viewport("macbook-16");
      cy.kcLogout().kcLogin();
    });

    it("it should have an office with an officer", () => {
      cy.visit("/zone/at-a-glance");

      cy.get('.comp-loader-overlay').should('exist');
      cy.get('.comp-loader-overlay').should('not.exist');
      cy.get('#Clearwater\\ Office').should('exist'); //assumes cypress user's office is Clearwater
      //Expand the Clearwater Box
      cy.get('.comp-zag-office > div > img').eq(1).click();  //Assumes Clearwater is second office
      cy.get('#officerNameENV\\ TestAcct').should('exist');
      /* ==== End Cypress Studio ==== */
    });

  });
  