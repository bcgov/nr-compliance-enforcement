/// <reference types="node" />
import { test as setup, expect, Page } from '@playwright/test'
import { STORAGE_STATE_BY_ROLE } from './utils/authConfig'

/**
 * To make a new user available for use in tests, replicate these `setup` blocks using the appropriate user,
 * and be sure to add the appropriate path to the STORAGE_STATE_BY_ROLE in `utils/authConfig`
 */
setup('authenticate as COS', async ({ page }) => {
  await loginToKeycloak(page, 'COS')
  await expect(page.getByText('Conservation Officer Service')).toBeVisible()
  await expect(
    page.getByRole('link', { name: ' Investigations' }),
  ).toBeVisible()
  await page.context().storageState({ path: STORAGE_STATE_BY_ROLE.COS })
})

setup('authenticate as CEEB', async ({ page }) => {
  await loginToKeycloak(page, 'CEEB')
  await expect(
    page.getByRole('link', { name: ' Investigations' }),
  ).toBeVisible()
  await page.context().storageState({ path: STORAGE_STATE_BY_ROLE.CEEB })
})

async function loginToKeycloak(page: Page, role?: string): Promise<void> {
  const authBaseUrl = process.env.AUTH_BASE_URL!
  const realm = process.env.AUTH_REALM!
  const clientId = process.env.VITE_OIDC_CLIENT_ID!
  const redirectUri = process.env.BASE_URL!
  let account = process.env.PLAYWRIGHT_KEYCLOAK_USER!
  if (role === 'CEEB') {
    account = process.env.PLAYWRIGHT_KEYCLOAK_USER_02!
  }
  // Auth parameters
  const scope = 'openid'
  const state = generateRandomString()
  const nonce = generateRandomString()
  const codeVerifier = generateRandomString(43)
  const codeChallenge = base64url(await sha256(codeVerifier))
  const kcIdpHint = 'idir'

  // Construct auth URL
  const authUrl = new URL(
    `${authBaseUrl}/realms/${realm}/protocol/openid-connect/auth`,
  )
  authUrl.searchParams.append('client_id', clientId)
  authUrl.searchParams.append('redirect_uri', redirectUri)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('scope', scope)
  authUrl.searchParams.append('state', state)
  authUrl.searchParams.append('nonce', nonce)
  authUrl.searchParams.append('kc_idp_hint', kcIdpHint)
  authUrl.searchParams.append('code_challenge_method', 'S256')
  authUrl.searchParams.append('code_challenge', codeChallenge)

  // Navigate to auth URL
  await page.goto(authUrl.toString())

  // Handle login form
  await page.fill('[name="user"]', account)
  await page.fill(
    '[name="password"]',
    process.env.PLAYWRIGHT_KEYCLOAK_PASSWORD!,
  )
  await page.click('[name="btnSubmit"]')

  // Wait for redirect and app load
  await page.waitForLoadState('networkidle')
  await page.waitForSelector('.loading-spinner', { state: 'hidden' })
}

const base64url = (source: string): string => {
  const base64 = Buffer.from(source).toString('base64')
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const sha256 = async (plain: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

const generateRandomString = (length: number = 20): string => {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
