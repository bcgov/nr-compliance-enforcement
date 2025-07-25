// environment variable handling in production build images
// require runtime placement of vars to prevent rebuilding the image
// this application is destined to be run via a caddy file server.
// caddy file server has the https://caddyserver.com/docs/caddyfile/directives/templates
// templates directive to easily handle runtime variables

const config = {
  KEYCLOAK_CLIENT_ID: window.VITE_KEYCLOAK_CLIENT_ID || import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  API_BASE_URL: window.VITE_API_URL || import.meta.env.VITE_API_URL,
  KEYCLOAK_URL: window.VITE_KEYCLOAK_URL || import.meta.env.VITE_KEYCLOAK_URL,
  KEYCLOAK_REALM: window.VITE_KEYCLOAK_REALM || import.meta.env.VITE_KEYCLOAK_REALM,
  COMS_URL: window.VITE_COMS_URL || import.meta.env.VITE_COMS_URL,
  COMS_BUCKET: window.VITE_COMS_BUCKET || import.meta.env.VITE_COMS_BUCKET,
  ENVIRONMENT_NAME: (window.VITE_ENVIRONMENT_NAME || import.meta.env.VITE_ENVIRONMENT_NAME) ?? "production",
};

export default config;
