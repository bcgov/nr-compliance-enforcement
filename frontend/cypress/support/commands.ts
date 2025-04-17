// <reference types="cypress" />
// ***********************************************
// For comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
require("cy-verify-downloads").addCustomCommand();
require("cypress-delete-downloads-folder").addCustomCommand();

const base64url = (source) => {
  // Encode the input string as base64.
  let encodedSource = btoa(source);

  // Replace any characters that are not URL-safe.
  encodedSource = encodedSource.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  return encodedSource;
};

const sha256 = async (plain) => {
  // encode as UTF-8.
  const msgBuffer = new TextEncoder().encode(plain);

  // hash the message.
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

  // convert ArrayBuffer to Array.
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string.
  const hashHex = hashArray.map((b) => ("00" + b.toString(16)).slice(-2)).join("");

  return hashHex;
};

Cypress.Commands.add("kcLogin", (role?: string) => {
  Cypress.log({ name: "Login to Keycloak" });
  let account = "keycloak_user";

  // Convert this to a switch in the future as more roles are added to the tests
  switch (role) {
    case Cypress.env("roles").CEEB:
      account = "keycloak_user_02";
      break;
    case Cypress.env("roles").PARKS:
      account = "keycloak_user_03";
      break;
  }

  cy.log("Keyloak Login").then(async () => {
    const authBaseUrl = Cypress.env("auth_base_url");
    const realm = Cypress.env("auth_realm");
    const client_id = Cypress.env("auth_client_id");
    const redirect_uri = Cypress.config("baseUrl");

    const scope = "openid";
    const state = "123456";
    const nonce = "7890";
    const code_challenge_method = "S256";
    const kc_idp_hint = "idir";

    // Generate a code verifier using a random string of 43-128 characters.
    const code_verifier = Cypress._.random(0, 1e10).toString(36) + Cypress._.random(0, 1e10).toString(36);
    const code_challenge = base64url(await sha256(code_verifier));

    // Make the initial request to the authentication endpoint.
    cy.request({
      method: "GET",
      url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/auth`,
      qs: {
        client_id,
        redirect_uri,
        code_challenge_method,
        code_challenge,
        response_type: "code",
        scope,
        state,
        nonce,
        kc_idp_hint,
      },
      followRedirect: false, // Don't follow the redirect automatically.
    }).then((response) => {
      // Extract the location header from the response to get the redirect URL.
      const redirectUrls = response.headers.location;
      const url = Array.isArray(redirectUrls) ? redirectUrls[0] : redirectUrls;
      // Visit redirect URL.
      const credentials = {
        username: Cypress.env(account),
        password: Cypress.env("keycloak_password"),
        url: url,
      };

      // depending on if we're running the cypress tests locally or not, we may or may not ge a CORS error.
      // If the keycloak login URL is the same as the application URL, then simply visit the URL;
      // otherwise, will need to use cy.origin to avoid any CORS errors.
      if (hasSameTopLevelDomain(Cypress.env("keycloak_login_url"), Cypress.config().baseUrl)) {
        cy.visit(url);
        // Log in the user and obtain an authorization code.
        cy.get('[name="user"]').click();
        cy.get('[name="user"]').type(credentials.username);
        cy.get('[name="password"]').click();
        cy.get('[name="password"]').type(credentials.password, { log: false });
        cy.get('[name="btnSubmit"]').click();
      } else {
        // different origin, so handle CORS errors
        cy.origin(Cypress.env("keycloak_login_url"), { args: credentials }, ({ username, password, url }) => {
          cy.visit(url);
          // Log in the user and obtain an authorization code.
          cy.get('[name="user"]').click();
          cy.get('[name="user"]').type(username);
          cy.get('[name="password"]').click();
          cy.get('[name="password"]').type(password, { log: false });
          cy.get('[name="btnSubmit"]').click();
        }).then(() => {
          cy.waitForSpinner();
        });
      }
    });
  });
});

Cypress.Commands.add("kcLogout", () => {
  Cypress.log({ name: "Logout" });
  const authBaseUrl = Cypress.env("auth_base_url");
  const realm = Cypress.env("auth_realm");
  cy.request({
    url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/logout`,
  });
  cy.visit(Cypress.config().baseUrl);
  cy.on("uncaught:exception", (e) => {
    if (e.message.includes("Unexpected")) {
      // we expected this error, so let's ignore it
      // and let the test continue
      return false;
    }
  });
});

Cypress.Commands.add("hasErrorMessage", (inputs: Array<string>, toastText?: string) => {
  //validate all the inputs
  Cypress._.times(inputs.length, (index) => {
    cy.get(inputs[index]).find(".error-message").should("exist");
  });

  //validate the toast
  if (toastText) {
    cy.get(".Toastify__toast-body").then(($toast) => {
      expect($toast).to.contain.text(toastText);
    });
  }
});

Cypress.Commands.add("verifyMapMarkerExists", (existIndicator: boolean) => {
  cy.get(".leaflet-container").should("exist");
  cy.get(".leaflet-marker-icon").should(existIndicator ? "exist" : "not.exist");
});

Cypress.Commands.add(
  "navigateToDetailsScreen",
  (complaintType: string, complaintIdentifier: string, navigateByURL: boolean) => {
    if (navigateByURL) {
      cy.visit(`/complaint/${complaintType.toUpperCase()}/${complaintIdentifier}`); //errors happen without converting to upper case!

      cy.waitForSpinner();
    } // go to the list, remove filters and find complaint (must be sure it will be in the first 50 results)
    else {
      //-- navigate to application root
      cy.visit("/");

      //Need to make sure the filters are loaded before switching tabs.
      cy.waitForSpinner();

      //-- click on HWCR tab
      cy.get(`#${complaintType.toLowerCase()}-tab`).click({ force: true });

      cy.get("#comp-zone-filter").should("exist").click({ force: true }); //clear zone filter so this complaint is in the list view
      cy.get("#comp-zone-filter").should("not.exist");
      cy.waitForSpinner();

      cy.get("#comp-status-filter").should("exist").click({ force: true }); //clear status filter so this complaint is in the list view
      cy.get("#comp-status-filter").should("not.exist");
      cy.waitForSpinner();

      //-- check to make sure there are items in the table
      cy.get("#complaint-list")
        .find("tr")
        .then(({ length }) => {
          expect(length, "rows N").to.be.gt(0);
        });

      cy.get("#complaint-list > tbody > tr").contains(complaintIdentifier).click({ force: true });

      cy.waitForSpinner();
    }
  },
);

Cypress.Commands.add("verifyAttachmentsCarousel", (uploadable: boolean, divId: string) => {
  cy.get(`#${divId}`).within(() => {
    // verify the attachments section exists
    cy.get("h3").contains("attachments");

    // verify the carousel exists (since 23-000076, 23-006888 are known to have attachments)
    cy.get("div.comp-carousel").should("exist");

    if (!uploadable) {
      cy.get(".comp-attachment-upload-btn").should("not.exist");

      cy.get(".comp-attachment-slide-actions").first().invoke("attr", "style", "display: block");

      // cypress can't verify things that happen in other tabs, so don't open attachments in another tab
      cy.get(".comp-slide-download-btn").should("exist");
    }
  });
});

Cypress.Commands.add(
  "navigateToEditScreen",
  (complaintType: string, complaintIdentifier: string, navigateByUrl: boolean) => {
    cy.navigateToDetailsScreen(complaintType.toLowerCase(), complaintIdentifier, navigateByUrl);
    cy.get("#details-screen-edit-button").click({ force: true });
  },
);

Cypress.Commands.add("navigateToCreateScreen", () => {
  cy.visit("/");
  cy.waitForSpinner();
  cy.get("#create-complaints-link").click({ force: true });
});

Cypress.Commands.add("waitForSpinner", () => {
  cy.get(".comp-loader-overlay").should("exist");
  cy.get(".comp-loader-overlay").should("not.exist");
});

Cypress.Commands.add("clearFilterById", (filterId: string) => {
  cy.get(`#${filterId}`).should("exist");
  cy.get(`#${filterId}`).click({ force: true }); //clear status filter in list view
  cy.get(`#${filterId}`).should("not.exist");
});

Cypress.Commands.add("selectItemById", (selectId: string, optionText: string) => {
  cy.get(`#${selectId}`).find("div").first().click({ force: true });
  cy.get(".comp-select__menu-list").should("exist"); //Wait for the options to show
  cy.contains(`.comp-select__option`, optionText).click({ force: true });
});

Cypress.Commands.add("selectTypeAheadItemByText", (selectId: string, optionText: string) => {
  cy.get(`#${selectId}`).find("input").first().click({ force: true });
  cy.get(`#${selectId}`).find("input").first().clear().type(optionText).type("{downarrow}").type("{enter}");
});

Cypress.Commands.add(
  "enterDateTimeInDatePicker",
  (datePickerId: string, day: string, hour?: string, minute?: string) => {
    cy.get(`#${datePickerId}`)
      .click({ force: true })
      .get(`.react-datepicker__day--0${day}`)
      .should("exist")
      .first()
      .click({ force: true });

    // Locate the time input field and click it to open the time picker
    if (hour && minute) {
      cy.get(`#${datePickerId}`)
        .click({ force: true })
        .get(".react-datepicker-time__input")
        .filter("input")
        .click({ force: true })
        .type(`${hour}:${minute}`);
    }
  },
);

Cypress.Commands.add("isInViewport", { prevSubject: true }, (subject) => {
  const bottom = Cypress.$(cy.state("window")).height();
  const rect = subject[0].getBoundingClientRect();

  expect(rect.top).not.to.be.least(bottom, `Expected element not to be below the visible scrolled area`);
  expect(rect.top).to.be.least(0, `Expected element not to be above the visible scrolled area`);

  return subject;
});

function hasSameTopLevelDomain(url1: string, url2: string): boolean {
  const tld1 = extractTopLevelDomain(url1);
  const tld2 = extractTopLevelDomain(url2);

  return tld1 === tld2;
}

function extractTopLevelDomain(url: string): string {
  const domain = new URL(url).hostname;
  const parts = domain.split(".");
  const tld = parts.slice(-2).join(".");

  return tld;
}

Cypress.Commands.add("typeAndTriggerChange", { prevSubject: "element" }, (subject, value) => {
  const element = subject[0];

  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;

  nativeInputValueSetter?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
});

Cypress.Commands.add("navigateToTab", (complaintTab: string, removeFilters: boolean) => {
  //-- load the human wildlife conflicts
  cy.get(complaintTab).click({ force: true });

  //-- verify correct tab
  if (complaintTab === "#hwcr-tab") {
    cy.get(complaintTab).should("contain.text", "Human Wildlife Conflict");
  } else {
    cy.get(complaintTab).should("contain.text", "Enforcement");
  }

  if (removeFilters) {
    cy.get("#comp-status-filter").click({ force: true });
    cy.get("#comp-zone-filter").click({ force: true });

    cy.get("#comp-status-filter").should("not.exist");
    cy.get("#comp-zone-filter").should("not.exist");
  }
});

Cypress.Commands.add("validateComplaint", (complaintIdentifier: string, species: string) => {
  //-- verify the right complaint identifier is selected and the animal type
  cy.get(".comp-box-complaint-id").contains(complaintIdentifier);
  cy.get(".comp-box-species-type").contains(species);
});

Cypress.Commands.add(
  "fillInHWCSection",
  ({ section, checkboxes, officer, date, actionRequired, justification, equipmentType }) => {
    let officerId = "";
    let datePickerId = "";
    let saveButtonId = "";

    if (section === "ASSESSMENT") {
      officerId = "outcome-officer";
      datePickerId = "complaint-outcome-date";
      saveButtonId = "#outcome-save-button";
    } else if (section === "EQUIPMENT") {
      officerId = "equipment-officer-set-select";
      datePickerId = "equipment-day-set";
      saveButtonId = "#equipment-save-button";
    } else {
      officerId = "prev-educ-outcome-officer";
      datePickerId = "prev-educ-outcome-date";
      saveButtonId = "#outcome-save-prev-and-educ-button";
    }

    if (section === "ASSESSMENT") {
      if (actionRequired) {
        cy.selectItemById("action-required", actionRequired);
        if (actionRequired === "Yes") {
          Cypress._.times(checkboxes.length, (index) => {
            cy.get(checkboxes[index]).check();
          });
        }
      }
    } else if (checkboxes) {
      Cypress._.times(checkboxes.length, (index) => {
        cy.get(checkboxes[index]).check();
      });
    }

    if (justification) {
      cy.selectItemById("justification", justification);
    }

    if (equipmentType) {
      cy.selectItemById("equipment-type-select", equipmentType);
    }

    cy.selectItemById(officerId, officer);

    cy.enterDateTimeInDatePicker(datePickerId, date);

    //click Save Button
    cy.get(saveButtonId).click();
  },
);

Cypress.Commands.add(
  "validateHWCSection",
  ({ section, checkboxes, officer, date, actionRequired, justification, toastText, equipmentType }) => {
    let checkboxDiv = "";
    let officerDiv = "";
    let dateDiv = "";

    if (section === "ASSESSMENT") {
      checkboxDiv = "#assessment-checkbox-div";
      officerDiv = "#assessment-officer-div";
      dateDiv = "#assessment-date-div";
    } else if (section === "EQUIPMENT") {
      officerDiv = "#equipment-officer-set-div";
      dateDiv = "#equipment-date-set-div";
    } else {
      checkboxDiv = "#prev-educ-checkbox-div";
      officerDiv = "#prev-educ-outcome-officer-div";
      dateDiv = "#prev-educ-outcome-date-div";
    }

    if (section === "ASSESSMENT") {
      if (actionRequired) {
        cy.get("#action-required-div").should(($div) => {
          expect($div).to.contain.text(actionRequired);
        });
        if (actionRequired === "Yes") {
          //Verify Fields exist
          Cypress._.times(checkboxes.length, (index) => {
            cy.get(checkboxDiv).should(($div) => {
              expect($div).to.contain.text(checkboxes[index]);
            });
          });
        }
      }
    } else if (checkboxes) {
      Cypress._.times(checkboxes.length, (index) => {
        cy.get(checkboxDiv).should(($div) => {
          expect($div).to.contain.text(checkboxes[index]);
        });
      });
    }

    if (justification) {
      cy.get("#justification-div").should(($div) => {
        expect($div).to.contain.text(justification);
      });
    }

    if (equipmentType) {
      cy.get("#equipment-type-title").should(($div) => {
        expect($div).to.contain.text(equipmentType);
      });
    }

    cy.get(officerDiv).should(($div) => {
      expect($div).to.contain.text(officer);
    });

    cy.get(dateDiv).should(($div) => {
      expect($div).to.contain.text(date); //Don't know the month... could maybe make this a bit smarter but this is probably good enough.
    });

    //validate the toast
    if (toastText) {
      cy.get(".Toastify__toast-body").then(($toast) => {
        expect($toast).to.contain.text(toastText);
      });
    }
  },
);

Cypress.Commands.add("assignSelfToComplaint", () => {
  cy.get("#details-screen-assign-button").click();
  cy.get("#self_assign_button").click();
  cy.waitForSpinner();
});

module.exports = {};
