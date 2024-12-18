import { browser } from "k6/browser";
import { check } from "https://jslib.k6.io/k6-utils/1.5.0/index.js";
import { COS_USER_CREDS } from "../../common/auth.js";
import { sleep } from "k6";

// This is the amount of time used to give the page time to render and slow the behaviour
// down to a more human speed. If running several headless browsers at once increasing this may
// ease a bit of the stress on the system executing the tests.
const IDLE_TIME = 3;

export async function browserTest(host) {
  /**
   * Scenario:
   * This test logs into NatCOM using the credentials provided via COS_USER_CREDS in performance/common/auth.js
   * Once logged in, the test navigates to the ERS tab then back to the HWCR tab to guarantee filters have been reset.
   * Next the default filters are removed, resulting in the query for all HWCR complaints.
   * Finally, it switches to the map view and checks that there is a cluster of results on the map.
   */
  const page = await browser.newPage();
  // Visit the page and login
  // The double waitForNavigation calls are intentional to handle the redirects that occur when
  // logging in.
  await page.goto(host);
  await page.waitForNavigation();
  await page.waitForNavigation();

  await page.locator('input[name="user"]').type(COS_USER_CREDS.username);
  await page.locator('input[name="password"]').type(COS_USER_CREDS.password);

  await Promise.all([page.waitForNavigation(), page.locator('input[type="submit"]').click()]);
  await page.waitForNavigation();
  await page.waitForNavigation();

  await check(page.locator("h1"), {
    header: async (h1) => (await h1.textContent()) == "Complaints",
  });
  sleep(IDLE_TIME);
  // Navigate to the ERS tab to ensure filters reset
  await page.locator("#ers-tab").click({ force: true });
  await check(page.locator("#ers-tab"), {
    // Only the active tab has the number in brackets in the title
    "ERS tab active": async (a) => (await a.textContent()).includes("("),
  });
  sleep(IDLE_TIME);
  // Return to the HWCR tab
  // Navigate to the ERS tab to ensure filters reset
  await page.locator("#hwcr-tab").click({ force: true });
  await check(page.locator("#hwcr-tab"), {
    "HWCR tab active": async (a) => (await a.textContent()).includes("("),
  });
  sleep(IDLE_TIME);
  // Clear the filters
  await page.locator("#comp-status-filter").click({ force: true });
  sleep(IDLE_TIME);
  await page.locator("#comp-zone-filter").click({ force: true });
  sleep(IDLE_TIME);
  // Go to the map view
  await page.locator('//label[@for="map_toggle_id"]').click({ force: true });
  sleep(IDLE_TIME);

  // Verify that there are clusters on the map.
  check(page.locator('//*[@id="multi-point-map"]'), {
    "Marker cluster exists": async (cluster) => await cluster.isVisible(),
  });
  page.close();
}
