/// <reference types="node" />
import { test as setup, Page, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "./utils/authConfig";
import { slowExpect } from "./utils/helpers";

setup("authenticate as COS", async ({ page }) => {
  await loginToKeycloak(page, "COS");
  await slowExpect(await page.locator("h1", { hasText: "Complaints" })).toBeVisible();
  // Expand the sidebar to reveal the agency name
  await page.locator("button.comp-sidebar-toggle").click();
  await expect(page.getByText("Conservation Officer Service")).toBeVisible();
  await page.context().storageState({ path: STORAGE_STATE_BY_ROLE.COS });
});

setup("authenticate as CEEB", async ({ page }) => {
  await loginToKeycloak(page, "CEEB");
  await slowExpect(await page.locator("h1", { hasText: "Complaints" })).toBeVisible();
  // Expand the sidebar to reveal the agency name
  await page.locator("button.comp-sidebar-toggle").click();
  await expect(page.getByText("Compliance and Environmental Enforcement Branch")).toBeVisible();
  await page.context().storageState({ path: STORAGE_STATE_BY_ROLE.CEEB });
});

setup("authenticate as Parks", async ({ page }) => {
  await loginToKeycloak(page, "PARKS");
  await slowExpect(await page.locator("h1", { hasText: "Complaints" })).toBeVisible();
  // Expand the sidebar to reveal the agency name
  await page.locator("button.comp-sidebar-toggle").click();
  await expect(page.getByText("BC Parks")).toBeVisible();
  await page.context().storageState({ path: STORAGE_STATE_BY_ROLE.PARKS });
});

async function loginToKeycloak(page: Page, role?: string): Promise<void> {
  const authBaseUrl = process.env.REACT_APP_KEYCLOAK_URL!;
  const realm = process.env.REACT_APP_KEYCLOAK_REALM!;
  const clientId = process.env.REACT_APP_KEYCLOAK_CLIENT_ID!;
  const redirectUri = process.env.E2E_BASE_URL!;
  let account = process.env.PLAYWRIGHT_KEYCLOAK_USER!;
  if (role === "CEEB") {
    account = process.env.PLAYWRIGHT_KEYCLOAK_USER_02!;
  } else if (role === "PARKS") {
    account = process.env.PLAYWRIGHT_KEYCLOAK_USER_03!;
  }
  // Auth parameters
  const scope = "openid";
  const state = generateRandomString();
  const nonce = generateRandomString();
  const codeVerifier = generateRandomString(43);
  const codeChallenge = base64url(await sha256(codeVerifier));
  const kcIdpHint = "idir";

  // Construct auth URL
  const urlString = `${authBaseUrl}/realms/${realm}/protocol/openid-connect/auth`;
  const authUrl = new URL(urlString);
  authUrl.searchParams.append("client_id", clientId);
  authUrl.searchParams.append("redirect_uri", redirectUri);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", scope);
  authUrl.searchParams.append("state", state);
  authUrl.searchParams.append("nonce", nonce);
  authUrl.searchParams.append("kc_idp_hint", kcIdpHint);
  authUrl.searchParams.append("code_challenge_method", "S256");
  authUrl.searchParams.append("code_challenge", codeChallenge);

  // Navigate to auth URL, and prevent the automatic redirect
  await page.goto(authUrl.toString());

  // Handle login form
  await slowExpect(page.locator("#user")).toBeVisible();
  await page.fill('[name="user"]', account);
  await page.fill('[name="password"]', process.env.KEYCLOAK_PASSWORD!);
  await page.click('[name="btnSubmit"]');

  // Wait for redirect and app load
  await page.waitForLoadState("networkidle");
  await page.waitForSelector(".loading-spinner", { state: "hidden" });
  console.log("Succesfully logged in as ", role);
}

const base64url = (source) => {
  // Encode the input string as base64.
  let encodedSource = btoa(source);

  // Replace any characters that are not URL-safe.
  encodedSource = encodedSource
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/={1,2}$/, "");
  return encodedSource;
};

const sha256 = async (plain: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const generateRandomString = (length: number = 20): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};
