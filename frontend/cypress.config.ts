import { defineConfig } from "cypress";
import dotenv from "dotenv";
import { Roles } from "./src/app/types/app/roles";
dotenv.config({ path: "./.env" });
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default defineConfig({
  defaultCommandTimeout: 40000,
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
      on("task", {
        async isFileExist(filename) {
          const cyVerifyDownloads = await import("cy-verify-downloads");
          return cyVerifyDownloads.default.verifyDownloadTasks.isFileExist(filename);
        },
        removeDirectory(folderName) {
          const { removeDirectory } = require("cypress-delete-downloads-folder");
          return removeDirectory(folderName);
        },
      });
    },
    experimentalWebKitSupport: true,
    experimentalRunAllSpecs: true,
    env: {
      auth_base_url: process.env.VITE_KEYCLOAK_URL,
      auth_realm: process.env.VITE_KEYCLOAK_REALM,
      auth_client_id: process.env.VITE_KEYCLOAK_CLIENT_ID,
      keycloak_user: process.env.CYPRESS_KEYCLOAK_USER,
      keycloak_user_02: process.env.CYPRESS_KEYCLOAK_USER_02,
      keycloak_user_03: process.env.CYPRESS_KEYCLOAK_USER_03,
      keycloak_password: process.env.CYPRESS_KEYCLOAK_PASSWORD,
      keycloak_login_url: "https://logontest7.gov.bc.ca",
      //-- CSS fields use for updating test account roles
      keycloak_user_guid: process.env.CYPRESS_KEYCLOAK_GUID,
      css_integration_id: process.env.VITE_CSS_INTEGRATION_ID,
      css_token_url: process.env.VITE_CSS_TOKEN_URL,
      css_client_id: process.env.VITE_CSS_CLIENT_ID,
      css_client_secret: process.env.VITE_CSS_CLIENT_SECRET,
      css_api_url: process.env.VITE_CSS_API_URL,
      //Provide access to Role Enum for use in custom commands
      roles: Roles,
    },
  },
  retries: 2,
});
