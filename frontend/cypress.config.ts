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
      keycloak_password: process.env.CYPRESS_KEYCLOAK_PASSWORD,
      keycloak_login_url: "https://logontest7.gov.bc.ca",
    },
  },
  retries: 2,
});
