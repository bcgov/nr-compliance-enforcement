/// <reference types="cypress" />
// ***********************************************
// For comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

const base64url = source => {
    // Encode the input string as base64.
    let encodedSource = btoa(source);
  
    // Replace any characters that are not URL-safe.
    encodedSource = encodedSource
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  
    return encodedSource;
  };
  
  const sha256 = async plain => {
    // encode as UTF-8.
    const msgBuffer = new TextEncoder().encode(plain);
  
    // hash the message.
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
    // convert ArrayBuffer to Array.
    const hashArray = Array.from(new Uint8Array(hashBuffer));
  
    // convert bytes to hex string.
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
  
    return hashHex;
  };
  
  Cypress.Commands.add('kcLogin', () => {
    Cypress.log({ name: 'Login to Keycloak' });
  
    cy.log('Keyloak Login').then(async () => {
      const authBaseUrl = Cypress.env('auth_base_url');
      const realm = Cypress.env('auth_realm');
      const client_id = Cypress.env('auth_client_id');
      const redirect_uri = Cypress.config('baseUrl') + '/login';
  
      const scope = 'openid';
      const state = '123456';
      const nonce = '7890';
      const code_challenge_method = 'S256';
      const kc_idp_hint = 'idir';
  
      // Generate a code verifier using a random string of 43-128 characters.
      const code_verifier =
        Cypress._.random(0, 1e10).toString(36) + Cypress._.random(0, 1e10).toString(36);
      const code_challenge = base64url(await sha256(code_verifier));
  
      // Make the initial request to the authentication endpoint.
      cy.request({
        method: 'GET',
        url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/auth`,
        qs: {
          client_id,
          redirect_uri,
          code_challenge_method,
          code_challenge,
          response_type: 'code',
          scope,
          state,
          nonce,
          kc_idp_hint,
        },
        followRedirect: false, // Don't follow the redirect automatically.
      }).then(response => {
        // Extract the location header from the response to get the redirect URL.
        const redirectUrls = response.headers.location;
        const url = Array.isArray(redirectUrls) ? redirectUrls[0] : redirectUrls;
  
        // Visit redirect URL.
        const credentials = {
          username: Cypress.env('keycloak_user'),
          password: Cypress.env('keycloak_password'),
          url: url
        };

        // depending on if we're running the cypress tests locally or not, we may or may not ge a CORS error.
        // If the keycloak login URL is the same as the application URL, then simply visit the URL;
        // otherwise, will need to use cy.origin to avoid any CORS errors.
        if (hasSameTopLevelDomain(Cypress.env('keycloak_login_url'), Cypress.config().baseUrl)) {
          cy.visit(url);
          // Log in the user and obtain an authorization code.
          cy.get('[name="user"]').click();
          cy.get('[name="user"]').type(credentials.username);
          cy.get('[name="password"]').click();
          cy.get('[name="password"]').type(credentials.password, {log: false});
          cy.get('[name="btnSubmit"]').click();
    
          cy.wait(10000);
        } else { // different origin, so handle CORS errors
          cy.visit("/");
          cy.on('uncaught:exception', (e) => {
            if (e.message.includes('Unexpected')) {
              // we expected this error, so let's ignore it
              // and let the test continue
              return false
            }
          })
          cy.origin(
            Cypress.env('keycloak_login_url'),
            { args: credentials },
            ({ username, password, url }) => {
            cy.visit(url);
            // Log in the user and obtain an authorization code.
            cy.get('[name="user"]').click();
            cy.get('[name="user"]').type(username);
            cy.get('[name="password"]').click();
            cy.get('[name="password"]').type(password, {log: false});
            cy.get('[name="btnSubmit"]').click();
      
            cy.wait(10000);
            });
        }
      });
    });
  });
  
  Cypress.Commands.add('kcLogout', () => {
    Cypress.log({ name: 'Logout' });
    const authBaseUrl = Cypress.env('auth_base_url');
    const realm = Cypress.env('auth_realm');
    cy.request({
      url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/logout`,
    });
    cy.visit(Cypress.config().baseUrl);
    cy.on('uncaught:exception', (e) => {
      if (e.message.includes('Unexpected')) {
        // we expected this error, so let's ignore it
        // and let the test continue
        return false
      }
    })

  });

  function hasSameTopLevelDomain(url1: string, url2: string): boolean {
    const tld1 = extractTopLevelDomain(url1);
    const tld2 = extractTopLevelDomain(url2);
  
    return tld1 === tld2;
  }
  
  function extractTopLevelDomain(url: string): string {
    const domain = new URL(url).hostname;
    const parts = domain.split('.');
    const tld = parts.slice(-2).join('.');
  
    return tld;
  }
  
  module.exports = {};
  