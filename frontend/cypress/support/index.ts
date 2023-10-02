/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    kcLogin(): Chainable<Element>;
    kcLogout(): Chainable<any>;
    verifyMapMarkerExists() : Chainable<any>;
    navigateToDetailsScreen(complaintType: string, complaintIdentifier: string) : Chainable<any>;
    navigateToEditScreen(complaintType: string, complaintIdentifier: string) : Chainable<any>;
    isInViewport() : Chainable<any>;
    waitForSpinner(): Chainable<any>;
    clearFilterById(filterId: string): Chainable<any>;
    selectItemByClass(selectClass: string, rowIndex: number) : Chainable<any>;
  }
}