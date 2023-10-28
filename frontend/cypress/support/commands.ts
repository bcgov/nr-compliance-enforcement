/// <reference types="cypress" />
// ***********************************************
// For comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

const base64url = (source) => {
  // Encode the input string as base64.
  let encodedSource = btoa(source);

  // Replace any characters that are not URL-safe.
  encodedSource = encodedSource
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

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
  const hashHex = hashArray
    .map((b) => ("00" + b.toString(16)).slice(-2))
    .join("");

  return hashHex;
};

Cypress.Commands.add("kcLogin", () => {
  Cypress.log({ name: "Login to Keycloak" });

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
    const code_verifier =
      Cypress._.random(0, 1e10).toString(36) +
      Cypress._.random(0, 1e10).toString(36);
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
        username: Cypress.env("keycloak_user"),
        password: Cypress.env("keycloak_password"),
        url: url,
      };

      // depending on if we're running the cypress tests locally or not, we may or may not ge a CORS error.
      // If the keycloak login URL is the same as the application URL, then simply visit the URL;
      // otherwise, will need to use cy.origin to avoid any CORS errors.
      if (
        hasSameTopLevelDomain(
          Cypress.env("keycloak_login_url"),
          Cypress.config().baseUrl,
        )
      ) {
        cy.visit(url);
        // Log in the user and obtain an authorization code.
        cy.get('[name="user"]').click();
        cy.get('[name="user"]').type(credentials.username);
        cy.get('[name="password"]').click();
        cy.get('[name="password"]').type(credentials.password, { log: false });
        cy.get('[name="btnSubmit"]').click();
      } else {
        // different origin, so handle CORS errors
        cy.origin(
          Cypress.env("keycloak_login_url"),
          { args: credentials },
          ({ username, password, url }) => {
            cy.visit(url);
            // Log in the user and obtain an authorization code.
            cy.get('[name="user"]').click();
            cy.get('[name="user"]').type(username);
            cy.get('[name="password"]').click();
            cy.get('[name="password"]').type(password, { log: false });
            cy.get('[name="btnSubmit"]').click();
          },
        ).then(() => {
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

Cypress.Commands.add("verifyMapMarkerExists", (existIndicator: boolean) => {
  cy.get(".leaflet-container").should("exist");
  cy.get(".leaflet-marker-icon").should(existIndicator ? "exist" : "not.exist");
});

Cypress.Commands.add(
  "navigateToDetailsScreen",
  (complaintType: string, complaintIdentifier: string) => {
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

    cy.get("#complaint-list > tbody > tr")
      .contains(complaintIdentifier)
      .click({ force: true });

    cy.waitForSpinner();
  },
);

Cypress.Commands.add(
  "navigateToEditScreen",
  (complaintType: string, complaintIdentifier: string) => {
    cy.navigateToDetailsScreen(
      complaintType.toLowerCase(),
      complaintIdentifier,
    );
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

Cypress.Commands.add(
  "selectItemById",
  (selectId: string, optionText: string) => {
    cy.get(`#${selectId}`).find("div").first().click({ force: true });
    cy.get(".comp-select__menu-list").should("exist"); //Wait for the options to show
    cy.contains(`.comp-select__option`, optionText).click({ force: true });
  },
);

Cypress.Commands.add("enterDateTimeInDatePicker", (datePickerId: string, day: string, hour: string, minute: string) => {

  cy.get(`#${datePickerId}`)
  .click({ force: true })
  .get(`.react-datepicker__day--0${day}`)
  .should("exist")
  .click({ force: true });


  // Locate the time input field and click it to open the time picker
  cy.get(`#${datePickerId}`)
  .click({ force: true })
  .get('.react-datepicker-time__input')
  .filter('input') 
  .click({force: true})
  .type(`${hour}:${minute}`);
})

Cypress.Commands.add("isInViewport", { prevSubject: true }, (subject) => {
  const bottom = Cypress.$(cy.state("window")).height();
  const rect = subject[0].getBoundingClientRect();

  console.log(rect.top);

  expect(rect.top).not.to.be.greaterThan(
    bottom,
    `Expected element not to be below the visible scrolled area`,
  );
  expect(rect.top).to.be.greaterThan(
    0,
    `Expected element not to be above the visible scrolled area`,
  );

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

Cypress.Commands.add(
  "typeAndTriggerChange",
  { prevSubject: "element" },
  (subject, value) => {
    const element = subject[0];

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;

    nativeInputValueSetter?.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  },
);

module.exports = {};
