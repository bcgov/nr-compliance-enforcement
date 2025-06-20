import { createReactOidc } from 'oidc-spa/react'
import { decodeJwt } from 'oidc-spa/tools/decodeJwt'
import { redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { config } from '@/config'

export const { OidcProvider, useOidc, getOidc } = createReactOidc(async () => ({
  // If you don't have the parameters right away, it's the case for example
  // if you get the oidc parameters from an API you can pass a promise that
  // resolves to the parameters. `createReactOidc(prParams)`.
  // You can also pass an async function that returns the parameters.
  // `createReactOidc(async () => params)`. It will be called when the <OidcProvider />
  // is first mounted or when getOidc() is called.

  // NOTE: If you are using keycloak, the issuerUri should be formatted like this:
  // issuerUri: https://<YOUR_KEYCLOAK_DOMAIN><KC_RELATIVE_PATH>/realms/<REALM_NAME>
  // KC_RELATIVE_PATH is by default "" in modern keycloak, on older keycloak it used to be "/auth" by default.
  issuerUri: config.VITE_OIDC_ISSUER_URI,
  clientId: config.VITE_OIDC_CLIENT_ID,
  idleSessionLifetimeInSeconds: (() => {
    const value_str = config.VITE_OIDC_SSO_SESSION_IDLE_SECONDS
    return value_str ? parseInt(value_str) : 36000
  })(),
  scopes: (config.VITE_OIDC_SCOPE || undefined)?.split(' '),
  homeUrl: config.VITE_BASE_URL,
  /**
   * This parameter is optional.
   *
   * It allows you to validate the shape of the idToken so that you
   * can trust that oidcTokens.decodedIdToken is of the expected shape
   * when the user is logged in.
   * What is actually inside the idToken is defined by the OIDC server
   * you are using.
   * The usage of zod here is just an example, you can use any other schema
   * validation library or write your own validation function.
   *
   * Note that zod will strip out all the fields that are not defined in the
   * schema, you can use `debugLogs: true` to get the raw decodedIdToken.
   */
  decodedIdTokenSchema: z.object({
    sub: z.string(),
    name: z.string(),
    given_name: z.string(),
    family_name: z.string(),
    client_roles: z.array(z.string()),
    idir_username: z.string(),
  }),
  //autoLogoutParams: { redirectTo: "current page" } // Default
  //autoLogoutParams: { redirectTo: "home" }
  //autoLogoutParams: { redirectTo: "specific url", url: "/a-page" }

  // This parameter is optional.
  // It allows you to pass extra query params before redirecting to the OIDC server.
  // extraQueryParams: ({ isSilent }) => ({
  //   ui_locales: isSilent ? undefined : 'en', // Here you would dynamically get the current language at the time of redirecting to the OIDC server
  // }),
}))

export const enforceLogin = async () => {
  const oidc = await getOidc()

  if (!oidc.isUserLoggedIn) {
    await oidc.login({
      doesCurrentHrefRequiresAuth: false,
    })
  }
}

export const enforceLoginRoles = async (roles: string[]) => {
  const oidc = await getOidc()

  if (!oidc.isUserLoggedIn) {
    await oidc.login({
      doesCurrentHrefRequiresAuth: false,
    })
  } else {
    const { idToken } = oidc.getTokens()
    const user = decodeJwt(idToken)
    if (
      roles?.length > 0 &&
      !user?.client_roles.some((role: string) => roles.includes(role))
    ) {
      throw redirect({
        to: '/unauthorized',
      })
    }
  }
}

export const getAccessToken = async () => {
  console.log('getAccessToken')
  const oidc = await getOidc()

  if (oidc.isUserLoggedIn) {
    console.log('getAccessToken oidc.isUserLoggedIn')
    const { accessToken } = oidc.getTokens()
    console.log('getAccessToken accessToken', accessToken)
    return accessToken
  }

  return undefined
}
