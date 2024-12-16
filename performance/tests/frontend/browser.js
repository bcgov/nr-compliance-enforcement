import { browser } from "k6/browser";
import { check } from "https://jslib.k6.io/k6-utils/1.5.0/index.js";
import { COS_USER_CREDS } from "../../common/auth.js";

export async function browserTest(host) {
  const page = await browser.newPage();

  // await page.goto("http://localhost:3001/");
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
  await page.locator("#comp-zone-filter").click({ force: true });

  page.close();
}
