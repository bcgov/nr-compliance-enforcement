@ -0,0 +1,89 @@
import { test, expect } from "@playwright/test";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { selectItemById } from "../../utils/helpers";

/**
 * Tests for Investigation Task functionality
 * Verifies tasks can be added, edited and deleted
 */
test.describe("Investigation Task Form", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  test.describe.configure({ mode: "serial" }); //Ensure tests run in order

  test.beforeEach(async ({ page }) => {
    // Navigate to investigation from test data
    await page.goto("investigation/66dd3a1f-4bc5-4758-a986-a664b8d8f200/");

    // Wait for investigation data to load - header should not show "Unknown"
    const header = page.locator("h1.comp-box-complaint-id");
    await expect(header).not.toContainText("Unknown", { timeout: 15000 });

    // Click Tasks button
    const taskButton = page.locator("#tasks");
    await taskButton.click();

    // Verify Add Task button is present
    const addTaskButton = page.locator("#add-task-button");
    await expect(addTaskButton).toBeVisible();
  });

  test("it validates required fields", async ({ page }) => {
    const addTaskButton = page.locator("#add-task-button");
    await addTaskButton.click();

    // Scope to the open modal (task add/edit modal)
    const modal = page.locator(".modal").first();
    await expect(modal).toBeVisible();
    const saveButton = modal.locator("button", { hasText: /Create/i }).first();
    await saveButton.click();

    // Check for validation errors
    const errorMessages = page.locator(".error-message", { hasText: "Task category is required" });
    await expect(errorMessages).toBeVisible();
  });

  test("it adds a task", async ({ page }) => {
    const addTaskButton = page.locator("#add-task-button");
    await addTaskButton.click();

    await selectItemById("task-detail-edit-category", "Type 2", page);

    const subCategory = page.locator("#task-detail-edit-subcategory");
    await expect(subCategory).toBeVisible();
    await selectItemById("task-detail-edit-subcategory", "Type g", page);

    await selectItemById("task-detail-edit-officer", "TestAcct, ENV", page);

    const descriptionInput = page.locator("#task-detail-edit-description");
    await descriptionInput.fill("Test task description");

    const modal = page.locator(".modal").first();
    await expect(modal).toBeVisible();
    const saveButton = modal.locator("button", { hasText: /Create/i }).first();
    await expect(saveButton).toBeEnabled();
    await saveButton.click({ force: true });

    await expect(await page.locator(".Toastify__toast-body", { hasText: "Task created successfully" })).toBeVisible();
  });

  test("it edits a task", async ({ page }) => {
    // Navigate to task detail by clicking first task link (task list shows task numbers as links)
    const taskLink = page.locator("#task-list tbody tr a.comp-cell-link").first();
    await taskLink.click();
    await expect(page).toHaveURL(/\/task\//);

    const editTaskButton = page.locator("#task-edit-button").first();
    await editTaskButton.click();

    const descriptionInput = page.locator("#task-detail-edit-description");
    await descriptionInput.fill("Edited description");

    const modal = page.locator(".modal").first();
    await expect(modal).toBeVisible();
    const saveButton = modal.locator("button", { hasText: /Save/i }).first();
    await expect(saveButton).toBeEnabled();
    await saveButton.click({ force: true });

    await expect(page.locator(".Toastify__toast-body", { hasText: "Task updated successfully" })).toBeVisible();
  });
});
