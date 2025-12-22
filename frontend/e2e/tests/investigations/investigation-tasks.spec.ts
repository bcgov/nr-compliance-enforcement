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

    // Try to save without filling required fields
    const saveButton = page.locator("button", { hasText: /Save/i }).first();
    await saveButton.click();

    // Check for validation errors
    const errorMessages = page.locator(".error-message", { hasText: "Task category is required" });
    await expect(errorMessages).toBeVisible({ timeout: 10000 });
  });

  test("it adds a task", async ({ page }) => {
    // Press Add Task Button
    const addTaskButton = page.locator("#add-task-button");
    await addTaskButton.click();

    await selectItemById("task-category-select", "Type 2", page);

    const subCategory = page.locator("#task-sub-category-select");
    await expect(subCategory).toBeVisible({ timeout: 10000 });
    await selectItemById("task-sub-category-select", "Type g", page);

    const descriptionInput = page.locator("#description");
    await descriptionInput.fill("Test task description");

    await selectItemById("task-officer-select", "TestAcct, ENV", page);

    const saveButton = page.locator("button", { hasText: /Save/i }).first();
    await expect(saveButton).toBeEnabled({ timeout: 10000 });
    await saveButton.click({ force: true });

    await expect(await page.locator(".Toastify__toast-body", { hasText: "Task added successfully" })).toBeVisible();
  });

  test("it edits a task", async ({ page }) => {
    // Press Edit Task Button
    const editTaskButton = page.locator("#task-edit-button").first();
    await editTaskButton.click();

    const descriptionInput = page.locator("#description");
    await descriptionInput.fill("Edited description");

    const saveButton = page.locator("button", { hasText: /Save/i }).first();
    await expect(saveButton).toBeEnabled({ timeout: 10000 });
    await saveButton.click({ force: true });

    await expect(await page.locator(".Toastify__toast-body", { hasText: "Task edited successfully" })).toBeVisible();
  });

  test("it removes a task", async ({ page }) => {
    // Press Remove Task Button
    const removeTaskButton = page.locator("#task-remove-button").first();
    await removeTaskButton.click();

    const confirmButton = page.locator("button", { hasText: /Yes, delete item/i }).first();
    await expect(confirmButton).toBeEnabled({ timeout: 10000 });
    await confirmButton.click({ force: true });

    await expect(await page.locator(".Toastify__toast-body", { hasText: "Task removed successfully" })).toBeVisible();
  });
});
