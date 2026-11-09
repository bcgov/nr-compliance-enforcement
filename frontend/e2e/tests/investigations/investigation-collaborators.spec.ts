import { test, expect, Page } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { enterDateTimeInDatePicker, openUpdateStatusModal, selectItemById, waitForSpinner } from "../../utils/helpers";

/**
 * Test to verify that collaborators can be added to and removed from an investigation,
 * and that they cannot be managed once the investigation is closed.
 */
test.describe("Investigation Collaborators", () => {
  // Run tests serially as they depend on eachother
  test.describe.configure({ mode: "serial" });

  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });

  // Shared across the serial tests so each one operates on the same investigation.
  let investigationUrl: string;

  const openManageCollaboratorsModal = async (page: Page) => {
    await page.getByRole("button", { name: "Actions Menu" }).click();
    await page.getByRole("button", { name: /Manage collaborators/ }).click();
  };

  test("it creates an investigation", async ({ page }) => {
    await page.goto("/cases");
    await waitForSpinner(page);

    const firstCaseLink = page.locator("#case-list tbody tr").first().locator("a.comp-cell-link").first();
    const caseGuid = (await firstCaseLink.getAttribute("href"))?.replace("/case/", "");
    expect(caseGuid).toBeTruthy();

    await page.goto(`/case/${caseGuid}/createInvestigation`);
    await waitForSpinner(page);
    await expect(page.locator("h2", { hasText: /Investigation details/i })).toBeVisible();

    await selectItemById("community-select", "100 Mile House", page);
    await selectItemById("primary-investigator-select", "TestAcct, ENV", page);
    await selectItemById("supervisor-select", "TestAcct, ENV", page);
    await enterDateTimeInDatePicker(page, "investigation-discovery-date", "01", "13", "45");
    await page.locator("#description").fill("Collaborators test investigation");

    const createMutationPromise = page.waitForResponse(
      (response) =>
        response.url().includes("/graphql") &&
        (response.request().postData()?.includes("CreateInvestigation") ?? false),
      { timeout: 15000 },
    );

    await page.locator("#details-screen-save-button-top").click();
    await createMutationPromise;
    await expect(page).toHaveURL(/\/investigation\/[a-f0-9-]+$/i, { timeout: 30000 });

    investigationUrl = page.url();
  });

  test("it adds a collaborator from Parks", async ({ page }) => {
    await page.goto(investigationUrl);
    await waitForSpinner(page);

    await openManageCollaboratorsModal(page);
    await selectItemById("select-agency", "Parks", page);
    await selectItemById("select-officer", "TestAcct 3, ENV", page);
    await page
      .locator("button", { hasText: /Add as a collaborator/ })
      .first()
      .click();
    await expect(page.locator(".Toastify__toast-body", { hasText: "Collaborator added successfully" })).toBeVisible();
    await page.locator("button", { hasText: /Close/ }).first().click();
    await expect(page.locator("#comp-header-collaborator-count")).toHaveText(/\+1/);
  });

  test("it removes a collaborator", async ({ page }) => {
    await page.goto(investigationUrl);
    await waitForSpinner(page);
    await expect(page.locator("#comp-header-collaborator-count")).toHaveText(/\+1/);

    await openManageCollaboratorsModal(page);
    await page
      .locator("button", { hasText: /Remove user/ })
      .first()
      .click();
    await expect(page.locator(".Toastify__toast-body", { hasText: "Collaborator removed successfully" })).toBeVisible();
    await page.locator("button", { hasText: /Close/ }).first().click();
    await expect(page.locator("#comp-header-collaborator-count")).not.toBeVisible();
  });

  test("it disables managing collaborators on a closed investigation", async ({ page }) => {
    await page.goto(investigationUrl);
    await waitForSpinner(page);

    await openUpdateStatusModal(page);
    const modal = page.locator(".modal", { hasText: "Update investigation status" }).first();
    await expect(modal).toBeVisible();
    await selectItemById("task-status-select", "Closed", page);
    const updateButton = modal.locator("button", { hasText: /^Update$/ });
    await expect(updateButton).toBeEnabled();
    await updateButton.click();
    await expect(
      page.locator(".Toastify__toast-body", { hasText: "Investigation status updated successfully" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Actions Menu" }).click();
    await expect(page.getByRole("button", { name: /Manage collaborators/ })).toBeDisabled();
  });
});
