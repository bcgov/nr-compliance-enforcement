// For defining environment variables in Vite such that Intellisense is aware of them
// https://vitejs.dev/guide/env-and-mode.html#env-variables

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OIDC_ISSUER_URI: string
  readonly VITE_OIDC_CLIENT_ID: string
  readonly VITE_OIDC_SSO_SESSION_IDLE_SECONDS: string
  readonly VITE_OIDC_SCOPE: string
  readonly VITE_BASE_URL: string
  readonly VITE_OIDC_AUDIENCE: string
  readonly VITE_GRAPHQL_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
