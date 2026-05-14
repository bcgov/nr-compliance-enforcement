import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../utils/authConfig";
import { waitForSpinner } from "../utils/helpers";

// Test that an invalid record is redirected to the not-found page. This covers both the case
// of a user trying to access a record that doesn't exist at all, and the case of a user trying to
// access a real record that belongs to another agency and is not returned due to RLS.
const NONEXISTENT_GUID = "00000000-0000-0000-0000-0000000000aa";
const OTHER_NONEXISTENT_GUID = "00000000-0000-0000-0000-0000000000bb";

const expectNotFound = async (page: import("@playwright/test").Page, path: string) => {
  await page.goto(path, { waitUntil: "commit" });
  await expect(page).toHaveURL(/\/not-found/);
  await expect(page.getByRole("heading", { name: /could not be found/i })).toBeVisible();
};

test.describe("Agency scoped access: a record the user cannot see redirects to /not-found", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  test("case file detail", async ({ page }) => {
    await expectNotFound(page, `/case/${NONEXISTENT_GUID}`);
  });

  test("case file detail tab", async ({ page }) => {
    await expectNotFound(page, `/case/${NONEXISTENT_GUID}/activity`);
  });

  test("investigation detail", async ({ page }) => {
    await expectNotFound(page, `/investigation/${NONEXISTENT_GUID}`);
  });

  test("investigation detail tab", async ({ page }) => {
    await expectNotFound(page, `/investigation/${NONEXISTENT_GUID}/tasks`);
  });

  test("task within an investigation the user cannot see", async ({ page }) => {
    await expectNotFound(page, `/investigation/${NONEXISTENT_GUID}/task/${OTHER_NONEXISTENT_GUID}`);
  });

  test("inspection detail", async ({ page }) => {
    await expectNotFound(page, `/inspection/${NONEXISTENT_GUID}`);
  });

  test("inspection detail tab", async ({ page }) => {
    await expectNotFound(page, `/inspection/${NONEXISTENT_GUID}/parties`);
  });
});

test.describe("Agency scoped access: Agency-specific record visibility", () => {
  test("a COS case file is not accessible to a Parks user", async ({ browser }) => {
    // As a COS user, pick a case file from the case list
    const cosContext = await browser.newContext({ storageState: STORAGE_STATE_BY_ROLE.COS });
    const cosPage = await cosContext.newPage();
    await cosPage.goto("/cases");
    await waitForSpinner(cosPage);
    const firstCaseLink = cosPage.locator("#case-list tbody tr").first().locator("a.comp-cell-link").first();
    const hasCase = await firstCaseLink.isVisible({ timeout: 5000 }).catch(() => false);
    const caseHref = hasCase ? await firstCaseLink.getAttribute("href") : null;
    await cosContext.close();

    test.skip(!caseHref, "No case files available in this environment to exercise cross-agency isolation");
    expect(caseHref).toMatch(/\/case\/[0-9a-fA-F-]+/);

    // As a Parks user, that case file must not be accessible
    const parksContext = await browser.newContext({ storageState: STORAGE_STATE_BY_ROLE.PARKS });
    const parksPage = await parksContext.newPage();
    await parksPage.goto(caseHref as string, { waitUntil: "commit" });
    await expect(parksPage).toHaveURL(/\/not-found/);
    await parksContext.close();
  });

  test("Parks and COS users see different case lists", async ({ browser }) => {
    const idsForRole = async (role: string): Promise<string[]> => {
      const context = await browser.newContext({ storageState: role });
      const page = await context.newPage();
      await page.goto("/cases");
      await waitForSpinner(page);
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

  test("a COS inspection is not accessible to a Parks user", async ({ browser }) => {
    // As a COS user, pick an inspection from the inspection list
    const cosContext = await browser.newContext({ storageState: STORAGE_STATE_BY_ROLE.COS });
    const cosPage = await cosContext.newPage();
    await cosPage.goto("/inspections");
    await waitForSpinner(cosPage);
    const firstInspectionLink = cosPage
      .locator("#inspection-list tbody tr")
      .first()
      .locator("a.comp-cell-link")
      .first();
    const hasInspection = await firstInspectionLink.isVisible({ timeout: 5000 }).catch(() => false);
    const inspectionHref = hasInspection ? await firstInspectionLink.getAttribute("href") : null;
    await cosContext.close();

    test.skip(!inspectionHref, "No inspections available in this environment to exercise cross-agency isolation");
    expect(inspectionHref).toMatch(/\/inspection\/[0-9a-fA-F-]+/);

    // As a Parks user, that inspection must not be accessible
    const parksContext = await browser.newContext({ storageState: STORAGE_STATE_BY_ROLE.PARKS });
    const parksPage = await parksContext.newPage();
    await parksPage.goto(inspectionHref as string, { waitUntil: "commit" });
    await expect(parksPage).toHaveURL(/\/not-found/);
    await parksContext.close();
  });

  test("Parks and COS users see different inspection lists", async ({ browser }) => {
    const idsForRole = async (role: string): Promise<string[]> => {
      const context = await browser.newContext({ storageState: role });
      const page = await context.newPage();
      await page.goto("/inspections");
      await waitForSpinner(page);
      const hrefs = await page
        .locator("#inspection-list tbody tr a.comp-cell-link")
        .evaluateAll((els) => els.map((el) => (el as HTMLAnchorElement).getAttribute("href") ?? "").filter(Boolean));
      await context.close();
      return hrefs;
    };

    const cosIds = await idsForRole(STORAGE_STATE_BY_ROLE.COS);
    const parksIds = await idsForRole(STORAGE_STATE_BY_ROLE.PARKS);

    test.skip(cosIds.length === 0, "No COS inspections available in this environment to compare against");
    const overlap = cosIds.filter((id) => parksIds.includes(id));
    expect(overlap, "A Parks user must not see any COS-owned inspections in the list view").toEqual([]);
  });
});
