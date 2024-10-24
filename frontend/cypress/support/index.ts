/// <reference types="cypress" />

declare namespace Cypress {
  export interface HwcSection {
    section: string;
    checkboxes?: string[];
    officer: string;
    date: string;
    actionRequired?: string;
    justification?: string;
    toastText?: string;
    equipmentType?: string;
  }

  interface Chainable {
    kcLogin(account?: string): Chainable<Element>;
    kcLogout(): Chainable<any>;
    verifyMapMarkerExists(existIndicator: boolean): Chainable<any>;
    typeAndTriggerChange(value: string): Chainable<void>;
    navigateToDetailsScreen(complaintType: string, complaintIdentifier: string, navigateByURL: boolean): Chainable<any>;
    navigateToEditScreen(complaintType: string, complaintIdentifier: string, navigateByURL: boolean): Chainable<any>;
    verifyAttachmentsCarousel(uploadable: boolean, divId: string): Chainable<any>;
    navigateToCreateScreen(): Chainable<any>;
    isInViewport(): Chainable<any>;
    waitForSpinner(): Chainable<any>;
    clearFilterById(filterId: string): Chainable<any>;
    selectItemById(selectId: string, optionText: string): Chainable<any>;
    enterDateTimeInDatePicker(datePickerId: string, day: string, hour?: string, minute?: string): Chainable<any>;
    navigateToTab(complaintTab: string, removeFilters: boolean): Chainable<void>;
    validateComplaint(complaintIdentifier: string, species: string): Chainable<void>;
    fillInHWCSection(section: HwcSection): Chainable<void>;
    validateHWCSection(section: HwcSection): Chainable<void>;
    hasErrorMessage(inputs: Array<string>, toastText?: string): Chainable<void>;
  }
}
