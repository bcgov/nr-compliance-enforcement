/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    kcLogin(): Chainable<Element>;
    kcLogout(): Chainable<any>;
    verifyMapMarkerExists() : Chainable<any>;
    navigateToHWLCDetailsScreen(complaintIdentifier: string) : Chainable<any>;
    navigateToHWLCEditScreen(complaintIdentifier: string) : Chainable<any>;
    navigateToAllegationDetailsScreen(complaintIdentifier: string) : Chainable<any>;
    navigateToAllegationEditScreen(complaintIdentifier: string) : Chainable<any>;
    typeAndTriggerChange(value: string): Chainable<void>;
    isInViewport() : Chainable<any>;
  }
}