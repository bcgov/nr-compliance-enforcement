import { test, expect, Page } from "@playwright/test";

import COMPLAINT_TYPES from "../../../src/app/types/app/complaint-types";
import { STORAGE_STATE_BY_ROLE } from "../../utils/authConfig";
import { navigateToDetailsScreen, validateComplaint } from "../../utils/helpers";

async function enterNote(page: Page, note: string) {
  await page.locator("#supporting-notes-textarea-id").click();
  await page.locator("#supporting-notes-textarea-id").clear();
  await page.locator("#supporting-notes-textarea-id").pressSequentially(note, { delay: 0 });
}

// Executes the following tests in order
// 1. Test the validation on the note component (also attempts to clean up any notes on the complaint)
// 2. Saves a note
// 3. Cancels an edit to a note
// 4. Edits a note
// 5. Deletes a note
test.describe("HWCR Outcome Notes", () => {
  test.use({ storageState: STORAGE_STATE_BY_ROLE.COS });
  test.describe.configure({ mode: "serial" }); //Ensure tests run in order

  test("it requires valid user input", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032454", true, page);
    await validateComplaint(page, "23-032454", "Black Bear");

    // Delete any note records if they exist
    const $notes = page.locator("#outcome-note");
    while ((await $notes.locator("#notes-delete-button").count()) > 0) {
      // Always select the *first* delete button
      await $notes.locator("#notes-delete-button").first().click();

      await page.locator(".modal-footer .btn-primary").click();

      // Confirm deletion in modal
      await expect(
        page.locator(".Toastify__toast-body", {
          hasText: "Note deleted",
        }),
      ).toBeVisible();

      await expect(
        page.locator(".Toastify__toast-body", {
          hasText: "Note deleted",
        }),
      ).toBeHidden({ timeout: 10000 });
    }

    // click Add Button
    await page.locator("#outcome-report-add-note").click();

    //click Save Button
    await page.locator("#supporting-notes-save-button").click();

    //validate error message
    await expect(
      page.locator("#outcome-note .error-message", {
        hasText: "Additional notes required",
      }),
    ).toBeVisible();

    //validate the toast
    await expect(
      page.locator(".Toastify__toast-body", {
        hasText: "Error updating additional notes",
      }),
    ).toBeVisible();
  });

  test("it can save note", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032454", true, page);
    await validateComplaint(page, "23-032454", "Black Bear");

    const $outcome = page.locator(".comp-hwcr-outcome-report");
    await $outcome.locator("#outcome-report-add-note").click();

    await enterNote(page, "This is test supporting note from Playwright");
    await $outcome.locator("#supporting-notes-save-button").click();

    // Validate the toast
    await expect(
      page.locator(".Toastify__toast-body", {
        hasText: "Note created",
      }),
    ).toBeVisible();

    //validate the note
    await expect(
      $outcome.locator("#additional-note-text", {
        hasText: "This is test supporting note from Playwright",
      }),
    ).toBeVisible();

    //validate the officer
    await expect(
      $outcome.locator("#comp-note-created-by", {
        hasText: "TestAcct, ENV",
      }),
    ).toBeVisible();
  });

  test("it can cancel note edits", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032454", true, page);
    await validateComplaint(page, "23-032454", "Black Bear");
    const $notes = page.locator(".comp-outcome-notes");
    await $notes.locator("#notes-edit-button").click();

    await enterNote(page, "This text will be cancelled by Playwright");
    await $notes.locator("#supporting-notes-cancel-button").click();
    await page.locator(".modal-footer > .btn-primary").click();
    const matchingNotes = $notes.locator(".comp-outcome-notes", {
      hasText: "This text will be cancelled by Playwright",
    });
    await expect(matchingNotes).toHaveCount(0);
  });

  test("it can edit an existing note", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032454", true, page);
    await validateComplaint(page, "23-032454", "Black Bear");
    const $notes = page.locator(".comp-outcome-notes");

    await expect($notes.locator("#notes-edit-button").first()).toBeVisible({ timeout: 15000 });

    await $notes.locator("#notes-edit-button").click();

    await enterNote(page, "This note is edited by Playwright");
    await $notes.locator("#supporting-notes-save-button").click();

    // Validate the toast
    await expect(
      page.locator(".Toastify__toast-body", {
        hasText: "Note updated",
      }),
    ).toBeVisible();

    //Validate the text
    await expect(
      $notes.locator(".comp-outcome-notes-note", {
        hasText: "This note is edited by Playwright",
      }),
    ).toBeVisible();
  });

  test("it can delete an existing note", async ({ page }) => {
    await navigateToDetailsScreen(COMPLAINT_TYPES.HWCR, "23-032454", true, page);
    await validateComplaint(page, "23-032454", "Black Bear");
    const $notes = page.locator(".comp-outcome-notes");
    await $notes.locator("#notes-delete-button").click();
    await page.locator(".modal-footer > .btn-primary").click();

    //validate the toast
    await expect(
      page.locator(".Toastify__toast-body", {
        hasText: "Note deleted",
      }),
    ).toBeVisible();
  });
});
