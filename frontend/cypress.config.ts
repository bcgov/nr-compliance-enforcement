import { defineConfig } from "cypress";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const { isFileExist } = require("cy-verify-downloads");
const { removeDirectory } = require("cypress-delete-downloads-folder");

export default defineConfig({
  defaultCommandTimeout: 20000,
  e2e: {
    baseUrl: "http://localhost:3000",
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        log(message) {
          console.log(message);

          return null;
        },
      });

      on("task", { isFileExist });
      on("task", { removeDirectory });
    },
    experimentalWebKitSupport: true,
    env: {
      auth_base_url: process.env.REACT_APP_KEYCLOAK_URL,
      auth_realm: process.env.REACT_APP_KEYCLOAK_REALM,
      auth_client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
      keycloak_user: process.env.CYPRESS_KEYCLOAK_USER,
      keycloak_user_02: process.env.CYPRESS_KEYCLOAK_USER_02,
      keycloak_password: process.env.CYPRESS_KEYCLOAK_PASSWORD,
      keycloak_login_url: "https://logontest7.gov.bc.ca",
      //-- CSS fields use for updating test account roles
      keycloak_user_guid: process.env.CYPRESS_KEYCLOAK_GUID,
      css_integration_id: process.env.REACT_APP_CSS_INTEGRATION_ID,
      css_token_url: process.env.REACT_APP_CSS_TOKEN_URL,
      css_client_id: process.env.REACT_APP_CSS_CLIENT_ID,
      css_client_secret: process.env.REACT_APP_CSS_CLIENT_SECRET,
      css_api_url: process.env.REACT_APP_CSS_API_URL,
    },
  },
  retries: 2,
});
