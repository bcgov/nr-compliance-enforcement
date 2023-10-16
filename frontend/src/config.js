// environment variable handling in production build images
// require runtime placement of vars to prevent rebuilding the image
// this application is destined to be run via a caddy file server.
// caddy file server has the https://caddyserver.com/docs/caddyfile/directives/templates
// templates directive to easily handle runtime variables

const config = {
  KEYCLOAK_CLIENT_ID:
    window.REACT_APP_KEYCLOAK_CLIENT_ID ||
    process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
  API_BASE_URL: window.REACT_APP_API_URL || process.env.REACT_APP_API_URL,
  KEYCLOAK_URL:
    window.REACT_APP_KEYCLOAK_URL || process.env.REACT_APP_KEYCLOAK_URL,
  KEYCLOAK_REALM:
    window.REACT_APP_KEYCLOAK_REALM || process.env.REACT_APP_KEYCLOAK_REALM,
};

export default config;
