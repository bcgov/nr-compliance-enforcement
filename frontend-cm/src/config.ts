// environment variable handling in production build images
// require runtime placement of vars to prevent rebuilding the image
// this application is destined to be run via a caddy file server.
// caddy file server has the https://caddyserver.com/docs/caddyfile/directives/templates
// templates directive to easily handle runtime variables

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    config: any
  }
}

export const config: Record<string, any> = {
  ...import.meta.env,
  ...window.config,
}
