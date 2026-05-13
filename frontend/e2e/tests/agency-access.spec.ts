import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../utils/authConfig";

// Agency-scoped access tests. A nonexistent record and a cross-agency one are the same
// UNAUTHORIZED code path from the client, so a well-formed but nonexistent GUID exercises it.
const NONEXISTENT_GUID = "00000000-0000-0000-0000-0000000000aa";
const OTHER_NONEXISTENT_GUID = "00000000-0000-0000-0000-0000000000bb";

const expectNotAuthorized = async (page: import("@playwright/test").Page, path: string) => {
  await page.goto(path, { waitUntil: "commit" });
  await expect(page).toHaveURL(/\/not-authorized/);
  await expect(page.getByRole("heading", { name: /not authorized/i })).toBeVisible();
};

test.describe("Agency-scoped access: a record the user cannot see redirects to /not-authorized", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("case file detail", async ({ page }) => {
    await expectNotAuthorized(page, `/case/${NONEXISTENT_GUID}`);
  });

  test("case file detail tab", async ({ page }) => {
    await expectNotAuthorized(page, `/case/${NONEXISTENT_GUID}/activity`);
  });

  test("investigation detail", async ({ page }) => {
    await expectNotAuthorized(page, `/investigation/${NONEXISTENT_GUID}`);
  });

  test("investigation detail tab", async ({ page }) => {
    await expectNotAuthorized(page, `/investigation/${NONEXISTENT_GUID}/tasks`);
  });

  test("task within an investigation the user cannot see", async ({ page }) => {
    await expectNotAuthorized(page, `/investigation/${NONEXISTENT_GUID}/task/${OTHER_NONEXISTENT_GUID}`);
  });

  test("inspection detail", async ({ page }) => {
    await expectNotAuthorized(page, `/inspection/${NONEXISTENT_GUID}`);
  });

  test("inspection detail tab", async ({ page }) => {
    await expectNotAuthorized(page, `/inspection/${NONEXISTENT_GUID}/parties`);
  });
});

test.describe("Agency-scoped access: cross-agency isolation (real records)", () => {
  test("a COS-owned case file is not accessible to a Parks user", async ({ browser }) => {
    // As a COS user, pick a case file from the (RLS-scoped) Cases list - it belongs to COS.
    const cosContext = await browser.newContext({ storageState: STORAGE_STATE_BY_ROLE.COS });
    const cosPage = await cosContext.newPage();
    await cosPage.goto("/cases", { waitUntil: "commit" });
    const firstCaseLink = cosPage.locator("#case-list tbody tr").first().locator("a.comp-cell-link").first();
    const hasCase = await firstCaseLink.isVisible({ timeout: 30000 }).catch(() => false);
    const caseHref = hasCase ? await firstCaseLink.getAttribute("href") : null;
    await cosContext.close();

    test.skip(!caseHref, "No case files available in this environment to exercise cross-agency isolation");
    expect(caseHref).toMatch(/\/case\/[0-9a-fA-F-]+/);

    // As a Parks user, that same case file must not be accessible.
    const parksContext = await browser.newContext({ storageState: STORAGE_STATE_BY_ROLE.PARKS });
    const parksPage = await parksContext.newPage();
    await parksPage.goto(caseHref as string, { waitUntil: "commit" });
    await expect(parksPage).toHaveURL(/\/not-authorized/);
    await parksContext.close();
  });

  test("Parks and COS users see different (non-overlapping) case lists", async ({ browser }) => {
    const idsForRole = async (role: string): Promise<string[]> => {
      const context = await browser.newContext({ storageState: role });
      const page = await context.newPage();
      await page.goto("/cases", { waitUntil: "commit" });
      // Wait for the table to settle (either rows render or it stays empty).
      await page
        .locator("#case-list")
        .waitFor({ timeout: 30000 })
        .catch(() => undefined);
      const hrefs = await page
        .locator("#case-list tbody tr a.comp-cell-link")
        .evaluateAll((els) => els.map((el) => (el as HTMLAnchorElement).getAttribute("href") ?? "").filter(Boolean));
      await context.close();
      return hrefs;
    };

    const cosIds = await idsForRole(STORAGE_STATE_BY_ROLE.COS);
    const parksIds = await idsForRole(STORAGE_STATE_BY_ROLE.PARKS);

    test.skip(cosIds.length === 0, "No COS case files available in this environment to compare against");
    const overlap = cosIds.filter((id) => parksIds.includes(id));
    expect(overlap, "A Parks user must not see any COS-owned case files in the list view").toEqual([]);
  });
});
