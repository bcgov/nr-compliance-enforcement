/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    kcLogin(): Chainable<Element>;
    kcLogout(): Chainable<any>;
    verifyMapMarkerExists(existIndicator: boolean) : Chainable<any>;
    typeAndTriggerChange(value: string): Chainable<void>;
    navigateToDetailsScreen(
      complaintType: string,
      complaintIdentifier: string,
      navigateByURL: boolean
    ): Chainable<any>;
    navigateToEditScreen(
      complaintType: string,
      complaintIdentifier: string,
      navigateByURL: boolean
    ): Chainable<any>;
    verifyAttachmentsCarousel(uploadable: boolean, divId: string,
    ): Chainable<any>;
    navigateToCreateScreen(): Chainable<any>;
    isInViewport(): Chainable<any>;
    waitForSpinner(): Chainable<any>;
    clearFilterById(filterId: string): Chainable<any>;
    selectItemById(selectId: string, optionText: string): Chainable<any>;
    enterDateTimeInDatePicker(datePickerId: string, day: string, hour?: string, minute?: string): Chainable<any>;
    navigateToTab(
      complaintTab: string,
      removeFilters: boolean): Chainable<void>;
  }
}
