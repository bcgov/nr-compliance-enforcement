import { test, expect, Page } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { enterDateTimeInDatePicker, selectItemById, waitForSpinner } from "../../utils/helpers";

/**
 * Test to verify that users without a role on an investigation, and who are not collaborators,
 * can view the investigation but cannot edit it.
 */
test.describe("Investigation Access", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  const selectOtherOfficer = async (selectId: string, page: Page) => {
    await page.locator(`#${selectId}`).first().click({ force: true });
    await page.locator('[class*="__option"]').filter({ hasNotText: "TestAcct" }).first().click();
  };

  test("it is read-only for users without a role on the investigation", async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const firstCaseLink = page.locator("#case-list tbody tr").first().locator("a.comp-cell-link").first();
    const caseGuid = (await firstCaseLink.getAttribute("href"))?.replace("/case/", "");
    expect(caseGuid).toBeTruthy();

    await page.goto(`/case/${caseGuid}/createInvestigation`);
    await waitForSpinner(page);
    await expect(page.locator("h2", { hasText: /Investigation details/i })).toBeVisible();

    await selectItemById("community-select", "100 Mile House", page);
    await selectOtherOfficer("primary-investigator-select", page);
    await selectOtherOfficer("supervisor-select", page);
    await enterDateTimeInDatePicker(page, "investigation-discovery-date", "01", "13", "45");
    await page.locator("#description").fill("Access test investigation");

    const createMutationPromise = page.waitForResponse(
      (response) =>
        response.url().includes("/graphql") &&
        (response.request().postData()?.includes("CreateInvestigation") ?? false),
      { timeout: 15000 },
    );

    await page.locator("#details-screen-save-button-top").click();
    await createMutationPromise;
    await expect(page).toHaveURL(/\/investigation\/[a-f0-9-]+$/i, { timeout: 30000 });
    await waitForSpinner(page);

    await expect(page.locator("#details-screen-edit-button")).toBeDisabled();
    await expect(page.locator("#details-screen-assign-button")).toBeDisabled();
    await expect(page.locator("#details-screen-update-status-button")).toBeDisabled();

    await page.locator("#tasks").click();
    await expect(page.locator("#add-task-button")).toBeDisabled();
  });
});
