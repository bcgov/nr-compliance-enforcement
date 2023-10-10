describe("COMPENF-138 - loading spinner", () => {
  const selectors = { 
    loadingSpinner: "#page-loader"
  }

  beforeEach(function () {
    cy.viewport("macbook-16");
    cy.kcLogout().kcLogin();
  });

  it('should show the loading spinner when loading the data then hide it afterwards', () => {

    // Create a Promise and capture a reference to its resolve
    // function so that we can resolve it when we want to:
    let sendResponse;
    const trigger = new Promise((resolve) => {
      sendResponse = resolve;
    });

    // Intercept requests to the URL we are loading data from and do not
    // let the response occur until our above Promise is resolved
    cy.intercept('data-url', (request) => {
      return trigger.then(() => {
        request.reply();
      });
    });

    // Now visit the page and assert the loading spinner is shown
    cy.visit('/zone/at-a-glance');

    cy.get(selectors.loadingSpinner).should('be.visible').then(() => {
      // After we've successfully asserted the loading spinner is
      // visible, call the resolve function of the above Promise
      // to allow the response to the data request to occur...
      sendResponse();
      // ...and assert the spinner is removed from the DOM and
      // the data is shown instead.
      cy.waitForSpinner();
    });

  });
  
});