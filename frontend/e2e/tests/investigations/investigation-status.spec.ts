import { test, expect, Page } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { enterDateTimeInDatePicker, selectItemById, waitForSpinner } from "../../utils/helpers";

/**
 * Tests for the investigation close/reopen eligibility rules.
 *
 * Runs serially against a single investigation created by the first test:
 *  - a task is added, so the investigation cannot be closed
 *  - the task is closed, so the investigation can be closed (confirmation warning shown)
 *  - the investigation is reopened (impact warning shown), returning it to its original status
 */
test.describe("Investigation Status Change", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  test.describe.configure({ mode: "serial" }); // Ensure tests run in order

  // Shared across the serial tests so each one operates on the same investigation.
  let investigationUrl: string;

  const openStatusModal = async (page: Page) => {
    const updateStatusButton = page.locator("#details-screen-update-status-button");
    await expect(updateStatusButton).toBeVisible({ timeout: 15000 });
    await updateStatusButton.click();

    const modal = page.locator(".modal", { hasText: "Update status" }).first();
    await expect(modal).toBeVisible();
    return modal;
  };

  test("it creates an investigation with an open task", async ({ page }) => {
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
    await page.locator("#description").fill("Status change eligibility test investigation");

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

    // Add a task so the investigation has an outstanding item preventing closure.
    await page.locator("#tasks").click();
    await page.locator("#add-task-button").click();

    await selectItemById("task-detail-edit-category", "Admin", page);
    await page.locator("#task-detail-edit-subject").fill("Status eligibility task");
    await selectItemById("task-detail-edit-officer", "TestAcct, ENV", page);
    await page.locator("#task-detail-edit-description").fill("Task blocking investigation closure");

    const taskModal = page.locator(".modal").first();
    await taskModal
      .locator("button", { hasText: /Create/i })
      .first()
      .click({ force: true });

    await expect(page.locator(".Toastify__toast-body", { hasText: "Task created successfully" })).toBeVisible();
  });

  test("it blocks closing an investigation with an open task", async ({ page }) => {
    await page.goto(investigationUrl);
    await waitForSpinner(page);

    const modal = await openStatusModal(page);
    await selectItemById("task-status-select", "Closed", page);

    await expect(modal.getByText("cannot be changed", { exact: false })).toBeVisible();
    await expect(modal.getByText("not been closed yet", { exact: false })).toBeVisible();
    await expect(modal.locator("button", { hasText: /^Update$/ })).toBeDisabled();

    await modal.locator("button", { hasText: /Cancel/i }).click();
  });

  test("it allows closing an investigation once the task is closed", async ({ page }) => {
    await page.goto(investigationUrl);
    await waitForSpinner(page);

    // Close the outstanding task.
    await page.locator("#tasks").click();
    await page.locator("#task-list tbody tr a.comp-cell-link").first().click();
    await expect(page).toHaveURL(/\/task\//);

    const taskStatusButton = page.locator("#task-details-update-status-button");
    await expect(taskStatusButton).toBeVisible({ timeout: 15000 });
    await taskStatusButton.click();

    const taskStatusModal = page.locator(".modal", { hasText: "Update status" }).first();
    await expect(taskStatusModal).toBeVisible();
    await selectItemById("task-status-select", "Closed", page);
    await taskStatusModal.locator("button", { hasText: /^Update$/ }).click();

    await expect(page.locator(".Toastify__toast-body", { hasText: "Task status updated successfully" })).toBeVisible();

    await page.goto(investigationUrl);
    await waitForSpinner(page);

    const modal = await openStatusModal(page);
    await selectItemById("task-status-select", "Closed", page);

    await expect(modal.getByText("will lock all sections", { exact: false })).toBeVisible();
    await expect(modal.getByText("have not been closed yet", { exact: false })).toBeHidden();

    const updateButton = modal.locator("button", { hasText: /^Update$/ });
    await expect(updateButton).toBeEnabled();
    await updateButton.click();

    await expect(
      page.locator(".Toastify__toast-body", { hasText: "Investigation status updated successfully" }),
    ).toBeVisible();
  });

  test("it warns when reopening a closed investigation", async ({ page }) => {
    await page.goto(investigationUrl);
    await waitForSpinner(page);

    const modal = await openStatusModal(page);
    await selectItemById("task-status-select", "Open", page);

    await expect(modal.getByText("Are you sure you want to reopen", { exact: false })).toBeVisible();
    await expect(modal.getByText("Reporting & Metrics", { exact: false })).toBeVisible();
    await expect(modal.getByText("Permissions", { exact: false })).toBeVisible();

    const updateButton = modal.locator("button", { hasText: /^Update$/ });
    await expect(updateButton).toBeEnabled();
    await updateButton.click();

    await expect(
      page.locator(".Toastify__toast-body", { hasText: "Investigation status updated successfully" }),
    ).toBeVisible();
  });
});
