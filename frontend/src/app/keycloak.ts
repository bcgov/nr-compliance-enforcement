import Keycloak from "keycloak-js";
import config from "../config.js";

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const _kc = new Keycloak({
  url: config.KEYCLOAK_URL,
  realm: `${config.KEYCLOAK_REALM}`,
  clientId: `${config.KEYCLOAK_CLIENT_ID}`,
});

export default _kc;
