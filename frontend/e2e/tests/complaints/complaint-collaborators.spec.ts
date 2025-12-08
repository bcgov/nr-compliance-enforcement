import { test, expect } from "@playwright/test";

import COMPLAINT_TYPES from "../../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { navigateToDetailsScreen, selectItemById, waitForSpinner } from "../../utils/helpers";

/**
 * Test to verify that collaborators can be added to a complaint,
 * and that the correct permissions are applied to the collaborator.
 */
const COMPLAINT_ID = "23-031396";
test.describe("Complaint collaborators", () => {
  // Run tests serially as they depend on eachother
  test.describe.configure({ mode: "serial" });

  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  test("Add a collaborator from Parks to an HWCR complaint", async function ({ page }) {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, COMPLAINT_ID, true, page);
    await waitForSpinner(page);
    await page.getByRole("button", { name: "Actions Menu" }).click();
    await page.getByRole("button", { name: /Manage collaborators/ }).click();
    // Remove any existing collaborators from previous test runs
    const existingCollaborators = await page.locator("button", { hasText: /Remove user/ }).count();
    if (existingCollaborators > 0) {
      await page
        .locator("button", { hasText: /Remove user/ })
        .first()
        .click();
      await expect(await page.locator("button", { hasText: /Remove user/ })).not.toBeVisible();
    }
    await selectItemById("select-agency", "Parks", page);
    await selectItemById("select-officer", "TestAcct 3, ENV", page);
    await page
      .locator("button", { hasText: /Add as a collaborator/ })
      .first()
      .click();
    await page.locator("button", { hasText: /Close/ }).first().click();
    await expect(page.locator("#comp-header-collaborator-count")).toHaveText(/\+1/);
  });

  test("Verifies collaborators have the correct permissions", async function ({ browser }) {
    const page = await browser.newPage({ storageState: STORAGE_STATE_BY_ROLE.PARKS });
    await navigateToDetailsScreen("HWCR", COMPLAINT_ID, true, page);
    await waitForSpinner(page);
    await expect(
      await page.locator(".banner-content", { hasText: /COS added you to this complaint as a collaborator/ }).first(),
    ).toBeVisible();
    await expect(await page.locator("#details-screen-update-status-button")).toBeDisabled();
    await expect(await page.locator("#outcome-report-add-note")).not.toBeDisabled();
  });

  test("Verifies collaborators can be removed", async function ({ browser }) {
    const page = await browser.newPage({ storageState: STORAGE_STATE_BY_ROLE.COS });
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, COMPLAINT_ID, true, page);
    await waitForSpinner(page);
    await page.getByRole("button", { name: "Actions Menu" }).click();
    await page.getByRole("button", { name: /Manage collaborators/ }).click();
    await page
      .locator("button", { hasText: /Remove user/ })
      .first()
      .click();
    await page.locator("button", { hasText: /Close/ }).first().click();
  });
});
